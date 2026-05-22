"use client";

import dynamic from "next/dynamic";
import type { Lesson } from "@/types";

const ReactPlayer = dynamic(() => import("react-player/youtube"), { ssr: false });

interface Props {
  lesson: Lesson;
}

export default function VideoPlayer({ lesson }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {lesson.videoUrl ? (
        <div style={{ borderRadius: "16px", overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
          <ReactPlayer url={lesson.videoUrl} width="100%" height="100%" controls />
        </div>
      ) : (
        <div style={{
          borderRadius: "16px", background: "#f5f5f5", aspectRatio: "16/9",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px",
        }}>
          <i className="fas fa-video-slash" style={{ fontSize: "2.5rem", color: "#bbb" }} />
          <p style={{ color: "#999", fontSize: "0.875rem" }}>Bài học này chưa có video</p>
        </div>
      )}

      {/* PDFs */}
      {(lesson.pdfPath || lesson.handwrittenPdfPath) && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {lesson.pdfPath && (
            <a href={lesson.pdfPath} target="_blank" rel="noopener noreferrer" style={pdfBtnStyle("#d32f2f")}>
              <i className="fas fa-file-pdf" /> Tải đề bài (PDF)
            </a>
          )}
          {lesson.handwrittenPdfPath && (
            <a href={lesson.handwrittenPdfPath} target="_blank" rel="noopener noreferrer" style={pdfBtnStyle("#777")}>
              <i className="fas fa-pen" /> Tải file viết tay
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function pdfBtnStyle(color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "#fdf0f0", border: `2px solid ${color}33`,
    color, borderRadius: "10px", padding: "9px 18px",
    fontSize: "0.85rem", fontWeight: 600,
  };
}
