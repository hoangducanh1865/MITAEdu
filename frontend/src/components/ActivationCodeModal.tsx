"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import type { ApiResponse, CourseEntitlement } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (courseName: string) => void;
}

export default function ActivationCodeModal({ open, onClose, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedCode = normalizeActivationCode(code);
  const canSubmit = normalizedCode.length === 14;

  function formatCode(raw: string) {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length < 4 && "MITA".startsWith(clean)) return clean;

    const body = getCodeBody(clean);
    if (body.length === 0) return clean === "MITA" ? "MITA" : "";
    if (body.length <= 4) return clean.startsWith("MITA") ? `MITA-${body}` : body;
    return `MITA-${body.slice(0, 4)}-${body.slice(4)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<CourseEntitlement>>("/api/access-codes/activate", { code: normalizedCode });
      onSuccess(res.data.data.courseName);
      setCode("");
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nhập mã truy cập">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6 }}>
          Nhập mã kích hoạt khóa học của bạn. Mã có dạng <strong>MITA-XXXX-XXXX</strong>.
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(formatCode(e.target.value))}
          placeholder="MITA-XXXX-XXXX"
          maxLength={14}
          autoFocus
          style={{
            width: "100%", padding: "12px 16px",
            border: "2px solid #c5ddf0", borderRadius: "12px",
            fontSize: "1.1rem", fontFamily: "monospace", fontWeight: 700,
            letterSpacing: "2px", textAlign: "center", color: "#2c2c2c",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#1e7ab8"}
          onBlur={(e) => e.target.style.borderColor = "#c5ddf0"}
        />

        {error && (
          <div style={{
            background: "#fff5f5", border: "1px solid #c5ddf0",
            borderRadius: "10px", padding: "10px 14px",
            fontSize: "0.82rem", color: "#1e7ab8",
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: "6px" }} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          style={{
            width: "100%", background: loading || !canSubmit ? "#e0e0e0" : "#1e7ab8",
            color: loading || !canSubmit ? "#999" : "#fff",
            border: "none", borderRadius: "12px",
            padding: "13px", fontFamily: "Nunito, sans-serif",
            fontWeight: 800, fontSize: "0.95rem",
            cursor: loading || !canSubmit ? "not-allowed" : "pointer",
            transition: "background .15s",
          }}
        >
          {loading
            ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }} />Đang kích hoạt...</>
            : <><i className="fas fa-key" style={{ marginRight: "8px" }} />Kích hoạt</>
          }
        </button>
      </form>
    </Modal>
  );
}

function normalizeActivationCode(raw: string) {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = getCodeBody(clean);
  return body.length === 8 ? `MITA-${body.slice(0, 4)}-${body.slice(4)}` : "";
}

function getCodeBody(cleanCode: string) {
  let body = cleanCode;
  while (body.startsWith("MITA")) {
    body = body.slice(4);
  }
  return body.slice(0, 8);
}
