"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import type { ApiResponse, ResultDto } from "@/types";
import Link from "next/link";

export default function SubmissionResultPage() {
  const { submissionId } = useParams() as { submissionId: string };
  const [result, setResult] = useState<ResultDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<ResultDto>>(`/api/submissions/${submissionId}`)
      .then((r) => setResult(r.data.data))
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) return (
    <><Navbar /><div style={{ textAlign: "center", padding: "80px", color: "#d32f2f" }}><i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} /></div></>
  );

  if (!result) return (
    <><Navbar /><div style={{ textAlign: "center", padding: "80px", color: "#777" }}>Không tìm thấy kết quả</div></>
  );

  const pct = result.percentage;
  const scoreColor = pct >= 80 ? "#2e7d32" : pct >= 50 ? "#e65100" : "#d32f2f";

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px" }}>
        {/* Result summary */}
        <div style={{ background: "#fff", borderRadius: "20px", border: "2px solid #f0d5d5", padding: "36px", textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "8px" }}>
            {result.examTitle}
          </h1>
          <div style={{ fontSize: "4rem", fontFamily: "Nunito, sans-serif", fontWeight: 900, color: scoreColor, lineHeight: 1.1 }}>
            {result.score}<span style={{ fontSize: "2rem" }}>/{result.totalQuestions}</span>
          </div>
          <div style={{ fontSize: "1.2rem", color: scoreColor, fontWeight: 700, marginTop: "4px" }}>
            {pct.toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.82rem", color: "#777", marginTop: "12px" }}>
            {pct >= 80 ? "🎉 Xuất sắc!" : pct >= 60 ? "👍 Tốt!" : pct >= 40 ? "📚 Cần cố gắng thêm" : "💪 Hãy ôn luyện thêm!"}
          </div>
        </div>

        {/* Detailed review */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c" }}>
              Chi tiết đáp án
            </h2>
            <button onClick={() => setShowAll((s) => !s)} style={{ background: "none", border: "1.5px solid #f0d5d5", borderRadius: "8px", padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer", color: "#555" }}>
              {showAll ? "Thu gọn" : "Xem tất cả"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {(showAll ? result.questions : result.questions.slice(0, 5)).map((q, i) => (
              <div key={q.id} style={{
                border: `2px solid ${q.correct ? "#4caf5044" : "#f4433644"}`,
                borderRadius: "12px", padding: "16px",
                background: q.correct ? "#e8f5e944" : "#ffebee44",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ background: q.correct ? "#4caf50" : "#f44336", color: "#fff", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                    <i className={`fas ${q.correct ? "fa-check" : "fa-times"}`} />
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#777" }}>Câu {i + 1}</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#2c2c2c", marginBottom: "8px", lineHeight: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: q.text.replace(/\n/g, "<br/>") }}
                />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    const key = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                    const isCorrect = q.correctAnswer === opt;
                    const isUser = q.userAnswer === opt;
                    return (
                      <span key={opt} style={{
                        padding: "5px 12px", borderRadius: "8px", fontSize: "0.78rem",
                        fontWeight: isCorrect || isUser ? 700 : 400,
                        background: isCorrect ? "#e8f5e9" : isUser ? "#ffebee" : "#f5f5f5",
                        color: isCorrect ? "#2e7d32" : isUser ? "#c62828" : "#777",
                        border: isCorrect ? "1.5px solid #4caf50" : isUser ? "1.5px solid #f44336" : "1.5px solid #eee",
                      }}>
                        {opt}. {q[key]}
                        {isCorrect && <i className="fas fa-check" style={{ marginLeft: "6px" }} />}
                        {isUser && !isCorrect && <i className="fas fa-times" style={{ marginLeft: "6px" }} />}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!showAll && result.questions.length > 5 && (
            <button onClick={() => setShowAll(true)} style={{ width: "100%", marginTop: "12px", background: "#fdf0f0", border: "2px solid #f0d5d5", borderRadius: "10px", padding: "10px", cursor: "pointer", color: "#d32f2f", fontWeight: 600, fontSize: "0.85rem" }}>
              Xem thêm {result.questions.length - 5} câu <i className="fas fa-chevron-down" />
            </button>
          )}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <Link href="/practice/history" style={{ flex: 1, textAlign: "center", background: "#fff", border: "2px solid #f0d5d5", borderRadius: "12px", padding: "12px", color: "#555", fontWeight: 600, fontSize: "0.875rem" }}>
            <i className="fas fa-history" style={{ marginRight: "8px" }} />Lịch sử
          </Link>
          <Link href="/practice" style={{ flex: 1, textAlign: "center", background: "#d32f2f", color: "#fff", borderRadius: "12px", padding: "12px", fontWeight: 600, fontSize: "0.875rem" }}>
            <i className="fas fa-redo" style={{ marginRight: "8px" }} />Luyện tiếp
          </Link>
        </div>
      </div>
    </>
  );
}
