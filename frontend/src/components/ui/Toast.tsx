"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const COLORS = {
  success: { bg: "var(--success-soft)", border: "var(--success)", icon: "fa-check-circle", iconColor: "var(--success)" },
  error:   { bg: "var(--blue-light)", border: "var(--blue)", icon: "fa-times-circle", iconColor: "var(--blue-dark)" },
  info:    { bg: "var(--blue-light)", border: "var(--blue)", icon: "fa-info-circle",  iconColor: "var(--blue)" },
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const c = COLORS[type];
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px", zIndex: 1000,
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: "12px",
      padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px",
      boxShadow: "var(--shadow-strong)", minWidth: "260px", maxWidth: "380px",
      animation: "slideUp .25s ease",
    }}>
      <i className={`fas ${c.icon}`} style={{ color: c.iconColor, fontSize: "1.1rem" }} />
      <span style={{ fontSize: "0.875rem", color: "var(--text)", flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
        <i className="fas fa-times" />
      </button>
      <style>{`@keyframes slideUp { from { transform:translateY(12px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
    </div>
  );
}
