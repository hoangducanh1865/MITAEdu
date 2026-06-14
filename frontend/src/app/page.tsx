"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import { useSidebar } from "@/lib/SidebarContext";
import type { ApiResponse, Course } from "@/types";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ActivationCodeModal from "@/components/ActivationCodeModal";

// ── Carousel slides ──────────────────────────────────────────────
const SLIDES = [
  {
    title: "Ngân Hàng\nCâu Hỏi",
    sub: "Phong phú đa dạng",
    badge: "Kì Thi Đánh Giá Tư Duy 2026",
    tags: ["Tư Duy Toán Học", "Tư Duy Khoa Học", "Tư Duy Đọc Hiểu"],
    bg: "linear-gradient(135deg,#d32f2f 0%,#b71c1c 100%)",
    banner: "/real/banner-slide-1.jpg",
  },
  {
    title: "Luyện Thi\nChuyên Sâu",
    sub: "Đạt điểm cao trong kì thi",
    badge: "Chương Trình Mới 2026",
    tags: ["Toán", "Vật Lý", "Hóa Học"],
    bg: "linear-gradient(135deg,#c62828 0%,#ad1457 100%)",
    banner: "/real/banner-slide-2.jpg",
  },
];

const SEARCH_TAGS = [
  "Labteam","Khóa học","Mentor","TSA","HSA",
  "Cách đăng kí khóa học","Cách ôn thi",
  "Cách đỗ hust từ năm lớp 11","Cách thủ khoa",
];


