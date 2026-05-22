"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import type { ApiResponse, Schedule } from "@/types";

const DAY_LABELS = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];
const DAY_KEYS = [2, 3, 4, 5, 6, 7, 1]; // Mon=2..Sun=1 matching backend
const PERIODS = [
  { key: "MORNING", label: "Sáng" },
  { key: "AFTERNOON", label: "Chiều" },
  { key: "EVENING", label: "Tối" },
];

type TabType = "personal" | "general";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("general");

  useEffect(() => {
    api.get<ApiResponse<Schedule[]>>("/api/schedules")
      .then((r) => setSchedules(r.data.data))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, []);

  // Group schedules: byDay[dayOfWeek][period] = Schedule[]
  const byDay: Record<number, Record<string, Schedule[]>> = {};
  schedules.forEach((s) => {
    if (!byDay[s.dayOfWeek]) byDay[s.dayOfWeek] = {};
    if (!byDay[s.dayOfWeek][s.period]) byDay[s.dayOfWeek][s.period] = [];
    byDay[s.dayOfWeek][s.period].push(s);
  });

  const totalCourses = new Set(schedules.map((s) => s.lessonCourse).filter(Boolean)).size;
  const todayDow = new Date().getDay(); // 0=Sun,1=Mon..6=Sat
  // Convert JS DOW to our DOW: Mon=2..Sun=1
  const todayKey = todayDow === 0 ? 1 : todayDow + 1;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px", background: "#fdf0f0", minHeight: "calc(100vh - 62px)" }}>

          {/* Hero banner */}
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "36px 48px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
            border: "2px solid #f0d5d5",
          }}>
            {/* Decorative elements */}
            <div style={{
              position: "absolute", left: "32px", top: "50%", transform: "translateY(-50%)",
              width: "80px", height: "40px", background: "#fce4ec", borderRadius: "50%", opacity: 0.8,
            }} />
            <div style={{
              position: "absolute", right: "60px", top: "50%", transform: "translateY(-50%)",
              fontSize: "2.5rem", color: "#f0d5d5", fontWeight: 900, letterSpacing: "-2px",
            }}>
              ✳
            </div>

            <div style={{ textAlign: "center", position: "relative" }}>
              <h1 style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 900,
                fontSize: "2rem", color: "#d32f2f",
                letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px",
              }}>
                THỜI KHÓA BIỂU
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#888" }}>
                {activeTab === "personal"
                  ? "Lịch học cá nhân - chỉ hiện các môn bạn đang theo học (0 khóa)"
                  : `Thời khóa biểu chung - hiển thị tất cả các khóa (${totalCourses} khóa)`
                }
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{
              background: "#fff", borderRadius: "30px", padding: "4px",
              display: "flex", gap: "2px", border: "2px solid #f0d5d5",
            }}>
              <TabBtn active={activeTab === "personal"} onClick={() => setActiveTab("personal")} color="#d32f2f">
                Thời khóa biểu cá nhân
              </TabBtn>
              <TabBtn active={activeTab === "general"} onClick={() => setActiveTab("general")} color="#d32f2f">
                Thời khóa biểu chung
              </TabBtn>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#d32f2f" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} />
            </div>
          ) : activeTab === "personal" ? (
            /* Personal tab — empty state */
            <div style={{
              background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5",
              padding: "80px 40px", textAlign: "center",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px", opacity: 0.3 }}>📋</div>
              <p style={{ color: "#999", fontSize: "0.9rem" }}>
                Bạn chưa có buổi học nào trong thời khóa biểu cá nhân.
              </p>
            </div>
          ) : (
            /* General timetable */
            <div style={{ background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5", overflow: "hidden" }}>
              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "80px repeat(7, 1fr)",
              }}>
                <div style={{ background: "#fff", padding: "14px" }} />
                {DAY_LABELS.map((label, i) => {
                  const isToday = DAY_KEYS[i] === todayKey;
                  return (
                    <div key={label} style={{
                      background: isToday ? "#f5a623" : "#d32f2f",
                      color: "#fff",
                      padding: "14px 8px",
                      textAlign: "center",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      borderLeft: "1px solid rgba(255,255,255,0.2)",
                    }}>
                      {label}
                    </div>
                  );
                })}
              </div>

              {/* Period rows */}
              {PERIODS.map((period, pi) => (
                <div key={period.key} style={{
                  display: "grid",
                  gridTemplateColumns: "80px repeat(7, 1fr)",
                  borderTop: "2px solid #f0d5d5",
                  minHeight: "120px",
                }}>
                  {/* Period label */}
                  <div style={{
                    background: "#d32f2f",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    letterSpacing: "2px",
                    borderTop: pi > 0 ? "2px solid rgba(255,255,255,0.2)" : "none",
                  }}>
                    {period.label}
                  </div>

                  {/* Day cells */}
                  {DAY_KEYS.map((dayKey, di) => {
                    const items = byDay[dayKey]?.[period.key] ?? [];
                    const isToday = dayKey === todayKey;
                    return (
                      <div key={di} style={{
                        padding: "8px 6px",
                        borderLeft: "1px solid #f0d5d5",
                        background: isToday ? "#fffbf0" : "#fff",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        minHeight: "120px",
                      }}>
                        {items.length === 0 ? (
                          /* Empty cell placeholder */
                          <div style={{
                            height: "32px", borderRadius: "8px",
                            background: "#fdf0f0", opacity: 0.5,
                          }} />
                        ) : (
                          items.map((s) => (
                            <ScheduleItem key={s.id} schedule={s} isToday={isToday} />
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

function ScheduleItem({ schedule, isToday }: { schedule: Schedule; isToday: boolean }) {
  return (
    <div style={{
      background: isToday ? "#fff8f0" : "#fdf0f0",
      border: isToday ? "1.5px solid #f5a623" : "1.5px solid #f0d5d5",
      borderRadius: "8px",
      padding: "8px 10px",
    }}>
      <div style={{
        fontSize: "0.75rem", fontWeight: 700,
        color: isToday ? "#e65100" : "#d32f2f",
        lineHeight: 1.3, marginBottom: "3px",
      }}>
        {schedule.lessonTitle}
      </div>
      {schedule.lessonCourse && (
        <div style={{ fontSize: "0.68rem", color: "#999", lineHeight: 1.2 }}>
          {schedule.lessonCourse}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, color, children }: {
  active: boolean; onClick: () => void; color: string; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 22px",
      borderRadius: "24px",
      border: "none",
      background: active ? color : "transparent",
      color: active ? "#fff" : "#777",
      fontWeight: 700,
      fontSize: "0.85rem",
      cursor: "pointer",
      transition: "all .18s",
    }}>
      {children}
    </button>
  );
}
