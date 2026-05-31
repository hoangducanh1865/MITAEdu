"use client";

import Link from "next/link";
import { LOCAL_THPT_EXAMS } from "@/lib/localExams";

export default function ThptKhaoThiPage() {
  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Page header */}
      <div style={{
        background: "linear-gradient(135deg,#b71c1c,#880e0e)",
        borderRadius: "16px",
        padding: "28px 32px",
        color: "#fff",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: "1.6rem",
        }}>
          <i className="fas fa-graduation-cap" />
        </div>
        <div>
          <h1 style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 900,
            fontSize: "1.3rem", marginBottom: "6px",
          }}>
            Đề Thi Thử THPT Quốc Gia
          </h1>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.5 }}>
            Cấu trúc mới 2025: Phần I (12 câu TN) · Phần II (4 câu Đúng/Sai) · Phần III (6 câu Trả lời ngắn)
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "10px", flexWrap: "wrap" }}>
            {[
              { icon: "fa-clock", label: "90 phút" },
              { icon: "fa-list-ol", label: "22 câu" },
              { icon: "fa-star", label: "10 điểm" },
            ].map(({ icon, label }) => (
              <span key={label} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.18)", borderRadius: "20px",
                padding: "4px 12px", fontSize: "0.78rem", fontWeight: 600,
              }}>
                <i className={`fas ${icon}`} style={{ fontSize: "0.7rem" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score structure info */}
      <div style={{
        background: "#fff", border: "2px solid #f0d5d5",
        borderRadius: "14px", padding: "18px 22px", marginBottom: "24px",
      }}>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#b71c1c", marginBottom: "12px" }}>
          Cấu trúc điểm
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {[
            { part: "Phần I", desc: "12 câu × 0,25 điểm", total: "3,0 điểm", color: "#1565c0", bg: "#e3f2fd" },
            { part: "Phần II", desc: "4 câu × tối đa 1 điểm", total: "4,0 điểm", color: "#2e7d32", bg: "#e8f5e9" },
            { part: "Phần III", desc: "6 câu × 0,5 điểm", total: "3,0 điểm", color: "#e65100", bg: "#fff3e0" },
          ].map(({ part, desc, total, color, bg }) => (
            <div key={part} style={{
              background: bg, borderRadius: "10px", padding: "12px 14px",
              border: `1px solid ${color}22`,
            }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color, marginBottom: "4px" }}>{part}</div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>{desc}</div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1rem", color }}>{total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam list */}
      <h2 style={{
        fontFamily: "Nunito, sans-serif", fontWeight: 800,
        fontSize: "0.95rem", color: "#2c2c2c",
        marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        Đề thi có sẵn
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {LOCAL_THPT_EXAMS.map((exam) => (
          <div key={exam.id} style={{
            background: "#fff", border: "2px solid #f0d5d5",
            borderRadius: "14px", padding: "20px 24px",
            display: "flex", alignItems: "center", gap: "20px",
          }}>
            {/* Year badge */}
            <div style={{
              width: "56px", height: "56px", borderRadius: "12px",
              background: "linear-gradient(135deg,#b71c1c,#880e0e)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0, color: "#fff",
            }}>
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1rem", lineHeight: 1 }}>
                {exam.year}
              </span>
              <span style={{ fontSize: "0.6rem", opacity: 0.85, marginTop: "2px" }}>THPT</span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 800,
                fontSize: "1rem", color: "#2c2c2c", marginBottom: "6px",
              }}>
                {exam.title}
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { icon: "fa-clock", label: `${exam.durationMinutes} phút` },
                  { icon: "fa-list-ol", label: "22 câu" },
                  { icon: "fa-file-pdf", label: "Đề PDF" },
                ].map(({ icon, label }) => (
                  <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "#777" }}>
                    <i className={`fas ${icon}`} style={{ color: "#b71c1c", fontSize: "0.7rem" }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/practice/thpt/exam-taking?examId=${exam.id}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#b71c1c", color: "#fff",
                padding: "10px 20px", borderRadius: "10px",
                fontWeight: 700, fontSize: "0.875rem",
                textDecoration: "none", flexShrink: 0,
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#d32f2f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#b71c1c"; }}
            >
              Bắt đầu thi
              <i className="fas fa-chevron-right" style={{ fontSize: "0.75rem" }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
