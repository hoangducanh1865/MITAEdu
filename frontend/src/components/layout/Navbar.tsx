"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AvatarDropdown from "./AvatarDropdown";
import { useSidebar } from "@/lib/SidebarContext";

const NAV_ITEMS = [
  { href: "/", icon: "fa-home", title: "Trang chủ" },
  { href: "/courses", icon: "fa-bookmark", title: "Khóa học" },
  { href: "/practice", icon: "fa-flask", title: "Phòng luyện", hidden: true },
  { href: "/documents", icon: "fa-file-alt", title: "Tài liệu" },
  { href: "/library", icon: "fa-book-open", title: "Thư viện" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  return (
    <header style={{
      background: "#f0f7fd", borderBottom: "1px solid #c5ddf0",
      height: "62px", position: "sticky", top: 0, zIndex: 100,
    }}>
    <div style={{
      maxWidth: "1440px", margin: "0 auto", padding: "0 32px",
      height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Left: Logo + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo-mita-2.png" alt="MITA Edu" style={{ height: "48px", objectFit: "contain" }} />
        </Link>

        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          title={sidebarOpen ? "Ẩn thanh bên" : "Hiện thanh bên"}
          style={{
            background: "none", border: "1px solid #c5ddf0",
            width: "36px", height: "36px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#1e7ab8", fontSize: "1rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f7fd";
            e.currentTarget.style.borderColor = "#1e7ab8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.borderColor = "#c5ddf0";
          }}
        >
          <i className="fas fa-bars" />
        </button>
      </div>

      {/* Center: Navigation */}
      <nav className="navbar-center-nav" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              prefetch={false}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "36px", height: "36px", borderRadius: "8px",
                background: isActive ? "#f0f7fd" : "transparent",
                color: isActive ? "#1e7ab8" : "#777",
                fontSize: "1rem", transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "#f0f7fd";
                  (e.currentTarget as HTMLElement).style.color = "#1e7ab8";
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

      {/* Right: Activation button + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="navbar-activation-btn"
          onClick={() => window.dispatchEvent(new CustomEvent("open-activation-modal"))}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 16px", borderRadius: "8px",
            border: "1.5px solid #1e7ab8", background: "transparent",
            color: "#1e7ab8", cursor: "pointer",
            fontSize: "0.82rem", fontWeight: 700,
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e7ab8";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#1e7ab8";
          }}
        >
          <i className="fas fa-key" style={{ fontSize: "0.75rem" }} />
          Mã kích hoạt
        </button>
        <AvatarDropdown />
      </div>
    </div>
    </header>
  );
}