"use client";

import { useEffect, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import { getSavedUser } from "@/lib/auth";
import type { LocalLesson } from "@/lib/localCourses";
import type { User } from "@/types";

interface Props {
  lesson: LocalLesson;
}

/**
 * Hiển thị media bảo mật của một bài học:
 *  - Video: phát qua presigned URL ngắn hạn, chặn nút tải, watermark email động.
 *  - PDF: xem inline (ẩn thanh công cụ tải/in của trình duyệt).
 * URL thật do backend ký mỗi lần xem, không nằm trong code frontend.
 */
export default function SecureMediaViewer({ lesson }: Props) {
  const [watermark, setWatermark] = useState("MITA Edu");

  useEffect(() => {
    const user = getSavedUser<User>();
    if (user?.email) setWatermark(user.email);
  }, []);

  const pdfs = [
    lesson.pdfMediaId
      ? { id: lesson.pdfMediaId, label: "Đề bài", icon: "fas fa-file-pdf" }
      : null,
    lesson.handwrittenMediaId
      ? { id: lesson.handwrittenMediaId, label: "File viết tay", icon: "fas fa-pen" }
      : null,
  ].filter(Boolean) as { id: string; label: string; icon: string }[];

  const [activePdf, setActivePdf] = useState<string | null>(pdfs[0]?.id ?? null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {lesson.videoMediaId && (
        <SecureVideo mediaId={lesson.videoMediaId} watermark={watermark} />
      )}

      {pdfs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Tabs chọn PDF */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {pdfs.map((p) => {
              const active = p.id === activePdf;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePdf(p.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: active ? "#d32f2f" : "#fdf0f0",
                    border: `2px solid ${active ? "#d32f2f" : "#f0d5d5"}`,
                    color: active ? "#fff" : "#d32f2f",
                    borderRadius: "10px", padding: "9px 18px",
                    fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  <i className={p.icon} /> {p.label}
                </button>
              );
            })}
          </div>
          {activePdf && <SecurePdf mediaId={activePdf} watermark={watermark} />}
        </div>
      )}
    </div>
  );
}

/* ── Video bảo mật ───────────────────────────────── */
function SecureVideo({ mediaId, watermark }: { mediaId: string; watermark: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pos, setPos] = useState({ top: "8%", left: "8%" });

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getMediaUrl(mediaId)
      .then((m) => { if (alive) { setUrl(m.url); setStatus("ready"); } })
      .catch(() => { if (alive) setStatus("error"); });
    return () => { alive = false; };
  }, [mediaId]);

  // Watermark di chuyển để khó che/crop
  useEffect(() => {
    const id = setInterval(() => {
      setPos({
        top: `${5 + Math.random() * 80}%`,
        left: `${5 + Math.random() * 70}%`,
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        background: "#000", aspectRatio: "16/9", border: "2px solid #f0d5d5",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {status === "ready" && url && (
        <video
          src={url}
          controls
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      )}
      {status === "loading" && (
        <Center><i className="fas fa-spinner fa-spin" style={{ fontSize: "1.8rem", color: "#fff" }} /></Center>
      )}
      {status === "error" && (
        <Center>
          <div style={{ color: "#fff", textAlign: "center", padding: "24px" }}>
            <i className="fas fa-lock" style={{ fontSize: "1.8rem", marginBottom: 10 }} /><br />
            Không tải được video. Vui lòng đăng nhập để xem.
          </div>
        </Center>
      )}

      {/* Watermark động */}
      {status === "ready" && (
        <div
          style={{
            position: "absolute", top: pos.top, left: pos.left,
            color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontWeight: 600,
            pointerEvents: "none", userSelect: "none",
            textShadow: "0 1px 3px rgba(0,0,0,0.6)", transition: "top 1s, left 1s",
            whiteSpace: "nowrap",
          }}
        >
          {watermark}
        </div>
      )}
    </div>
  );
}

/* ── PDF bảo mật ─────────────────────────────────── */
function SecurePdf({ mediaId, watermark }: { mediaId: string; watermark: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getMediaUrl(mediaId)
      .then((m) => { if (alive) { setUrl(m.url); setStatus("ready"); } })
      .catch(() => { if (alive) setStatus("error"); });
    return () => { alive = false; };
  }, [mediaId]);

  return (
    <div
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        border: "2px solid #f0d5d5", background: "#fff", minHeight: "600px",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {status === "ready" && url && (
        <iframe
          className="pdf-iframe"
          src={`${url}#toolbar=0&navpanes=0&statusbar=0&view=FitH`}
          title="PDF"
          style={{ width: "100%", height: "600px", border: "none", display: "block" }}
        />
      )}
      {status === "loading" && (
        <div style={{ padding: "60px", textAlign: "center", color: "#d32f2f" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.6rem" }} />
        </div>
      )}
      {status === "error" && (
        <div style={{ padding: "60px", textAlign: "center", color: "#777" }}>
          <i className="fas fa-lock" style={{ fontSize: "1.6rem", marginBottom: 10 }} /><br />
          Không tải được tài liệu. Vui lòng đăng nhập để xem.
        </div>
      )}

      {/* Watermark mờ góc dưới (răn đe chụp màn hình) */}
      {status === "ready" && (
        <div
          style={{
            position: "absolute", bottom: "10px", right: "14px",
            color: "rgba(120,120,120,0.5)", fontSize: "0.75rem", fontWeight: 600,
            pointerEvents: "none", userSelect: "none",
          }}
        >
          {watermark}
        </div>
      )}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </div>
  );
}
