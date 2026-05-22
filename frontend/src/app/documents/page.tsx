import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

interface Document {
  id: number;
  title: string;
  type: string;
  description: string;
  courseName: string;
  filePath?: string;
  url?: string;
  duration?: string;
  createdAt: string;
}

async function getDocuments(type?: string): Promise<Document[]> {
  try {
    const url = type ? `/api/documents?type=${type}` : "/api/documents";
    const res = await api.get<ApiResponse<Document[]>>(url);
    return res.data.data || [];
  } catch {
    return [];
  }
}

const typeIcons: Record<string, string> = {
  "PDF": "fa-file-pdf",
  "VIDEO": "fa-video",
  "MATERIAL": "fa-book",
  "OTHER": "fa-file"
};

const typeColors: Record<string, { bg: string; text: string }> = {
  "PDF": { bg: "#f3e5f5", text: "#6a1b9a" },
  "VIDEO": { bg: "#e3f2fd", text: "#1565c0" },
  "MATERIAL": { bg: "#fff3e0", text: "#e65100" },
  "OTHER": { bg: "#f5f5f5", text: "#666" }
};

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#d32f2f", marginBottom: "8px" }}>
              <i className="fas fa-file-alt" style={{ marginRight: "10px" }} />Tài liệu
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem" }}>Tài liệu học tập, bài giảng video, và các tài nguyên học tập</p>
          </div>

          {documents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
              <i className="fas fa-folder-open" style={{ fontSize: "3rem", marginBottom: "16px", display: "block", color: "#d32f2f" }} />
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, marginBottom: "8px" }}>Chưa có tài liệu</h3>
              <p style={{ fontSize: "0.875rem" }}>Hãy quay lại sau để xem các tài liệu học tập mới</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {documents.map((doc) => {
                const colors = typeColors[doc.type] || typeColors["OTHER"];
                const icon = typeIcons[doc.type] || typeIcons["OTHER"];
                return (
                  <div key={doc.id} style={{
                    background: "#fff",
                    border: "2px solid #f0f0f0",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    _hover: { boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        background: colors.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.text,
                        fontSize: "1.2rem",
                        flexShrink: 0
                      }}>
                        <i className={`fas ${icon}`} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#2c2c2c",
                          margin: "0 0 4px 0",
                          wordBreak: "break-word"
                        }}>
                          {doc.title}
                        </h3>
                        <div style={{ fontSize: "0.75rem", color: colors.text, fontWeight: 600, marginBottom: "4px" }}>
                          {doc.type === "VIDEO" ? "🎥 Video" : doc.type === "PDF" ? "📄 PDF" : doc.type === "MATERIAL" ? "📚 Tài liệu" : "📎 Tệp"}
                        </div>
                        {doc.courseName && (
                          <div style={{ fontSize: "0.75rem", color: "#999" }}>Khóa: {doc.courseName}</div>
                        )}
                      </div>
                    </div>

                    {doc.description && (
                      <p style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        margin: "0",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {doc.description}
                      </p>
                    )}

                    <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: colors.bg,
                            color: colors.text,
                            borderRadius: "6px",
                            textAlign: "center",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s",
                            border: `2px solid ${colors.text}20`
                          }}
                        >
                          <i className="fas fa-external-link-alt" style={{ marginRight: "4px" }} />
                          Xem
                        </a>
                      )}
                      {doc.filePath && (
                        <a
                          href={doc.filePath}
                          download
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: colors.bg,
                            color: colors.text,
                            borderRadius: "6px",
                            textAlign: "center",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s",
                            border: `2px solid ${colors.text}20`
                          }}
                        >
                          <i className="fas fa-download" style={{ marginRight: "4px" }} />
                          Tải
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

