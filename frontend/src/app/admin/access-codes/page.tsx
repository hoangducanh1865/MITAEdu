"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, Course, ActivationCode } from "@/types";

export default function AccessCodesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Course[]>>("/api/courses")
      .then((r) => {
        const list = r.data.data || [];
        setCourses(list);
        if (list.length > 0) setSelectedCourseId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingCodes(true);
    api.get<ApiResponse<ActivationCode[]>>(`/api/admin/access-codes?courseId=${selectedCourseId}`)
      .then((r) => setCodes(r.data.data || []))
      .catch(() => setCodes([]))
      .finally(() => setLoadingCodes(false));
  }, [selectedCourseId]);

  async function handleGenerate() {
    if (!selectedCourseId) return;
    setGenerating(true);
    setError(null);
    setGeneratedCodes(null);
    try {
      const res = await api.post<ApiResponse<string[]>>("/api/admin/access-codes/generate", {
        courseId: selectedCourseId, count,
      });
      setGeneratedCodes(res.data.data);
      // Refresh list
      const updated = await api.get<ApiResponse<ActivationCode[]>>(`/api/admin/access-codes?courseId=${selectedCourseId}`);
      setCodes(updated.data.data || []);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(id: number) {
    if (!confirm("Thu hồi mã này?")) return;
    await api.delete(`/api/admin/access-codes/${id}`);
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, status: "REVOKED" as const } : c));
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#2c2c2c", marginBottom: "24px" }}>
        Mã kích hoạt
      </h1>

      {/* Generate panel */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: "16px" }}>Tạo mã mới</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "#777", fontWeight: 600 }}>Khóa học</label>
            <select
              value={selectedCourseId ?? ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "0.875rem", minWidth: "220px" }}
            >
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "#777", fontWeight: 600 }}>Số lượng</label>
            <input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "0.875rem", width: "80px" }} />
          </div>
          <button onClick={handleGenerate} disabled={generating || !selectedCourseId}
            style={{ padding: "10px 20px", background: "#d32f2f", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
            {generating ? <><i className="fas fa-spinner fa-spin" /> Đang tạo...</> : <><i className="fas fa-plus" /> Tạo mã</>}
          </button>
        </div>
        {error && <p style={{ marginTop: "10px", color: "#d32f2f", fontSize: "0.82rem" }}>{error}</p>}

        {generatedCodes && (
          <div style={{ marginTop: "16px", background: "#f5fff5", border: "1px solid #c8e6c9", borderRadius: "10px", padding: "14px" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2e7d32", marginBottom: "8px" }}>
              <i className="fas fa-check-circle" /> Đã tạo {generatedCodes.length} mã:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {generatedCodes.map((c) => (
                <code key={c} style={{ background: "#fff", border: "1px solid #c8e6c9", borderRadius: "6px", padding: "4px 10px", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1px" }}>{c}</code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Codes table */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: "16px" }}>
          Danh sách mã — {courses.find((c) => c.id === selectedCourseId)?.name ?? ""}
        </h2>
        {loadingCodes ? (
          <p style={{ color: "#888" }}><i className="fas fa-spinner fa-spin" /> Đang tải...</p>
        ) : codes.length === 0 ? (
          <p style={{ color: "#888" }}>Chưa có mã nào cho khóa học này.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0d5d5" }}>
                  <Th>Mã</Th><Th>Trạng thái</Th><Th>Dùng bởi</Th><Th>Ngày dùng</Th><Th>Thao tác</Th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <Td><code style={{ fontWeight: 700, letterSpacing: "1px" }}>{code.code}</code></Td>
                    <Td><StatusBadge status={code.status} /></Td>
                    <Td>{code.usedByEmail ?? "—"}</Td>
                    <Td>{code.usedAt ? new Date(code.usedAt).toLocaleDateString("vi-VN") : "—"}</Td>
                    <Td>
                      {code.status === "UNUSED" && (
                        <button onClick={() => handleRevoke(code.id)}
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    UNUSED: { bg: "#e8f5e9", color: "#2e7d32", label: "Chưa dùng" },
    USED:   { bg: "#e3f2fd", color: "#1565c0", label: "Đã dùng" },
    REVOKED:{ bg: "#fdf0f0", color: "#d32f2f", label: "Thu hồi" },
  };
  const s = map[status] ?? { bg: "#f5f5f5", color: "#777", label: status };
  return <span style={{ background: s.bg, color: s.color, borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>{s.label}</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.78rem", color: "#777", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "10px 12px", color: "#444" }}>{children}</td>;
}
