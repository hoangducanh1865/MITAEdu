"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import type { ApiResponse, ResetPasswordRequest } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", color: "#1e7ab8" }} />
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
        minHeight: "100vh", background: "#f0f7fd",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px",
          boxShadow: "0 4px 40px rgba(30,122,184,.14)",
          padding: "44px 48px", width: "440px", textAlign: "center",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "#e3f2fd", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
            fontSize: "1.8rem", color: "#155f8f",
          }}>
            <i className="fas fa-link-slash" />
          </div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "12px" }}>
            Link không hợp lệ
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#777", marginBottom: "24px", lineHeight: 1.6 }}>
            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </p>
          <Link
            href="/forgot-password"
            style={{
              display: "inline-block", background: "#1e7ab8", color: "#fff",
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
      minHeight: "100vh", background: "#f0f7fd",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        boxShadow: "0 4px 40px rgba(30,122,184,.14)",
        padding: "44px 48px", width: "440px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#1e7ab8" }}>
            🌙 MITA<span style={{ color: "#155f8f" }}>Edu</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "6px" }}>
            {success ? "Đặt lại mật khẩu thành công" : "Tạo mật khẩu mới"}
          </p>
        </div>

        {success ? (
          /* ── Màn hình thành công ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "#e8f5e9", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "2rem", color: "#2e7d32",
            }}>
              <i className="fas fa-check-circle" />
            </div>
            <h2 style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "12px",
            }}>
              Mật khẩu đã được cập nhật!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.65, marginBottom: "28px" }}>
              Mật khẩu của bạn đã được đặt lại thành công.
              Hãy đăng nhập bằng mật khẩu mới.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block", background: "#1e7ab8", color: "#fff",
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
                background: "#e3f2fd", border: "1px solid #2196f3",
                borderRadius: "10px", padding: "10px 14px",
                fontSize: "0.875rem", color: "#1970a8",
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Đặt lại mật khẩu
            </Button>

            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#777", marginTop: "4px" }}>
              <Link href="/forgot-password" style={{ color: "#1e7ab8", fontWeight: 600 }}>
                Yêu cầu link mới
              </Link>
              {" "}·{" "}
              <Link href="/login" style={{ color: "#777" }}>
                Đăng nhập
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
