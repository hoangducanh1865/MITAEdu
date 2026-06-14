"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  findLocalThptExam,
  computeScore,
  cycleBoolean,
  type ThptExam,
  type P1Answers,
  type P2Answers,
  type P3Answers,
  type ScoreResult,
} from "@/lib/localExams";
import { getSavedUser } from "@/lib/auth";
import type { User } from "@/types";

// ── Constants ─────────────────────────────────────────────
const P1_RANGE = Array.from({ length: 12 }, (_, i) => i + 1);   // 1–12
const P2_RANGE = Array.from({ length: 4 }, (_, i) => i + 13);   // 13–16
const P3_RANGE = Array.from({ length: 6 }, (_, i) => i + 17);   // 17–22
const P2_ITEMS = ["a", "b", "c", "d"] as const;
const TIMER_GREEN  = 15 * 60;
const TIMER_ORANGE = 5 * 60;

// ── Helpers ───────────────────────────────────────────────
function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function timerColor(s: number) {
  if (s > TIMER_GREEN) return "#2e7d32";
  if (s > TIMER_ORANGE) return "#e65100";
  return "#155f8f";
}

// ── Root export ────────────────────────────────────────────
export default function ThptExamTakingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#155f8f" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} />
      </div>
    }>
      <ExamRoom />
    </Suspense>
  );
}

