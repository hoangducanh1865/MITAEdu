"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [search, setSearch] = useState("");

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        borderBottom: "2px solid #f0d5d5",
        padding: "0 28px",
        height: "62px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: "12px",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1 }}>
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem",
            color: "#d32f2f",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>🌙</span>
          <span>MITA<span style={{ color: "#b71c1c" }}>Edu</span></span>
        </Link>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "#fdf0f0", border: "1.5px solid #f0d5d5",
            borderRadius: "10px", padding: "8px 14px", width: "260px",
          }}
        >
          <i className="fas fa-search" style={{ color: "#d32f2f", fontSize: "0.85rem" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm khóa học, bài tập..."
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: "0.875rem", width: "100%",
            }}
          />
        </div>
      </div>

      {/* Center nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {NAV_ITEMS.map(({ href, icon, title }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={title}
              style={{
                width: "38px", height: "38px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: active ? "#d32f2f" : "#777",
                background: active ? "#fdf0f0" : "transparent",
                fontSize: "1.1rem", transition: "all .18s",
              }}
            >
              <i className={`fas ${icon}`} />
            </Link>
          );
        })}
      </nav>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <AvatarDropdown />
        <Link
          href="#"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(135deg,#d32f2f,#b71c1c)",
            color: "#fff", borderRadius: "20px", padding: "7px 16px",
            fontSize: "0.8rem", fontWeight: 600,
          }}
        >
          <i className="fas fa-key" /> Mã truy cập
        </Link>
      </div>
    </header>
  );
}
