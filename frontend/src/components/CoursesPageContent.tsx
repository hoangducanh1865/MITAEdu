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
import {
  COURSE_CATEGORY_CODES,
  getCourseCategoryCode,
  getCourseCategoryFromParam,
} from "@/lib/courseCategory";

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
    short: COURSE_CATEGORY_CODES.TSA,
    color: "#1e7ab8",
    gradient: "linear-gradient(135deg,#1e7ab8,#155f8f)",
  },
  {
    value: "HSA",
    label: "Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)",
    short: COURSE_CATEGORY_CODES.HSA,
    color: "#1565c0",
    gradient: "linear-gradient(135deg,#1565c0,#0d47a1)",
  },
  {
    value: "THPT",
    label: "Khóa Luyện Đề - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)",
    short: COURSE_CATEGORY_CODES.THPT,
    color: "#0e6fa3",
    gradient: "linear-gradient(135deg,#0e6fa3,#0a4f78)",
  },
];

const CAT_TITLES: Record<string, string> = {
  TSA: "KHÓA TRẠI HÈ ĐÁNH THỨC TƯ DUY ĐGNL",
  HSA: "KHÓA NỀN TẢNG V-ACT 2027",
  THPT: "KHÓA LUYỆN ĐỀ V-ACT 2027",
};

const HSA_SUBJECTS = [
  { name: "Toán", prefix: "Toán", icon: "fas fa-calculator", color: "#1565c0", bg: "#e3f2fd", count: 58 },
  { name: "Tiếng Việt", prefix: "Tiếng Việt", icon: "fas fa-book-open", color: "#6a1b9a", bg: "#f3e5f5", count: 23 },
  { name: "Tiếng Anh", prefix: "Tiếng Anh", icon: "fas fa-language", color: "#0277bd", bg: "#e1f5fe", count: 22 },
  { name: "Hóa học", prefix: "Hóa", icon: "fas fa-flask", color: "#2e7d32", bg: "#e8f5e9", count: 23 },
  { name: "Sinh học", prefix: "Sinh học", icon: "fas fa-dna", color: "#00695c", bg: "#e0f2f1", count: 14 },
  { name: "Lịch sử", prefix: "Sử", icon: "fas fa-landmark", color: "#bf360c", bg: "#fbe9e7", count: 16 },
  { name: "Địa lí", prefix: "Địa", icon: "fas fa-globe-asia", color: "#33691e", bg: "#f1f8e9", count: 16 },
  { name: "Vật lí", prefix: "Lí", icon: "fas fa-atom", color: "#4527a0", bg: "#ede7f6", count: 7 },
];

const NEN_TANG_COURSE_THUMBNAIL = "/real/khoa-hoc/khoa-tu-duy-toan-dien-dgnl-2027.jpg";

export default function CoursesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = getCourseCategoryFromParam(searchParams.get("category"));

  const [apiCourses, setApiCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<Course[]>>(`/api/courses?category=${getCourseCategoryCode(category)}`)
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
          className="courses-main"
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
                className="courses-cat-title"
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

              <div className="courses-cat-list" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {CATEGORIES.map((cat) => {
                  const active = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      className="courses-cat-btn"
                      onClick={() =>
                        router.push(`/courses?category=${getCourseCategoryCode(cat.value)}`)
                      }
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "10px",
                        padding: "14px 16px",
                        borderRadius: "14px",
                        border: active
                          ? "none"
                          : "2px solid transparent",
                        background: active ? cat.gradient : "#fff",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all .15s",
                        boxShadow: active
                          ? "0 4px 16px rgba(0,0,0,.15)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          e.currentTarget.style.background = "#f0f7fd";
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          e.currentTarget.style.background = "#fff";
                      }}
                    >
                      <div
                        className="courses-cat-logo"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: active
                            ? "rgba(255,255,255,0.22)"
                            : "#e8f4fd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img src="/logo-mita.png" alt="MITA" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
                      </div>

                      <div
                        className="courses-cat-label"
                        style={{
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: active ? "#fff" : "#2c2c2c",
                          lineHeight: 1.3,
                        }}
                      >
                        {cat.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="courses-content" style={{ flex: 1, minWidth: 0 }}>
              <h1
                className="courses-title"
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
              ) : category === "HSA" ? (
                courses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px" }}>
                    <i className="fas fa-box-open" style={{ fontSize: "3rem", marginBottom: "14px", display: "block", opacity: 0.3 }} />
                    <p>Khóa học đang được chuẩn bị, vui lòng quay lại sau</p>
                  </div>
                ) : (
                  <div className="courses-subject-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                    {HSA_SUBJECTS.map((subject) => (
                      <Link
                        key={subject.name}
                        href={`/courses/${courses[0].id}?subject=${encodeURIComponent(subject.prefix)}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="courses-subject-card" style={{
                          background: "#fff", border: "2px solid #e8f0f7", borderRadius: "16px",
                          padding: "24px 20px", display: "flex", flexDirection: "column",
                          alignItems: "center", gap: "12px", cursor: "pointer",
                          transition: "all .15s", textAlign: "center",
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = subject.color;
                            e.currentTarget.style.boxShadow = `0 4px 16px ${subject.color}22`;
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e8f0f7";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <div className="courses-subject-icon" style={{
                            width: "56px", height: "56px", borderRadius: "14px",
                            background: subject.bg, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem", color: subject.color,
                          }}>
                            <i className={subject.icon} />
                          </div>
                          <div>
                            <div className="courses-subject-name" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2c2c2c" }}>
                              {subject.name}
                            </div>
                            <div className="courses-subject-count" style={{ fontSize: "0.78rem", color: "#999", marginTop: "4px" }}>
                              {subject.count} bài học
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : courses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px" }}>
                  <i className="fas fa-box-open" style={{ fontSize: "3rem", marginBottom: "14px", display: "block", opacity: 0.3 }} />
                  <p>Chưa có khóa học nào trong danh mục này</p>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px", scrollSnapType: "x mandatory" }}>
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
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
  const thumbnailUrl = getCourseThumbnail(course);

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
          {thumbnailUrl ? (
            <img
              className="c-thumb"
              src={thumbnailUrl}
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

function getCourseThumbnail(course: any) {
  if (course.thumbnailUrl) return course.thumbnailUrl;
  if (course.id === 1
    || course.slug === "khoa-nen-tang-vact-2027"
    || String(course.name ?? "").includes("Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027")) {
    return NEN_TANG_COURSE_THUMBNAIL;
  }
  return undefined;
}
