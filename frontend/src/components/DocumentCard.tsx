"use client";

import { useState } from "react";

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

export default function DocumentCard({ doc }: { doc: Document }) {
  const [hovered, setHovered] = useState(false);
  const colors = typeColors[doc.type] || typeColors["OTHER"];
  const icon = typeIcons[doc.type] || typeIcons["OTHER"];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "2px solid #f0f0f0",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.2s",
        cursor: "pointer",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.1)" : "none"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
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
          }}
        >
          <i className={`fas ${icon}`} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#2c2c2c",
              margin: "0 0 4px 0",
              wordBreak: "break-word"
            }}
          >
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
        <p
          style={{
            fontSize: "0.8rem",
            color: "#666",
            margin: "0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
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
}
