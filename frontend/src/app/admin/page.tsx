"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, Course } from "@/types";

interface Stats {
  totalCodes: number;
  usedCodes: number;
  totalEntitlements: number;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Course[]>>("/api/courses")
      .then((r) => setCourses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#2c2c2c", marginBottom: "24px" }}>
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard icon="fas fa-book" label="Khóa học" value={courses.length} color="#1e7ab8" loading={loading} />
        <StatCard icon="fas fa-key" label="Xem mã kích hoạt" value="→" color="#1565c0" href="/admin/access-codes" />
        <StatCard icon="fas fa-user-check" label="Xem phân quyền" value="→" color="#2e7d32" href="/admin/entitlements" />
        <StatCard icon="fas fa-users" label="Xem người dùng" value="→" color="#e65100" href="/admin/users" />
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c", marginBottom: "16px" }}>
          Danh sách khóa học
        </h2>
        {loading ? (
          <p style={{ color: "#888" }}><i className="fas fa-spinner fa-spin" /> Đang tải...</p>
        ) : courses.length === 0 ? (
          <p style={{ color: "#888" }}>Chưa có khóa học nào.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #c5ddf0" }}>
                <Th>ID</Th><Th>Tên khóa học</Th><Th>Danh mục</Th><Th>Giáo viên</Th><Th>Slug</Th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <Td>{c.id}</Td>
                  <Td><span style={{ fontWeight: 600 }}>{c.name}</span></Td>
                  <Td><span style={{ background: "#f0f7fd", color: "#1e7ab8", borderRadius: "6px", padding: "2px 8px", fontSize: "0.75rem", fontWeight: 700 }}>{c.category}</span></Td>
                  <Td>{c.teacher ?? "—"}</Td>
                  <Td><code style={{ fontSize: "0.78rem", color: "#555" }}>{c.slug}</code></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, loading, href }: {
  icon: string; label: string; value: number | string; color: string; loading?: boolean; href?: string;
}) {
  const content = (
    <div style={{
      background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0",
      padding: "20px", display: "flex", flexDirection: "column", gap: "8px",
      cursor: href ? "pointer" : "default", textDecoration: "none",
    }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={icon} style={{ color: "#fff", fontSize: "1rem" }} />
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2c2c2c" }}>
        {loading ? <i className="fas fa-spinner fa-spin" style={{ fontSize: "1rem", color: "#ccc" }} /> : value}
      </div>
      <div style={{ fontSize: "0.82rem", color: "#777" }}>{label}</div>
    </div>
  );
  if (href) {
    return <a href={href} style={{ textDecoration: "none" }}>{content}</a>;
  }
  return content;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.78rem", color: "#777", fontWeight: 600, textTransform: "uppercase" }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "10px 12px", color: "#444" }}>{children}</td>;
}
