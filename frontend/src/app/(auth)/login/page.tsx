"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, saveUser } from "@/lib/auth";
import type { ApiResponse, AuthResponse } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "admin@mita.edu.vn", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needVerify, setNeedVerify] = useState(false);   // true khi tài khoản chưa xác minh
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNeedVerify(false);
    setResendDone(false);
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<AuthResponse>>("/api/auth/login", form);
      const { token, ...user } = res.data.data;
      setToken(token);
      saveUser(user);
      router.push("/");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      // 403 = tài khoản chưa xác minh email
      if (status === 403) setNeedVerify(true);
      setError(msg ?? "Đăng nhập thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resending || resendDone) return;
    setResending(true);
    try {
      await api.post("/api/auth/resend-verification", { email: form.email });
      setResendDone(true);
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#fdf0f0",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", boxShadow: "0 4px 40px rgba(211,47,47,.14)",
        padding: "44px 48px", width: "440px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#d32f2f",
          }}>
            🌙 MITA<span style={{ color: "#b71c1c" }}>Edu</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "6px" }}>
            Đăng nhập để tiếp tục học tập
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            leftIcon={<i className="fas fa-envelope" />}
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            leftIcon={<i className="fas fa-lock" />}
            required
          />

          {error && (
            <div style={{
              background: needVerify ? "#fff8e1" : "#ffebee",
              border: `1px solid ${needVerify ? "#ffca28" : "#f44336"}`,
              borderRadius: "10px", padding: "12px 14px", fontSize: "0.875rem",
              color: needVerify ? "#795548" : "#c62828",
            }}>
              <i className={`fas ${needVerify ? "fa-envelope" : "fa-exclamation-circle"}`} style={{ marginRight: "8px" }} />
              {error}
              {needVerify && (
                <div style={{ marginTop: "10px" }}>
                  {resendDone ? (
                    <span style={{ color: "#2e7d32", fontWeight: 600, fontSize: "0.82rem" }}>
                      <i className="fas fa-check" style={{ marginRight: "4px" }} />
                      Đã gửi lại email xác minh — vui lòng kiểm tra hộp thư.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      style={{
                        background: "#f59e0b", color: "#fff", border: "none",
                        borderRadius: "6px", padding: "6px 14px",
                        fontWeight: 700, fontSize: "0.8rem",
                        cursor: resending ? "not-allowed" : "pointer", opacity: resending ? 0.7 : 1,
                      }}
                    >
                      {resending ? "Đang gửi..." : "Gửi lại email xác minh"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
            Đăng nhập
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#777" }}>
          Chưa có tài khoản?{" "}
          <Link href="/register" prefetch={false} style={{ color: "#d32f2f", fontWeight: 600 }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
