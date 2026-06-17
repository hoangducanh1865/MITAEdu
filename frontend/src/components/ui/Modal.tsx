"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className={cn(
          "rounded-2xl shadow-xl p-7 min-w-[340px] max-w-[90vw] relative bg-[var(--bg-surface)] text-[var(--text)] border border-[var(--border)]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--blue)" }}>
              {title}
            </h3>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--blue)] transition-colors">
              <i className="fas fa-times" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
