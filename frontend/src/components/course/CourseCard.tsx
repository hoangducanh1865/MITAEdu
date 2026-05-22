"use client";

import Link from "next/link";
import type { Course } from "@/types";

const categoryColors: Record<string, { bg: string; color: string }> = {
  TSA: { bg: "#fce4ec", color: "#c62828" },
  HSA: { bg: "#e3f2fd", color: "#1565c0" },
  THPT: { bg: "#fff3e0", color: "#ff6f00" },
};

export default function CourseCard({ course }: { course: Course }) {
  const colors = categoryColors[course.category] || categoryColors.TSA;

  return (
    <Link href={`/courses/${course.id}`}>
      <div style={{
        background: "#fff",
        border: "2px solid #f0d5d5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s",
        cursor: "pointer",
        height: "100%",
        textDecoration: "none"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}>
        {/* Badge & Count */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px"
        }}>
          <span style={{
            display: "inline-block",
            background: colors.bg,
            color: colors.color,
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            {course.category}
          </span>
          {course.lessonCount && (
            <span style={{
              fontSize: "0.75rem",
              color: "#999"
            }}>
              <i className="fas fa-book" style={{ marginRight: "4px" }} />
              {course.lessonCount} bài
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#2c2c2c",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {course.name}
        </h3>

        {/* Teacher */}
        {course.teacher && (
          <p style={{
            fontSize: "0.8rem",
            color: "#777",
            margin: "0",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <i className="fas fa-chalkboard-teacher" />
            {course.teacher}
          </p>
        )}

        {/* Description */}
        {course.description && (
          <p style={{
            fontSize: "0.8rem",
            color: "#666",
            margin: "4px 0 0 0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {course.description}
          </p>
        )}

        {/* Footer - spacer + button */}
        <div style={{ flex: 1 }} />
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: colors.color,
          fontSize: "0.85rem",
          fontWeight: 600,
          marginTop: "12px"
        }}>
          Xem chi tiết
          <i className="fas fa-arrow-right" />
        </div>
      </div>
    </Link>
  );
}