import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import type { ApiResponse, Schedule } from "@/types";
import { DAY_NAMES, PERIOD_NAMES } from "@/lib/utils";

async function getSchedules(): Promise<Schedule[]> {
  try {
    const res = await api.get<ApiResponse<Schedule[]>>("/api/schedules");
    return res.data.data;
  } catch { return []; }
}

const PERIOD_COLOR: Record<string, { bg: string; color: string }> = {
  MORNING:   { bg: "#fff3e0", color: "#e65100" },
  AFTERNOON: { bg: "#e3f2fd", color: "#1565c0" },
  EVENING:   { bg: "#f3e5f5", color: "#6a1b9a" },
};

export default async function SchedulePage() {
  const schedules = await getSchedules();
  const byDay: Record<number, Schedule[]> = {};
  schedules.forEach((s) => {
    if (!byDay[s.dayOfWeek]) byDay[s.dayOfWeek] = [];
    byDay[s.dayOfWeek].push(s);
  });

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#e65100" }}>
              <i className="fas fa-calendar-alt" style={{ marginRight: "10px" }} />Thời Khóa Biểu
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem", marginTop: "4px" }}>Lịch học hàng tuần</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "12px" }}>
            {[2, 3, 4, 5, 6, 7, 1].map((day) => (
              <div key={day}>
                <div style={{
                  background: "#d32f2f", color: "#fff", borderRadius: "10px 10px 0 0",
                  padding: "8px 12px", textAlign: "center", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.85rem",
                }}>
                  {DAY_NAMES[day]}
                </div>
                <div style={{ border: "2px solid #f0d5d5", borderTop: "none", borderRadius: "0 0 10px 10px", minHeight: "120px", padding: "8px", background: "#fff" }}>
                  {(byDay[day] ?? []).map((s) => {
                    const c = PERIOD_COLOR[s.period] ?? { bg: "#fdf0f0", color: "#d32f2f" };
                    return (
                      <div key={s.id} style={{
                        background: c.bg, borderRadius: "8px", padding: "8px 10px",
                        marginBottom: "6px", borderLeft: `3px solid ${c.color}`,
                      }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: c.color, marginBottom: "3px" }}>
                          {PERIOD_NAMES[s.period]}
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2c2c2c", lineHeight: 1.3 }}>
                          {s.lessonTitle}
                        </div>
                        {s.lessonCourse && (
                          <div style={{ fontSize: "0.65rem", color: "#777", marginTop: "2px" }}>{s.lessonCourse}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
