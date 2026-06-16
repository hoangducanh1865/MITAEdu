"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProvinceSelect from "@/components/ui/ProvinceSelect";
import { DEFAULT_PROVINCE } from "@/lib/provinces";

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Chưa nhập", "Yếu", "Trung bình", "Khá", "Mạnh"];
  const colors = ["#d1d5db", "#e53935", "#f97316", "#f5a623", "#2e7d32"];

  return {
    score,
    label: password ? labels[score] : labels[0],
    color: password ? colors[score] : colors[0],
    strong: checks.every(Boolean),
  };
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    school: "",
    city: DEFAULT_PROVINCE,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const passwordStrength = getPasswordStrength(form.password);

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!passwordStrength.strong) {
      setError("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return;
    }
    setLoading(true);
    try {
      // Đăng ký KHÔNG cấp token — phải xác minh email trước khi đăng nhập
      await api.post<ApiResponse<void>>("/api/auth/register", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        school: form.school.trim() || undefined,
      });
      setRegisteredEmail(form.email);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Đăng ký thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" style={{ minHeight: "100vh", background: "#f0f7fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-card" style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 40px rgba(30,122,184,.14)", padding: "44px 48px", width: "480px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <img
            className="auth-logo"
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
              <Input label="Số điện thoại" type="tel" placeholder="0941.899.726" value={form.phone} onChange={(e) => set("phone", e.target.value)} leftIcon={<i className="fas fa-phone" />} required />
              <div>
                <Input label="Mật khẩu" type="password" placeholder="Ít nhất 8 ký tự" value={form.password} onChange={(e) => set("password", e.target.value)} leftIcon={<i className="fas fa-lock" />} required />
                <div style={{ marginTop: "8px" }}>
                  <div style={{ height: "8px", borderRadius: "999px", background: "#e5eef7", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.max(passwordStrength.score, form.password ? 1 : 0) * 25}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background: passwordStrength.color,
                        transition: "width .2s ease, background .2s ease",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "6px", fontSize: "0.74rem", color: "#777" }}>
                    <span>Mật khẩu: <strong style={{ color: passwordStrength.color }}>{passwordStrength.label}</strong></span>
                    <span style={{ textAlign: "right" }}>8+ ký tự, hoa/thường, số, ký tự đặc biệt</span>
                  </div>
                </div>
              </div>
              <Input label="Trường học (tuỳ chọn)" placeholder="THPT ABC" value={form.school} onChange={(e) => set("school", e.target.value)} leftIcon={<i className="fas fa-school" />} />
              <ProvinceSelect label="Tỉnh/Thành phố" value={form.city} onChange={(province) => set("city", province)} leftIcon={<i className="fas fa-map-marker-alt" />} required />

              {error && (
                <div style={{ background: "#e3f2fd", border: "1px solid #2196f3", borderRadius: "10px", padding: "10px 14px", fontSize: "0.875rem", color: "#1970a8" }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />{error}
                </div>
              )}

              <Button type="submit" loading={loading} disabled={!passwordStrength.strong} size="lg" className="w-full mt-2">
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
