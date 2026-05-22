"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Course, CourseCategory } from "@/types";
import { LOCAL_COURSES } from "@/lib/localCourses";

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

const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#f5a623,#e65100)",
  "linear-gradient(135deg,#7b1fa2,#4a148c)",
  "linear-gradient(135deg,#d32f2f,#b71c1c)",
  "linear-gradient(135deg,#1565c0,#0d47a1)",
  "linear-gradient(135deg,#2e7d32,#1b5e20)",
  "linear-gradient(135deg,#37474f,#263238)",
];

export default function CoursesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = (searchParams.get("category") ?? "TSA") as CourseCategory;

  const [apiCourses, setApiCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<Course[]>>(`/api/courses?category=${category}`)
      .then((r) => setApiCourses(r.data.data || []))
      .catch(() => setApiCourses([]))
      .finally(() => setLoading(false));
  }, [category]);

  const localForCategory = LOCAL_COURSES.filter((c) => c.category === category);

  const courses = [
    ...localForCategory.map((lc, i) => ({
      id: lc.id as unknown as number,
      name: lc.name,
      slug: lc.id,
      category: lc.category,
      teacher: lc.teacher,
      thumbnailUrl: undefined,
      thumbnailGradient: lc.thumbnailGradient,
      thumbnailLabel: lc.thumbnailLabel,
      description: lc.description,
      createdAt: "",
      lessonCount: lc.sessions.reduce((acc, s) => acc + s.lessons.length, 0),
      isLocal: true,
    })),
    ...apiCourses.map((c) => ({ ...c, isLocal: false, thumbnailGradient: undefined, thumbnailLabel: undefined })),
  ];

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
                <div style={{ textAlign: "center", padding: "40px", color: "#d32f2f" }}>
                  <i className="fas fa-spinner fa-spin" />
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
  course: any;
  fallbackGradient: string;
}) {
  const href = `/courses/${course.slug ?? course.id}`;
  const bg = course.thumbnailGradient ?? fallbackGradient;

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start" }}
    >
      <div
        style={{ width: "200px", display: "flex", flexDirection: "column", gap: "10px" }}
        onMouseEnter={(e) => {
          const thumb = e.currentTarget.querySelector(".c-thumb") as HTMLElement;
          if (thumb) thumb.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          const thumb = e.currentTarget.querySelector(".c-thumb") as HTMLElement;
          if (thumb) thumb.style.transform = "scale(1)";
        }}
      >
        <div style={{ width: "200px", height: "150px", borderRadius: "14px", overflow: "hidden", background: "#e0e0e0" }}>
          {course.thumbnailUrl ? (
            <img
              className="c-thumb"
              src={course.thumbnailUrl}
              alt={course.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .2s" }}
            />
          ) : (
            <div
              className="c-thumb"
              style={{
                width: "100%", height: "100%",
                background: bg,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "12px", transition: "transform .2s",
              }}
            >
              {course.thumbnailLabel ? (
                <div style={{
                  fontFamily: "Nunito, sans-serif", fontWeight: 900,
                  fontSize: "1rem", color: "#fff",
                  textAlign: "center", lineHeight: 1.25,
                  textTransform: "uppercase", letterSpacing: "1px",
                  textShadow: "0 2px 8px rgba(0,0,0,.4)",
                  whiteSpace: "pre-line",
                }}>
                  {course.thumbnailLabel}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Chuyên đề
                  </div>
                  <div style={{
                    fontFamily: "Nunito, sans-serif", fontWeight: 900,
                    fontSize: "1.1rem", color: "#fff", textAlign: "center",
                    lineHeight: 1.2, textTransform: "uppercase",
                    letterSpacing: "0.5px", textShadow: "0 2px 8px rgba(0,0,0,.3)",
                  }}>
                    {course.name.length > 20
                      ? course.name.replace(/^(KHOÁ|KHÓA|CHUYÊN ĐỀ)\s*/i, "").slice(0, 18)
                      : course.name.replace(/^(KHOÁ|KHÓA|CHUYÊN ĐỀ)\s*/i, "")}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: "0 2px" }}>
          <div style={{
            fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem",
            color: "#2c2c2c", textTransform: "uppercase", letterSpacing: "0.3px",
            lineHeight: 1.4, marginBottom: "5px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
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
  );
}
