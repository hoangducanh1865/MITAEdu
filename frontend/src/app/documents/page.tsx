"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import DocumentCard from "@/components/DocumentCard";
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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<Document[]>>("/api/documents");
        setDocuments(res.data.data || []);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#d32f2f" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem" }} />
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#777", background: "#fff", borderRadius: "16px", border: "2px solid #f0d5d5" }}>
              <i className="fas fa-folder-open" style={{ fontSize: "3rem", marginBottom: "16px", display: "block", color: "#d32f2f" }} />
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, marginBottom: "8px" }}>Chưa có tài liệu</h3>
              <p style={{ fontSize: "0.875rem" }}>Hãy quay lại sau để xem các tài liệu học tập mới</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

