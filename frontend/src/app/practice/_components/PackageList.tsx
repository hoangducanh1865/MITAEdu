"use client";

import { useEffect, useState } from "react";
import PackageCard from "@/components/practice/PackageCard";
import api from "@/lib/api";
import type { ApiResponse, ExamPackage } from "@/types";

interface Props {
  tag: "TSA" | "HSA";
  title: string;
  icon: string;
  color: string;
}

export default function PackageList({ tag, title, icon, color }: Props) {
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<ExamPackage[]>>(`/api/exam-packages?tag=${tag}`)
      .then((r) => setPackages(r.data.data))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ width: "44px", height: "44px", borderRadius: "12px", background: tag === "TSA" ? "#e3f2fd" : "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: "1.2rem" }}>
          <i className={`fas ${icon}`} />
        </span>
        <div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color }}>{title}</h1>
          <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "2px" }}>Chọn bộ đề để bắt đầu luyện tập</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem" }} />
        </div>
      ) : packages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#777" }}>
          <i className="fas fa-box-open" style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }} />
          Chưa có bộ đề nào
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              examHref={(id) => `/exam/${id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
