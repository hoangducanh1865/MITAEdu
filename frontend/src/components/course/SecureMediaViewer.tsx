"use client";

import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import { getSavedUser } from "@/lib/auth";
import type { User } from "@/types";

interface SecureLesson {
  videoMediaId?: string;
  pdfMediaId?: string;
  handwrittenMediaId?: string;
  answerMediaId?: string;
}

interface Props {
  lesson: SecureLesson;
}

type MediaStatus = "loading" | "ready" | "error" | "unavailable";

function getMediaErrorMessage(err: unknown) {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

function isUnavailableError(err: unknown) {
  const status = (err as { response?: { status?: number } })?.response?.status;
  const message = getMediaErrorMessage(err) ?? "";
  return status === 404 || message.includes("chưa được tải lên");
}

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
    lesson.answerMediaId
      ? { id: lesson.answerMediaId, label: "Đáp án chi tiết", icon: "fas fa-clipboard-check" }
      : null,
  ].filter(Boolean) as { id: string; label: string; icon: string }[];

  const [activePdf, setActivePdf] = useState<string | null>(pdfs[0]?.id ?? null);
  const activePdfMeta = pdfs.find((p) => p.id === activePdf) ?? null;

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
                    background: active ? "#1e7ab8" : "#f0f7fd",
                    border: `2px solid ${active ? "#1e7ab8" : "#c5ddf0"}`,
                    color: active ? "#fff" : "#1e7ab8",
                    borderRadius: "10px", padding: "9px 18px",
                    fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  <i className={p.icon} /> {p.label}
                </button>
              );
            })}
          </div>
          {activePdfMeta && <SecurePdf mediaId={activePdfMeta.id} label={activePdfMeta.label} watermark={watermark} />}
        </div>
      )}
    </div>
  );
}

/* ── Video bảo mật ───────────────────────────────── */
function SecureVideo({ mediaId, watermark }: { mediaId: string; watermark: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<MediaStatus>("loading");
  const [pos, setPos] = useState({ top: "8%", left: "8%" });

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getMediaUrl(mediaId)
      .then((m) => { if (alive) { setUrl(m.url); setStatus("ready"); } })
      .catch((err) => {
        if (!alive) return;
        setStatus(isUnavailableError(err) ? "unavailable" : "error");
      });
    return () => { alive = false; };
  }, [mediaId]);

  // Watermark di chuyển chậm, thưa để không ảnh hưởng trải nghiệm xem
  useEffect(() => {
    const id = setInterval(() => {
      setPos({
        top: `${5 + Math.random() * 80}%`,
        left: `${5 + Math.random() * 70}%`,
      });
    }, 180000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        background: "#000", aspectRatio: "16/9", border: "2px solid #c5ddf0",
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
      {status === "unavailable" && (
        <Center>
          <div style={{ color: "#fff", textAlign: "center", padding: "24px" }}>
            <i className="fas fa-cloud-arrow-up" style={{ fontSize: "1.8rem", marginBottom: 10 }} /><br />
            Nội dung chưa được tải lên
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
            textShadow: "0 1px 3px rgba(0,0,0,0.6)", transition: "top 2s ease, left 2s ease",
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
function SecurePdf({ mediaId, label, watermark }: { mediaId: string; label: string; watermark: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<MediaStatus>("loading");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getMediaUrl(mediaId)
      .then((m) => { if (alive) { setUrl(m.url); setStatus("ready"); } })
      .catch((err) => {
        if (!alive) return;
        setStatus(isUnavailableError(err) ? "unavailable" : "error");
      });
    return () => { alive = false; };
  }, [mediaId]);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    const ios = isIOSDevice();
    const iosWindow = ios ? window.open("", "_blank") : null;
    if (iosWindow) iosWindow.opener = null;

    try {
      const media = await getMediaUrl(mediaId, { download: true });
      if (ios) {
        if (iosWindow) {
          iosWindow.location.href = media.url;
        } else {
          window.location.assign(media.url);
        }
        return;
      }

      const link = document.createElement("a");
      link.href = media.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      if (iosWindow) iosWindow.close();
      setStatus(isUnavailableError(err) ? "unavailable" : "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        border: "2px solid #c5ddf0", background: "#fff", minHeight: "600px",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {status === "ready" && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px", padding: "10px 12px", borderBottom: "1px solid #c5ddf0",
          background: "#f8fbfe",
        }}>
          <span style={{ fontSize: "0.82rem", color: "#555", fontWeight: 700 }}>
            <i className="fas fa-file-pdf" style={{ color: "#e53935", marginRight: "6px" }} />
            {label}
          </span>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px",
              border: "1px solid #c5ddf0", borderRadius: "9px", background: "#fff",
              color: "#1e7ab8", padding: "8px 12px", fontSize: "0.8rem",
              fontWeight: 800, cursor: downloading ? "not-allowed" : "pointer",
              opacity: downloading ? 0.7 : 1,
            }}
          >
            <i className={downloading ? "fas fa-spinner fa-spin" : "fas fa-download"} />
            Tải PDF
          </button>
        </div>
      )}
      {status === "ready" && url && (
        <iframe
          className="pdf-iframe"
          src={`${url}#toolbar=0&navpanes=0&statusbar=0&view=FitH`}
          title="PDF"
          style={{ width: "100%", height: "600px", border: "none", display: "block" }}
        />
      )}
      {status === "loading" && (
        <div style={{ padding: "60px", textAlign: "center", color: "#1e7ab8" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.6rem" }} />
        </div>
      )}
      {status === "error" && (
        <div style={{ padding: "60px", textAlign: "center", color: "#777" }}>
          <i className="fas fa-lock" style={{ fontSize: "1.6rem", marginBottom: 10 }} /><br />
          Không tải được tài liệu. Vui lòng đăng nhập để xem.
        </div>
      )}
      {status === "unavailable" && (
        <div style={{ padding: "60px", textAlign: "center", color: "#777" }}>
          <i className="fas fa-cloud-arrow-up" style={{ fontSize: "1.6rem", marginBottom: 10 }} /><br />
          Nội dung chưa được tải lên
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
