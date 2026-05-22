"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import type { LocalCourse, LocalLesson, LocalSession } from "@/lib/localCourses";

interface Props {
  course: LocalCourse;
}

export default function LocalCourseDetail({ course }: Props) {
  const [activeLesson, setActiveLesson] = useState<LocalLesson | null>(
    course.sessions[0]?.lessons[0] ?? null
  );
  const [openSessions, setOpenSessions] = useState<Set<string>>(
    new Set(course.sessions.map((s) => s.id))
  );

  function toggleSession(id: string) {
    setOpenSessions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "24px 28px", display: "flex", gap: "24px", background: "#fdf0f0", minHeight: "calc(100vh - 62px)" }}>

          {/* LEFT: media viewer + info */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "0.82rem", color: "#777", display: "flex", alignItems: "center", gap: "6px" }}>
              <Link href="/" style={{ color: "#d32f2f" }}><i className="fas fa-home" /></Link>
              <span style={{ color: "#ccc" }}>›</span>
              <Link href="/courses" style={{ color: "#777" }}>Khóa học</Link>
              <span style={{ color: "#ccc" }}>›</span>
              <span style={{ color: "#d32f2f", fontWeight: 600 }}>{course.name}</span>
            </nav>

            {/* Media viewer */}
            {activeLesson && <MediaViewer lesson={activeLesson} courseName={course.name} thumbnailGradient={course.thumbnailGradient} />}

            {/* Teacher info */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "2px solid #f0d5d5", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: course.thumbnailGradient ?? "linear-gradient(135deg,#d32f2f,#b71c1c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "1.2rem", flexShrink: 0,
              }}>
                <i className="fas fa-chalkboard-teacher" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c" }}>{course.teacher ?? "Giáo viên"}</div>
                <div style={{ fontSize: "0.78rem", color: "#999" }}>Giáo viên</div>
              </div>
            </div>
          </div>

          {/* RIGHT: lesson list - LAB style */}
          <div style={{ width: "340px", flexShrink: 0 }}>
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "2px solid #f0d5d5", padding: "16px",
              position: "sticky", top: "80px", maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}>
              <h3 style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 800,
                fontSize: "1rem", color: "#d32f2f", marginBottom: "14px",
              }}>
                Danh sách bài học
              </h3>

              {course.sessions.map((session) => {
                const isOpen = openSessions.has(session.id);
                return (
                  <SessionAccordion
                    key={session.id}
                    session={session}
                    isOpen={isOpen}
                    onToggle={() => toggleSession(session.id)}
                    activeId={activeLesson?.id}
                    onSelect={setActiveLesson}
                  />
                );
              })}
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
}

/* ── Media Viewer ─────────────────────────────────── */
function MediaViewer({
  lesson,
  courseName,
  thumbnailGradient,
}: {
  lesson: LocalLesson;
  courseName: string;
  thumbnailGradient?: string;
}) {
  if (lesson.videoUrl) {
    // YouTube embed
    const videoId = extractYouTubeId(lesson.videoUrl);
    return (
      <div style={{
        background: "#000", borderRadius: "16px", overflow: "hidden",
        aspectRatio: "16/9", border: "2px solid #f0d5d5",
      }}>
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <div style={{ color: "#fff", textAlign: "center", padding: "40px" }}>
            Không thể phát video
          </div>
        )}
      </div>
    );
  }

  const pdfUrl = lesson.pdfUrl ?? lesson.handwrittenPdfUrl;
  if (pdfUrl) {
    return (
      <div style={{ borderRadius: "16px", overflow: "hidden", border: "2px solid #f0d5d5", background: "#fff" }}>
        {/* Title bar */}
        <div style={{
          background: "#d32f2f", padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>
            <i className="fas fa-file-pdf" style={{ marginRight: 8 }} />
            {lesson.title}
          </span>
          <a
            href={pdfUrl}
            download
            style={{
              color: "#fff", fontSize: "0.78rem",
              display: "flex", alignItems: "center", gap: "6px",
              background: "rgba(255,255,255,0.18)", borderRadius: "6px",
              padding: "4px 10px",
            }}
          >
            <i className="fas fa-download" /> Tải xuống
          </a>
        </div>
        <iframe
          src={pdfUrl}
          title={lesson.title}
          style={{ width: "100%", height: "600px", border: "none" }}
        />
      </div>
    );
  }

  // Placeholder (no media)
  return (
    <div style={{
      background: thumbnailGradient ?? "linear-gradient(135deg,#d32f2f,#b71c1c)",
      borderRadius: "16px", aspectRatio: "16/9",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.15)", borderRadius: "16px",
        padding: "24px 32px", textAlign: "center",
      }}>
        <div style={{ fontSize: "3rem", opacity: 0.7, marginBottom: "8px" }}>📚</div>
        <div style={{
          fontFamily: "Nunito, sans-serif", fontWeight: 900,
          fontSize: "1.2rem", color: "#fff",
          textTransform: "uppercase", letterSpacing: "1px",
        }}>{courseName}</div>
      </div>
    </div>
  );
}

/* ── Session Accordion (LAB style) ───────────────── */
function SessionAccordion({
  session,
  isOpen,
  onToggle,
  activeId,
  onSelect,
}: {
  session: LocalSession;
  isOpen: boolean;
  onToggle: () => void;
  activeId?: string;
  onSelect: (lesson: LocalLesson) => void;
}) {
  return (
    <div style={{ marginBottom: "6px" }}>
      {/* Session header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left",
          background: "#b71c1c", color: "#fff",
          border: "none", borderRadius: isOpen ? "10px 10px 0 0" : "10px",
          padding: "12px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", fontWeight: 700, fontSize: "0.82rem",
          lineHeight: 1.4,
        }}
      >
        <span style={{ flex: 1, marginRight: "8px" }}>{session.title}</span>
        <i
          className={`fas fa-${isOpen ? "minus" : "plus"}`}
          style={{ fontSize: "0.75rem", flexShrink: 0 }}
        />
      </button>

      {/* Lessons */}
      {isOpen && (
        <div style={{ border: "2px solid #f0d5d5", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          {session.lessons.map((lesson) => {
            const active = lesson.id === activeId;
            const icon = lesson.videoUrl
              ? "fab fa-youtube"
              : lesson.handwrittenPdfUrl
              ? "fas fa-pen"
              : "fas fa-file-alt";
            const iconColor = lesson.videoUrl ? "#ff0000" : lesson.handwrittenPdfUrl ? "#555" : "#d32f2f";

            return (
              <button
                key={lesson.id}
                onClick={() => onSelect(lesson)}
                style={{
                  width: "100%", textAlign: "left",
                  background: active ? "#fdf0f0" : "#fff",
                  border: "none",
                  borderBottom: "1px solid #f0d5d5",
                  padding: "11px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                  cursor: "pointer", transition: "background .15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#fff8f8";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "#fff";
                }}
              >
                <i className={icon} style={{ color: iconColor, width: "16px", textAlign: "center", flexShrink: 0 }} />
                <span style={{
                  fontSize: "0.82rem", fontWeight: active ? 700 : 500,
                  color: active ? "#d32f2f" : "#2c2c2c", flex: 1,
                }}>
                  {lesson.title}
                </span>
                {active && <i className="fas fa-play" style={{ color: "#d32f2f", fontSize: "0.65rem" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────── */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
