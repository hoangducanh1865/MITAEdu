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
              width: "100%", textAlign: "left", background: active ? "var(--bg-muted)" : "var(--bg-surface)",
              border: active ? "2px solid var(--blue)" : "2px solid var(--border)",
              borderRadius: "12px", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: "12px",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <span style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: active ? "var(--blue)" : "var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: active ? "#fff" : "var(--text-muted)", fontWeight: 700, fontSize: "0.8rem",
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: active ? "var(--blue)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {lesson.title}
              </div>
              {lesson.description && (
                <div style={{ fontSize: "0.72rem", color: active ? "var(--blue)" : "var(--text-soft)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.85 }}>
                  {lesson.description.split(" | ")[0]}
                </div>
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                {(lesson.videoUrl || lesson.videoMediaId) && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}><i className="fas fa-video" style={{ color: "var(--blue)", marginRight: "3px" }} />Video</span>}
                {(lesson.pdfPath || lesson.pdfMediaId) && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}><i className="fas fa-file-pdf" style={{ color: "#e53935", marginRight: "3px" }} />Đề</span>}
                {(lesson.handwrittenPdfPath || lesson.handwrittenMediaId) && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}><i className="fas fa-pen" style={{ color: "var(--text-muted)", marginRight: "3px" }} />Viết tay</span>}
                {lesson.answerMediaId && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}><i className="fas fa-clipboard-check" style={{ color: "var(--success)", marginRight: "3px" }} />Đáp án</span>}
              </div>
            </div>
            {active && <i className="fas fa-play" style={{ color: "var(--blue)", fontSize: "0.8rem" }} />}
          </button>
        );
      })}
    </div>
  );
}
