"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function PracticeSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    tsa: false,
    hsa: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleSub = (subId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="prac-sidebar" style={{
      width: "220px", background: "#f8f9fa", borderRight: "1px solid #e0e0e0",
      display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto",
    }}>
      <nav className="prac-nav" style={{ flex: 1 }}>
        {/* Home */}
        <Link href="/practice" className={`pnav-item ${isActive("/practice") && !pathname.includes("/practice/") ? "active" : ""}`} style={{
          padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
          color: isActive("/practice") && !pathname.includes("/practice/") ? "#d32f2f" : "#555",
          fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
          background: isActive("/practice") && !pathname.includes("/practice/") ? "#ffe0e0" : "transparent",
        }}>
          <i className="fas fa-home" style={{ fontSize: "1.1rem" }} />
          <span>Trang chủ</span>
        </Link>

        {/* TSA Accordion */}
        <div className="pnav-group">
          <div
            className="pnav-group-hd"
            onClick={() => toggleGroup("tsa")}
            style={{
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#555",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-file-alt" style={{ fontSize: "1.1rem" }} />
              <span>Đánh giá Tư duy</span>
            </div>
            <i
              className="fas fa-chevron-right"
              style={{
                fontSize: "0.75rem", transition: "transform 0.2s",
                transform: openGroups.tsa ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </div>
          {openGroups.tsa && (
            <div style={{ background: "#fff" }}>
              <Link href="/practice/tsa/luyen-tung-phan" style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 32px",
                fontSize: "0.85rem", color: "#666", textDecoration: "none",
                borderLeft: isActive("/practice/tsa/luyen-tung-phan") ? "3px solid #d32f2f" : "3px solid transparent",
              }}>
                <i className="fas fa-book-open" /> Luyện từng phần
              </Link>

              {/* Luyện đề gộp sub-accordion */}
              <div style={{ borderLeft: "1px solid #e0e0e0" }}>
                <div
                  onClick={() => toggleSub("tsa-de")}
                  style={{
                    padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", fontSize: "0.85rem", color: "#666",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fas fa-file-alt" style={{ fontSize: "0.8rem" }} />
                    <span>Luyện đề gộp</span>
                  </div>
                  <i
                    className="fas fa-chevron-down"
                    style={{
                      fontSize: "0.6rem", transition: "transform 0.2s",
                      transform: openGroups["tsa-de"] ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
                {openGroups["tsa-de"] && (
                  <div style={{ background: "#f8f9fa" }}>
                    <Link href="/practice/tsa/de-tu-tao" style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "8px 48px",
                      fontSize: "0.8rem", color: "#666", textDecoration: "none",
                    }}>
                      <i className="fas fa-user" style={{ fontSize: "0.75rem" }} /> Đề tự tạo
                    </Link>
                    <Link href="/practice/tsa/de-admin" style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "8px 48px",
                      fontSize: "0.8rem", color: "#666", textDecoration: "none",
                    }}>
                      <i className="fas fa-user-shield" style={{ fontSize: "0.75rem" }} /> Đề Admin tạo
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/practice/tsa/khao-thi" style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 32px",
                fontSize: "0.85rem", color: "#666", textDecoration: "none",
              }}>
                <i className="fas fa-clock" /> Khảo thí (Thi thử)
              </Link>
            </div>
          )}
        </div>

        {/* HSA Accordion */}
        <div className="pnav-group">
          <div
            className="pnav-group-hd"
            onClick={() => toggleGroup("hsa")}
            style={{
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#555",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-star" style={{ fontSize: "1.1rem" }} />
              <span>Đánh giá Năng lực</span>
            </div>
            <i
              className="fas fa-chevron-right"
              style={{
                fontSize: "0.75rem", transition: "transform 0.2s",
                transform: openGroups.hsa ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </div>
          {openGroups.hsa && (
            <div style={{ background: "#fff" }}>
              <Link href="/practice/hsa/luyen-tung-phan" style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 32px",
                fontSize: "0.85rem", color: "#666", textDecoration: "none",
              }}>
                <i className="fas fa-book-open" /> Luyện từng phần
              </Link>

              {/* Luyện đề gộp sub-accordion */}
              <div style={{ borderLeft: "1px solid #e0e0e0" }}>
                <div
                  onClick={() => toggleSub("hsa-de")}
                  style={{
                    padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", fontSize: "0.85rem", color: "#666",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fas fa-file-alt" style={{ fontSize: "0.8rem" }} />
                    <span>Luyện đề gộp</span>
                  </div>
                  <i
                    className="fas fa-chevron-down"
                    style={{
                      fontSize: "0.6rem", transition: "transform 0.2s",
                      transform: openGroups["hsa-de"] ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
                {openGroups["hsa-de"] && (
                  <div style={{ background: "#f8f9fa" }}>
                    <Link href="/practice/hsa/de-tu-tao" style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "8px 48px",
                      fontSize: "0.8rem", color: "#666", textDecoration: "none",
                    }}>
                      <i className="fas fa-user" style={{ fontSize: "0.75rem" }} /> Đề tự tạo
                    </Link>
                    <Link href="/practice/hsa/de-admin" style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "8px 48px",
                      fontSize: "0.8rem", color: "#666", textDecoration: "none",
                    }}>
                      <i className="fas fa-user-shield" style={{ fontSize: "0.75rem" }} /> Đề Admin tạo
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/practice/hsa/khao-thi" style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 32px",
                fontSize: "0.85rem", color: "#666", textDecoration: "none",
              }}>
                <i className="fas fa-clock" /> Khảo thí (Thi thử)
              </Link>
            </div>
          )}
        </div>

        {/* Other items */}
        <Link href="/practice/books" style={{
          padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
          color: "#555", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
        }}>
          <i className="fas fa-book" style={{ fontSize: "1.1rem" }} />
          <span>Tra cứu sách</span>
        </Link>

        <Link href="/practice/history" style={{
          padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
          color: "#555", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
        }}>
          <i className="fas fa-history" style={{ fontSize: "1.1rem" }} />
          <span>Lịch sử làm bài</span>
        </Link>

        <Link href="/profile" style={{
          padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
          color: "#555", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
        }}>
          <i className="fas fa-user-circle" style={{ fontSize: "1.1rem" }} />
          <span>Tài khoản</span>
        </Link>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e0e0e0", padding: "16px" }}>
        <Link href="/" style={{
          display: "block", padding: "8px 12px", textAlign: "center",
          background: "#d32f2f", color: "#fff", borderRadius: "8px",
          fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", marginBottom: "8px",
        }}>
          Thoát
        </Link>
        <div style={{ fontSize: "0.7rem", color: "#999", textAlign: "center" }}>
          MoonEdu © 2026<br />Copyright by MoonEdu
        </div>
      </div>
    </aside>
  );
}
