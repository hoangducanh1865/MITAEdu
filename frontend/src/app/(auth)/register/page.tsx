"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", school: "", city: "TP. HCM" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Đăng ký KHÔNG cấp token — phải xác minh email trước khi đăng nhập
      await api.post<ApiResponse<void>>("/api/auth/register", form);
      setRegisteredEmail(form.email);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Đăng ký thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 40px rgba(30,122,184,.14)", padding: "44px 48px", width: "480px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <img
            src="/logo-mita-2.png"
            alt="MITA Education"
            style={{ display: "block", width: "320px", maxWidth: "100%", height: "auto", objectFit: "contain" }}
          />
          <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "6px" }}>
            {registeredEmail ? "Kiểm tra email của bạn" : "Tạo tài khoản mới"}
          </p>
        </div>

        {registeredEmail ? (
          /* ── Màn hình sau khi đăng ký: yêu cầu xác minh email ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "#e8f5e9", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px",
              fontSize: "2rem", color: "#2e7d32",
            }}>
              <i className="fas fa-envelope-open-text" />
            </div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#2c2c2c", marginBottom: "12px" }}>
              Đăng ký thành công!
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.65, marginBottom: "8px" }}>
              Chúng tôi đã gửi email xác minh đến<br />
              <strong style={{ color: "#1e7ab8" }}>{registeredEmail}</strong>
            </p>
            <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6, marginBottom: "28px" }}>
              Vui lòng nhấn vào link trong email để kích hoạt tài khoản.
              Bạn cần xác minh email <strong>trước khi đăng nhập</strong>.
              (Kiểm tra cả thư mục Spam nếu không thấy.)
            </p>
            <Link href="/login" style={{
              display: "inline-block", background: "#1e7ab8", color: "#fff",
              borderRadius: "10px", padding: "12px 32px",
              fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
            }}>
              Đến trang đăng nhập
            </Link>
          </div>
        ) : (
          /* ── Form đăng ký ── */
          <>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => set("name", e.target.value)} leftIcon={<i className="fas fa-user" />} required />
              <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} leftIcon={<i className="fas fa-envelope" />} required />
              <Input label="Mật khẩu" type="password" placeholder="Ít nhất 6 ký tự" value={form.password} onChange={(e) => set("password", e.target.value)} leftIcon={<i className="fas fa-lock" />} required />
              <Input label="Trường học (tuỳ chọn)" placeholder="THPT ABC" value={form.school} onChange={(e) => set("school", e.target.value)} leftIcon={<i className="fas fa-school" />} />
              <Input label="Tỉnh/Thành phố (tuỳ chọn)" placeholder="TP. HCM" value={form.city} onChange={(e) => set("city", e.target.value)} leftIcon={<i className="fas fa-map-marker-alt" />} />

              {error && (
                <div style={{ background: "#e3f2fd", border: "1px solid #2196f3", borderRadius: "10px", padding: "10px 14px", fontSize: "0.875rem", color: "#1970a8" }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />{error}
                </div>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
                Đăng ký
              </Button>
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#777" }}>
              Đã có tài khoản?{" "}
              <Link href="/login" prefetch={false} style={{ color: "#1e7ab8", fontWeight: 600 }}>Đăng nhập</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
