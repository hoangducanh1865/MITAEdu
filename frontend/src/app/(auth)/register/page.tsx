"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, saveUser } from "@/lib/auth";
import type { ApiResponse, AuthResponse } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", school: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<AuthResponse>>("/api/auth/register", form);
      const { token, ...user } = res.data.data;
      setToken(token);
      saveUser(user);
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Đăng ký thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 40px rgba(211,47,47,.14)", padding: "44px 48px", width: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#d32f2f" }}>
            🌙 MITA<span style={{ color: "#b71c1c" }}>Edu</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#777", marginTop: "6px" }}>Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => set("name", e.target.value)} leftIcon={<i className="fas fa-user" />} required />
          <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} leftIcon={<i className="fas fa-envelope" />} required />
          <Input label="Mật khẩu" type="password" placeholder="Ít nhất 6 ký tự" value={form.password} onChange={(e) => set("password", e.target.value)} leftIcon={<i className="fas fa-lock" />} required />
          <Input label="Trường học (tuỳ chọn)" placeholder="THPT ABC" value={form.school} onChange={(e) => set("school", e.target.value)} leftIcon={<i className="fas fa-school" />} />
          <Input label="Tỉnh/Thành phố (tuỳ chọn)" placeholder="Hà Nội" value={form.city} onChange={(e) => set("city", e.target.value)} leftIcon={<i className="fas fa-map-marker-alt" />} />

          {error && (
            <div style={{ background: "#ffebee", border: "1px solid #f44336", borderRadius: "10px", padding: "10px 14px", fontSize: "0.875rem", color: "#c62828" }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }} />{error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
            Đăng ký
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "#777" }}>
          Đã có tài khoản?{" "}
          <Link href="/login" style={{ color: "#d32f2f", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
