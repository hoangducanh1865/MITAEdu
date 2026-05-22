export default function BooksPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#00796b" }}>
          <i className="fas fa-search" style={{ marginRight: "10px" }} />Tra cứu sách
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "4px" }}>Tìm kiếm sách tham khảo và tài liệu theo chủ đề</p>
      </div>

      {/* Search */}
      <div style={{ background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            placeholder="Tìm kiếm sách, tài liệu..."
            style={{
              flex: 1, border: "1.5px solid #f0d5d5", borderRadius: "10px",
              padding: "10px 16px", fontSize: "0.875rem", background: "#fdf0f0",
              outline: "none",
            }}
          />
          <button style={{ background: "#d32f2f", color: "#fff", borderRadius: "10px", padding: "0 20px", border: "none", cursor: "pointer", fontWeight: 600 }}>
            <i className="fas fa-search" />
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "60px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
        <i className="fas fa-book" style={{ fontSize: "2.5rem", marginBottom: "12px", display: "block", color: "#00796b" }} />
        <p>Tính năng tra cứu sách đang được phát triển</p>
        <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>Vui lòng quay lại sau!</p>
      </div>
    </div>
  );
}
