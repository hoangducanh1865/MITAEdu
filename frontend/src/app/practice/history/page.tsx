"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Submission } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function PracticeHistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Submission[]>>("/api/submissions")
      .then((r) => setSubmissions(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#6a1b9a" }}>
          <i className="fas fa-history" style={{ marginRight: "10px" }} />Lịch sử làm bài
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "4px" }}>Các bài thi đã thực hiện</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6a1b9a" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }} />
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#777" }}>
          <i className="fas fa-file-alt" style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }} />
          Chưa có bài thi nào
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {submissions.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c" }}>{s.examTitle}</div>
                <div style={{ fontSize: "0.78rem", color: "#777", marginTop: "4px" }}>
                  <i className="fas fa-clock" style={{ marginRight: "4px" }} />{formatDateTime(s.startedAt)}
                </div>
              </div>
              {s.completed ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#2e7d32" }}>
                    {s.score}/{s.totalQuestions}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#777" }}>{s.percentage}%</div>
                </div>
              ) : (
                <span style={{ fontSize: "0.78rem", color: "#e65100", fontWeight: 600 }}>Chưa nộp</span>
              )}
              {s.completed && (
                <Link href={`/submissions/${s.id}`} style={{ background: "#fdf0f0", color: "#d32f2f", borderRadius: "10px", padding: "7px 14px", fontSize: "0.8rem", fontWeight: 600 }}>
                  Xem kết quả
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
