"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { ApiResponse, Exam, ExamPackage, Submission } from "@/types";
import { formatDateTime, formatDuration } from "@/lib/utils";
import Link from "next/link";

export default function TsaDeTuTaoPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [history, setHistory] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<ExamPackage[]>>("/api/exam-packages?tag=TSA"),
      api.get<ApiResponse<Exam[]>>("/api/exams?status=PUBLISHED"),
      api.get<ApiResponse<Submission[]>>("/api/submissions").catch(() => ({ data: { data: [] } })),
    ])
      .then(([pkgRes, examRes, subRes]) => {
        setPackages(pkgRes.data.data);
        const tsaExams = (examRes.data.data as Exam[]).filter((e) =>
          pkgRes.data.data.some((p: ExamPackage) => p.id === e.packageId)
        );
        setAllExams(tsaExams);
        setHistory((subRes.data.data as Submission[]).filter((s) =>
          tsaExams.some((e) => e.id === s.examId)
        ).slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleStart() {
    if (!selectedExamId) return;
    setStarting(true);
    try {
      await api.post(`/api/exams/${selectedExamId}/start`);
      router.push(`/exam/${selectedExamId}/taking`);
    } catch {
      setStarting(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{
              width: "44px", height: "44px", borderRadius: "12px", background: "#e3f2fd",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#1565c0", fontSize: "1.2rem",
            }}>
              <i className="fas fa-user" />
            </span>
            <div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#1565c0" }}>
                Đề Tự Tạo — TSA
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "2px" }}>
                Chọn đề bất kỳ từ kho để luyện tập
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#1565c0", color: "#fff", border: "none", borderRadius: "12px",
              padding: "10px 20px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <i className="fas fa-plus" /> Bắt đầu làm bài
          </button>
        </div>

        {/* Recent history */}
        <div style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c" }}>
              <i className="fas fa-history" style={{ marginRight: "8px", color: "#1565c0" }} />
              Bài làm gần đây
            </h2>
            <Link href="/practice/history" style={{ fontSize: "0.8rem", color: "#1565c0", fontWeight: 600 }}>
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#1565c0" }}>
              <i className="fas fa-spinner fa-spin" />
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#777" }}>
              <i className="fas fa-file-alt" style={{ fontSize: "2rem", display: "block", marginBottom: "10px", opacity: 0.4 }} />
              <p style={{ fontSize: "0.875rem" }}>Chưa có bài làm nào. Hãy bắt đầu!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {history.map((s) => (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "12px 14px", borderRadius: "12px", background: "#f8fbff",
                  border: "1.5px solid #e3f2fd",
                }}>
                  <i className="fas fa-file-alt" style={{ color: "#1565c0", fontSize: "1rem" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#2c2c2c" }}>{s.examTitle}</div>
                    <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "2px" }}>{formatDateTime(s.startedAt)}</div>
                  </div>
                  {s.completed ? (
                    <>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: "1rem", color: (s.percentage ?? 0) >= 70 ? "#2e7d32" : "#d32f2f" }}>
                          {s.score}/{s.totalQuestions}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#777" }}>{s.percentage}%</div>
                      </div>
                      <Link href={`/submissions/${s.id}`} style={{
                        background: "#e3f2fd", color: "#1565c0", borderRadius: "8px",
                        padding: "6px 12px", fontSize: "0.78rem", fontWeight: 600,
                      }}>
                        Xem lại
                      </Link>
                    </>
                  ) : (
                    <Link href={`/exam/${s.examId}/taking`} style={{
                      background: "#1565c0", color: "#fff", borderRadius: "8px",
                      padding: "6px 12px", fontSize: "0.78rem", fontWeight: 600,
                    }}>
                      Tiếp tục
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal chọn đề */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", padding: "20px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "32px",
            maxWidth: "480px", width: "100%",
            boxShadow: "0 12px 40px rgba(0,0,0,.18)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#1565c0" }}>
                <i className="fas fa-file-alt" style={{ marginRight: "10px" }} />Chọn đề TSA
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#777", fontSize: "1.2rem" }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px", display: "block" }}>
                Chọn đề thi <span style={{ color: "#d32f2f" }}>*</span>
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "2px solid #e3f2fd", fontSize: "0.875rem", color: "#2c2c2c",
                  background: "#f8fbff", outline: "none",
                }}
              >
                <option value="">— Chọn đề —</option>
                {packages.map((pkg) => {
                  const pkgExams = allExams.filter((e) => e.packageId === pkg.id);
                  if (!pkgExams.length) return null;
                  return (
                    <optgroup key={pkg.id} label={pkg.name}>
                      {pkgExams.map((exam) => (
                        <option key={exam.id} value={exam.id}>
                          {exam.title} ({formatDuration(exam.durationMinutes)} · {exam.questionCount} câu)
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div style={{
              background: "#e3f2fd", borderRadius: "10px", padding: "12px 14px",
              fontSize: "0.82rem", color: "#0d47a1", marginBottom: "24px",
            }}>
              <i className="fas fa-info-circle" style={{ marginRight: "8px" }} />
              Sau khi chọn đề, bạn sẽ được chuyển đến trang xác nhận trước khi thi.
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "11px", borderRadius: "10px", border: "2px solid #e0e0e0",
                background: "#fff", color: "#555", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem",
              }}>
                Hủy
              </button>
              <button
                onClick={handleStart}
                disabled={!selectedExamId || starting}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px", border: "none",
                  background: !selectedExamId ? "#b0bec5" : "#1565c0",
                  color: "#fff", fontWeight: 700, cursor: !selectedExamId ? "not-allowed" : "pointer",
                  fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {starting && <i className="fas fa-spinner fa-spin" />}
                Bắt đầu thi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}