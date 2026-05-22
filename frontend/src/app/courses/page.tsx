import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/course/CourseCard";
import CoursesCategorySidebar from "@/components/course/CoursesCategorySidebar";
import api from "@/lib/api";
import type { ApiResponse, Course } from "@/types";

async function getCourses(category?: string): Promise<Course[]> {
  try {
    const url = category ? `/api/courses?category=${category}` : "/api/courses";
    const res = await api.get<ApiResponse<Course[]>>(url);
    return res.data.data;
  } catch {
    return [];
  }
}

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const courses = await getCourses(category);

  return (
    <>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "auto 200px 1fr", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar />
        <CoursesCategorySidebar />
        <main style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#d32f2f" }}>
              KHÓA HỌC {category ? `${category}` : ""}
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem", marginTop: "4px" }}>
              {courses.length} khóa học có sẵn
            </p>
          </div>

          {courses.length === 0 ? (
            <div style={{ textAlign: "center", color: "#777", padding: "60px 0", fontSize: "0.95rem" }}>
              <i className="fas fa-box-open" style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }} />
              Chưa có khóa học nào
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "20px" }}>
              {courses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
