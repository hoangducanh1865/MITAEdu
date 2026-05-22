"use client";

import { useState } from "react";
import type { Lesson } from "@/types";

interface Props {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
  activeId?: number;
}

export default function LessonAccordion({ lessons, onSelect, activeId }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {lessons.map((lesson, i) => {
        const active = lesson.id === activeId;
        return (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson)}
            style={{
              width: "100%", textAlign: "left", background: active ? "#fdf0f0" : "#fff",
              border: active ? "2px solid #d32f2f" : "2px solid #f0d5d5",
              borderRadius: "12px", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: "12px",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <span style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: active ? "#d32f2f" : "#f0d5d5",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: active ? "#fff" : "#777", fontWeight: 700, fontSize: "0.8rem",
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: active ? "#d32f2f" : "#2c2c2c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {lesson.title}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                {lesson.videoUrl && <span style={{ fontSize: "0.72rem", color: "#777" }}><i className="fab fa-youtube" style={{ color: "#ff0000", marginRight: "4px" }} />Video</span>}
                {lesson.pdfPath && <span style={{ fontSize: "0.72rem", color: "#777" }}><i className="fas fa-file-pdf" style={{ color: "#d32f2f", marginRight: "4px" }} />Đề</span>}
                {lesson.handwrittenPdfPath && <span style={{ fontSize: "0.72rem", color: "#777" }}><i className="fas fa-pen" style={{ color: "#777", marginRight: "4px" }} />Viết tay</span>}
              </div>
            </div>
            {active && <i className="fas fa-play" style={{ color: "#d32f2f", fontSize: "0.8rem" }} />}
          </button>
        );
      })}
    </div>
  );
}
