"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, Course, CourseEntitlement } from "@/types";

export default function EntitlementsPage() {
  const [entitlements, setEntitlements] = useState<CourseEntitlement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [grantUserId, setGrantUserId] = useState("");
  const [grantCourseId, setGrantCourseId] = useState<number | "">("");
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function fetchAll() {
    setLoading(true);
    Promise.all([
      api.get<ApiResponse<CourseEntitlement[]>>("/api/admin/entitlements"),
      api.get<ApiResponse<Course[]>>("/api/courses"),
    ]).then(([eRes, cRes]) => {
      setEntitlements(eRes.data.data || []);
      const list = cRes.data.data || [];
      setCourses(list);
      if (list.length > 0 && !grantCourseId) setGrantCourseId(list[0].id);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!grantUserId.trim() || !grantCourseId) return;
    setGranting(true);
    try {
      await api.post("/api/admin/entitlements", { userId: Number(grantUserId), courseId: grantCourseId });
      setSuccess("Đã cấp quyền thành công!");
      setGrantUserId("");
      fetchAll();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setGranting(false);
    }
  }

  async function handleRevoke(id: number) {
    if (!confirm("Thu hồi quyền truy cập này?")) return;
    await api.delete(`/api/admin/entitlements/${id}`);
    setEntitlements((prev) => prev.map((e) => e.id === id ? { ...e, status: "REVOKED" as const } : e));
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#2c2c2c", marginBottom: "24px" }}>
        Phân quyền truy cập
      </h1>

      {/* Grant panel */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: "16px" }}>Cấp quyền trực tiếp</h2>
        <form onSubmit={handleGrant} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "#777", fontWeight: 600 }}>User ID</label>
            <input type="number" value={grantUserId} onChange={(e) => setGrantUserId(e.target.value)} placeholder="Nhập User ID"
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "0.875rem", width: "120px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "#777", fontWeight: 600 }}>Khóa học</label>
            <select value={grantCourseId} onChange={(e) => setGrantCourseId(Number(e.target.value))}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "0.875rem", minWidth: "220px" }}>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={granting}
            style={{ padding: "10px 20px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
            {granting ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-user-plus" /> Cấp quyền</>}
          </button>
        </form>
        {error && <p style={{ marginTop: "10px", color: "#d32f2f", fontSize: "0.82rem" }}>{error}</p>}
        {success && <p style={{ marginTop: "10px", color: "#2e7d32", fontSize: "0.82rem" }}><i className="fas fa-check-circle" /> {success}</p>}
      </div>

      {/* Entitlements table */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: "16px" }}>
          Danh sách quyền truy cập ({entitlements.length})
        </h2>
        {loading ? (
          <p style={{ color: "#888" }}><i className="fas fa-spinner fa-spin" /> Đang tải...</p>
        ) : entitlements.length === 0 ? (
          <p style={{ color: "#888" }}>Chưa có quyền truy cập nào.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0d5d5" }}>
                  <Th>User</Th><Th>Khóa học</Th><Th>Nguồn</Th><Th>Trạng thái</Th><Th>Từ ngày</Th><Th>Thao tác</Th>
                </tr>
              </thead>
              <tbody>
                {entitlements.map((e) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <Td>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{e.userEmail}</div>
                      <div style={{ fontSize: "0.72rem", color: "#aaa" }}>ID: {e.userId}</div>
                    </Td>
                    <Td>{e.courseName}</Td>
                    <Td>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: e.source === "ADMIN_GRANT" ? "#e65100" : "#1565c0" }}>
                        {e.source === "ADMIN_GRANT" ? "Admin" : "Mã kích hoạt"}
                      </span>
                    </Td>
                    <Td>
                      <span style={{
                        background: e.status === "ACTIVE" ? "#e8f5e9" : "#fdf0f0",
                        color: e.status === "ACTIVE" ? "#2e7d32" : "#d32f2f",
                        borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700,
                      }}>
                        {e.status === "ACTIVE" ? "Đang hoạt động" : "Đã thu hồi"}
                      </span>
                    </Td>
                    <Td>{new Date(e.startsAt).toLocaleDateString("vi-VN")}</Td>
                    <Td>
                      {e.status === "ACTIVE" && (
                        <button onClick={() => handleRevoke(e.id)}
                          style={{ padding: "4px 12px", background: "#fdf0f0", color: "#d32f2f", border: "1px solid #f0d5d5", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}>
                          Thu hồi
                        </button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.78rem", color: "#777", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "10px 12px", color: "#444" }}>{children}</td>;
}
