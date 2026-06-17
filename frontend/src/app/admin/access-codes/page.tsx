"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import type { ActivationCode, ApiResponse, Course } from "@/types";

type CourseSelection = "all" | number;

export default function AccessCodesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseSelection>("all");
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [count, setCount] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<ActivationCode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCourseIds = useMemo(() => {
    if (selectedCourse === "all") return courses.map((course) => course.id);
    return [selectedCourse];
  }, [courses, selectedCourse]);

  useEffect(() => {
    api.get<ApiResponse<Course[]>>("/api/courses")
      .then((r) => {
        const list = r.data.data || [];
        setCourses(list);
        if (list.length === 1) setSelectedCourse(list[0].id);
      })
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    setLoadingCodes(true);
    const url = selectedCourse === "all"
      ? "/api/admin/access-codes"
      : `/api/admin/access-codes?courseId=${selectedCourse}`;
    api.get<ApiResponse<ActivationCode[]>>(url)
      .then((r) => setCodes(r.data.data || []))
      .catch(() => setCodes([]))
      .finally(() => setLoadingCodes(false));
  }, [selectedCourse]);

  async function handleGenerate() {
    if (selectedCourseIds.length === 0) {
      setError("Chưa có khóa học nào để tạo mã");
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedCodes(null);
    try {
      const payload: Record<string, unknown> = {
        courseIds: selectedCourseIds,
        count,
      };
      if (expiresAt) payload.expiresAt = expiresAt;

      const res = await api.post<ApiResponse<ActivationCode[]>>("/api/admin/access-codes/generate", payload);
      const created = res.data.data || [];
      setGeneratedCodes(created);
      downloadCsv(created, buildFileName(created));

      const url = selectedCourse === "all"
        ? "/api/admin/access-codes"
        : `/api/admin/access-codes?courseId=${selectedCourse}`;
      const updated = await api.get<ApiResponse<ActivationCode[]>>(url);
      setCodes(updated.data.data || []);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setGenerating(false);
    }
  }

  const totalWillCreate = selectedCourseIds.length * count;

  return (
    <div>
      <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "var(--text)", marginBottom: "24px" }}>
        Mã kích hoạt
      </h1>

      <div style={{ background: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border)", padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", margin: 0 }}>Tạo mã mới</h2>
          {generatedCodes && (
            <button
              onClick={() => downloadCsv(generatedCodes, buildFileName(generatedCodes))}
              style={{ padding: "8px 14px", background: "var(--bg-muted)", color: "var(--blue)", border: "1px solid var(--border)", borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
            >
              <i className="fas fa-download" style={{ marginRight: "6px" }} />
              Tải lại CSV vừa tạo
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>Khóa học</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value === "all" ? "all" : Number(e.target.value))}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: "0.875rem", minWidth: "280px" }}
            >
              <option value="all">Tất cả khóa hiện có</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {selectedCourse === "all" ? "Số lượng mỗi khóa" : "Số lượng"}
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: "0.875rem", width: "130px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Hạn kích hoạt <span style={{ color: "var(--text-soft)", fontWeight: 400 }}>(trống = không giới hạn)</span>
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: "0.875rem" }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || selectedCourseIds.length === 0}
            style={{ padding: "10px 20px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.875rem", cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.75 : 1 }}
          >
            {generating ? <><i className="fas fa-spinner fa-spin" /> Đang tạo...</> : <><i className="fas fa-plus" /> Tạo và tải CSV</>}
          </button>
        </div>

        <p style={{ margin: "12px 0 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Sẽ tạo <strong>{totalWillCreate}</strong> mã. Mỗi mã chỉ mở một khóa tương ứng, hết hiệu lực khi quá hạn hoặc ngay sau khi học sinh dùng.
        </p>

        {error && <p style={{ marginTop: "10px", color: "#c62828", fontSize: "0.82rem" }}>{error}</p>}

        {generatedCodes && (
          <div style={{ marginTop: "16px", background: "var(--success-soft)", border: "1px solid var(--success)", borderRadius: "10px", padding: "14px" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--success)", marginBottom: "8px" }}>
              <i className="fas fa-check-circle" /> Đã tạo {generatedCodes.length} mã và tải file CSV.
            </p>
            <div style={{ maxHeight: "160px", overflow: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px" }}>
              {generatedCodes.map((item) => (
                <code key={item.code} style={{ background: "var(--bg-surface)", border: "1px solid var(--success)", borderRadius: "6px", padding: "6px 10px", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.5px" }}>
                  {item.code}
                  <span style={{ display: "block", color: "var(--text-muted)", fontWeight: 500, letterSpacing: 0, marginTop: "2px" }}>{item.courseName}</span>
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ background: "var(--bg-surface)", borderRadius: "14px", border: "1px solid var(--border)", padding: "20px 24px" }}>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: "16px" }}>
          Danh sách mã — {selectedCourse === "all" ? "Tất cả khóa" : courses.find((course) => course.id === selectedCourse)?.name ?? ""}
        </h2>
        {loadingCodes ? (
          <p style={{ color: "var(--text-soft)" }}><i className="fas fa-spinner fa-spin" /> Đang tải...</p>
        ) : codes.length === 0 ? (
          <p style={{ color: "var(--text-soft)" }}>Chưa có mã nào.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <Th>Mã</Th>
                  <Th>Khóa học</Th>
                  <Th>Trạng thái</Th>
                  <Th>Hạn kích hoạt</Th>
                  <Th>Dùng bởi</Th>
                  <Th>Ngày dùng</Th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <Td><code style={{ fontWeight: 700, letterSpacing: "1px" }}>{code.code}</code></Td>
                    <Td>{code.courseName}</Td>
                    <Td><StatusBadge status={code.status} expiresAt={code.expiresAt} /></Td>
                    <Td style={{ color: code.expiresAt ? "var(--text-muted)" : "var(--text-soft)" }}>
                      {code.expiresAt
                        ? new Date(code.expiresAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })
                        : "Không giới hạn"}
                    </Td>
                    <Td>{code.usedByEmail ?? "-"}</Td>
                    <Td>{code.usedAt ? new Date(code.usedAt).toLocaleDateString("vi-VN") : "-"}</Td>
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

function StatusBadge({ status, expiresAt }: { status: string; expiresAt?: string }) {
  const isExpired = status === "UNUSED" && expiresAt && new Date(expiresAt) < new Date();

  if (isExpired) {
    return <span style={{ background: "#fff3e0", color: "#e65100", borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>Hết hạn</span>;
  }

  const map: Record<string, { bg: string; color: string; label: string }> = {
    UNUSED: { bg: "#e8f5e9", color: "#2e7d32", label: "Chưa dùng" },
    USED: { bg: "#e3f2fd", color: "#1565c0", label: "Đã dùng" },
    REVOKED: { bg: "#f0f7fd", color: "#1e7ab8", label: "Thu hồi" },
  };
  const s = map[status] ?? { bg: "#f5f5f5", color: "#777", label: status };
  return <span style={{ background: s.bg, color: s.color, borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>{s.label}</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</th>;
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "10px 12px", color: "var(--text)", ...style }}>{children}</td>;
}

function buildFileName(codes: ActivationCode[]) {
  const courseLabel = codes.length === 0
    ? "activation-codes"
    : codes.every((code) => code.courseId === codes[0].courseId)
      ? slugify(codes[0].courseName)
      : "all-courses";
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `mita-${courseLabel}-activation-codes-${timestamp}.csv`;
}

function downloadCsv(codes: ActivationCode[], fileName: string) {
  const csv = toCsv(codes);
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsv(codes: ActivationCode[]) {
  const header = ["code", "course_id", "course_name", "status", "expires_at", "created_at"];
  const rows = codes.map((code) => [
    code.code,
    String(code.courseId),
    code.courseName,
    code.status,
    code.expiresAt ?? "",
    code.createdAt ?? "",
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "course";
}
