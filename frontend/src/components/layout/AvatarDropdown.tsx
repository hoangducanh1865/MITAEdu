"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSavedUser, removeToken } from "@/lib/auth";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

export default function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const showExamHistory = false;

  useEffect(() => {
    setUser(getSavedUser<User>());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function logout() {
    removeToken();
    router.push("/login");
  }

  if (!user) {
    return (
      <div className="public-auth-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link
          className="public-auth-link public-auth-link-login"
          href="/login"
          style={{
            fontSize: "0.875rem", fontWeight: 600, color: "var(--blue)",
            padding: "6px 14px", borderRadius: "8px", border: "1.5px solid var(--blue)",
            textDecoration: "none", transition: "background .15s",
          }}
        >
          Đăng nhập
        </Link>
        <Link
          className="public-auth-link public-auth-link-register"
          href="/register"
          style={{
            fontSize: "0.875rem", fontWeight: 600, color: "#fff",
            padding: "6px 14px", borderRadius: "8px",
            background: "linear-gradient(135deg,#1e7ab8,#155f8f)",
            textDecoration: "none", transition: "opacity .15s",
          }}
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="avatar-dropdown-root" style={{ position: "relative" }}>
      <button
        className="avatar-dropdown-button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer", padding: "4px",
        }}
      >
        <span className="avatar-dropdown-name" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>
          {user.name ?? "Người dùng"}
        </span>
        <div
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg,#1e7ab8,#155f8f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "0.9rem",
          }}
        >
          <i className="fas fa-user" />
        </div>
        <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            background: "var(--bg-surface)", borderRadius: "12px", boxShadow: "var(--shadow-strong)",
            border: "1px solid var(--border)", minWidth: "180px", zIndex: 200,
            padding: "8px 0",
          }}
        >
          <Link href="/profile" style={dropItemStyle} onClick={() => setOpen(false)}>
            <i className="fas fa-user-circle" style={{ width: "16px" }} /> Hồ sơ
          </Link>
          <Link href="/profile#security" style={dropItemStyle} onClick={() => setOpen(false)}>
            <i className="fas fa-key" style={{ width: "16px" }} /> Đổi mật khẩu
          </Link>
          {showExamHistory && (
            <Link href="/practice/history" style={dropItemStyle} onClick={() => setOpen(false)}>
              <i className="fas fa-history" style={{ width: "16px" }} /> Lịch sử làm bài
            </Link>
          )}
          <hr style={{ borderColor: "var(--border)", margin: "4px 12px" }} />
          <button
            onClick={logout}
            style={{ ...dropItemStyle, width: "100%", textAlign: "left", color: "var(--blue)" }}
          >
            <i className="fas fa-sign-out-alt" style={{ width: "16px" }} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

const dropItemStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "9px 16px", fontSize: "0.875rem", color: "var(--text)",
  background: "none", border: "none", cursor: "pointer",
  transition: "background .15s",
};