export default function DashboardPage() {
  const [slide, setSlide] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseIdx, setCourseIdx] = useState(0);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { sidebarOpen, toggleSidebar } = useSidebar();

  function handleActivationSuccess(courseName: string) {
    setToast(`Kích hoạt thành công! Bạn đã mở khóa: ${courseName}`);
    setTimeout(() => setToast(null), 5000);
  }

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Listen for activation modal trigger from Navbar button
  useEffect(() => {
    const handler = () => setCodeModalOpen(true);
    window.addEventListener("open-activation-modal", handler);
    return () => window.removeEventListener("open-activation-modal", handler);
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
      {/* Backdrop: click to close sidebar on mobile */}
      <div
        className={`sidebar-mobile-backdrop${sidebarOpen ? " active" : ""}`}
        onClick={toggleSidebar}
      />
      <div className="layout-home">
        <Sidebar />
        {/* Toast notification */}
        {toast && (
          <div style={{
            position: "fixed", top: "80px", right: "20px", zIndex: 9999,
            background: "#2e7d32", color: "#fff", borderRadius: "14px",
            padding: "14px 20px", fontSize: "0.875rem", fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "320px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <i className="fas fa-check-circle" />
            {toast}
          </div>
        )}
        <ActivationCodeModal
          open={codeModalOpen}
          onClose={() => setCodeModalOpen(false)}
          onSuccess={handleActivationSuccess}
        />
        <main style={{ background: "#fff", minHeight: "calc(100vh - 62px)", display: "flex", flexDirection: "column", gap: 0, minWidth: "560px" }}>
          {/* ── HERO CAROUSEL ─────────────────────────────── */}
          <section className="home-section" style={{ padding: "20px 28px 0" }}>
            <div className="hero-inner" style={{
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              minHeight: "200px",
            }}>
              <img
                src={s.banner}
                alt={s.title.replace("\n", " ")}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "20px" }}
              />

              {/* Prev/Next */}
              {["prev","next"].map((dir) => (
                <button key={dir} onClick={() => setSlide((s) => dir === "prev" ? (s - 1 + SLIDES.length) % SLIDES.length : (s + 1) % SLIDES.length)} style={{
                  position: "absolute", top: "50%", transform: "translateY(-50%)",
                  [dir === "prev" ? "left" : "right"]: "16px",
                  background: "rgba(0,0,0,0.12)", border: "1.5px solid #ccc",
                  borderRadius: "50%", width: "36px", height: "36px",
                  color: "#aaa", cursor: "pointer", zIndex: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`fas fa-chevron-${dir === "prev" ? "left" : "right"}`} style={{ fontSize: "0.85rem" }} />
                </button>
              ))}

              {/* Dots */}
              <div style={{
                position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "8px", zIndex: 3,
              }}>
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} style={{
                    width: i === slide ? "28px" : "10px", height: "10px",
                    borderRadius: "5px", border: "none",
                    background: i === slide ? "#aaa" : "#ddd",
                    cursor: "pointer", transition: "width .3s, background .3s", padding: 0,
                  }} />
                ))}
              </div>
            </div>
          </section>

          {/* ── VINH DANH BANNER ──────────────────────────── */}
          <section className="home-section" style={{ padding: "16px 28px 0" }}>
            <div style={{
              background: "#d32f2f", borderRadius: "12px",
              padding: "14px 24px", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "14px", fontFamily: "Nunito, sans-serif",
              fontWeight: 900, fontSize: "1.05rem", letterSpacing: "1px",
              cursor: "pointer",
            }}>
              <i className="fas fa-trophy" />
              BẢNG VÀNG THÀNH TÍCH
              <i className="fas fa-trophy" />
            </div>
          </section>

          {/* ── BẢNG VÀNG THÀNH TÍCH ─────────────────────── */}
          <section className="home-section" style={{ padding: "16px 28px 0" }}>
            <div className="thanh-tich-grid" style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              {[
                { rank: "Bảng thành tích 1", src: "/real/poster-thanh-tich-1.jpg" },
                { rank: "Bảng thành tích 2", src: "/real/poster-thanh-tich-2.jpg" },
              ].map(({ rank, src }) => (
                <img
                  key={rank}
                  src={src}
                  alt={rank}
                  style={{
                    height: "260px", width: "auto", maxWidth: "48%",
                    borderRadius: "16px", display: "block",
                    objectFit: "contain", flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </section>

          {/* ── BẠN ĐANG TÌM GÌ ───────────────────────────── */}
          <section className="home-section" style={{ padding: "20px 28px 0" }}>
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
          <section className="home-section" style={{ padding: "20px 28px 28px" }}>
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

              <div ref={sliderRef} className="home-courses-grid" style={{
                display: "grid",
                gridTemplateColumns: `repeat(3, 1fr)`,
                gap: "16px",
                overflow: "hidden",
              }}>
                {courses.slice(courseIdx, courseIdx + VISIBLE).map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: "100%", aspectRatio: "4/3", borderRadius: "12px",
                        overflow: "hidden",
                        background: course.thumbnailUrl ? "#000" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImagePlaceholder
                            width="100%"
                            height="100%"
                            desc={"Thumbnail khóa học\nTỷ lệ 4:3 | min 400×300px\nJPG/PNG"}
                            style={{ borderRadius: 0 }}
                          />
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
        <RightPanel onOpenCodeModal={() => setCodeModalOpen(true)} />
      </div>
      <Footer />
    </>
  );
}

// ── Right Panel ──────────────────────────────────────────────────
function RightPanel({ onOpenCodeModal }: { onOpenCodeModal: () => void }) {
  return (
    <aside className="home-right-panel" style={{
      width: "260px",
      flexShrink: 0,
      padding: "20px 16px 20px 0",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      minHeight: "calc(100vh - 62px)",
    }}>

      {/* ── Promo card ── */}
      <img
        src="/real/banner-promo.jpg"
        alt="Khóa Tổng Ôn Đợt 2 — MITAEdu"
        style={{ width: "100%", height: "auto", borderRadius: "18px", display: "block" }}
      />

      {/* ── Access code button ── */}
      <button onClick={onOpenCodeModal} style={{
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
        Mã kích hoạt
      </button>

    </aside>
  );
}

