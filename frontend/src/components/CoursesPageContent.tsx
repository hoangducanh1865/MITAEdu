"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import api from "@/lib/api";
import type { ApiResponse, Course, CourseCategory } from "@/types";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const CATEGORIES: {
  value: CourseCategory;
  label: string;
  short: string;
  color: string;
  gradient: string;
}[] = [
  {
    value: "TSA",
    label: "Khóa Trại hè Đánh thức tư duy ĐGNL",
    short: "TSA",
    color: "#1e7ab8",
    gradient: "linear-gradient(135deg,#1e7ab8,#155f8f)",
  },
  {
    value: "HSA",
    label: "Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)",
    short: "HSA",
    color: "#1565c0",
    gradient: "linear-gradient(135deg,#1565c0,#0d47a1)",
  },
  {
    value: "THPT",
    label: "Khóa Luyện Đề - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)",
    short: "THPT",
    color: "#e65100",
    gradient: "linear-gradient(135deg,#e65100,#bf360c)",
  },
];

const CAT_TITLES: Record<string, string> = {
  TSA: "KHÓA TRẠI HÈ ĐÁNH THỨC TƯ DUY ĐGNL",
  HSA: "KHÓA NỀN TẢNG V-ACT 2027",
  THPT: "KHÓA LUYỆN ĐỀ V-ACT 2027",
};


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

  const courses = apiCourses;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main
          style={{
            padding: "0",
            background: "#f0f7fd",
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
              background: "#f0f7fd",
            }}
          >
            <Link href="/" style={{ color: "#1e7ab8" }}>
              <i className="fas fa-home" />
            </Link>
            <span style={{ color: "#ccc" }}>›</span>
            <span style={{ color: "#2c2c2c", fontWeight: 600 }}>Khóa học</span>
          </div>

          <div
            className="courses-layout"
            style={{
              padding: "0 28px 32px",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            <div
              className="courses-cat-sidebar"
              style={{
                width: "290px",
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
                    className="courses-cat-btn"
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
                          : "#e8f4fd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img src="/logo-mita.png" alt="MITA" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.8rem",
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
                <div style={{ textAlign: "center", padding: "40px", color: "#1e7ab8" }}>
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
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
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

function CourseCard({ course }: { course: any }) {
  const href = `/courses/${course.slug ?? course.id}`;

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
            <ImagePlaceholder
              width="100%"
              height="100%"
              desc={"Thumbnail khóa học\n200×150px | JPG/PNG"}
              style={{ borderRadius: 0 }}
            />
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
