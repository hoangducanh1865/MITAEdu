"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AvatarDropdown from "./AvatarDropdown";

const NAV_ITEMS = [
  { href: "/", icon: "fa-home", title: "Trang chủ" },
  { href: "/courses", icon: "fa-bookmark", title: "Khóa học" },
  { href: "/practice", icon: "fa-flask", title: "Phòng luyện" },
  { href: "/documents", icon: "fa-file-alt", title: "Tài liệu" },
  { href: "/library", icon: "fa-book-open", title: "Thư viện" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Lấy state từ localStorage
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Lưu state và update DOM
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    
    const sidebar = document.querySelector(".sidebar") as HTMLElement | null;
    const mainContent = document.querySelector(".main-content") as HTMLElement | null;
    
    if (sidebar) {
      if (sidebarOpen) {
        sidebar.style.display = "block";
        sidebar.style.opacity = "1";
      } else {
        sidebar.style.display = "none";
        sidebar.style.opacity = "0";
      }
    }
    
    if (mainContent) {
      mainContent.style.flex = sidebarOpen ? "1" : "1";
    }
  }, [sidebarOpen]);

  return (
    <header style={{
      background: "#fff", borderBottom: "1px solid #f0d5d5",
      padding: "0 32px", height: "62px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Left: Logo + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link href="/" style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem",
          color: "#d32f2f", display: "flex", alignItems: "center", gap: "6px",
          textDecoration: "none",
        }}>
          <span style={{ fontSize: "1.5rem" }}>🌙</span>
          MITA<span style={{ color: "#b71c1c" }}>Edu</span>
        </Link>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Ẩn thanh bên" : "Hiện thanh bên"}
          style={{
            background: "none", border: "1px solid #f0d5d5",
            width: "36px", height: "36px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#d32f2f", fontSize: "1rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fdf0f0";
            e.currentTarget.style.borderColor = "#d32f2f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.borderColor = "#f0d5d5";
          }}
        >
          <i className={`fas ${sidebarOpen ? "fa-sidebar" : "fa-bars"}`} />
        </button>
      </div>

      {/* Center: Navigation */}
      <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "36px", height: "36px", borderRadius: "8px",
                background: isActive ? "#fdf0f0" : "transparent",
                color: isActive ? "#d32f2f" : "#777",
                fontSize: "1rem", transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "#fdf0f0";
                  (e.currentTarget as HTMLElement).style.color = "#d32f2f";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#777";
                }
              }}
            >
              <i className={`fas ${item.icon}`} />
            </Link>
          );
        })}
      </nav>

      {/* Right: Avatar */}
      <AvatarDropdown />
    </header>
  );
}