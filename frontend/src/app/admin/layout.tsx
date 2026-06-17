"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt", exact: true },
  { href: "/admin/access-codes", label: "Mã kích hoạt", icon: "fas fa-key" },
  { href: "/admin/users", label: "Người dùng", icon: "fas fa-users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{
        background: "linear-gradient(135deg,#1e7ab8,#155f8f)", color: "#fff",
        padding: "0 28px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <i className="fas fa-shield-alt" style={{ fontSize: "1.2rem" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.1rem" }}>
            MITAEdu Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", textDecoration: "none" }}>
            <i className="fas fa-arrow-left" style={{ marginRight: "6px" }} />Về trang chủ
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar nav */}
        <nav style={{
          width: "220px", flexShrink: 0,
          background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
          padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px",
        }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "11px 14px", borderRadius: "10px", textDecoration: "none",
                background: active ? "var(--bg-muted)" : "transparent",
                color: active ? "var(--blue)" : "var(--text)",
                fontWeight: active ? 700 : 500, fontSize: "0.875rem",
                transition: "all .15s",
              }}>
                <i className={item.icon} style={{ width: "16px", textAlign: "center" }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px", minHeight: "calc(100vh - 60px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
