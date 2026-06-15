"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LessonAccordion from "@/components/course/LessonAccordion";
import VideoPlayer from "@/components/course/VideoPlayer";
import SecureMediaViewer from "@/components/course/SecureMediaViewer";
import ActivationCodeModal from "@/components/ActivationCodeModal";
import api from "@/lib/api";
import { getCourseCategoryCode, getCourseCategoryUrl } from "@/lib/courseCategory";
import type { ApiResponse, Course, Lesson } from "@/types";
import Badge from "@/components/ui/Badge";

const SUBJECT_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  "Toán":       { icon: "fas fa-calculator", color: "#1565c0", bg: "#e3f2fd" },
  "Tiếng Việt": { icon: "fas fa-book-open",  color: "#6a1b9a", bg: "#f3e5f5" },
  "Tiếng Anh":  { icon: "fas fa-language",   color: "#0277bd", bg: "#e1f5fe" },
  "Hóa":        { icon: "fas fa-flask",       color: "#2e7d32", bg: "#e8f5e9" },
  "Sinh học":   { icon: "fas fa-dna",         color: "#00695c", bg: "#e0f2f1" },
  "Sử":         { icon: "fas fa-landmark",    color: "#bf360c", bg: "#fbe9e7" },
  "Địa":        { icon: "fas fa-globe-asia",  color: "#33691e", bg: "#f1f8e9" },
  "Lí":         { icon: "fas fa-atom",        color: "#4527a0", bg: "#ede7f6" },
};

export default function CourseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const subject = searchParams.get("subject") ?? "";
  return <ApiCourseDetail courseId={courseId} subject={subject} />;
}

