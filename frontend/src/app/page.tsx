"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Course } from "@/types";

// ── Carousel slides ──────────────────────────────────────────────
const SLIDES = [
  {
    title: "Ngân Hàng\nCâu Hỏi",
    sub: "Phong phú đa dạng",
    badge: "Kì Thi Đánh Giá Tư Duy 2026",
    tags: ["Tư Duy Toán Học", "Tư Duy Khoa Học", "Tư Duy Đọc Hiểu"],
    bg: "linear-gradient(135deg,#d32f2f 0%,#b71c1c 100%)",
  },
  {
    title: "Luyện Thi\nChuyên Sâu",
    sub: "Đạt điểm cao trong kì thi",
    badge: "Chương Trình Mới 2026",
    tags: ["Toán", "Vật Lý", "Hóa Học"],
    bg: "linear-gradient(135deg,#c62828 0%,#ad1457 100%)",
  },
  {
    title: "Thi Thử\nOnline",
    sub: "Miễn phí — Mọi lúc mọi nơi",
    badge: "Xếp Hạng Toàn Quốc",
    tags: ["Đề Mô Phỏng", "Đề Chính Thức"],
    bg: "linear-gradient(135deg,#b71c1c 0%,#880e4f 100%)",
  },
];

// ── Champions ────────────────────────────────────────────────────
const CHAMPIONS = [
  { name: "Tùng Lâm",   exam: "Kỳ thi đánh giá tư duy 2026", score: "89.24" },
  { name: "Đức Trọng",  exam: "Kỳ thi đánh giá tư duy 2026", score: "88.69" },
  { name: "Minh Dương", exam: "Kỳ thi đánh giá tư duy 2026", score: "83.44" },
  { name: "Hải Nam",    exam: "Kỳ thi đánh giá tư duy 2026", score: "82.90" },
  { name: "Thùy Linh",  exam: "Kỳ thi đánh giá tư duy 2026", score: "81.55" },
  { name: "Quốc Bảo",   exam: "Kỳ thi đánh giá tư duy 2026", score: "80.78" },
];

const SEARCH_TAGS = [
  "Labteam","Khóa học","Mentor","TSA","HSA",
  "Cách đăng kí khóa học","Cách ôn thi",
  "Cách đỗ hust từ năm lớp 11","Cách thủ khoa",
];

const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#f5a623,#e65100)",
  "linear-gradient(135deg,#7b1fa2,#4a148c)",
  "linear-gradient(135deg,#d32f2f,#b71c1c)",
  "linear-gradient(135deg,#1565c0,#0d47a1)",
  "linear-gradient(135deg,#2e7d32,#1b5e20)",
];

