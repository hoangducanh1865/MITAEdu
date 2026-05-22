"use client";

import { useEffect, useState } from "react";
import { formatTimer } from "@/lib/utils";

interface Props {
  durationMinutes: number;
  onExpire: () => void;
}

export default function ExamTimer({ durationMinutes, onExpire }: Props) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) { onExpire(); return; }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, onExpire]);

  const pct = seconds / (durationMinutes * 60);
  const color = pct > 0.3 ? "#2e7d32" : pct > 0.1 ? "#e65100" : "#d32f2f";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1.8rem", fontFamily: "Nunito, sans-serif", fontWeight: 900, color, letterSpacing: "2px" }}>
        {formatTimer(seconds)}
      </div>
      <div style={{ height: "4px", background: "#f0d5d5", borderRadius: "2px", marginTop: "6px" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: "2px", transition: "width 1s linear" }} />
      </div>
    </div>
  );
}
