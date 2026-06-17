"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { removeToken } from "@/lib/auth";
import type { ApiResponse, ResetPasswordRequest } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-page)" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "var(--blue)" }} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Token không có trong URL
  if (!token) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-page)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "var(--bg-surface)", borderRadius: "20px",
          boxShadow: "var(--shadow-strong)",
          padding: "44px 48px", width: "440px", textAlign: "center",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "var(--blue-light)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
            fontSize: "1.8rem", color: "var(--blue-dark)",
          }}>
            <i className="fas fa-link-slash" />
          </div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "var(--text)", marginBottom: "12px" }}>
            Link không hợp lệ
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.6 }}>
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <Link
            href="/forgot-password"
            style={{
              display: "inline-block", background: "var(--blue)", color: "#fff",
              borderRadius: "10px", padding: "12px 28px",
              fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
            }}
          >
            Yêu cầu link mới
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const payload: ResetPasswordRequest = { token: token!, newPassword: form.newPassword };
      await api.post<ApiResponse<void>>("/api/auth/reset-password", payload);
      removeToken();
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-page)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "var(--bg-surface)", borderRadius: "20px",
        boxShadow: "var(--shadow-strong)",
        padding: "44px 48px", width: "440px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            className="auth-logo"
            src="/logo-mita-2.png"
            alt="MITA Education"
            style={{ display: "block", width: "320px", maxWidth: "100%", height: "auto", objectFit: "contain", margin: "0 auto" }}
          />
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "6px" }}>
            {success ? "Đặt lại mật khẩu thành công" : "Tạo mật khẩu mới"}
          </p>
        </div>

        {success ? (
          /* ── Màn hình thành công ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "var(--success-soft)", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "2rem", color: "var(--success)",
            }}>
              <i className="fas fa-check-circle" />
            </div>
            <h2 style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "1.2rem", color: "var(--text)", marginBottom: "12px",
            }}>
              Mật khẩu đã được cập nhật!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "28px" }}>
              Mật khẩu của bạn đã được đặt lại thành công.
              Hãy đăng nhập bằng mật khẩu mới.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block", background: "var(--blue)", color: "#fff",
                borderRadius: "10px", padding: "12px 32px",
                fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
              }}
            >
              Đến trang đăng nhập
            </Link>
          </div>
        ) : (
          /* ── Form đặt mật khẩu mới ── */
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              leftIcon={<i className="fas fa-lock" />}
              required
            />
            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              leftIcon={<i className="fas fa-lock" />}
              required
            />

            {error && (
              <div style={{
                background: "var(--blue-light)", border: "1px solid var(--blue)",
                borderRadius: "10px", padding: "10px 14px",
                fontSize: "0.875rem", color: "var(--blue-dark)",
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Đặt lại mật khẩu
            </Button>

            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <Link href="/forgot-password" style={{ color: "var(--blue)", fontWeight: 600 }}>
                Yêu cầu link mới
              </Link>
              {" "}·{" "}
              <Link href="/login" style={{ color: "var(--text-muted)" }}>
                Đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
