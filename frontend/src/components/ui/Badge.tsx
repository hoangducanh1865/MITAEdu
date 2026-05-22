import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "tsa" | "hsa" | "thpt" | "published" | "draft" | "default";
  className?: string;
}

const VARIANTS: Record<string, string> = {
  tsa: "bg-[#e3f2fd] text-[#1565c0]",
  hsa: "bg-[#e8f5e9] text-[#2e7d32]",
  thpt: "bg-[#fff3e0] text-[#e65100]",
  published: "bg-[#e8f5e9] text-[#2e7d32]",
  draft: "bg-gray-100 text-gray-500",
  default: "bg-[#fdf0f0] text-[#d32f2f]",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
      VARIANTS[variant],
      className
    )}>
      {children}
    </span>
  );
}
