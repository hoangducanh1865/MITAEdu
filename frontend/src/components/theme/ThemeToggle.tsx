"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      aria-label={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
    >
      <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`} />
    </button>
  );
}

