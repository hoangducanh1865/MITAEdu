"use client";

import type { Question } from "@/types";

interface Props {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
}

const OPTIONS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
const OPTION_LABELS = { A: "optionA", B: "optionB", C: "optionC", D: "optionD" } as const;

export default function QuestionCard({ question, questionNumber, selectedAnswer, onSelect }: Props) {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <span style={{ display: "inline-block", background: "#d32f2f", color: "#fff", borderRadius: "8px", padding: "4px 12px", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px" }}>
          Câu {questionNumber}
        </span>
        <div
          style={{ fontSize: "1rem", lineHeight: 1.7, color: "#2c2c2c" }}
          dangerouslySetInnerHTML={{ __html: question.text.replace(/\n/g, "<br/>") }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {OPTIONS.map((opt) => {
          const key = OPTION_LABELS[opt];
          const text = question[key as keyof Question] as string;
          const selected = selectedAnswer === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                width: "100%", textAlign: "left", padding: "14px 16px",
                borderRadius: "12px", border: "2px solid",
                borderColor: selected ? "#d32f2f" : "#f0d5d5",
                background: selected ? "#fdf0f0" : "#fff",
                cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "12px",
                transition: "all .15s",
              }}
            >
              <span style={{
                width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                background: selected ? "#d32f2f" : "#f0d5d5",
                color: selected ? "#fff" : "#777",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.85rem",
              }}>
                {opt}
              </span>
              <span style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "#2c2c2c", paddingTop: "4px" }}
                dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br/>") }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
