import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all cursor-pointer border-0";
  const variants = {
    primary: "bg-[#d32f2f] hover:bg-[#b71c1c] text-white",
    secondary: "bg-[#fdf0f0] hover:bg-[#ffebee] text-[#d32f2f]",
    ghost: "bg-transparent hover:bg-[#fdf0f0] text-[#2c2c2c]",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <i className="fas fa-spinner fa-spin" />}
      {children}
    </button>
  );
}
