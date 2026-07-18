"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { THEMES, type ThemeId } from "@/lib/themes";

export function ThemeToggle() {
  const { theme, setTheme, meta } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 max-w-[9.5rem] items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--heading)] sm:max-w-none sm:px-3"
        title={`当前主题：${meta.name}（点击切换）`}
        aria-label="选择主题"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-0.5" aria-hidden>
          {meta.swatch.map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="truncate font-medium text-[var(--heading)]">{meta.shortName}</span>
        <span className="text-[10px] opacity-70" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="主题列表"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-[80] w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] py-1 shadow-xl shadow-black/30"
        >
          <p className="px-3 py-2 text-[11px] tracking-wide text-[var(--muted)]">
            选择主题 · 共 {THEMES.length} 套
          </p>
          <ul className="max-h-[min(70vh,22rem)] overflow-y-auto">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(t.id)}
                    className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--heading)] hover:bg-[var(--accent-soft)]"
                    }`}
                  >
                    <span className="mt-0.5 flex shrink-0 items-center gap-0.5">
                      {t.swatch.map((c) => (
                        <span
                          key={c}
                          className="h-3 w-3 rounded-full border border-black/10"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.name}</span>
                        {active && (
                          <span className="rounded-full bg-[var(--accent)]/20 px-1.5 py-0.5 text-[10px]">
                            当前
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[var(--muted)]">
                        {t.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
