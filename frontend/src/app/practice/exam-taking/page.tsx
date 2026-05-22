"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1, text: "Cho hàm số $f(x)$ xác định trên $\\mathbb{R}$ thỏa mãn $f'(x) = \\dfrac{5x+1}{x+2}$. Biết $f(0) = 2$. Tính $f(2) + f(3)$.",
    options: ["$29 - 11\\ln 5$", "$29 - 9\\ln 5$", "$29 - \\ln 5$", "$29 + 11\\ln 5$"],
    answer: 0,
  },
  {
    id: 2, text: "Nghiệm của phương trình $\\log_2(x+3) = 4$ là:",
    options: ["$x = 13$", "$x = 11$", "$x = 19$", "$x = 7$"],
    answer: 0,
  },
  {
    id: 3, text: "Tập nghiệm của bất phương trình $2^{x-1} \\geq 8$ là:",
    options: ["$[4; +\\infty)$", "$[3; +\\infty)$", "$(-\\infty; 3]$", "$[2; +\\infty)$"],
    answer: 0,
  },
];

export default function ExamTakingPage({ searchParams }: { searchParams: Promise<{ examId?: string; name?: string }> }) {
  const [examName, setExamName] = useState("Tư Duy Toán Học 07");
  const [examCode] = useState("TSA_B60DD");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [perQTime, setPerQTime] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [questions] = useState(SAMPLE_QUESTIONS);

  useEffect(() => {
    searchParams.then((params) => {
      if (params.name) setExamName(decodeURIComponent(params.name));
    });
  }, [searchParams]);

  // Global countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Per-question timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPerQTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswer = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQ].id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const submitExam = () => {
    alert(`Đã nộp bài!\nSố câu hoàn thành: ${Object.keys(answers).length}/${questions.length}`);
    window.location.href = "/practice";
  };

  const q = questions[currentQ];
  const answered = Object.keys(answers).length;

  return (
    <>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", minHeight: "calc(100vh - 60px)" }}>
        {/* LEFT: Main exam area */}
        <main style={{ background: "#fafafa", padding: "20px", overflowY: "auto" }}>
          {/* Header */}
          <div style={{
            background: "#fff", padding: "14px 18px", borderRadius: "10px", marginBottom: "16px",
            display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "1.4rem" }}>🌙</div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2c2c2c" }}>{examName}</div>
                <div style={{ fontSize: "0.75rem", color: "#999" }}>{examCode}</div>
              </div>
            </div>
          </div>

          {/* Question content */}
          <div style={{
            background: "#fff", padding: "24px", borderRadius: "10px", marginBottom: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#d32f2f", marginBottom: "12px" }}>
              Câu {currentQ + 1}
            </div>
            <div style={{
              fontSize: "0.95rem", color: "#2c2c2c", lineHeight: 1.6, marginBottom: "16px",
              fontFamily: "'Nunito', sans-serif",
            }}>
              {q.text}
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {q.options.map((opt, idx) => {
                const isChosen = answers[q.id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      padding: "12px 14px", borderRadius: "8px", cursor: "pointer",
                      border: isChosen ? "2px solid #d32f2f" : "2px solid #e0e0e0",
                      background: isChosen ? "#fff3e0" : "#fff",
                      display: "flex", alignItems: "center", gap: "10px",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "4px",
                      border: isChosen ? "2px solid #d32f2f" : "2px solid #999",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isChosen ? "#d32f2f" : "#fff",
                      color: isChosen ? "#fff" : "#999",
                      fontSize: "0.75rem", fontWeight: 700,
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: "0.9rem", color: "#2c2c2c" }}>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Per-question timer */}
            <div style={{
              marginTop: "16px", fontSize: "0.75rem", color: "#999",
              textAlign: "center",
            }}>
              Thời gian làm câu hiện tại <span style={{ fontWeight: 700, color: "#d32f2f" }}>{formatTime(perQTime)}</span>
            </div>
          </div>

          {/* Bottom navigation */}
          <div style={{
            display: "flex", gap: "10px", justifyContent: "space-between",
          }}>
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              style={{
                padding: "10px 16px", borderRadius: "8px", border: "1px solid #d32f2f",
                background: currentQ === 0 ? "#f5f5f5" : "#fff", color: "#d32f2f",
                fontWeight: 600, cursor: currentQ === 0 ? "not-allowed" : "pointer",
                opacity: currentQ === 0 ? 0.5 : 1,
              }}
            >
              <i className="fas fa-chevron-left" /> Câu trước
            </button>
            <button
              onClick={handleNext}
              disabled={currentQ === questions.length - 1}
              style={{
                padding: "10px 16px", borderRadius: "8px", border: "1px solid #d32f2f",
                background: currentQ === questions.length - 1 ? "#f5f5f5" : "#fff",
                color: "#d32f2f", fontWeight: 600,
                cursor: currentQ === questions.length - 1 ? "not-allowed" : "pointer",
                opacity: currentQ === questions.length - 1 ? 0.5 : 1,
              }}
            >
              Câu tiếp <i className="fas fa-chevron-right" />
            </button>
          </div>
        </main>

        {/* RIGHT: Sidebar with info */}
        <aside style={{
          background: "#f8f9fa", borderLeft: "1px solid #e0e0e0", padding: "16px",
          display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto",
        }}>
          {/* Thí sinh info */}
          <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", fontSize: "0.8rem" }}>
            <div style={{ fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>Thông tin thí sinh</div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: "4px" }}>
              <span>Họ tên</span>
              <span style={{ fontWeight: 600 }}>Hoàng Đức Anh</span>
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            background: timeLeft < 300 ? "#fff3e0" : "#e3f2fd",
            padding: "12px", borderRadius: "8px", border: timeLeft < 300 ? "2px solid #ff9800" : "2px solid #2196f3",
          }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#666", marginBottom: "4px" }}>Thời gian còn lại</div>
            <div style={{
              fontSize: "1.4rem", fontWeight: 900, color: timeLeft < 300 ? "#ff9800" : "#d32f2f",
              fontFamily: "monospace",
            }}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            style={{
              padding: "10px 12px", borderRadius: "8px", border: "none",
              background: "#d32f2f", color: "#fff", fontWeight: 600, fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Nộp bài
          </button>

          {/* Legend */}
          <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", fontSize: "0.75rem" }}>
            <div style={{ fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>Chỉ thị màu sắc:</div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "4px", background: "#4caf50",
                  margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "0.8rem",
                }}>
                  {answered}
                </div>
                <div style={{ color: "#666" }}>Đã làm</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "4px", background: "#ff9800",
                  margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "0.8rem",
                }}>
                  {questions.length - answered}
                </div>
                <div style={{ color: "#666" }}>Chưa làm</div>
              </div>
            </div>
          </div>

          {/* Question grid */}
          <div style={{ background: "#fff", padding: "12px", borderRadius: "8px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>Danh sách câu hỏi</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
              {questions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQ(idx)}
                  style={{
                    width: "100%", aspectRatio: "1", borderRadius: "4px", border: "none",
                    background: currentQ === idx ? "#d32f2f" : answers[question.id] !== undefined ? "#4caf50" : "#e0e0e0",
                    color: currentQ === idx || answers[question.id] !== undefined ? "#fff" : "#999",
                    fontWeight: 600, fontSize: "0.7rem", cursor: "pointer",
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", fontSize: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#666" }}>Bạn đã hoàn thành</span>
              <span style={{ fontWeight: 700, color: "#2c2c2c" }}>{answered}/{questions.length} câu</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "#e0e0e0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#4caf50",
                width: `${(answered / questions.length) * 100}%`,
                transition: "width 0.15s",
              }} />
            </div>
          </div>

          {/* Connection status */}
          <div style={{ fontSize: "0.75rem", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fas fa-circle" style={{ fontSize: "0.5rem", color: "#4caf50" }} />
            Đã kết nối máy chủ
          </div>
        </aside>
      </div>

      {/* Submit confirmation modal */}
      {showSubmitModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999, display: "flex",
          alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)",
        }}>
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "28px",
            maxWidth: "360px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "12px" }}>
              Xác nhận nộp bài
            </h2>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "20px" }}>
              Bạn đã trả lời <strong>{answered}/{questions.length}</strong> câu hỏi.<br />
              {questions.length - answered > 0 && (
                <span style={{ color: "#e65100" }}>Còn {questions.length - answered} câu chưa trả lời.</span>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc",
                  background: "#fff", color: "#333", fontWeight: 600, cursor: "pointer",
                }}
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={submitExam}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                  background: "#d32f2f", color: "#fff", fontWeight: 600, cursor: "pointer",
                }}
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
