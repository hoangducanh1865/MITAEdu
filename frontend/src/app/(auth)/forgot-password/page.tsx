"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post<ApiResponse<void>>("/api/auth/forgot-password", { email });
      setSubmitted(true);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" style={{
      minHeight: "100vh", background: "#f0f7fd",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div className="auth-card" style={{
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 4px 40px rgba(30,122,184,.14)",
        padding: "44px 48px", width: "440px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <img
            className="auth-logo"
            src="/logo-mita-2.png"
            alt="MITA Education"
            style={{ display: "block", width: "320px", maxWidth: "100%", height: "auto", objectFit: "contain" }}
          />
          <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "6px" }}>
            {submitted ? "Kiểm tra email của bạn" : "Quên mật khẩu"}
          </p>
        </div>

        {submitted ? (
          /* ── Màn hình xác nhận đã gửi email ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "#e8f5e9", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "2rem", color: "#2e7d32",
            }}>
              <i className="fas fa-envelope-open-text" />
            </div>
            <h2 style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "12px",
            }}>
              Email đã được gửi!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.65, marginBottom: "8px" }}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến<br />
              <strong style={{ color: "#1e7ab8" }}>{email}</strong>
            </p>
            <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6, marginBottom: "28px" }}>
              Vui lòng kiểm tra hộp thư và nhấn vào link trong email.
              Link có hiệu lực trong <strong>1 giờ</strong>.
              (Kiểm tra cả thư mục Spam nếu không thấy.)
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block", background: "#1e7ab8", color: "#fff",
                borderRadius: "10px", padding: "12px 32px",
                fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
              }}
            >
              Về trang đăng nhập
            </Link>
          </div>
        ) : (
          /* ── Form nhập email ── */
          <>
            <p style={{ fontSize: "0.875rem", color: "#555", marginBottom: "24px", lineHeight: 1.6 }}>
              Nhập địa chỉ email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<i className="fas fa-envelope" />}
                required
              />

              {error && (
                <div style={{
                  background: "#e3f2fd", border: "1px solid #2196f3",
                  borderRadius: "10px", padding: "10px 14px",
                  fontSize: "0.875rem", color: "#1970a8",
                }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
                Gửi link đặt lại mật khẩu
              </Button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#777" }}>
              Nhớ mật khẩu rồi?{" "}
              <Link href="/login" style={{ color: "#1e7ab8", fontWeight: 600 }}>
                Đăng nhập
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
