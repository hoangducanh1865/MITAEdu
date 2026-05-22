"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const COLORS = {
  success: { bg: "#e8f5e9", border: "#4caf50", icon: "fa-check-circle", iconColor: "#2e7d32" },
  error:   { bg: "#ffebee", border: "#f44336", icon: "fa-times-circle", iconColor: "#c62828" },
  info:    { bg: "#e3f2fd", border: "#2196f3", icon: "fa-info-circle",  iconColor: "#1565c0" },
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
      boxShadow: "0 4px 20px rgba(0,0,0,.12)", minWidth: "260px", maxWidth: "380px",
      animation: "slideUp .25s ease",
    }}>
      <i className={`fas ${c.icon}`} style={{ color: c.iconColor, fontSize: "1.1rem" }} />
      <span style={{ fontSize: "0.875rem", color: "#2c2c2c", flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#777" }}>
        <i className="fas fa-times" />
      </button>
      <style>{`@keyframes slideUp { from { transform:translateY(12px); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
    </div>
  );
}
