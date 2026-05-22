import Link from "next/link";
import type { Exam } from "@/types";
import Badge from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";

export default function ExamCard({ exam }: { exam: Exam }) {
  return (
    <div style={{
      background: "#fff", border: "2px solid #f0d5d5", borderRadius: "14px",
      padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
          <Badge variant={exam.status === "PUBLISHED" ? "published" : "draft"}>
            {exam.status === "PUBLISHED" ? "Công bố" : "Bản nháp"}
          </Badge>
          <span style={{ fontSize: "0.74rem", color: "#777" }}>
            <i className="fas fa-clock" style={{ marginRight: "4px" }} />{formatDuration(exam.durationMinutes)}
          </span>
          <span style={{ fontSize: "0.74rem", color: "#777" }}>
            <i className="fas fa-question-circle" style={{ marginRight: "4px" }} />{exam.questionCount} câu
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#2c2c2c" }}>{exam.title}</div>
      </div>
      <Link href={`/exam/${exam.id}/confirm`} style={{
        background: "#d32f2f", color: "#fff", borderRadius: "10px",
        padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600,
        display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
      }}>
        <i className="fas fa-play" /> Làm bài
      </Link>
    </div>
  );
}
