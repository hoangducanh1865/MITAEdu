"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "tsa", label: "Đánh giá tư duy", badge: "TSA" },
  { value: "hsa", label: "Đánh giá năng lực", badge: "HSA" },
  { value: "thpt", label: "Trung học phổ thông quốc gia", badge: "THPT" },
];

export default function CoursesCategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "tsa";

  return (
    <aside style={{
      width: "200px", background: "#f8f9fa", borderRight: "1px solid #e0e0e0",
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
                borderLeft: isActive ? "4px solid #d32f2f" : "4px solid transparent",
                textDecoration: "none", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "6px",
                background: isActive ? "#e0d5c8" : "#e0e0e0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 900, color: "#666",
              }}>
                {cat.badge}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2c2c2c" }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#999" }}>MoonEdu</div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
