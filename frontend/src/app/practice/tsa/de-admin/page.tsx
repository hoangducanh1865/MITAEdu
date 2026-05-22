"use client";

import PracticeLayout from "@/app/practice/layout-wrapper";

export default function TsaDeAdminPage() {
  return (
    <PracticeLayout>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "2px solid #f0d5d5", minHeight: "400px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <i className="fas fa-user-shield" style={{
          fontSize: "3rem", color: "#1565c0", marginBottom: "16px",
        }} />
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>
          Đề Admin Tạo - TSA
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#999", textAlign: "center" }}>
          Danh sách các đề thi do Admin tạo
        </p>
      </div>
    </PracticeLayout>
  );
}
