import Link from "next/link";
import type { Course } from "@/types";
import Badge from "@/components/ui/Badge";

const CATEGORY_COLORS: Record<string, string> = {
  TSA: "#1565c0", HSA: "#2e7d32", THPT: "#e65100",
};
const CATEGORY_BG: Record<string, string> = {
  TSA: "#e3f2fd", HSA: "#e8f5e9", THPT: "#fff3e0",
};

export default function CourseCard({ course }: { course: Course }) {
  const color = CATEGORY_COLORS[course.category] ?? "#d32f2f";
  const bg = CATEGORY_BG[course.category] ?? "#fdf0f0";

  return (
    <Link href={`/courses/${course.id}`} style={{
      background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "box-shadow .18s, border-color .18s",
    }}>
      {/* Thumbnail */}
      <div style={{
        height: "140px", background: `linear-gradient(135deg,${color}dd,${color})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "8px", color: "#fff",
      }}>
        <i className="fas fa-graduation-cap" style={{ fontSize: "2.5rem", opacity: 0.7 }} />
        <span style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.9 }}>{course.category}</span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Badge variant={course.category.toLowerCase() as "tsa" | "hsa" | "thpt"}>
            {course.category}
          </Badge>
          <span style={{ fontSize: "0.75rem", color: "#777" }}>
            <i className="fas fa-book" style={{ marginRight: "4px" }} />{course.lessonCount} bài
          </span>
        </div>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#2c2c2c", lineHeight: 1.4 }}>
          {course.name}
        </h3>
        {course.teacher && (
          <p style={{ fontSize: "0.8rem", color: "#777" }}>
            <i className="fas fa-chalkboard-teacher" style={{ marginRight: "6px", color }} />
            {course.teacher}
          </p>
        )}
        {course.description && (
          <p style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {course.description}
          </p>
        )}
      </div>
    </Link>
  );
}
