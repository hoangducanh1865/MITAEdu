import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({ label, error, leftIcon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#2c2c2c]">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
            {leftIcon}
          </span>
        )}
        <input
          className={cn(
            "w-full rounded-xl border border-[#f0d5d5] bg-[#fdf0f0] px-4 py-2.5 text-sm outline-none",
            "focus:border-[#d32f2f] focus:ring-2 focus:ring-[#d32f2f]/20 transition-all",
            "placeholder:text-[#aaa]",
            leftIcon && "pl-10",
            error && "border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
