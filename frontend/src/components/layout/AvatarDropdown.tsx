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

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer", padding: "4px",
        }}
      >
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2c2c2c" }}>
          {user?.name ?? "Người dùng"}
        </span>
        <div
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg,#d32f2f,#b71c1c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "0.9rem",
          }}
        >
          <i className="fas fa-user" />
        </div>
        <i className="fas fa-chevron-down" style={{ fontSize: "0.7rem", color: "#777" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,.12)",
            border: "1px solid #f0d5d5", minWidth: "180px", zIndex: 200,
            padding: "8px 0",
          }}
        >
          <Link href="/profile" style={dropItemStyle} onClick={() => setOpen(false)}>
            <i className="fas fa-user-circle" style={{ width: "16px" }} /> Hồ sơ
          </Link>
          <Link href="/practice/history" style={dropItemStyle} onClick={() => setOpen(false)}>
            <i className="fas fa-history" style={{ width: "16px" }} /> Lịch sử làm bài
          </Link>
          <hr style={{ borderColor: "#f0d5d5", margin: "4px 12px" }} />
          <button
            onClick={logout}
            style={{ ...dropItemStyle, width: "100%", textAlign: "left", color: "#d32f2f" }}
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
  padding: "9px 16px", fontSize: "0.875rem", color: "#2c2c2c",
  background: "none", border: "none", cursor: "pointer",
  transition: "background .15s",
};
