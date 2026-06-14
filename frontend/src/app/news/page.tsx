"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#1e7ab8", marginBottom: "8px" }}>
              <i className="fas fa-newspaper" style={{ marginRight: "10px" }} />Tin tức
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem" }}>Cập nhật tin tức, thông báo và sự kiện từ MITAEdu</p>
          </div>

          <div style={{
            textAlign: "center", padding: "80px 32px",
            background: "#fff", borderRadius: "16px",
            border: "2px solid #c5ddf0",
          }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "#e3f2fd", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 24px",
              fontSize: "2rem", color: "#1e7ab8",
            }}>
              <i className="fas fa-hammer" />
            </div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#2c2c2c", marginBottom: "12px" }}>
              Tính năng đang được phát triển
            </h2>
            <p style={{ color: "#777", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto" }}>
              Trang tin tức đang trong quá trình xây dựng. Hãy quay lại sau để cập nhật những thông tin mới nhất từ MITAEdu.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