export default function DashboardPage() {
  const [slide, setSlide] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseIdx, setCourseIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Fetch latest courses
  useEffect(() => {
    api.get<ApiResponse<Course[]>>("/api/courses")
      .then((r) => setCourses(r.data.data?.slice(0, 8) || []))
      .catch(() => {});
  }, []);

  const VISIBLE = 3;
  const maxIdx = Math.max(0, courses.length - VISIBLE);

  function scrollCourses(dir: 1 | -1) {
    setCourseIdx((i) => Math.max(0, Math.min(maxIdx, i + dir)));
  }

  const s = SLIDES[slide];

  return (
    <>
      <Navbar />
      <div className="layout-home">
        <Sidebar />
        <main style={{ background: "#fff", minHeight: "calc(100vh - 62px)", display: "flex", flexDirection: "column", gap: 0 }}>

          {/* ── HERO CAROUSEL ─────────────────────────────── */}
          <section style={{ padding: "20px 28px 0" }}>
            <div style={{
              background: s.bg,
              borderRadius: "20px",
              padding: "40px 48px",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
              minHeight: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "background .6s ease",
            }}>
              {/* Left content */}
              <div style={{ flex: 1, zIndex: 2 }}>
                <h2 style={{
                  fontFamily: "Nunito, sans-serif", fontWeight: 900,
                  fontSize: "2.4rem", lineHeight: 1.15,
                  marginBottom: "10px", whiteSpace: "pre-line",
                }}>
                  {s.title}
                </h2>
                <p style={{ fontStyle: "italic", opacity: 0.9, marginBottom: "16px", fontSize: "1rem" }}>
                  {s.sub}
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.18)", borderRadius: "20px",
                  padding: "6px 14px", fontSize: "0.82rem", fontWeight: 600,
                  marginBottom: "16px",
                }}>
                  <i className="fas fa-bullseye" style={{ fontSize: "0.75rem" }} />
                  {s.badge}
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {s.tags.map((tag) => (
                    <button key={tag} style={{
                      background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                      color: "#fff", borderRadius: "20px",
                      padding: "6px 16px", fontSize: "0.82rem", fontWeight: 600,
                      cursor: "pointer",
                    }}>{tag}</button>
                  ))}
                </div>
              </div>

              {/* Right visual */}
              <div style={{ flexShrink: 0, zIndex: 2, marginLeft: "32px" }}>
                <div style={{ position: "relative", width: "160px", height: "120px" }}>
                  {[0,1,2].map((i) => (
                    <div key={i} style={{
                      position: "absolute",
                      width: "100px", height: "80px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.18)",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      top: `${i * 14}px`,
                      left: `${i * 18}px`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backdropFilter: "blur(4px)",
                    }}>
                      {i === 2 && <i className="fas fa-image" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.5rem" }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev/Next */}
              {["prev","next"].map((dir) => (
                <button key={dir} onClick={() => setSlide((s) => dir === "prev" ? (s - 1 + SLIDES.length) % SLIDES.length : (s + 1) % SLIDES.length)} style={{
                  position: "absolute", top: "50%", transform: "translateY(-50%)",
                  [dir === "prev" ? "left" : "right"]: "16px",
                  background: "rgba(255,255,255,0.22)", border: "none",
                  borderRadius: "50%", width: "36px", height: "36px",
                  color: "#fff", cursor: "pointer", zIndex: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`fas fa-chevron-${dir === "prev" ? "left" : "right"}`} style={{ fontSize: "0.85rem" }} />
                </button>
              ))}

              {/* Dots */}
              <div style={{
                position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "8px", zIndex: 3,
              }}>
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} style={{
                    width: i === slide ? "28px" : "10px", height: "10px",
                    borderRadius: "5px", border: "none",
                    background: i === slide ? "#fff" : "rgba(255,255,255,0.45)",
                    cursor: "pointer", transition: "width .3s, background .3s", padding: 0,
                  }} />
                ))}
              </div>
            </div>
          </section>

          {/* ── VINH DANH BANNER ──────────────────────────── */}
          <section style={{ padding: "16px 28px 0" }}>
            <div style={{
              background: "#d32f2f", borderRadius: "12px",
              padding: "14px 24px", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "14px", fontFamily: "Nunito, sans-serif",
              fontWeight: 900, fontSize: "1.05rem", letterSpacing: "1px",
              cursor: "pointer",
            }}>
              <i className="fas fa-award" />
              VINH DANH THỦ KHOA &amp; Á KHOA
              <i className="fas fa-award" />
            </div>
          </section>

          {/* ── TOP 2 STUDENTS ────────────────────────────── */}
          <section style={{ padding: "16px 28px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { rank: "Thủ Khoa", score: "96.10", gold: true },
              { rank: "Á Khoa",   score: "96.08", gold: false },
            ].map(({ rank, score, gold }) => (
              <div key={rank} style={{
                background: gold ? "linear-gradient(135deg,#d32f2f,#b71c1c)" : "linear-gradient(135deg,#c62828,#a01515)",
                borderRadius: "16px", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                color: "#fff",
              }}>
                <div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.8, marginBottom: "2px" }}>🌙 MITAEdu &nbsp;·&nbsp; HỆ THỐNG MITAEDU</div>
                  <div style={{ fontStyle: "italic", fontSize: "0.85rem", opacity: 0.9, marginBottom: "4px" }}>Vinh danh Học Sinh</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.6rem", lineHeight: 1 }}>{score}</div>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{
                      display: "inline-block", background: gold ? "#f5a623" : "rgba(255,255,255,0.25)",
                      color: gold ? "#7f3000" : "#fff",
                      borderRadius: "12px", padding: "2px 10px",
                      fontSize: "0.72rem", fontWeight: 800, width: "fit-content",
                    }}>{rank}</span>
                    <div style={{ fontSize: "0.78rem", opacity: 0.85, marginTop: "4px" }}>{rank}<br/>{rank}</div>
                  </div>
                </div>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", opacity: 0.7,
                }}>
                  <i className="fas fa-user-graduate" />
                </div>
              </div>
            ))}
          </section>

          {/* ── CHIẾN THẦN 80+ ────────────────────────────── */}
          <section style={{ padding: "20px 28px 0" }}>
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                display: "inline-block", background: "#d32f2f", color: "#fff",
                borderRadius: "8px", padding: "8px 18px",
                fontFamily: "Nunito, sans-serif", fontWeight: 900,
                fontSize: "0.9rem", letterSpacing: "1px",
              }}>
                CHIẾN THẦN 80+ TSA - MITAEdu
              </span>
            </div>
            <div style={{
              border: "2px dashed #f0d5d5", borderRadius: "16px", padding: "20px",
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px",
            }}>
              {CHAMPIONS.map((c) => (
                <div key={c.name} style={{
                  background: "#fff", borderRadius: "16px",
                  border: "2px solid #f0d5d5", padding: "20px 16px",
                  textAlign: "center", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "8px",
                }}>
                  <div style={{
                    width: "70px", height: "70px", borderRadius: "50%",
                    background: "#fdf0f0", border: "2px solid #f0d5d5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.8rem", color: "#d32f2f",
                  }}>
                    <i className="fas fa-user-graduate" />
                  </div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#d32f2f" }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#888" }}>{c.exam}</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "#d32f2f", lineHeight: 1 }}>
                    {c.score}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#aaa" }}>điểm</div>
                  <button style={{
                    width: "100%", background: "#d32f2f", color: "#fff",
                    border: "none", borderRadius: "20px", padding: "8px 0",
                    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                    marginTop: "4px",
                  }}>
                    Xem chứng chỉ
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── BẠN ĐANG TÌM GÌ ───────────────────────────── */}
          <section style={{ padding: "20px 28px 0" }}>
            <div style={{
              border: "2px dashed #f0d5d5", borderRadius: "16px", padding: "20px 24px",
            }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{
                  display: "inline-block", background: "#d32f2f", color: "#fff",
                  borderRadius: "8px", padding: "8px 18px",
                  fontFamily: "Nunito, sans-serif", fontWeight: 900,
                  fontSize: "0.9rem", letterSpacing: "1px",
                }}>
                  BẠN ĐANG TÌM KIẾM GÌ?
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {SEARCH_TAGS.map((tag) => (
                  <button key={tag} style={{
                    background: "#fff", border: "1.5px solid #e0e0e0",
                    borderRadius: "20px", padding: "7px 16px",
                    fontSize: "0.82rem", color: "#444",
                    cursor: "pointer", transition: "border-color .15s",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#d32f2f"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── KHÓA HỌC MỚI NHẤT ─────────────────────────── */}
          <section style={{ padding: "20px 28px 28px" }}>
            <div style={{
              border: "2px dashed #f0d5d5", borderRadius: "16px", padding: "20px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{
                  display: "inline-block", background: "#d32f2f", color: "#fff",
                  borderRadius: "8px", padding: "8px 18px",
                  fontFamily: "Nunito, sans-serif", fontWeight: 900,
                  fontSize: "0.9rem", letterSpacing: "1px",
                }}>
                  KHÓA HỌC MỚI NHẤT
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[{ dir: "prev", icon: "fa-arrow-left" }, { dir: "next", icon: "fa-arrow-right" }].map(({ dir, icon }) => (
                    <button key={dir} onClick={() => scrollCourses(dir === "prev" ? -1 : 1)} style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      border: "1.5px solid #e0e0e0", background: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#555",
                    }}>
                      <i className={`fas ${icon}`} style={{ fontSize: "0.8rem" }} />
                    </button>
                  ))}
                </div>
              </div>

              <div ref={sliderRef} style={{
                display: "grid",
                gridTemplateColumns: `repeat(3, 1fr)`,
                gap: "16px",
                overflow: "hidden",
              }}>
                {courses.slice(courseIdx, courseIdx + VISIBLE).map((course, i) => (
                  <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: "100%", aspectRatio: "4/3", borderRadius: "12px",
                        overflow: "hidden",
                        background: course.thumbnailUrl ? "#000" : THUMB_GRADIENTS[(courseIdx + i) % THUMB_GRADIENTS.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ textAlign: "center", color: "#fff", padding: "16px" }}>
                            <div style={{ fontSize: "0.6rem", letterSpacing: "2px", marginBottom: "6px", opacity: 0.85 }}>NỘI DUNG<br/>KHÓA HỌC</div>
                            <div style={{ fontSize: "0.55rem", letterSpacing: "1px", opacity: 0.7 }}>LỘ TRÌNH KHÓA HỌC</div>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div>
                        <div style={{
                          fontFamily: "Nunito, sans-serif", fontWeight: 800,
                          fontSize: "0.88rem", color: "#2c2c2c",
                          textTransform: "uppercase", lineHeight: 1.3,
                          marginBottom: "5px",
                        }}>
                          {course.name}
                        </div>
                        {course.teacher && (
                          <div style={{ fontSize: "0.75rem", color: "#888", display: "flex", alignItems: "center", gap: "5px" }}>
                            <i className="fas fa-user" style={{ fontSize: "0.62rem" }} />
                            {course.teacher}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

        </main>
        <RightPanel />
      </div>
      <Footer />
    </>
  );
}

// ── Right Panel ──────────────────────────────────────────────────
const NEWS_ITEMS = [
  { title: "Thi thử TSA ngày 01/08/2025",  time: "12:48 - 01/01/2025" },
  { title: "Lịch thi TSA 2026 chính thức",  time: "09:00 - 15/01/2025" },
  { title: "Cập nhật đề thi mới nhất",      time: "08:30 - 20/02/2025" },
];

function RightPanel() {
  return (
    <aside style={{
      width: "260px",
      flexShrink: 0,
      padding: "20px 16px 20px 0",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      minHeight: "calc(100vh - 62px)",
    }}>

      {/* ── Promo card ── */}
      <div style={{
        background: "linear-gradient(160deg,#d32f2f 0%,#b71c1c 100%)",
        borderRadius: "18px",
        padding: "18px 20px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "1rem" }}>🌙</span>
            <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>MITAEdu</span>
          </div>
          <div style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1px",
            opacity: 0.8, textTransform: "uppercase",
          }}>
            HỆ THỐNG MITAEDU
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900,
          fontSize: "1.3rem", lineHeight: 1.2,
          marginBottom: "16px", letterSpacing: "0.5px",
        }}>
          KHÓA TỔNG ÔN<br />ĐỢT 2
        </div>

        {/* Plane visual */}
        <div style={{
          position: "relative", height: "60px", marginBottom: "14px",
          display: "flex", alignItems: "center",
        }}>
          {/* clouds */}
          <div style={{
            position: "absolute", left: "10px", top: "10px",
            width: "50px", height: "22px", borderRadius: "20px",
            background: "rgba(255,255,255,0.18)",
          }} />
          <div style={{
            position: "absolute", left: "0", top: "30px",
            width: "35px", height: "16px", borderRadius: "20px",
            background: "rgba(255,255,255,0.12)",
          }} />
          {/* plane */}
          <i className="fas fa-plane" style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)",
            fontSize: "2rem", opacity: 0.9,
          }} />
          {/* trail */}
          <div style={{
            position: "absolute", left: "60px", right: "55px", top: "50%",
            height: "3px", borderRadius: "2px",
            background: "rgba(255,255,255,0.3)",
            transform: "translateY(-50%)",
          }} />
        </div>

        {/* Price */}
        <div style={{
          background: "rgba(0,0,0,0.18)", borderRadius: "12px",
          padding: "14px 16px",
        }}>
          <div style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 900,
            fontSize: "2rem", color: "#f5a623", lineHeight: 1,
            marginBottom: "6px",
          }}>
            1.600 K
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.9, marginBottom: "4px" }}>
            Cho Học sinh lần đầu
          </div>
          <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
            Giá Học Sinh Cũ <s>800.000 Đ</s>
          </div>
          <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
            Và Miễn Phí Phòng Luyện
          </div>
        </div>
      </div>

      {/* ── Access code button ── */}
      <button style={{
        width: "100%",
        background: "#d32f2f",
        color: "#fff",
        border: "none",
        borderRadius: "14px",
        padding: "14px 20px",
        fontFamily: "Nunito, sans-serif",
        fontWeight: 800,
        fontSize: "0.95rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        letterSpacing: "0.3px",
      }}>
        <i className="fas fa-key" />
        Nhập mã truy cập
      </button>

      {/* ── News panel ── */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "2px solid #f0d5d5",
        padding: "16px",
        flex: 1,
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}>
          <span style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800, fontSize: "0.95rem", color: "#2c2c2c",
          }}>
            Tin tức
          </span>
          <a href="#" style={{
            fontSize: "0.78rem", color: "#d32f2f",
            fontWeight: 600, textDecoration: "none",
          }}>
            Xem tất cả
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {NEWS_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                background: "#fdf0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "#d32f2f", fontSize: "0.85rem",
              }}>
                <i className="fas fa-newspaper" />
              </div>
              <div>
                <a href="#" style={{
                  fontSize: "0.8rem", fontWeight: 600, color: "#2c2c2c",
                  lineHeight: 1.35, display: "block", textDecoration: "none",
                  marginBottom: "3px",
                }}>
                  {item.title}
                </a>
                <div style={{ fontSize: "0.7rem", color: "#aaa" }}>
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}

