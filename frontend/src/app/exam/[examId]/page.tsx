"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ExamCard from "@/components/practice/ExamCard";
import api from "@/lib/api";
import type { ApiResponse, Exam, ExamPackage } from "@/types";
import Link from "next/link";

export default function ExamListPage() {
  const { examId } = useParams() as { examId: string };
  const [pkg, setPkg] = useState<ExamPackage | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<ExamPackage>>(`/api/exam-packages/${examId}`),
      api.get<ApiResponse<Exam[]>>(`/api/exams?packageId=${examId}&status=PUBLISHED`),
    ])
      .then(([pkgRes, examsRes]) => {
        setPkg(pkgRes.data.data);
        setExams(examsRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [examId]);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 20px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.82rem", color: "#777", marginBottom: "16px" }}>
          <Link href="/" style={{ color: "#777" }}>Trang chủ</Link> ›{" "}
          <Link href="/practice" style={{ color: "#777" }}>Phòng luyện</Link> ›{" "}
          <span style={{ color: "#d32f2f", fontWeight: 600 }}>{pkg?.name ?? "..."}</span>
        </nav>

        {/* Header */}
        <div style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px", padding: "22px 24px", marginBottom: "20px" }}>
          {pkg && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{
                  padding: "4px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700,
                  background: pkg.tag === "TSA" ? "#e3f2fd" : "#e8f5e9",
                  color: pkg.tag === "TSA" ? "#1565c0" : "#2e7d32",
                }}>
                  {pkg.tag}
                </span>
                <span style={{ fontSize: "0.78rem", color: "#777" }}>{pkg.examCount} đề</span>
              </div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "6px" }}>
                {pkg.name}
              </h1>
              {pkg.description && <p style={{ fontSize: "0.875rem", color: "#666" }}>{pkg.description}</p>}
            </>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#d32f2f" }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }} />
          </div>
        ) : exams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
            <i className="fas fa-file-alt" style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }} />
            Chưa có đề nào được công bố
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
          </div>
        )}
      </div>
    </>
  );
}
