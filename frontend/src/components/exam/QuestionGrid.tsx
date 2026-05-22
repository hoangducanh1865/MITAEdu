"use client";

interface Props {
  total: number;
  answers: Record<number, string>;
  currentIndex: number;
  onJump: (index: number) => void;
}

export default function QuestionGrid({ total, answers, currentIndex, onJump }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {Array.from({ length: total }, (_, i) => {
        const answered = answers[i + 1] !== undefined;
        const current = i === currentIndex;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            style={{
              width: "36px", height: "36px", borderRadius: "8px", border: "2px solid",
              borderColor: current ? "#d32f2f" : answered ? "#4caf50" : "#f0d5d5",
              background: current ? "#d32f2f" : answered ? "#e8f5e9" : "#fff",
              color: current ? "#fff" : answered ? "#2e7d32" : "#777",
              fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
