"use client";

import { useEffect, useRef, useState } from "react"; // useRef kept for course slider
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import { useSidebar } from "@/lib/SidebarContext";
import type { ApiResponse, Course } from "@/types";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ActivationCodeModal from "@/components/ActivationCodeModal";

const BANNER_SRC = "/real/banner-slide-1.jpg";

const FEEDBACK_IMAGES = [
  "/real/feedback_hoc_vien/nguyen-truong-huy-1.jpg",
  "/real/feedback_hoc_vien/nguyen-truong-huy-2.jpg",
  "/real/feedback_hoc_vien/nguyen-truong-huy-3.jpg",
];


export default function DashboardPage() {
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

  return (
    <>
      <Navbar />
      {/* Backdrop: click to close sidebar on mobile */}
      <div
        className={`sidebar-mobile-backdrop${sidebarOpen ? " active" : ""}`}
        onClick={toggleSidebar}
      />
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
      <div className="home-page-wrapper">
        <div className="layout-home">
          <Sidebar />
          <main style={{ minHeight: "calc(100vh - 62px)", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* ── HERO BANNER ───────────────────────────────── */}
          <section className="home-section" style={{ padding: "20px 28px 0" }}>
            <img
              src={BANNER_SRC}
              alt="MITAEdu Banner"
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "20px" }}
            />
          </section>

          {/* ── VINH DANH HỌC SINH THÀNH TÍCH CAO TRONG KỲ THI V-VACT 2026 ──────────────────────────── */}
          <section className="home-section" style={{ padding: "16px 28px 0" }}>
            <div style={{
              background: "#1e7ab8", borderRadius: "12px",
              padding: "14px 24px", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "14px", fontFamily: "Nunito, sans-serif",
              fontWeight: 900, fontSize: "1.05rem", letterSpacing: "1px",
              cursor: "pointer",
            }}>
              <i className="fas fa-trophy" />
              VINH DANH HỌC SINH THÀNH TÍCH CAO TRONG KỲ THI V-VACT 2026
              <i className="fas fa-trophy" />
            </div>
          </section>

          {/* ── VINH DANH HỌC SINH THÀNH TÍCH CAO TRONG KỲ THI V-VACT 2026 ─────────────────────── */}
          <section className="home-section" style={{ padding: "16px 28px 0" }}>
            <div className="thanh-tich-grid" style={{ display: "flex", gap: "16px" }}>
              {[
                { rank: "Bảng thành tích 1", src: "/real/poster-thanh-tich-1.jpg" },
                { rank: "Bảng thành tích 2", src: "/real/poster-thanh-tich-2.jpg" },
              ].map(({ rank, src }) => (
                <img
                  key={rank}
                  src={src}
                  alt={rank}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    width: "calc(50% - 8px)",
                    height: "auto",
                    borderRadius: "16px",
                    display: "block",
                  }}
                />
              ))}
            </div>
          </section>

          {/* ── FEEDBACK HỌC VIÊN ─────────────────────────── */}
          <section className="home-section" style={{ padding: "20px 28px 0" }}>
            <div style={{
              background: "#fff", border: "1px solid #c5ddf0", borderRadius: "16px", padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(30,122,184,.07)",
            }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{
                  display: "inline-block", background: "#1e7ab8", color: "#fff",
                  borderRadius: "8px", padding: "8px 18px",
                  fontFamily: "Nunito, sans-serif", fontWeight: 900,
                  fontSize: "0.9rem", letterSpacing: "1px",
                }}>
                  FEEDBACK CỦA HỌC VIÊN
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {FEEDBACK_IMAGES.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Feedback học viên ${i + 1}`}
                    style={{
                      width: "100%", borderRadius: "10px",
                      objectFit: "cover", display: "block",
                      border: "1px solid #e8f0f7",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── KHÓA HỌC MỚI NHẤT ─────────────────────────── */}
          <section className="home-section" style={{ padding: "20px 28px 28px" }}>
            <div style={{
              background: "#fff", border: "1px solid #c5ddf0", borderRadius: "16px", padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(30,122,184,.07)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{
                  display: "inline-block", background: "#1e7ab8", color: "#fff",
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
        </div>
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
        background: "#1e7ab8",
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

