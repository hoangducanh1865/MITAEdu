import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#d32f2f", marginBottom: "20px" }}>
            <i className="fas fa-book-open" style={{ marginRight: "10px" }} />Thư viện
          </h1>
          <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
            <i className="fas fa-book" style={{ fontSize: "3rem", marginBottom: "16px", display: "block", color: "#d32f2f" }} />
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, marginBottom: "8px" }}>Thư viện học liệu</h3>
            <p style={{ fontSize: "0.875rem" }}>Tính năng đang được phát triển. Vui lòng quay lại sau!</p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
