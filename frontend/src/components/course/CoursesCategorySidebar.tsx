"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "tsa", label: "Khóa Trại hè Đánh thức tư duy ĐGNL", badge: "TSA" },
  { value: "hsa", label: "Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)", badge: "HSA" },
  { value: "thpt", label: "Khóa Luyện Đề - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)", badge: "THPT" },
];

export default function CoursesCategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "tsa";

  return (
    <aside style={{
      width: "260px", background: "#f8f9fa", borderRight: "1px solid #e0e0e0",
      padding: "20px 16px", minHeight: "100vh",
    }}>
      <div style={{ fontSize: "0.8rem", fontWeight: 900, color: "#555", marginBottom: "16px", letterSpacing: "0.5px" }}>
        DANH MỤC
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <Link
              key={cat.value}
              href={`/courses?category=${cat.value.toUpperCase()}`}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "10px",
                background: isActive ? "#fff3e0" : "transparent",
                borderLeft: isActive ? "4px solid #1e7ab8" : "4px solid transparent",
                textDecoration: "none", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "6px",
                background: isActive ? "#dbeeff" : "#e8f4fd",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <img src="/logo-mita.png" alt="MITA" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2c2c2c", lineHeight: 1.35 }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#999" }}>MITAEdu</div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
