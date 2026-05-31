"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { getSavedUser, saveUser } from "@/lib/auth";
import type { ApiResponse, User } from "@/types";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");
  const [status, setStatus]   = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link không hợp lệ — không tìm thấy token.");
      return;
    }

    api.post<ApiResponse<void>>("/api/auth/verify-email", { token })
      .then(() => {
        // Nếu user đã từng lưu (hiếm), cập nhật cờ; bình thường user chưa đăng nhập
        const user = getSavedUser<User>();
        if (user) saveUser({ ...user, emailVerified: true });
        setStatus("success");
      })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? "Xác minh thất bại. Link có thể đã hết hạn hoặc đã được sử dụng.";
        setMessage(msg);
        setStatus("error");
      });
  }, [token]);

  return (
    <div style={{
      minHeight: "100vh", background: "#fdf0f0",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "48px 40px", maxWidth: "460px", width: "100%",
        boxShadow: "0 8px 32px rgba(211,47,47,.12)",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "2.5rem" }}>🌙</span>
          <div style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 900,
            fontSize: "1.3rem", color: "#d32f2f", marginTop: "4px",
          }}>
            MITAEdu
          </div>
        </div>

        {status === "loading" && (
          <>
            <div style={{ color: "#d32f2f", fontSize: "2rem", marginBottom: "16px" }}>
              <i className="fas fa-spinner fa-spin" />
            </div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#2c2c2c", marginBottom: "8px" }}>
              Đang xác minh email...
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#888" }}>Vui lòng chờ trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#e8f5e9", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "1.8rem", color: "#2e7d32",
            }}>
              <i className="fas fa-check" />
            </div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "10px" }}>
              Xác minh thành công!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Email của bạn đã được xác minh. Bây giờ bạn có thể đăng nhập vào MITAEdu.
            </p>
            <Link href="/login" style={{
              display: "inline-block", background: "#d32f2f", color: "#fff",
              borderRadius: "10px", padding: "12px 32px",
              fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
            }}>
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#fff3e0", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "1.8rem", color: "#e65100",
            }}>
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "10px" }}>
              Xác minh thất bại
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              {message}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/" style={{
                display: "inline-block", background: "#fff", color: "#d32f2f",
                border: "1.5px solid #d32f2f", borderRadius: "10px",
                padding: "11px 24px", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none",
              }}>
                Về trang chủ
              </Link>
              <Link href="/login" style={{
                display: "inline-block", background: "#d32f2f", color: "#fff",
                borderRadius: "10px", padding: "12px 24px",
                fontWeight: 700, fontSize: "0.875rem", textDecoration: "none",
              }}>
                Đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#fdf0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#d32f2f" }} />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