// ── Inner component ────────────────────────────────────────
function ExamRoom() {
  const searchParams                = useSearchParams();
  const examId                      = searchParams.get("examId");

  const [exam, setExam]           = useState<ThptExam | null>(null);
  const [user, setUser]           = useState<User | null>(null);
  const [p1, setP1]               = useState<P1Answers>({});
  const [p2, setP2]               = useState<P2Answers>({});
  const [p3, setP3]               = useState<P3Answers>({});
  const [timeLeft, setTimeLeft]   = useState(90 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult]       = useState<ScoreResult | null>(null);
  const [mobileTab, setMobileTab] = useState<"pdf" | "answers">("answers");

  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);
  const part3Ref = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!examId) return;
    const found = findLocalThptExam(examId);
    if (found) {
      setExam(found);
      setTimeLeft(found.durationMinutes * 60);
    }
    setUser(getSavedUser<User>());
  }, [examId]);

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  // ── Handlers ──────────────────────────────────────────
  function handleP1(q: number, ans: "A"|"B"|"C"|"D") {
    setP1((prev) => ({ ...prev, [q]: ans }));
  }

  function handleP2(q: number, item: "a"|"b"|"c"|"d") {
    setP2((prev) => {
      const cur = prev[q]?.[item];
      return { ...prev, [q]: { ...prev[q], [item]: cycleBoolean(cur) } };
    });
  }

  function handleP3(q: number, val: string) {
    setP3((prev) => ({ ...prev, [q]: val }));
  }

  function handleSubmit() {
    if (!exam) return;
    const score = computeScore(p1, p2, p3, exam);
    setResult(score);
    setSubmitted(true);
    setShowModal(false);
    setMobileTab("answers");
  }

  function handleReset() {
    setP1({}); setP2({}); setP3({});
    setSubmitted(false); setResult(null);
    if (exam) setTimeLeft(exam.durationMinutes * 60);
  }

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Progress ───────────────────────────────────────────
  const p1Done = P1_RANGE.filter((q) => p1[q] !== undefined).length;
  const p2Done = P2_RANGE.filter((q) =>
    P2_ITEMS.some((k) => p2[q]?.[k] !== undefined)
  ).length;
  const p3Done = P3_RANGE.filter((q) => (p3[q] ?? "").trim() !== "").length;

  const tColor = timerColor(timeLeft);

  if (!exam) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "12px", color: "#155f8f" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} />
        <span style={{ fontSize: "0.85rem", color: "#888" }}>
          {examId ? "Đang tải đề thi..." : "Không tìm thấy đề thi"}
        </span>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Sticky header ─────────────────────────────── */}
      <header className="exam-room-header" style={{
        height: "56px", flexShrink: 0,
        background: "#fff", borderBottom: "2px solid #c5ddf0",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: "16px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link href="/practice/thpt/khao-thi" style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "#777", fontSize: "0.82rem", textDecoration: "none",
          fontWeight: 600, flexShrink: 0,
        }}>
          <i className="fas fa-arrow-left" style={{ fontSize: "0.75rem" }} />
          Thoát
        </Link>

        <div className="exam-header-sep" style={{ width: "1px", height: "24px", background: "#c5ddf0" }} />

        <span className="exam-header-badge" style={{
          background: "#155f8f", color: "#fff",
          borderRadius: "6px", padding: "3px 10px",
          fontSize: "0.72rem", fontWeight: 800, flexShrink: 0,
        }}>
          THPT {exam.year}
        </span>
        <span className="exam-header-title" style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 800,
          fontSize: "0.95rem", color: "#2c2c2c",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          flex: 1,
        }}>
          {exam.title}
        </span>

        {/* Spacer on mobile (title is hidden) */}
        <div style={{ flex: 1 }} className="exam-header-title" />

        {/* Timer */}
        {!submitted && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#fff5f5", borderRadius: "8px",
            padding: "6px 14px", border: `1.5px solid ${tColor}44`,
            flexShrink: 0,
          }}>
            <i className="fas fa-clock" style={{ color: tColor, fontSize: "0.8rem" }} />
            <span style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "1.05rem", color: tColor, letterSpacing: "1px",
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        {!submitted && (
          <button
            className="exam-submit-btn"
            onClick={() => setShowModal(true)}
            style={{
              background: "#155f8f", color: "#fff", border: "none",
              borderRadius: "8px", padding: "8px 16px",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Nộp bài
          </button>
        )}
      </header>

      {/* ── Mobile tab switcher (hidden on desktop) ───── */}
      {!submitted && (
        <div className="exam-mobile-tabs">
          <button
            className={`exam-tab-btn${mobileTab === "pdf" ? " active" : ""}`}
            onClick={() => setMobileTab("pdf")}
          >
            <i className="fas fa-file-pdf" />
            Xem đề
          </button>
          <button
            className={`exam-tab-btn${mobileTab === "answers" ? " active" : ""}`}
            onClick={() => setMobileTab("answers")}
          >
            <i className="fas fa-pencil-alt" />
            Làm bài ({p1Done + p2Done + p3Done}/22)
          </button>
        </div>
      )}

      {/* ── Main body ─────────────────────────────────── */}
      <div
        className={`exam-body-split${mobileTab === "pdf" ? " show-pdf" : ""}`}
        style={{ display: "flex", flex: 1, overflow: "hidden" }}
      >

        {/* LEFT: PDF viewer */}
        <div className="exam-pdf-panel" style={{
          width: "55%", flexShrink: 0,
          borderRight: "2px solid #c5ddf0",
          background: "#f5f5f5",
        }}>
          <iframe
            src={exam.pdfUrl}
            title="Đề thi"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        </div>

        {/* RIGHT: Answer panel */}
        <div ref={rightRef} className="exam-answers-panel" style={{
          flex: 1, overflowY: "auto",
          background: "#fff",
          display: "flex", flexDirection: "column",
        }}>
          {submitted && result ? (
            <ResultPanel result={result} exam={exam} p1={p1} p2={p2} p3={p3} onReset={handleReset} />
          ) : (
            <>
              {/* Section navigator tabs */}
              <div style={{
                display: "flex", gap: "8px", padding: "12px 16px",
                borderBottom: "1px solid #c5ddf0",
                background: "#fff", position: "sticky", top: 0, zIndex: 10,
              }}>
                {[
                  { label: `Phần I (${p1Done}/12)`, ref: part1Ref, done: p1Done, total: 12 },
                  { label: `Phần II (${p2Done}/4)`, ref: part2Ref, done: p2Done, total: 4 },
                  { label: `Phần III (${p3Done}/6)`, ref: part3Ref, done: p3Done, total: 6 },
                ].map(({ label, ref, done, total }) => (
                  <button
                    key={label}
                    onClick={() => scrollTo(ref)}
                    style={{
                      flex: 1, padding: "7px 8px",
                      borderRadius: "8px", border: "1.5px solid #c5ddf0",
                      background: done === total ? "#fff5f5" : "#fff",
                      cursor: "pointer", fontSize: "0.75rem", fontWeight: 700,
                      color: done === total ? "#155f8f" : "#555",
                      transition: "all .15s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, padding: "0 0 80px 0" }}>

                {/* ── PHẦN I ──────────────────────── */}
                <div ref={part1Ref} style={{ padding: "18px 16px 8px" }}>
                  <SectionHeader
                    title="Phần I — Trắc nghiệm"
                    subtitle="12 câu × 0,25 điểm = 3,0 điểm"
                    color="#1565c0"
                    bg="#e3f2fd"
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                    {P1_RANGE.map((q) => (
                      <div key={q} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 12px", borderRadius: "8px",
                        background: p1[q] ? "#fff5f5" : "#fafafa",
                        border: `1px solid ${p1[q] ? "#fca5a5" : "#c5ddf0"}`,
                      }}>
                        <span style={{
                          fontWeight: 700, fontSize: "0.8rem", color: "#555",
                          minWidth: "42px", flexShrink: 0,
                        }}>
                          Câu {q}
                        </span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {(["A", "B", "C", "D"] as const).map((opt) => {
                            const chosen = p1[q] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleP1(q, opt)}
                                style={{
                                  width: "36px", height: "32px",
                                  borderRadius: "6px", border: "1.5px solid",
                                  borderColor: chosen ? "#155f8f" : "#d0d0d0",
                                  background: chosen ? "#155f8f" : "#fff",
                                  color: chosen ? "#fff" : "#555",
                                  fontWeight: 800, fontSize: "0.82rem",
                                  cursor: "pointer", transition: "all .12s",
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── PHẦN II ─────────────────────── */}
                <div ref={part2Ref} style={{ padding: "18px 16px 8px", borderTop: "2px dashed #c5ddf0" }}>
                  <SectionHeader
                    title="Phần II — Đúng / Sai"
                    subtitle="4 câu, mỗi câu tối đa 1 điểm"
                    color="#2e7d32"
                    bg="#e8f5e9"
                  />
                  <div style={{
                    display: "flex", gap: "10px", marginTop: "10px",
                    padding: "8px 12px", background: "#f9f9f9",
                    borderRadius: "8px", fontSize: "0.72rem", color: "#666",
                    flexWrap: "wrap",
                  }}>
                    <span>Điểm theo số ý đúng:</span>
                    {[[1,"0,1"],[2,"0,25"],[3,"0,5"],[4,"1,0"]].map(([n,s]) => (
                      <span key={n} style={{
                        background: "#fff", border: "1px solid #e0e0e0",
                        borderRadius: "4px", padding: "2px 8px", fontWeight: 700,
                      }}>{n} đúng → {s}đ</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                    {P2_RANGE.map((q) => (
                      <div key={q} style={{
                        border: "1.5px solid #e8f5e9", borderRadius: "10px",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          background: "#e8f5e9", padding: "7px 12px",
                          fontWeight: 800, fontSize: "0.82rem", color: "#2e7d32",
                        }}>
                          Câu {q}
                        </div>
                        <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                          {P2_ITEMS.map((item) => {
                            const val = p2[q]?.[item];
                            return (
                              <div key={item} style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between", gap: "8px",
                              }}>
                                <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "#555", minWidth: "20px" }}>
                                  {item})
                                </span>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => {
                                      setP2((prev) => ({
                                        ...prev,
                                        [q]: { ...prev[q], [item]: val === true ? undefined : true },
                                      }));
                                    }}
                                    style={{
                                      padding: "4px 12px", borderRadius: "6px",
                                      border: "1.5px solid",
                                      borderColor: val === true ? "#2e7d32" : "#d0d0d0",
                                      background: val === true ? "#2e7d32" : "#fff",
                                      color: val === true ? "#fff" : "#555",
                                      fontWeight: 700, fontSize: "0.75rem", cursor: "pointer",
                                      transition: "all .12s",
                                    }}
                                  >
                                    Đúng
                                  </button>
                                  <button
                                    onClick={() => {
                                      setP2((prev) => ({
                                        ...prev,
                                        [q]: { ...prev[q], [item]: val === false ? undefined : false },
                                      }));
                                    }}
                                    style={{
                                      padding: "4px 12px", borderRadius: "6px",
                                      border: "1.5px solid",
                                      borderColor: val === false ? "#155f8f" : "#d0d0d0",
                                      background: val === false ? "#155f8f" : "#fff",
                                      color: val === false ? "#fff" : "#555",
                                      fontWeight: 700, fontSize: "0.75rem", cursor: "pointer",
                                      transition: "all .12s",
                                    }}
                                  >
                                    Sai
                                  </button>
                                  {val === undefined && (
                                    <span style={{ fontSize: "0.68rem", color: "#aaa", alignSelf: "center" }}>chưa chọn</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── PHẦN III ────────────────────── */}
                <div ref={part3Ref} style={{ padding: "18px 16px 8px", borderTop: "2px dashed #c5ddf0" }}>
                  <SectionHeader
                    title="Phần III — Trả lời ngắn"
                    subtitle="6 câu × 0,5 điểm = 3,0 điểm"
                    color="#e65100"
                    bg="#fff3e0"
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                    {P3_RANGE.map((q) => (
                      <div key={q} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 12px", borderRadius: "8px",
                        border: `1px solid ${p3[q]?.trim() ? "#fed7aa" : "#c5ddf0"}`,
                        background: p3[q]?.trim() ? "#fff7ed" : "#fafafa",
                      }}>
                        <span style={{
                          fontWeight: 700, fontSize: "0.8rem", color: "#555",
                          minWidth: "42px", flexShrink: 0,
                        }}>
                          Câu {q}
                        </span>
                        <input
                          type="text"
                          value={p3[q] ?? ""}
                          onChange={(e) => handleP3(q, e.target.value)}
                          placeholder="Nhập đáp án..."
                          style={{
                            flex: 1, padding: "6px 10px",
                            border: "1.5px solid #e0e0e0", borderRadius: "6px",
                            fontSize: "0.875rem", outline: "none",
                            fontFamily: "monospace", fontWeight: 600,
                            transition: "border-color .15s",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "#155f8f"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sticky submit bar */}
              <div style={{
                position: "sticky", bottom: 0,
                padding: "12px 16px",
                background: "#fff", borderTop: "2px solid #c5ddf0",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{ flex: 1, fontSize: "0.78rem", color: "#888" }}>
                  Đã làm: {p1Done + p2Done + p3Done}/22 câu
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: "#155f8f", color: "#fff", border: "none",
                    borderRadius: "8px", padding: "10px 24px",
                    fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                  }}
                >
                  <i className="fas fa-paper-plane" style={{ marginRight: "8px" }} />
                  Nộp bài
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Submit modal ────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px",
            padding: "28px 32px", maxWidth: "380px", width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "#fff5f5", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#155f8f", fontSize: "1.1rem",
                flexShrink: 0,
              }}>
                <i className="fas fa-paper-plane" />
              </div>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "#2c2c2c" }}>
                Xác nhận nộp bài
              </h2>
            </div>

            <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "8px", lineHeight: 1.6 }}>
              <strong>Phần I:</strong> {p1Done}/12 câu &nbsp;·&nbsp;
              <strong>Phần II:</strong> {p2Done}/4 câu &nbsp;·&nbsp;
              <strong>Phần III:</strong> {p3Done}/6 câu
            </div>

            {p1Done + p2Done + p3Done < 22 && (
              <div style={{
                background: "#fff3e0", border: "1px solid #ffcc02",
                borderRadius: "8px", padding: "10px 14px", fontSize: "0.82rem",
                color: "#e65100", marginBottom: "16px",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginTop: "2px" }} />
                <span>Còn {22 - p1Done - p2Done - p3Done} câu chưa trả lời. Bạn có chắc chắn muốn nộp?</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  border: "1.5px solid #e0e0e0", background: "#fff",
                  color: "#444", fontWeight: 600, cursor: "pointer",
                }}
              >
                Tiếp tục làm
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  border: "none", background: "#155f8f",
                  color: "#fff", fontWeight: 700, cursor: "pointer",
                }}
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function SectionHeader({
  title, subtitle, color, bg,
}: {
  title: string; subtitle: string; color: string; bg: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <div style={{
        background: bg, borderRadius: "8px", padding: "6px 14px",
        fontFamily: "Nunito, sans-serif", fontWeight: 900,
        fontSize: "0.88rem", color,
      }}>
        {title}
      </div>
      <span style={{ fontSize: "0.75rem", color: "#888" }}>{subtitle}</span>
    </div>
  );
}

function ResultPanel({
  result, exam, p1, p2, p3, onReset,
}: {
  result: ScoreResult;
  exam: ThptExam;
  p1: P1Answers;
  p2: P2Answers;
  p3: P3Answers;
  onReset: () => void;
}) {
  const pct = (result.total / 10) * 100;
  const scoreColor = pct >= 80 ? "#2e7d32" : pct >= 50 ? "#e65100" : "#155f8f";

  return (
    <div style={{ padding: "20px 16px", overflowY: "auto" }}>
      {/* Total score */}
      <div style={{
        background: `${scoreColor}11`, border: `2px solid ${scoreColor}44`,
        borderRadius: "14px", padding: "20px",
        textAlign: "center", marginBottom: "18px",
      }}>
        <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "6px" }}>Tổng điểm</div>
        <div style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900,
          fontSize: "3rem", color: scoreColor, lineHeight: 1,
        }}>
          {result.total}
        </div>
        <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "4px" }}>/ 10 điểm</div>
      </div>

      {/* Section scores */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "20px" }}>
        {[
          { label: "Phần I", score: result.part1, max: 3, color: "#1565c0" },
          { label: "Phần II", score: result.part2, max: 4, color: "#2e7d32" },
          { label: "Phần III", score: result.part3, max: 3, color: "#e65100" },
        ].map(({ label, score, max, color }) => (
          <div key={label} style={{
            background: "#fff", border: "2px solid #c5ddf0",
            borderRadius: "10px", padding: "12px", textAlign: "center",
          }}>
            <div style={{ fontSize: "0.72rem", color: "#888", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color }}>
              {score}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#aaa" }}>/ {max}</div>
          </div>
        ))}
      </div>

      {/* Part I detail */}
      <ResultSection title="Phần I — Trắc nghiệm" color="#1565c0">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "6px" }}>
          {P1_RANGE.map((q) => {
            const ok = result.part1Detail[q];
            const userAns = p1[q] ?? "—";
            const correctAns = exam.answerKey.part1[q];
            return (
              <div key={q} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "6px 10px", borderRadius: "7px",
                background: ok ? "#f0fdf4" : p1[q] ? "#fff5f5" : "#fafafa",
                border: `1px solid ${ok ? "#86efac" : p1[q] ? "#fca5a5" : "#e5e7eb"}`,
              }}>
                <span style={{ fontSize: "0.75rem", color: "#555", minWidth: "38px" }}>Câu {q}</span>
                <span style={{
                  fontWeight: 800, fontSize: "0.82rem", minWidth: "22px",
                  color: ok ? "#2e7d32" : "#155f8f",
                }}>
                  {userAns}
                </span>
                {!ok && p1[q] && (
                  <span style={{ fontSize: "0.72rem", color: "#888" }}>→ {correctAns}</span>
                )}
                <i className={`fas fa-${ok ? "check" : p1[q] ? "times" : "minus"}`}
                  style={{ marginLeft: "auto", color: ok ? "#2e7d32" : p1[q] ? "#155f8f" : "#ccc", fontSize: "0.72rem" }} />
              </div>
            );
          })}
        </div>
      </ResultSection>

      {/* Part II detail */}
      <ResultSection title="Phần II — Đúng / Sai" color="#2e7d32">
        {P2_RANGE.map((q) => {
          const { correct, score } = result.part2Detail[q];
          return (
            <div key={q} style={{
              border: "1.5px solid #c5ddf0", borderRadius: "8px",
              overflow: "hidden", marginBottom: "8px",
            }}>
              <div style={{
                padding: "6px 12px",
                background: score === 1 ? "#f0fdf4" : score > 0 ? "#fff7ed" : "#fff5f5",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#444" }}>Câu {q}</span>
                <span style={{ fontWeight: 800, fontSize: "0.82rem", color: score === 1 ? "#2e7d32" : score > 0 ? "#e65100" : "#155f8f" }}>
                  {correct}/4 đúng → {score}đ
                </span>
              </div>
              <div style={{ padding: "8px 12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {P2_ITEMS.map((item) => {
                  const userVal = p2[q]?.[item];
                  const keyVal = exam.answerKey.part2[q][item];
                  const itemOk = userVal === keyVal;
                  return (
                    <span key={item} style={{
                      fontSize: "0.75rem", fontWeight: 600,
                      color: itemOk ? "#2e7d32" : "#155f8f",
                      display: "flex", alignItems: "center", gap: "4px",
                    }}>
                      <i className={`fas fa-${itemOk ? "check" : "times"}`} style={{ fontSize: "0.6rem" }} />
                      {item}) {keyVal ? "Đúng" : "Sai"}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </ResultSection>

      {/* Part III detail */}
      <ResultSection title="Phần III — Trả lời ngắn" color="#e65100">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {P3_RANGE.map((q) => {
            const ok = result.part3Detail[q];
            const userAns = p3[q] ?? "";
            const correctAns = exam.answerKey.part3[q];
            return (
              <div key={q} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "7px 12px", borderRadius: "7px",
                background: ok ? "#f0fdf4" : userAns ? "#fff5f5" : "#fafafa",
                border: `1px solid ${ok ? "#86efac" : userAns ? "#fca5a5" : "#e5e7eb"}`,
              }}>
                <span style={{ fontSize: "0.75rem", color: "#555", minWidth: "42px" }}>Câu {q}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem",
                  color: ok ? "#2e7d32" : "#155f8f" }}>
                  {userAns || "—"}
                </span>
                {!ok && <span style={{ fontSize: "0.72rem", color: "#888" }}>→ {correctAns}</span>}
                <i className={`fas fa-${ok ? "check" : userAns ? "times" : "minus"}`}
                  style={{ marginLeft: "auto", color: ok ? "#2e7d32" : userAns ? "#155f8f" : "#ccc", fontSize: "0.72rem" }} />
              </div>
            );
          })}
        </div>
      </ResultSection>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
        <button
          onClick={onReset}
          style={{
            flex: 1, padding: "11px", borderRadius: "8px",
            border: "1.5px solid #155f8f", background: "#fff",
            color: "#155f8f", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem",
          }}
        >
          <i className="fas fa-redo" style={{ marginRight: "8px" }} />
          Làm lại
        </button>
        <Link
          href="/practice/thpt/khao-thi"
          style={{
            flex: 1, padding: "11px", borderRadius: "8px",
            background: "#155f8f", color: "#fff",
            fontWeight: 700, cursor: "pointer", fontSize: "0.875rem",
            textDecoration: "none", textAlign: "center",
          }}
        >
          Về danh sách đề
        </Link>
      </div>
    </div>
  );
}

function ResultSection({
  title, color, children,
}: {
  title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{
        fontFamily: "Nunito, sans-serif", fontWeight: 800,
        fontSize: "0.85rem", color, marginBottom: "10px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <div style={{ width: "3px", height: "16px", background: color, borderRadius: "2px" }} />
        {title}
      </div>
      {children}
    </div>
  );
}
