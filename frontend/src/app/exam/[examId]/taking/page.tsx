"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import api from "@/lib/api";
import type { ApiResponse, Exam, Question, ResultDto } from "@/types";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionGrid from "@/components/exam/QuestionGrid";
import QuestionCard from "@/components/exam/QuestionCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { getSavedUser } from "@/lib/auth";
import type { User } from "@/types";

export default function ExamTakingPage() {
  const { examId } = useParams() as { examId: string };
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = getSavedUser<User>();

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<Exam>>(`/api/exams/${examId}`),
      api.get<ApiResponse<Question[]>>(`/api/exams/${examId}/questions`),
    ])
      .then(([examRes, qRes]) => {
        setExam(examRes.data.data);
        setQuestions(qRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [examId]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    // Convert answers: key = questionId (string), value = answer
    const mappedAnswers: Record<string, string> = {};
    questions.forEach((q, i) => {
      if (answers[i + 1]) mappedAnswers[String(q.id)] = answers[i + 1];
    });
    try {
      const res = await api.post<ApiResponse<ResultDto>>("/api/submissions", {
        examId: Number(examId),
        answers: mappedAnswers,
      });
      router.push(`/submissions/${res.data.data.submissionId}`);
    } catch {
      setSubmitting(false);
    }
  }, [answers, examId, questions, router, submitting]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#d32f2f" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "2.5rem" }} />
          <p style={{ marginTop: "12px" }}>Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" id="MathJax-script" />

      {/* Top bar */}
      <header style={{
        background: "#fff", borderBottom: "2px solid #f0d5d5",
        height: "56px", display: "flex", alignItems: "center",
        padding: "0 24px", gap: "16px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <span style={{ fontSize: "1.4rem" }}>🌙</span>
        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c" }}>
          {exam?.title}
        </span>
      </header>

      <div className="et-layout">
        {/* Main: question area */}
        <main style={{ padding: "28px 36px", background: "#fdf0f0", overflowY: "auto" }}>
          {currentQ && (
            <QuestionCard
              question={currentQ}
              questionNumber={currentIdx + 1}
              selectedAnswer={answers[currentIdx + 1]}
              onSelect={(ans) => setAnswers((prev) => ({ ...prev, [currentIdx + 1]: ans }))}
            />
          )}

          {/* Bottom nav */}
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            <Button
              variant="secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              <i className="fas fa-chevron-left" /> Câu trước
            </Button>
            <Button
              disabled={currentIdx === questions.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Câu tiếp <i className="fas fa-chevron-right" />
            </Button>
          </div>
        </main>

        {/* Right sidebar */}
        <aside style={{ background: "#fff", borderLeft: "2px solid #f0d5d5", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
          {/* Thí sinh */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#777", textTransform: "uppercase", marginBottom: "8px" }}>Thông tin thí sinh</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2c2c2c" }}>{user?.name}</div>
          </div>

          {/* Timer */}
          <div style={{ background: "#fdf0f0", borderRadius: "12px", padding: "14px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#777", textTransform: "uppercase", marginBottom: "8px" }}>Thời gian còn lại</div>
            {exam && (
              <ExamTimer durationMinutes={exam.durationMinutes} onExpire={handleSubmit} />
            )}
          </div>

          {/* Submit button */}
          <Button onClick={() => setShowConfirm(true)} size="lg" className="w-full">
            <i className="fas fa-paper-plane" /> Nộp bài
          </Button>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#777", marginBottom: "6px" }}>
              <span>Đã hoàn thành</span>
              <span style={{ fontWeight: 700, color: "#2c2c2c" }}>{answeredCount}/{questions.length} câu</span>
            </div>
            <div style={{ height: "6px", background: "#f0d5d5", borderRadius: "3px" }}>
              <div style={{ height: "100%", width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`, background: "#d32f2f", borderRadius: "3px", transition: "width .3s" }} />
            </div>
          </div>

          {/* Legend */}
          <div style={{ fontSize: "0.72rem", color: "#777" }}>
            <div style={{ marginBottom: "6px", fontWeight: 700 }}>Chú thích:</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#e8f5e9", border: "1px solid #4caf50", display: "inline-block" }} />
                Đã trả lời
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#d32f2f", display: "inline-block" }} />
                Đang xem
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#fff", border: "1px solid #f0d5d5", display: "inline-block" }} />
                Chưa làm
              </span>
            </div>
          </div>

          {/* Question grid */}
          <QuestionGrid
            total={questions.length}
            answers={answers}
            currentIndex={currentIdx}
            onJump={setCurrentIdx}
          />

          <div style={{ fontSize: "0.75rem", color: "#4caf50", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fas fa-circle" style={{ fontSize: "0.5rem" }} /> Đã kết nối máy chủ
          </div>
        </aside>
      </div>

      {/* Submit confirm modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Xác nhận nộp bài">
        <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "8px" }}>
          Bạn đã trả lời <strong style={{ color: "#d32f2f" }}>{answeredCount}/{questions.length}</strong> câu hỏi.
        </p>
        {answeredCount < questions.length && (
          <p style={{ fontSize: "0.82rem", color: "#e65100", marginBottom: "16px" }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: "6px" }} />
            Còn {questions.length - answeredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài?
          </p>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">
            Tiếp tục làm
          </Button>
          <Button onClick={() => { setShowConfirm(false); handleSubmit(); }} loading={submitting} className="flex-1">
            Nộp bài
          </Button>
        </div>
      </Modal>
    </>
  );
}
