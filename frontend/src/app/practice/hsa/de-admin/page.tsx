"use client";

import { useEffect, useState } from "react";
import ExamCard from "@/components/practice/ExamCard";
import api from "@/lib/api";
import type { ApiResponse, Exam, ExamPackage } from "@/types";

export default function HsaDeAdminPage() {
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [exams, setExams] = useState<Record<number, Exam[]>>({});
  const [loading, setLoading] = useState(true);
  const [openPkg, setOpenPkg] = useState<number | null>(null);
  const [loadingExams, setLoadingExams] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse<ExamPackage[]>>("/api/exam-packages?tag=HSA")
      .then((r) => setPackages(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  async function togglePackage(pkgId: number) {
    if (openPkg === pkgId) {
      setOpenPkg(null);
      return;
    }
    setOpenPkg(pkgId);
    if (exams[pkgId]) return;
    setLoadingExams(pkgId);
    try {
      const r = await api.get<ApiResponse<Exam[]>>(
        `/api/exams?packageId=${pkgId}&status=PUBLISHED`
      );
      setExams((prev) => ({ ...prev, [pkgId]: r.data.data }));
    } finally {
      setLoadingExams(null);
    }
  }

  return (

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            width: "44px", height: "44px", borderRadius: "12px", background: "#e8f5e9",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#2e7d32", fontSize: "1.2rem",
          }}>
            <i className="fas fa-user-shield" />
          </span>
          <div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2e7d32" }}>
              Đề Admin Tạo — HSA
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "2px" }}>
              Các bộ đề do Admin biên soạn — chọn bộ đề để làm bài
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#2e7d32" }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }} />
          </div>
        ) : packages.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px", color: "#777",
            background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5",
          }}>
            <i className="fas fa-user-shield" style={{ fontSize: "2.5rem", color: "#2e7d32", marginBottom: "14px", display: "block", opacity: 0.5 }} />
            <p style={{ fontSize: "0.95rem" }}>Chưa có bộ đề nào được Admin tạo</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {packages.map((pkg) => {
              const isOpen = openPkg === pkg.id;
              const pkgExams = exams[pkg.id] ?? [];
              const isLoadingThis = loadingExams === pkg.id;

              return (
                <div key={pkg.id} style={{
                  background: "#fff", border: `2px solid ${isOpen ? "#2e7d32" : "#f0d5d5"}`,
                  borderRadius: "14px", overflow: "hidden", transition: "border-color .2s",
                }}>
                  <button
                    onClick={() => togglePackage(pkg.id)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: "#e8f5e9", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#2e7d32", fontSize: "1.1rem", flexShrink: 0,
                    }}>
                      <i className="fas fa-file-alt" />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{
                          background: "#e8f5e9", color: "#2e7d32", borderRadius: "20px",
                          padding: "2px 10px", fontSize: "0.72rem", fontWeight: 700,
                        }}>HSA</span>
                        <span style={{ fontSize: "0.75rem", color: "#777" }}>{pkg.examCount} đề</span>
                        {pkg.isLocked && (
                          <i className="fas fa-lock" style={{ color: "#f5a623", fontSize: "0.78rem" }} />
                        )}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#2c2c2c" }}>{pkg.name}</div>
                      {pkg.description && (
                        <div style={{ fontSize: "0.78rem", color: "#777", marginTop: "2px" }}>{pkg.description}</div>
                      )}
                    </div>
                    <i className="fas fa-chevron-down" style={{
                      color: "#777", fontSize: "0.85rem",
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform .2s",
                    }} />
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "2px solid #f0d5d5", padding: "12px 16px", background: "#f9fdf9" }}>
                      {isLoadingThis ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "#2e7d32" }}>
                          <i className="fas fa-spinner fa-spin" />
                        </div>
                      ) : pkgExams.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "#777", fontSize: "0.875rem" }}>
                          <i className="fas fa-inbox" style={{ marginRight: "8px" }} />
                          Chưa có đề nào được công bố
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {pkgExams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
