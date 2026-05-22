"use client";

import PracticeLayout from "@/app/practice/layout-wrapper";
import { useState } from "react";

export default function TsaDeTuTaoPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const handleStartExam = () => {
    if (selectedExam) {
      alert("Bắt đầu làm bài!");
      window.location.href = "/practice/exam-taking?name=TSA+Custom+Exam";
    }
  };

  return (
    <PracticeLayout>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "2px solid #f0d5d5",
      }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>
          Kết quả bài làm của tôi - TSA
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#999", marginBottom: "16px" }}>
          Chưa có kết quả nào
        </p>

        <div style={{
          textAlign: "center", padding: "40px 20px", borderRadius: "10px",
          background: "#fafafa", border: "2px dashed #e0e0e0",
        }}>
          <i className="fas fa-book-open" style={{
            fontSize: "2.4rem", color: "#999", marginBottom: "16px", display: "block",
          }} />
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#2c2c2c", marginBottom: "8px" }}>
            Chưa có kết quả nào
          </div>
          <div style={{ fontSize: "0.85rem", color: "#999", marginBottom: "16px" }}>
            Bạn chưa có bài làm nào. Hãy bắt đầu làm bài!
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "inline-block", padding: "10px 24px", borderRadius: "8px",
              background: "#1565c0", color: "#fff", border: "none", fontWeight: 600,
              cursor: "pointer", fontSize: "0.9rem",
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: "8px" }} />
            Bắt đầu làm bài
          </button>
        </div>
      </div>

      {/* Modal tạo đề */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999, display: "flex",
          alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)",
          overflowY: "auto", padding: "20px",
        }}>
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "28px",
            maxWidth: "500px", width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "20px", paddingBottom: "16px", borderBottom: "2px solid #f0d5d5",
            }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#2c2c2c" }}>
                Tạo Đề Thi TSA Mới
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none", border: "none", fontSize: "1.5rem",
                  color: "#999", cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Guide */}
            <div style={{
              background: "#e3f2fd", padding: "12px 14px", borderRadius: "8px",
              marginBottom: "20px", display: "flex", gap: "10px",
            }}>
              <i className="fas fa-file-alt" style={{ color: "#1565c0", marginTop: "2px" }} />
              <div style={{ fontSize: "0.85rem", color: "#0d47a1" }}>
                <div style={{ fontWeight: 600 }}>Tạo đề thi TSA</div>
                <div style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                  Chọn 1 đề để bắt đầu làm bài trắc nghiệm tư duy.
                </div>
              </div>
            </div>

            {/* Exam selection */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "0.85rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "12px",
              }}>
                Chọn đề thi TSA <span style={{ color: "#d32f2f" }}>*</span>
              </div>
              <select
                value={selectedExam || ""}
                onChange={(e) => setSelectedExam(e.target.value)}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0",
                  fontSize: "0.85rem", color: "#666",
                }}
              >
                <option value="">-- Chọn đề --</option>
                <option value="tsa-1">Tư Duy Toán Học 01</option>
                <option value="tsa-2">Tư Duy Toán Học 02</option>
                <option value="tsa-3">Tư Duy Đọc Hiểu 01</option>
                <option value="tsa-4">Tư Duy Khoa Học 01</option>
              </select>
            </div>

            {/* Footer buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc",
                  background: "#fff", color: "#333", fontWeight: 600, cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleStartExam}
                disabled={!selectedExam}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                  background: !selectedExam ? "#ccc" : "#1565c0",
                  color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem",
                }}
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      )}
    </PracticeLayout>
  );
}
