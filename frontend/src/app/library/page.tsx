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

async function getDocuments(): Promise<Document[]> {
  try {
    const res = await api.get<ApiResponse<Document[]>>("/api/documents");
    return res.data.data || [];
  } catch {
    return [];
  }
}

export default async function LibraryPage() {
  const documents = await getDocuments();
  
  // Group documents by course
  const byCourse: Record<string, Document[]> = {};
  documents.forEach((doc) => {
    const course = doc.courseName || "Chung";
    if (!byCourse[course]) byCourse[course] = [];
    byCourse[course].push(doc);
  });

  const courses = Object.keys(byCourse).sort();

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#d32f2f", marginBottom: "8px" }}>
              <i className="fas fa-book-open" style={{ marginRight: "10px" }} />Thư viện
            </h1>
            <p style={{ color: "#777", fontSize: "0.875rem" }}>Kho tài liệu học tập phong phú từ các khóa học</p>
          </div>

          {documents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
              <i className="fas fa-book" style={{ fontSize: "3rem", marginBottom: "16px", display: "block", color: "#d32f2f" }} />
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, marginBottom: "8px" }}>Thư viện học liệu</h3>
              <p style={{ fontSize: "0.875rem" }}>Chưa có tài liệu nào trong thư viện. Hãy quay lại sau!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {courses.map((course) => (
                <section key={course}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: "2px solid #f0d5d5"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #d32f2f, #b71c1c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontWeight: 700
                    }}>
                      <i className="fas fa-folder" />
                    </div>
                    <div>
                      <h2 style={{
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: "#2c2c2c",
                        margin: 0
                      }}>
                        {course}
                      </h2>
                      <p style={{ color: "#999", fontSize: "0.8rem", margin: "2px 0 0 0" }}>
                        {byCourse[course].length} tài liệu
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "12px"
                  }}>
                    {byCourse[course].map((doc) => (
                      <LibraryCard key={doc.id} document={doc} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

function LibraryCard({ document }: { document: Document }) {
  const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
    "PDF": { bg: "#f3e5f5", text: "#6a1b9a", icon: "fa-file-pdf" },
    "VIDEO": { bg: "#e3f2fd", text: "#1565c0", icon: "fa-video" },
    "MATERIAL": { bg: "#fff3e0", text: "#e65100", icon: "fa-book" },
    "OTHER": { bg: "#f5f5f5", text: "#666", icon: "fa-file" }
  };

  const colors = typeColors[document.type] || typeColors["OTHER"];

  return (
    <div style={{
      background: "#fff",
      border: "2px solid #efefef",
      borderRadius: "10px",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      transition: "all 0.2s"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "6px",
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.text,
          fontSize: "1.1rem",
          flexShrink: 0
        }}>
          <i className={`fas ${colors.icon}`} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#2c2c2c",
            margin: "0 0 3px 0",
            wordBreak: "break-word",
            lineHeight: 1.3
          }}>
            {document.title}
          </h3>
          <div style={{ fontSize: "0.7rem", color: colors.text, fontWeight: 600 }}>
            {document.type}
          </div>
        </div>
      </div>

      {document.description && (
        <p style={{
          fontSize: "0.75rem",
          color: "#666",
          margin: "0",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {document.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "6px", marginTop: "auto" }}>
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "6px 10px",
              background: colors.bg,
              color: colors.text,
              borderRadius: "5px",
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: 600,
              textDecoration: "none",
              border: `1px solid ${colors.text}30`
            }}
          >
            Xem
          </a>
        )}
        {document.filePath && (
          <a
            href={document.filePath}
            download
            style={{
              flex: 1,
              padding: "6px 10px",
              background: colors.bg,
              color: colors.text,
              borderRadius: "5px",
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: 600,
              textDecoration: "none",
              border: `1px solid ${colors.text}30`
            }}
          >
            Tải
          </a>
        )}
      </div>
    </div>
  );
}