function ApiCourseDetail({ courseId, subject }: { courseId: string; subject: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function fetchCourse() {
    setLoading(true);
    api.get<ApiResponse<Course>>(`/api/courses/${courseId}`)
      .then((r) => {
        setCourse(r.data.data);
        const lessons = r.data.data.lessons ?? [];
        const filtered = subject
          ? lessons.filter((l: Lesson) => l.title.startsWith(subject + " ·"))
          : lessons;
        if (filtered.length) setActiveLesson(filtered[0]);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchCourse(); }, [courseId]);

  function handleActivationSuccess(courseName: string) {
    setToast(`Kích hoạt thành công! Bạn đã mở khóa: ${courseName}`);
    setTimeout(() => setToast(null), 5000);
    fetchCourse();
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "60px", textAlign: "center", color: "#1e7ab8", background: "#f0f7fd" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} />
        </main>
      </div>
    </>
  );

  if (!course) return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "60px", textAlign: "center", color: "#777", background: "#f0f7fd" }}>
          Không tìm thấy khóa học
        </main>
      </div>
    </>
  );

  if (course.locked) return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <LockedCourseView course={course} onOpenCodeModal={() => setCodeModalOpen(true)} />
      </div>
      <Footer />
      <ActivationCodeModal
        open={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        onSuccess={handleActivationSuccess}
      />
      {toast && (
        <div style={{
          position: "fixed", top: "80px", right: "20px", zIndex: 9999,
          background: "#2e7d32", color: "#fff", borderRadius: "14px",
          padding: "14px 20px", fontSize: "0.875rem", fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "320px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <i className="fas fa-check-circle" />{toast}
        </div>
      )}
    </>
  );

  const catLower = course.category.toLowerCase() as "tsa" | "hsa" | "thpt";
  const categoryCode = getCourseCategoryCode(course.category);
  const allLessons = course.lessons ?? [];
  const visibleLessons = subject
    ? allLessons.filter((l) => l.title.startsWith(subject + " ·"))
    : allLessons;
  const subjectInfo = subject ? SUBJECT_ICONS[subject] : null;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="course-detail-main" style={{ padding: "24px 28px", display: "flex", gap: "24px", background: "#f0f7fd" }}>
          {/* Left: video + info */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "0.82rem", color: "#777" }}>
              <a href="/" style={{ color: "#777" }}>Trang chủ</a>
              {" › "}
              <a href="/courses" style={{ color: "#777" }}>Khóa học</a>
              {" › "}
              <a href={getCourseCategoryUrl(course.category)} style={{ color: "#777" }}>{course.name}</a>
              {subject && (
                <>
                  {" › "}
                  <span style={{ color: "#1e7ab8", fontWeight: 600 }}>{subject}</span>
                </>
              )}
            </nav>

            {/* Subject header when filtered */}
            {subject && subjectInfo && (
              <div style={{
                background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0",
                padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: subjectInfo.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.4rem", color: subjectInfo.color, flexShrink: 0,
                }}>
                  <i className={subjectInfo.icon} />
                </div>
                <div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: subjectInfo.color }}>
                    {subject}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#999" }}>{visibleLessons.length} bài học</div>
                </div>
                <a
                  href={`/courses/${courseId}`}
                  style={{ marginLeft: "auto", fontSize: "0.78rem", color: "#1e7ab8", textDecoration: "none", fontWeight: 600 }}
                >
                  <i className="fas fa-th" style={{ marginRight: "4px" }} />Tất cả môn
                </a>
              </div>
            )}

            {/* Course header */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Badge variant={catLower}>{categoryCode}</Badge>
                <span style={{ fontSize: "0.78rem", color: "#777" }}>
                  <i className="fas fa-book" style={{ marginRight: "4px" }} />{course.lessonCount} bài học
                </span>
              </div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "6px" }}>
                {course.name}
              </h1>
              {course.teacher && (
                <p style={{ fontSize: "0.875rem", color: "#777" }}>
                  <i className="fas fa-chalkboard-teacher" style={{ marginRight: "6px", color: "#1e7ab8" }} />
                  {course.teacher}
                </p>
              )}
              {course.description && (
                <p style={{ fontSize: "0.875rem", color: "#555", marginTop: "10px", lineHeight: 1.6 }}>{course.description}</p>
              )}
            </div>

            {/* Media player */}
            {activeLesson && (
              <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "20px 24px" }}>
                <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c", marginBottom: activeLesson.description ? "6px" : "16px" }}>
                  {activeLesson.title}
                </h2>
                {activeLesson.description && (
                  <div style={{ fontSize: "0.8rem", color: "#777", lineHeight: 1.5, marginBottom: "16px" }}>
                    {activeLesson.description.split(" | ").map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "2px" }}>
                        <span style={{ color: "#1e7ab8", fontWeight: 700, flexShrink: 0 }}>·</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeLesson.videoMediaId || activeLesson.pdfMediaId || activeLesson.handwrittenMediaId
                  ? <SecureMediaViewer lesson={activeLesson} />
                  : <VideoPlayer lesson={activeLesson} />
                }
              </div>
            )}
          </div>

          {/* Right: lesson list */}
          <div className="course-lesson-panel" style={{ width: "320px", flexShrink: 0 }}>
            <div className="course-lesson-sticky" style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "16px", position: "sticky", top: "80px" }}>
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#1e7ab8", marginBottom: "14px" }}>
                {subject ? `Bài học · ${subject}` : "Danh sách bài học"}
              </h3>
              {visibleLessons.length > 0 && (
                <LessonAccordion
                  lessons={visibleLessons}
                  onSelect={setActiveLesson}
                  activeId={activeLesson?.id}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

function LockedCourseView({ course, onOpenCodeModal }: { course: Course; onOpenCodeModal: () => void }) {
  const catLower = course.category.toLowerCase() as "tsa" | "hsa" | "thpt";
  const categoryCode = getCourseCategoryCode(course.category);
  return (
    <main style={{ flex: 1, padding: "40px 28px", background: "#f0f7fd", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "20px", border: "2px solid #c5ddf0", padding: "40px", maxWidth: "560px", width: "100%", textAlign: "center" }}>
        {course.thumbnailUrl && (
          <img src={course.thumbnailUrl} alt={course.name}
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "12px", marginBottom: "24px" }} />
        )}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Badge variant={catLower}>{categoryCode}</Badge>
        </div>
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#2c2c2c", marginBottom: "8px" }}>
          {course.name}
        </h1>
        {course.teacher && (
          <p style={{ fontSize: "0.875rem", color: "#777", marginBottom: "8px" }}>
            <i className="fas fa-chalkboard-teacher" style={{ marginRight: "6px", color: "#1e7ab8" }} />
            {course.teacher}
          </p>
        )}
        {course.description && (
          <p style={{ fontSize: "0.875rem", color: "#555", lineHeight: 1.6, marginBottom: "24px" }}>{course.description}</p>
        )}

        {/* Lock banner */}
        <div style={{
          background: "linear-gradient(135deg,#1e7ab8,#155f8f)", borderRadius: "16px",
          padding: "20px 24px", color: "#fff", marginBottom: "20px",
        }}>
          <i className="fas fa-lock" style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }} />
          <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
            Khóa học đang bị khóa
          </p>
          <p style={{ fontSize: "0.82rem", opacity: 0.85 }}>
            Bạn cần kích hoạt mã truy cập để xem nội dung khóa học này.
          </p>
        </div>

        <button
          onClick={onOpenCodeModal}
          style={{
            width: "100%", background: "#1e7ab8", color: "#fff",
            border: "none", borderRadius: "14px", padding: "15px",
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px",
          }}
        >
          <i className="fas fa-key" />
          Nhập mã truy cập
        </button>
      </div>
    </main>
  );
}
