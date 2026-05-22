"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import type { ApiResponse, Exam, SubmissionDto } from "@/types";
import { formatDuration } from "@/lib/utils";
import type { User } from "@/types";
import Button from "@/components/ui/Button";
import { getSavedUser as getUser } from "@/lib/auth";

export default function ExamConfirmPage() {
  const { examId } = useParams() as { examId: string };
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const user = getUser<User>();

  useEffect(() => {
    api.get<ApiResponse<Exam>>(`/api/exams/${examId}`)
      .then((r) => setExam(r.data.data))
      .finally(() => setLoading(false));
  }, [examId]);

  async function startExam() {
    setStarting(true);
    try {
      await api.post<ApiResponse<SubmissionDto>>(`/api/exams/${examId}/start`);
      router.push(`/exam/${examId}/taking`);
    } catch {
      setStarting(false);
    }
  }

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: "80px", color: "#d32f2f" }}><i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} /></div></>;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 62px)", background: "#fdf0f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 30px rgba(211,47,47,.12)", padding: "40px 48px", width: "520px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fdf0f0", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-file-alt" style={{ fontSize: "1.8rem", color: "#d32f2f" }} />
            </div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c" }}>
              Xác nhận thi
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem", marginTop: "6px" }}>{exam?.title}</p>
          </div>

          {/* Exam info */}
          <div style={{ background: "#fdf0f0", borderRadius: "14px", padding: "20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <InfoRow icon="fa-user" label="Thí sinh" value={user?.name ?? "—"} />
            <InfoRow icon="fa-envelope" label="Email" value={user?.email ?? "—"} />
            <InfoRow icon="fa-clock" label="Thời gian" value={exam ? formatDuration(exam.durationMinutes) : "—"} />
            <InfoRow icon="fa-question-circle" label="Số câu hỏi" value={exam ? `${exam.questionCount} câu` : "—"} />
            <InfoRow icon="fa-layer-group" label="Số phần" value={exam ? `${exam.partCount} phần` : "—"} />
          </div>

          {/* Warning */}
          <div style={{ background: "#fff3e0", border: "1px solid #ffcc80", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", fontSize: "0.82rem", color: "#e65100" }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }} />
            Sau khi bắt đầu, đồng hồ đếm ngược sẽ chạy và không thể dừng lại. Hãy đảm bảo bạn đã sẵn sàng!
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="secondary" onClick={() => router.back()} className="flex-1">
              <i className="fas fa-arrow-left" /> Quay lại
            </Button>
            <Button onClick={startExam} loading={starting} className="flex-1">
              <i className="fas fa-play" /> Bắt đầu thi
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" }}>
      <span style={{ color: "#777", display: "flex", alignItems: "center", gap: "8px" }}>
        <i className={`fas ${icon}`} style={{ width: "16px", color: "#d32f2f" }} />{label}
      </span>
      <span style={{ fontWeight: 600, color: "#2c2c2c" }}>{value}</span>
    </div>
  );
}
