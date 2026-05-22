"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedUser } from "@/lib/auth";
import type { User } from "@/types";

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { setUser(getSavedUser<User>()); }, []);

  return (
    <aside
      style={{
        background: "#fff", borderRight: "2px solid #f0d5d5",
        padding: "20px 16px", display: "flex", flexDirection: "column", gap: "8px",
        minHeight: "calc(100vh - 62px)",
      }}
    >
      {/* Profile card */}
      <div
        style={{
          background: "linear-gradient(135deg,#d32f2f,#b71c1c)",
          borderRadius: "14px", padding: "16px", color: "#fff",
          display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px",
        }}
      >
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: "rgba(255,255,255,0.25)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
        }}>
          <i className="fas fa-user-circle" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user?.name ?? "..."}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.85, wordBreak: "break-all" }}>{user?.email ?? ""}</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <SidebarItem href="/courses" icon="fa-graduation-cap" color="#d32f2f" bg="#fdf0f0">Khóa học</SidebarItem>
        <SidebarItem href="/practice" icon="fa-dumbbell" color="#1565c0" bg="#e3f2fd">Phòng luyện</SidebarItem>
        <SidebarItem href="/news" icon="fa-newspaper" color="#2e7d32" bg="#e8f5e9">Tin tức</SidebarItem>
        <SidebarItem href="/schedule" icon="fa-calendar-alt" color="#e65100" bg="#fff3e0">Lịch học</SidebarItem>
      </nav>

      <hr style={{ borderColor: "#f0d5d5", margin: "8px 0" }} />

      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#777", letterSpacing: "0.5px", textTransform: "uppercase", padding: "0 4px" }}>
        Liên kết
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <SocialLink href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook" color="#1877f2" label="Facebook" />
        <SocialLink href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook-messenger" color="#0095f6" label="Messenger" />
        <SocialLink href="https://www.youtube.com/@%C4%90%E1%BB%A9cAnhHo%C3%A0ng-j6v" icon="fab fa-youtube" color="#ff0000" label="Youtube" />
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, color, bg, children }: {
  href: string; icon: string; color: string; bg: string; children: React.ReactNode;
}) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 12px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 500,
      color: "#2c2c2c", transition: "background .15s",
    }}>
      <span style={{
        width: "30px", height: "30px", borderRadius: "8px",
        background: bg, display: "flex", alignItems: "center",
        justifyContent: "center", color, fontSize: "0.9rem",
      }}>
        <i className={`fas ${icon}`} />
      </span>
      {children}
    </Link>
  );
}

function SocialLink({ href, icon, color, label }: {
  href: string; icon: string; color: string; label: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "8px 12px", borderRadius: "10px", fontSize: "0.85rem",
      color: "#2c2c2c", transition: "background .15s",
    }}>
      <i className={icon} style={{ color, width: "16px", textAlign: "center" }} />
      {label}
    </a>
  );
}
