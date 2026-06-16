"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LessonAccordion from "@/components/course/LessonAccordion";
import SecureMediaViewer from "@/components/course/SecureMediaViewer";
import VideoPlayer from "@/components/course/VideoPlayer";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";
import type { ApiResponse, Course, Lesson } from "@/types";

const TRIAL_CATEGORY_LABEL = "ĐGNL ĐHQG TP.HCM (V-ACT) 2027";
const TRIAL_COURSE_NAME = "Khóa Tư Duy Toàn Diện ĐGNL ĐHQG TP.HCM (V-ACT) 2027";
const TRIAL_COURSE_DESCRIPTION = "Khóa học toàn diện các phần trong kỳ thi: Phần Toán, Phần Sử dụng ngôn ngữ (Tiếng Việt, Tiếng Anh), Phần Tư duy khoa học (đủ các môn: Logic và PTSL, Hóa học, Vật lý, Sinh học, Địa lí, Lịch sử)";

const SUBJECT_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  "Toán": { icon: "fas fa-calculator", color: "#1565c0", bg: "#e3f2fd" },
  "Tiếng Việt": { icon: "fas fa-book-open", color: "#6a1b9a", bg: "#f3e5f5" },
};

export default function TrialPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<ApiResponse<Course>>("/api/courses/trial")
      .then((r) => {
        const data = r.data.data;
        const lessons = data.lessons ?? [];
        setCourse(data);
        setActiveLesson(lessons[0] ?? null);
      })
      .catch(() => {
        setCourse(null);
        setActiveLesson(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
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
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="layout">
          <Sidebar />
          <main style={{ padding: "60px", textAlign: "center", color: "#777", background: "#f0f7fd" }}>
            Không tìm thấy nội dung học thử
          </main>
        </div>
      </>
    );
  }

  const lessons = course.lessons ?? [];

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="course-detail-main" style={{ padding: "24px 28px", display: "flex", gap: "24px", background: "#f0f7fd" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            <nav style={{ fontSize: "0.82rem", color: "#777" }}>
              <Link href="/" style={{ color: "#777" }}>Trang chủ</Link>
              {" › "}
              <span style={{ color: "#1e7ab8", fontWeight: 600 }}>Học thử</span>
            </nav>

            <div style={{
              background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0",
              padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
            }}>
              {lessons.map((lesson) => {
                const subject = getSubject(lesson.title);
                const style = SUBJECT_STYLES[subject] ?? SUBJECT_STYLES["Toán"];
                const active = lesson.id === activeLesson?.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    style={{
                      border: active ? `2px solid ${style.color}` : "2px solid #e8f0f7",
                      background: active ? style.bg : "#fff",
                      color: active ? style.color : "#2c2c2c",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: "0.86rem",
                    }}
                  >
                    <i className={style.icon} />
                    {subject}
                  </button>
                );
              })}
            </div>

            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Badge variant="hsa">{TRIAL_CATEGORY_LABEL}</Badge>
                <span style={{ fontSize: "0.78rem", color: "#777" }}>
                  <i className="fas fa-play-circle" style={{ marginRight: "4px" }} />{lessons.length} buổi học thử
                </span>
              </div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "6px" }}>
                {TRIAL_COURSE_NAME}
              </h1>
              {course.teacher && (
                <p style={{ fontSize: "0.875rem", color: "#777" }}>
                  <i className="fas fa-chalkboard-teacher" style={{ marginRight: "6px", color: "#1e7ab8" }} />
                  {course.teacher}
                </p>
              )}
              <p style={{ fontSize: "0.875rem", color: "#555", marginTop: "10px", lineHeight: 1.6 }}>{TRIAL_COURSE_DESCRIPTION}</p>
            </div>

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
                {activeLesson.videoMediaId || activeLesson.pdfMediaId || activeLesson.handwrittenMediaId || activeLesson.answerMediaId
                  ? <SecureMediaViewer lesson={activeLesson} />
                  : <VideoPlayer lesson={activeLesson} />
                }
              </div>
            )}
          </div>

          <div className="course-lesson-panel" style={{ width: "320px", flexShrink: 0 }}>
            <div className="course-lesson-sticky" style={{ background: "#fff", borderRadius: "16px", border: "2px solid #c5ddf0", padding: "16px", position: "sticky", top: "80px" }}>
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#1e7ab8", marginBottom: "14px" }}>
                Danh sách học thử
              </h3>
              {lessons.length > 0 && (
                <LessonAccordion
                  lessons={lessons}
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

function getSubject(title: string) {
  return title.split(" · ")[0] || title;
}
