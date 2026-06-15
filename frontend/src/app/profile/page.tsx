"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import type { ApiResponse, User, UpdateProfileRequest } from "@/types";
import { getSavedUser, saveUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", school: "", city: "", birthYear: "" });
  const [saving, setSaving] = useState(false);
  const [requestingPasswordChange, setRequestingPasswordChange] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get<ApiResponse<User>>("/api/auth/me");
        const freshUser = res.data.data;
        setUser(freshUser);
        saveUser(freshUser);
        setForm({ name: freshUser.name, school: freshUser.school ?? "", city: freshUser.city ?? "", birthYear: freshUser.birthYear?.toString() ?? "" });
      } catch {
        const saved = getSavedUser<User>();
        if (saved) {
          setUser(saved);
          setForm({ name: saved.name, school: saved.school ?? "", city: saved.city ?? "", birthYear: saved.birthYear?.toString() ?? "" });
        }
      }
    }
    loadUser();
  }, []);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const payload: UpdateProfileRequest = {
        name: form.name,
        school: form.school || undefined,
        city: form.city || undefined,
        birthYear: form.birthYear ? Number(form.birthYear) : undefined,
      };
      const res = await api.put<ApiResponse<User>>(`/api/users/${user.id}`, payload);
      setUser(res.data.data);
      saveUser(res.data.data);
      setToast({ message: "Cập nhật thông tin thành công!", type: "success" });
    } catch {
      setToast({ message: "Cập nhật thất bại, vui lòng thử lại", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function requestPasswordChange() {
    setRequestingPasswordChange(true);
    try {
      await api.post<ApiResponse<void>>("/api/users/me/password-reset-link");
      setToast({
        message: "Đã gửi link đổi mật khẩu đến email của bạn. Link có hiệu lực trong 1 giờ.",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setToast({ message: msg ?? "Không gửi được link đổi mật khẩu, vui lòng thử lại", type: "error" });
    } finally {
      setRequestingPasswordChange(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#1e7ab8", marginBottom: "24px" }}>
            <i className="fas fa-user-circle" style={{ marginRight: "10px" }} />Hồ sơ cá nhân
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>
            {/* Avatar card */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "28px 20px", textAlign: "center" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg,#1e7ab8,#155f8f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", color: "#fff", fontSize: "2rem",
              }}>
                <i className="fas fa-user" />
              </div>
              <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#2c2c2c" }}>{user?.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#777", marginTop: "4px" }}>{user?.email}</div>
              <div style={{ marginTop: "12px" }}>
                <span style={{ background: "#f0f7fd", color: "#1e7ab8", borderRadius: "20px", padding: "4px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
                  {user?.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                </span>
              </div>
              <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "#777" }}>
                Tham gia từ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
              </div>
            </div>

            {/* Edit form */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "28px 32px" }}>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c", marginBottom: "20px" }}>
                Chỉnh sửa thông tin
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Input label="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} leftIcon={<i className="fas fa-user" />} />
                <Input label="Email" value={user?.email ?? ""} disabled leftIcon={<i className="fas fa-envelope" />} />
                <Input label="Trường học" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} leftIcon={<i className="fas fa-school" />} placeholder="Nhập tên trường..." />
                <Input label="Tỉnh/Thành phố" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} leftIcon={<i className="fas fa-map-marker-alt" />} placeholder="Hà Nội, TP.HCM..." />
                <Input label="Năm sinh" type="number" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} leftIcon={<i className="fas fa-birthday-cake" />} placeholder="2006" />
                <Button onClick={save} loading={saving} className="w-fit">
                  <i className="fas fa-save" /> Lưu thay đổi
                </Button>
              </div>

              <div id="security" style={{ borderTop: "1px solid #c5ddf0", marginTop: "28px", paddingTop: "24px" }}>
                <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c", marginBottom: "10px" }}>
                  Bảo mật tài khoản
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6, marginBottom: "16px" }}>
                  Để đổi mật khẩu, MITA Education sẽ gửi một link xác nhận đến email <strong>{user?.email}</strong>. Bạn cần mở link đó để thiết lập mật khẩu mới.
                </p>
                <Button onClick={requestPasswordChange} loading={requestingPasswordChange} variant="secondary" className="w-fit">
                  <i className="fas fa-key" /> Gửi link đổi mật khẩu
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
