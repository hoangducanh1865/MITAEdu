"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedUser } from "@/lib/auth";
import { useSidebar } from "@/lib/SidebarContext";
import type { User } from "@/types";

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const { sidebarOpen } = useSidebar();

  useEffect(() => { setUser(getSavedUser<User>()); }, []);

  return (
    <aside
      style={{
        background: "#fff",
        borderRight: "2px solid #f0d5d5",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minHeight: "calc(100vh - 62px)",
        width: "240px",
        flexShrink: 0,
        overflow: "hidden",
        /* Animation: trượt sang trái khi ẩn */
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        opacity: sidebarOpen ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, width 0.3s ease, padding 0.3s ease",
        padding: sidebarOpen ? "20px 16px" : "0",
        /* Khi ẩn: thu lại về 0px để không chiếm không gian layout */
        maxWidth: sidebarOpen ? "240px" : "0px",
      }}
    >
      {/* Profile card */}
      <div
        style={{
          background: "linear-gradient(135deg,#d32f2f,#b71c1c)",
          borderRadius: "14px", padding: "16px", color: "#fff",
          display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px",
          minWidth: "208px", /* giữ nội dung không bị vỡ khi co lại */
        }}
      >
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: "rgba(255,255,255,0.25)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
          flexShrink: 0,
        }}>
          <i className="fas fa-user-circle" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap" }}>{user?.name ?? "..."}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.85, wordBreak: "break-all" }}>{user?.email ?? ""}</div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "208px" }}>
        <SidebarItem href="/courses" icon="fa-graduation-cap" color="#d32f2f" bg="#fdf0f0">Khóa học</SidebarItem>
        <SidebarItem href="/practice" icon="fa-dumbbell" color="#1565c0" bg="#e3f2fd">Phòng luyện</SidebarItem>
        <SidebarItem href="/news" icon="fa-newspaper" color="#2e7d32" bg="#e8f5e9">Tin tức</SidebarItem>
        <SidebarItem href="/schedule" icon="fa-calendar-alt" color="#e65100" bg="#fff3e0">Lịch học</SidebarItem>
      </nav>

      <hr style={{ borderColor: "#f0d5d5", margin: "8px 0", minWidth: "208px" }} />

      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#777", letterSpacing: "0.5px", textTransform: "uppercase", padding: "0 4px", minWidth: "208px" }}>
        Liên kết
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "208px" }}>
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
      color: "#2c2c2c", transition: "background .15s", whiteSpace: "nowrap",
    }}>
      <span style={{
        width: "30px", height: "30px", borderRadius: "8px",
        background: bg, display: "flex", alignItems: "center",
        justifyContent: "center", color, fontSize: "0.9rem", flexShrink: 0,
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
      color: "#2c2c2c", transition: "background .15s", whiteSpace: "nowrap",
    }}>
      <i className={icon} style={{ color, width: "16px", textAlign: "center" }} />
      {label}
    </a>
  );
}
