import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function Select({ label, error, leftIcon, className, children, ...props }: SelectProps) {
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
        <select
          className={cn(
            "w-full appearance-none rounded-xl border border-[#c5ddf0] bg-[#f0f7fd] px-4 py-2.5 pr-10 text-sm outline-none",
            "focus:border-[#1e7ab8] focus:ring-2 focus:ring-[#1e7ab8]/20 transition-all",
            leftIcon && "pl-10",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777]">
          <i className="fas fa-chevron-down" />
        </span>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
