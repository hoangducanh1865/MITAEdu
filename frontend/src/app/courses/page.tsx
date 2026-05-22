"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Course, CourseCategory } from "@/types";

const CATEGORIES: {
  value: CourseCategory;
  label: string;
  short: string;
  color: string;
  gradient: string;
}[] = [
  {
    value: "TSA",
    label: "Đánh giá tư duy",
    short: "TSA",
    color: "#d32f2f",
    gradient: "linear-gradient(135deg,#d32f2f,#b71c1c)",
  },
  {
    value: "HSA",
    label: "Đánh giá năng lực",
    short: "HSA",
    color: "#1565c0",
    gradient: "linear-gradient(135deg,#1565c0,#0d47a1)",
  },
  {
    value: "THPT",
    label: "Trung học phổ thông quốc gia",
    short: "THPT",
    color: "#e65100",
    gradient: "linear-gradient(135deg,#e65100,#bf360c)",
  },
];

const CAT_TITLES: Record<string, string> = {
  TSA: "KHÓA HỌC ĐÁNH GIÁ TƯ DUY",
  HSA: "KHÓA HỌC ĐÁNH GIÁ NĂNG LỰC",
  THPT: "KHÓA HỌC TRUNG HỌC PHỔ THÔNG",
};

// Placeholder thumbnail gradients khi không có ảnh
const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#f5a623,#e65100)",
  "linear-gradient(135deg,#7b1fa2,#4a148c)",
  "linear-gradient(135deg,#d32f2f,#b71c1c)",
  "linear-gradient(135deg,#1565c0,#0d47a1)",
  "linear-gradient(135deg,#2e7d32,#1b5e20)",
  "linear-gradient(135deg,#37474f,#263238)",
];

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = (searchParams.get("category") ?? "TSA") as CourseCategory;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<Course[]>>(`/api/courses?category=${category}`)
      .then((r) => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [category]);

  const activeCat = CATEGORIES.find((c) => c.value === category)!;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main
          style={{
            padding: "0",
            background: "#fdf0f0",
            minHeight: "calc(100vh - 62px)",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              padding: "12px 28px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.82rem",
              color: "#777",
              background: "#fdf0f0",
            }}
          >
            <Link href="/" style={{ color: "#d32f2f" }}>
              <i className="fas fa-home" />
            </Link>
            <span style={{ color: "#ccc" }}>›</span>
            <span style={{ color: "#2c2c2c", fontWeight: 600 }}>Khóa học</span>
          </div>

          <div
            style={{
              padding: "0 28px 32px",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            {/* LEFT: Category list */}
            <div
              style={{
                width: "230px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#aaa",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  paddingLeft: "4px",
                }}
              >
                DANH MỤC
              </div>

              {CATEGORIES.map((cat) => {
                const active = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() =>
                      router.push(`/courses?category=${cat.value}`)
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      border: active
                        ? "none"
                        : "2px solid transparent",
                      background: active ? cat.gradient : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all .15s",
                      boxShadow: active
                        ? "0 4px 16px rgba(0,0,0,.15)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.background = "#fff8f8";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.background = "#fff";
                    }}
                  >
                    {/* Icon badge */}
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        background: active
                          ? "rgba(255,255,255,0.22)"
                          : cat.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: "0.68rem",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {cat.short}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: active ? "#fff" : "#2c2c2c",
                          lineHeight: 1.3,
                        }}
                      >
                        {cat.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: active ? "rgba(255,255,255,0.7)" : "#aaa",
                          marginTop: "2px",
                        }}
                      >
                        MITAEdu
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Course content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.4rem",
                  color: "#2c2c2c",
                  marginBottom: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                {CAT_TITLES[category] ?? "KHÓA HỌC"}
              </h1>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#888",
                  marginBottom: "20px",
                }}
              >
                {loading
                  ? "Đang tải..."
                  : `${courses.length} khóa học có sẵn`}
              </p>

              {loading ? (
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px",
                    color: "#777",
                    background: "#fff",
                    borderRadius: "16px",
                  }}
                >
                  <i
                    className="fas fa-box-open"
                    style={{
                      fontSize: "3rem",
                      marginBottom: "14px",
                      display: "block",
                      opacity: 0.3,
                    }}
                  />
                  <p>Chưa có khóa học nào trong danh mục này</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    // Snap scrolling
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {courses.map((course, i) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      fallbackGradient={
                        THUMB_GRADIENTS[i % THUMB_GRADIENTS.length]
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

function CourseCard({
  course,
  fallbackGradient,
}: {
  course: Course;
  fallbackGradient: string;
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start" }}
    >
      <div
        style={{ width: "200px", display: "flex", flexDirection: "column", gap: "10px" }}
        onMouseEnter={(e) => {
          const thumb = e.currentTarget.querySelector(
            ".c-thumb"
          ) as HTMLElement;
          if (thumb) thumb.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          const thumb = e.currentTarget.querySelector(
            ".c-thumb"
          ) as HTMLElement;
          if (thumb) thumb.style.transform = "scale(1)";
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: "200px",
            height: "150px",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#e0e0e0",
          }}
        >
          {course.thumbnailUrl ? (
            <img
              className="c-thumb"
              src={course.thumbnailUrl}
              alt={course.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform .2s",
              }}
            />
          ) : (
            <div
              className="c-thumb"
              style={{
                width: "100%",
                height: "100%",
                background: fallbackGradient,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                transition: "transform .2s",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 600,
                  marginBottom: "6px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Chuyên đề
              </div>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: "#fff",
                  textAlign: "center",
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  textShadow: "0 2px 8px rgba(0,0,0,.3)",
                }}
              >
                {/* Show short course name on thumbnail */}
                {course.name.length > 20
                  ? course.name.replace(/^(KHOÁ|KHÓA|CHUYÊN ĐỀ)\s*/i, "").slice(0, 18)
                  : course.name.replace(/^(KHOÁ|KHÓA|CHUYÊN ĐỀ)\s*/i, "")}
              </div>
            </div>
          )}
        </div>

        {/* Course info */}
        <div style={{ padding: "0 2px" }}>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: "0.82rem",
              color: "#2c2c2c",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              lineHeight: 1.4,
              marginBottom: "5px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.name}
          </div>
          {course.teacher && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#888",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <i className="fas fa-user" style={{ fontSize: "0.62rem" }} />
              {course.teacher}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div style={{ width: "200px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          width: "200px", height: "150px", borderRadius: "14px",
          background: "linear-gradient(90deg,#f0d5d5 25%,#ffe8e8 50%,#f0d5d5 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div style={{ padding: "0 2px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ height: "14px", borderRadius: "6px", background: "#f0d5d5", width: "85%" }} />
        <div style={{ height: "12px", borderRadius: "6px", background: "#f0d5d5", width: "55%" }} />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}