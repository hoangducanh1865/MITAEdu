"use client";

import PracticeLayout from "@/app/practice/layout-wrapper";
import { useState } from "react";

export default function HsaDeTuTaoPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedToán, setSelectedToán] = useState<string | null>(null);
  const [selectedVăn, setSelectedVăn] = useState<string | null>(null);
  const [selectedTA, setSelectedTA] = useState<string | null>(null);
  const [selectedKH, setSelectedKH] = useState<string[]>([]);
  const [useKH, setUseKH] = useState(false);

  const handleStartExam = () => {
    if (selectedToán && selectedVăn && (useKH ? selectedKH.length === 3 : selectedTA)) {
      alert("Bắt đầu làm bài!");
      window.location.href = "/practice/exam-taking?name=HSA+Custom+Exam";
    }
  };

  return (
    <PracticeLayout>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "24px",
        border: "2px solid #f0d5d5",
      }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px" }}>
          Kết quả bài làm của tôi - HSA
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
              background: "#2e7d32", color: "#fff", border: "none", fontWeight: 600,
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
                Tạo Đề Thi HSA Mới
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
              background: "#e8f5e9", padding: "12px 14px", borderRadius: "8px",
              marginBottom: "20px", display: "flex", gap: "10px",
            }}>
              <i className="fas fa-book-open" style={{ color: "#2e7d32", marginTop: "2px" }} />
              <div style={{ fontSize: "0.85rem", color: "#1b5e20" }}>
                <div style={{ fontWeight: 600 }}>Tạo đề thi HSA</div>
                <div style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                  Chọn đề theo cấu trúc: 1 đề Toán, 1 đề Văn, và 1 đề Tiếng Anh HOẶC 3 đề Khoa học.
                </div>
              </div>
            </div>

            {/* SECTION 1: Toán */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: "0.85rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px",
              }}>
                1. Tư duy định lượng <span style={{ fontSize: "0.75rem", color: "#999" }}>(1 đề Toán)</span> <span style={{ color: "#d32f2f" }}>*</span>
              </div>
              <select
                value={selectedToán || ""}
                onChange={(e) => setSelectedToán(e.target.value)}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0",
                  fontSize: "0.85rem", color: "#666",
                }}
              >
                <option value="">-- Chọn đề Toán --</option>
                <option value="toan-1">Đề Toán 1</option>
                <option value="toan-2">Đề Toán 2</option>
                <option value="toan-3">Đề Toán 3</option>
              </select>
            </div>

            {/* SECTION 2: Văn */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: "0.85rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "8px",
              }}>
                2. Tư duy định tính <span style={{ fontSize: "0.75rem", color: "#999" }}>(1 đề Văn)</span> <span style={{ color: "#d32f2f" }}>*</span>
              </div>
              <select
                value={selectedVăn || ""}
                onChange={(e) => setSelectedVăn(e.target.value)}
                style={{
                  width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0",
                  fontSize: "0.85rem", color: "#666",
                }}
              >
                <option value="">-- Chọn đề Văn --</option>
                <option value="van-1">Đề Văn 1</option>
                <option value="van-2">Đề Văn 2</option>
                <option value="van-3">Đề Văn 3</option>
              </select>
            </div>

            {/* SECTION 3: Khoa học / Tiếng Anh */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "0.85rem", fontWeight: 700, color: "#2c2c2c", marginBottom: "12px",
              }}>
                3. Tư duy khoa học/tiếng anh <span style={{ color: "#d32f2f" }}>*</span>
              </div>

              {/* Option 1: Tiếng Anh */}
              <label style={{
                display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px",
                cursor: "pointer", fontSize: "0.85rem",
              }}>
                <input
                  type="radio"
                  checked={!useKH}
                  onChange={() => setUseKH(false)}
                  style={{ cursor: "pointer" }}
                />
                <span><strong>TH1:</strong> <span style={{ fontSize: "0.75rem", color: "#999" }}>1 đề Tiếng Anh</span></span>
              </label>

              {!useKH && (
                <select
                  value={selectedTA || ""}
                  onChange={(e) => setSelectedTA(e.target.value)}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0",
                    fontSize: "0.85rem", color: "#666", marginBottom: "12px",
                  }}
                >
                  <option value="">-- Chọn đề Tiếng Anh --</option>
                  <option value="ta-1">Đề Tiếng Anh 1</option>
                  <option value="ta-2">Đề Tiếng Anh 2</option>
                </select>
              )}

              {/* Divider */}
              <div style={{
                textAlign: "center", fontSize: "0.75rem", color: "#999", margin: "12px 0",
              }}>
                --- HOẶC ---
              </div>

              {/* Option 2: Khoa học */}
              <label style={{
                display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px",
                cursor: "pointer", fontSize: "0.85rem",
              }}>
                <input
                  type="radio"
                  checked={useKH}
                  onChange={() => setUseKH(true)}
                  style={{ cursor: "pointer" }}
                />
                <span><strong>TH2:</strong> <span style={{ fontSize: "0.75rem", color: "#999" }}>3 đề Khoa học (Lý, Hóa, Sinh, Sử, Địa) <strong>{selectedKH.length}/3</strong></span></span>
              </label>

              {useKH && (
                <>
                  <select
                    multiple
                    value={selectedKH}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value).slice(0, 3);
                      setSelectedKH(selected);
                    }}
                    style={{
                      width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0",
                      fontSize: "0.85rem", color: "#666", minHeight: "80px",
                    }}
                  >
                    <option value="ly">Đề Vật Lý</option>
                    <option value="hoa">Đề Hóa Học</option>
                    <option value="sinh">Đề Sinh Học</option>
                    <option value="su">Đề Sử</option>
                    <option value="dia">Đề Địa Lý</option>
                  </select>
                  {selectedKH.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {selectedKH.map((kh) => (
                        <div
                          key={kh}
                          style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: "#e8f5e9", color: "#2e7d32", padding: "4px 10px",
                            borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600,
                          }}
                        >
                          {kh.toUpperCase()}
                          <button
                            onClick={() => setSelectedKH(selectedKH.filter((k) => k !== kh))}
                            style={{
                              background: "none", border: "none", color: "inherit",
                              cursor: "pointer", fontSize: "0.9rem",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
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
                disabled={!selectedToán || !selectedVăn || (useKH ? selectedKH.length !== 3 : !selectedTA)}
                style={{
                  flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                  background: (!selectedToán || !selectedVăn || (useKH ? selectedKH.length !== 3 : !selectedTA)) ? "#ccc" : "#2e7d32",
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
