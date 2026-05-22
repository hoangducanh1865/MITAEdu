"use client";

import { useState } from "react";

const BOOK_CATEGORIES = [
  { label: "Tất cả", value: "all", icon: "fa-th-large", color: "#d32f2f" },
  { label: "Toán học", value: "math", icon: "fa-square-root-alt", color: "#1565c0" },
  { label: "Vật lý", value: "physics", icon: "fa-atom", color: "#e65100" },
  { label: "Hóa học", value: "chemistry", icon: "fa-flask", color: "#6a1b9a" },
  { label: "Sinh học", value: "biology", icon: "fa-dna", color: "#2e7d32" },
  { label: "Văn học", value: "literature", icon: "fa-book-open", color: "#c62828" },
  { label: "Tiếng Anh", value: "english", icon: "fa-language", color: "#00796b" },
];

const FEATURED_BOOKS = [
  { title: "Toán Tư Duy — Phân tích đề thi TSA 2024", subject: "Toán học", category: "math", publisher: "NXB Đại học Quốc gia", icon: "fa-square-root-alt", color: "#1565c0", bg: "#e3f2fd" },
  { title: "Đọc hiểu & Lập luận — Luyện kỹ năng TSA", subject: "Ngữ văn", category: "literature", publisher: "NXB Giáo dục", icon: "fa-book-open", color: "#c62828", bg: "#fce4ec" },
  { title: "Khoa học tự nhiên tổng hợp — HSA 2025", subject: "Khoa học", category: "physics", publisher: "NXB ĐHQGHN", icon: "fa-atom", color: "#e65100", bg: "#fff3e0" },
  { title: "Grammar & Vocabulary for HUST", subject: "Tiếng Anh", category: "english", publisher: "Oxford University Press", icon: "fa-language", color: "#00796b", bg: "#e0f2f1" },
  { title: "Hóa học đại cương — Ôn thi HSA", subject: "Hóa học", category: "chemistry", publisher: "NXB KHKT", icon: "fa-flask", color: "#6a1b9a", bg: "#f3e5f5" },
  { title: "Sinh học phân tử & tế bào", subject: "Sinh học", category: "biology", publisher: "NXB Đại học Quốc gia", icon: "fa-dna", color: "#2e7d32", bg: "#e8f5e9" },
];

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = FEATURED_BOOKS.filter((b) => {
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.subject.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{
          width: "44px", height: "44px", borderRadius: "12px", background: "#e0f2f1",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#00796b", fontSize: "1.2rem",
        }}>
          <i className="fas fa-search" />
        </span>
        <div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#00796b" }}>
            Tra cứu sách
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "2px" }}>
            Tìm sách tham khảo và tài liệu theo môn học
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div style={{
        background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px", padding: "18px 22px",
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: "10px",
            background: "#fdf0f0", border: "1.5px solid #f0d5d5", borderRadius: "10px",
            padding: "10px 14px",
          }}>
            <i className="fas fa-search" style={{ color: "#d32f2f", fontSize: "0.9rem" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tên sách, môn học..."
              style={{
                border: "none", background: "transparent", outline: "none",
                fontSize: "0.875rem", width: "100%",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
          <button style={{
            background: "#d32f2f", color: "#fff", border: "none", borderRadius: "10px",
            padding: "0 20px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <i className="fas fa-search" /> Tìm
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {BOOK_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "20px", border: "2px solid",
                borderColor: active ? cat.color : "#f0d5d5",
                background: active ? cat.color : "#fff",
                color: active ? "#fff" : cat.color,
                fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <i className={`fas ${cat.icon}`} style={{ fontSize: "0.75rem" }} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Books grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", color: "#777",
          background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5",
        }}>
          <i className="fas fa-search" style={{ fontSize: "2.5rem", marginBottom: "14px", display: "block", opacity: 0.3 }} />
          <p>Không tìm thấy sách phù hợp</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {filtered.map((book, i) => (
            <div key={i} style={{
              background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px",
              padding: "18px 20px", display: "flex", flexDirection: "column", gap: "12px",
              transition: "box-shadow .15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px", background: book.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: book.color, fontSize: "1.4rem",
              }}>
                <i className={`fas ${book.icon}`} />
              </div>
              <div>
                <div style={{
                  fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                  color: "#2c2c2c", lineHeight: 1.4, marginBottom: "6px",
                }}>
                  {book.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: book.color, fontWeight: 600, marginBottom: "3px" }}>
                  {book.subject}
                </div>
                <div style={{ fontSize: "0.73rem", color: "#999" }}>
                  <i className="fas fa-building" style={{ marginRight: "4px" }} />
                  {book.publisher}
                </div>
              </div>
              <div style={{ marginTop: "auto" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "0.78rem", color: book.color, fontWeight: 600,
                }}>
                  Xem chi tiết <i className="fas fa-arrow-right" style={{ fontSize: "0.65rem" }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon notice */}
      <div style={{
        background: "#fff3e0", border: "1.5px solid #ffcc80", borderRadius: "12px",
        padding: "14px 18px", fontSize: "0.82rem", color: "#e65100",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <i className="fas fa-tools" />
        <span>Tính năng liên kết trực tiếp đến nguồn tài liệu đang được phát triển. Danh sách sách hiện tại là gợi ý tham khảo.</span>
      </div>
    </div>
  );
}
