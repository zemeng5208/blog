"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { THEMES, type ThemeId } from "@/lib/themes";

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium text-[var(--accent)]">主题中心</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--heading)]">
          切换全站主题
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          共 {THEMES.length} 套主题。也可使用导航栏右侧的主题菜单随时切换，选择会自动记住。
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
        当前：
        <strong className="mx-1 text-[var(--heading)]">
          {THEMES.find((t) => t.id === theme)?.name}
        </strong>
        （{theme}）
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTheme(t.id as ThemeId)}
                className={`card-neon flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                } bg-[var(--card)]`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--heading)]">{t.name}</span>
                  {active && (
                    <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] text-[var(--accent)]">
                      使用中
                    </span>
                  )}
                </div>
                <div className="flex h-12 overflow-hidden rounded-xl border border-[var(--border)]">
                  {t.swatch.map((c) => (
                    <span key={c} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-sm text-[var(--muted)]">{t.description}</p>
                <p className="text-[11px] text-[var(--muted)]">
                  {t.dark ? "深色" : "浅色"} · id: {t.id}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <Link href="/" className="text-sm text-[var(--link)] hover:underline">
          ← 返回首页看效果
        </Link>
      </div>
    </div>
  );
}
