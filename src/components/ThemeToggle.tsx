"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isNeon = theme === "neon";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--heading)]"
      title={isNeon ? "切换为黑色护眼模式" : "切换为霓虹模式"}
      aria-label={isNeon ? "切换为黑色护眼模式" : "切换为霓虹模式"}
    >
      <span aria-hidden>{isNeon ? "✦" : "●"}</span>
      <span className="hidden sm:inline">{isNeon ? "霓虹" : "护眼黑"}</span>
    </button>
  );
}
