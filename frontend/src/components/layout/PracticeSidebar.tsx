"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavGroup {
  id: string;
  label: string;
  icon: string;
  children: NavChild[];
}
interface NavChild {
  label: string;
  href: string;
  icon: string;
  sub?: { label: string; href: string; icon: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "tsa",
    label: "Đánh giá tư duy",
    icon: "fa-file-alt",
    children: [
      { label: "Luyện từng phần", href: "/practice/tsa/luyen-tung-phan", icon: "fa-book-open" },
      {
        label: "Luyện đề gộp", href: "#", icon: "fa-file-alt",
        sub: [
          { label: "Đề tự tạo", href: "/practice/tsa/de-tu-tao", icon: "fa-user" },
          { label: "Đề Admin tạo", href: "/practice/tsa/de-admin", icon: "fa-user-shield" },
        ],
      },
      { label: "Khảo thí (Thi thử)", href: "/practice/tsa/khao-thi", icon: "fa-clock" },
    ],
  },
  {
    id: "hsa",
    label: "Đánh giá năng lực",
    icon: "fa-star",
    children: [
      { label: "Luyện từng phần", href: "/practice/hsa/luyen-tung-phan", icon: "fa-book-open" },
      {
        label: "Luyện đề gộp", href: "#", icon: "fa-file-alt",
        sub: [
          { label: "Đề tự tạo", href: "/practice/hsa/de-tu-tao", icon: "fa-user" },
          { label: "Đề Admin tạo", href: "/practice/hsa/de-admin", icon: "fa-user-shield" },
        ],
      },
      { label: "Khảo thí (Thi thử)", href: "/practice/hsa/khao-thi", icon: "fa-clock" },
    ],
  },
];

export default function PracticeSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

  function toggleGroup(id: string) {
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));
  }
  function toggleSub(id: string) {
    setOpenSubs((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <aside style={{
      background: "#fff", borderRight: "2px solid #f0d5d5",
      padding: "12px 0", overflowY: "auto",
    }}>
      {/* Home */}
      <NavItem href="/practice" icon="fa-home" active={pathname === "/practice"}>
        Trang chủ
      </NavItem>

      {NAV_GROUPS.map((group) => {
        const isOpen = openGroups[group.id] ?? false;
        return (
          <div key={group.id}>
            <button
              onClick={() => toggleGroup(group.id)}
              style={groupHdStyle}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className={`fas ${group.icon}`} style={{ color: "#d32f2f", width: "16px" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{group.label}</span>
              </span>
              <i
                className="fas fa-chevron-right"
                style={{
                  fontSize: "0.7rem", color: "#777",
                  transform: isOpen ? "rotate(90deg)" : "none",
                  transition: "transform .2s",
                }}
              />
            </button>

            {isOpen && (
              <div style={{ paddingLeft: "12px" }}>
                {group.children.map((child) => {
                  if (child.sub) {
                    const subOpen = openSubs[child.label] ?? false;
                    return (
                      <div key={child.label}>
                        <button onClick={() => toggleSub(child.label)} style={subHdStyle}>
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className={`fas ${child.icon}`} style={{ width: "14px", color: "#777" }} />
                            <span style={{ fontSize: "0.82rem" }}>{child.label}</span>
                          </span>
                          <i
                            className="fas fa-chevron-down"
                            style={{
                              fontSize: "0.65rem", color: "#aaa",
                              transform: subOpen ? "rotate(180deg)" : "none",
                              transition: "transform .2s",
                            }}
                          />
                        </button>
                        {subOpen && (
                          <div style={{ paddingLeft: "12px" }}>
                            {child.sub.map((s) => (
                              <NavItem key={s.href} href={s.href} icon={s.icon} active={pathname === s.href} small>
                                {s.label}
                              </NavItem>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <NavItem key={child.href} href={child.href} icon={child.icon} active={pathname === child.href} small>
                      {child.label}
                    </NavItem>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <hr style={{ borderColor: "#f0d5d5", margin: "8px 12px" }} />
      <NavItem href="/practice/history" icon="fa-history" active={pathname === "/practice/history"}>
        Lịch sử làm bài
      </NavItem>
      <NavItem href="/practice/books" icon="fa-search" active={pathname === "/practice/books"}>
        Tra cứu sách
      </NavItem>
    </aside>
  );
}

function NavItem({ href, icon, active, small, children }: {
  href: string; icon: string; active: boolean; small?: boolean; children: React.ReactNode;
}) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: small ? "7px 16px" : "10px 16px",
      fontSize: small ? "0.82rem" : "0.875rem",
      fontWeight: active ? 600 : 400,
      color: active ? "#d32f2f" : "#2c2c2c",
      background: active ? "#fdf0f0" : "transparent",
      borderRight: active ? "3px solid #d32f2f" : "3px solid transparent",
      transition: "background .15s",
    }}>
      <i className={`fas ${icon}`} style={{ width: "14px", color: active ? "#d32f2f" : "#777", fontSize: "0.85rem" }} />
      {children}
    </Link>
  );
}

const groupHdStyle: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
  transition: "background .15s", textAlign: "left",
};
const subHdStyle: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "8px 16px", background: "none", border: "none", cursor: "pointer",
  transition: "background .15s", textAlign: "left",
};
