"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LessonAccordion from "@/components/course/LessonAccordion";
import VideoPlayer from "@/components/course/VideoPlayer";
import LocalCourseDetail from "@/components/course/LocalCourseDetail";
import api from "@/lib/api";
import { findLocalCourse } from "@/lib/localCourses";
import type { ApiResponse, Course, Lesson } from "@/types";
import Badge from "@/components/ui/Badge";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // ── Kiểm tra xem có phải local course không ──
  const localCourse = findLocalCourse(courseId);
  if (localCourse) {
    return <LocalCourseDetail course={localCourse} />;
  }

  // ── API course (courseId là số) ──
  return <ApiCourseDetail courseId={courseId} />;
}

function ApiCourseDetail({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Course>>(`/api/courses/${courseId}`)
      .then((r) => {
        setCourse(r.data.data);
        if (r.data.data.lessons?.length) setActiveLesson(r.data.data.lessons[0]);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "60px", textAlign: "center", color: "#d32f2f", background: "#fdf0f0" }}>
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
        <main style={{ padding: "60px", textAlign: "center", color: "#777", background: "#fdf0f0" }}>Không tìm thấy khóa học</main>
      </div>
    </>
  );

  const catLower = course.category.toLowerCase() as "tsa" | "hsa" | "thpt";

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "24px 28px", display: "flex", gap: "24px", background: "#fdf0f0" }}>
          {/* Left: video + info */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "0.82rem", color: "#777" }}>
              <a href="/" style={{ color: "#777" }}>Trang chủ</a>
              {" › "}
              <a href="/courses" style={{ color: "#777" }}>Khóa học</a>
              {" › "}
              <span style={{ color: "#d32f2f", fontWeight: 600 }}>{course.name}</span>
            </nav>

            {/* Course header */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Badge variant={catLower}>{course.category}</Badge>
                <span style={{ fontSize: "0.78rem", color: "#777" }}>
                  <i className="fas fa-book" style={{ marginRight: "4px" }} />{course.lessonCount} bài học
                </span>
              </div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "6px" }}>
                {course.name}
              </h1>
              {course.teacher && (
                <p style={{ fontSize: "0.875rem", color: "#777" }}>
                  <i className="fas fa-chalkboard-teacher" style={{ marginRight: "6px", color: "#d32f2f" }} />
                  {course.teacher}
                </p>
              )}
              {course.description && (
                <p style={{ fontSize: "0.875rem", color: "#555", marginTop: "10px", lineHeight: 1.6 }}>{course.description}</p>
              )}
            </div>

            {/* Video player */}
            {activeLesson && (
              <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5", padding: "20px 24px" }}>
                <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c", marginBottom: "16px" }}>
                  {activeLesson.title}
                </h2>
                <VideoPlayer lesson={activeLesson} />
              </div>
            )}
          </div>

          {/* Right: lesson list */}
          <div style={{ width: "320px", flexShrink: 0 }}>
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5", padding: "16px", position: "sticky", top: "80px" }}>
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#d32f2f", marginBottom: "14px" }}>
                Danh sách bài học
              </h3>
              {course.lessons && (
                <LessonAccordion
                  lessons={course.lessons}
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
