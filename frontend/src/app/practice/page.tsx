"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Submission } from "@/types";
import { getSavedUser } from "@/lib/auth";
import type { User } from "@/types";

export default function PracticeHomePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getSavedUser<User>());
    api.get<ApiResponse<Submission[]>>("/api/submissions")
      .then((r) => setSubmissions(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const completed = submissions.filter((s) => s.completed);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weeklyCount = completed.filter((s) => new Date(s.startedAt) >= weekStart).length;

  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / completed.length)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1565c0,#0d47a1)",
        borderRadius: "18px", padding: "28px 32px", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", marginBottom: "6px" }}>
            Phòng Luyện MITA 🏆
          </h1>
          <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>
            Xin chào, <strong>{user?.name ?? "bạn"}</strong>! Luyện đề TSA, HSA đầy đủ — từng phần, đề gộp, thi thử.
          </p>
        </div>
        <div style={{ fontSize: "4rem", opacity: 0.2 }}>📚</div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        <StatCard
          loading={loading}
          icon="fa-file-alt"
          color="#1565c0"
          bg="#e3f2fd"
          label="Tổng bài đã làm"
          value={completed.length}
          unit="bài"
        />
        <StatCard
          loading={loading}
          icon="fa-calendar-week"
          color="#2e7d32"
          bg="#e8f5e9"
          label="Tuần này"
          value={weeklyCount}
          unit="bài"
        />
        <StatCard
          loading={loading}
          icon="fa-chart-line"
          color="#e65100"
          bg="#fff3e0"
          label="Điểm TB"
          value={avgScore}
          unit="%"
        />
      </div>

      {/* TSA & HSA cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <ExamCatCard
          title="Đánh giá Tư duy (TSA)"
          color="#1565c0" bg="#e3f2fd" icon="fa-file-alt"
          links={[
            { label: "Luyện từng phần", href: "/practice/tsa/luyen-tung-phan", icon: "fa-book-open" },
            { label: "Đề tự tạo", href: "/practice/tsa/de-tu-tao", icon: "fa-user" },
            { label: "Đề Admin tạo", href: "/practice/tsa/de-admin", icon: "fa-user-shield" },
            { label: "Khảo thí (Thi thử)", href: "/practice/tsa/khao-thi", icon: "fa-clock" },
          ]}
        />
        <ExamCatCard
          title="Đánh giá Năng lực (HSA)"
          color="#2e7d32" bg="#e8f5e9" icon="fa-star"
          links={[
            { label: "Luyện từng phần", href: "/practice/hsa/luyen-tung-phan", icon: "fa-book-open" },
            { label: "Đề tự tạo", href: "/practice/hsa/de-tu-tao", icon: "fa-user" },
            { label: "Đề Admin tạo", href: "/practice/hsa/de-admin", icon: "fa-user-shield" },
            { label: "Khảo thí (Thi thử)", href: "/practice/hsa/khao-thi", icon: "fa-clock" },
          ]}
        />
      </div>

      {/* Utility links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <Link href="/practice/history" style={utilCard}>
          <span style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f3e5f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#6a1b9a", fontSize: "1.1rem" }}>
            <i className="fas fa-history" />
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c" }}>Lịch sử làm bài</div>
            <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "2px" }}>
              {loading ? "..." : `${completed.length} bài đã hoàn thành`}
            </div>
          </div>
          <i className="fas fa-chevron-right" style={{ marginLeft: "auto", color: "#ccc", fontSize: "0.8rem" }} />
        </Link>
        <Link href="/practice/books" style={utilCard}>
          <span style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#e0f2f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#00796b", fontSize: "1.1rem" }}>
            <i className="fas fa-search" />
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c" }}>Tra cứu sách</div>
            <div style={{ fontSize: "0.75rem", color: "#777", marginTop: "2px" }}>Tìm sách tham khảo</div>
          </div>
          <i className="fas fa-chevron-right" style={{ marginLeft: "auto", color: "#ccc", fontSize: "0.8rem" }} />
        </Link>
      </div>

      {/* Recent submissions */}
      {!loading && completed.length > 0 && (
        <div style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c" }}>
              Bài thi gần đây
            </h2>
            <Link href="/practice/history" style={{ fontSize: "0.8rem", color: "#d32f2f", fontWeight: 600 }}>
              Xem tất cả →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {completed.slice(0, 3).map((s) => (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "10px 14px", borderRadius: "10px", background: "#fdf0f0",
              }}>
                <i className="fas fa-file-alt" style={{ color: "#d32f2f", fontSize: "0.9rem" }} />
                <div style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "#2c2c2c" }}>
                  {s.examTitle}
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: (s.percentage ?? 0) >= 70 ? "#2e7d32" : "#d32f2f" }}>
                  {s.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ loading, icon, color, bg, label, value, unit }: {
  loading: boolean; icon: string; color: string; bg: string; label: string; value: number; unit: string;
}) {
  return (
    <div style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "14px", padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span style={{ width: "34px", height: "34px", borderRadius: "8px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: "0.95rem" }}>
          <i className={`fas ${icon}`} />
        </span>
        <span style={{ fontSize: "0.78rem", color: "#777" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color }}>
        {loading ? <i className="fas fa-spinner fa-spin" style={{ fontSize: "1rem" }} /> : `${value}`}
        <span style={{ fontSize: "0.9rem", fontWeight: 600, marginLeft: "4px" }}>{unit}</span>
      </div>
    </div>
  );
}

function ExamCatCard({ title, color, bg, icon, links }: {
  title: string; color: string; bg: string; icon: string;
  links: { label: string; href: string; icon: string }[];
}) {
  return (
    <div style={{ background: "#fff", border: `2px solid ${color}22`, borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: "1.1rem" }}>
          <i className={`fas ${icon}`} />
        </span>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color }}>{title}</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{
            padding: "8px 12px", borderRadius: "10px", background: bg,
            fontSize: "0.82rem", fontWeight: 600, color,
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <i className={`fas ${l.icon}`} style={{ fontSize: "0.75rem", opacity: 0.8 }} />
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const utilCard: React.CSSProperties = {
  background: "#fff", border: "2px solid #f0d5d5", borderRadius: "14px",
  padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px",
  color: "#2c2c2c", textDecoration: "none",
};
