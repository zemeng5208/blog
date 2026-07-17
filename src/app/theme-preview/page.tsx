"use client";

import { useMemo, useState } from "react";

type ThemeId =
  | "paper"
  | "terminal"
  | "magazine"
  | "sky"
  | "ink"
  | "cyber"
  | "linear";

type ThemeDef = {
  id: ThemeId;
  name: string;
  subtitle: string;
  tags: string[];
  pageBg: string;
  cardBg: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  border: string;
  navBg: string;
  codeBg: string;
  heroTitle: string;
  badge: string;
  dark: boolean;
};

const themes: ThemeDef[] = [
  {
    id: "paper",
    name: "1 · 极简纸感",
    subtitle: "干净笔记风，青绿点缀",
    tags: ["双模式", "阅读优先", "克制"],
    pageBg: "#fafafa",
    cardBg: "#ffffff",
    text: "#18181b",
    muted: "#71717a",
    accent: "#0d9488",
    accentSoft: "#ccfbf1",
    border: "#e4e4e7",
    navBg: "rgba(255,255,255,0.9)",
    codeBg: "#18181b",
    heroTitle: "写代码，也写思考",
    badge: "个人技术博客",
    dark: false,
  },
  {
    id: "terminal",
    name: "2 · 深空终端",
    subtitle: "暗色工程师风，荧光青",
    tags: ["偏深色", "酷", "夜间友好"],
    pageBg: "#0b0f0e",
    cardBg: "#121816",
    text: "#d7f5e9",
    muted: "#6f8f80",
    accent: "#34d399",
    accentSoft: "rgba(52,211,153,0.12)",
    border: "#1f2e28",
    navBg: "rgba(11,15,14,0.92)",
    codeBg: "#020403",
    heroTitle: "root@blog:~# write",
    badge: "// tech journal",
    dark: true,
  },
  {
    id: "magazine",
    name: "3 · 杂志排版",
    subtitle: "大标题留白，琥珀强调",
    tags: ["设计感", "长文", "精选"],
    pageBg: "#f7f4ef",
    cardBg: "#fffdf9",
    text: "#1c1917",
    muted: "#78716c",
    accent: "#ea580c",
    accentSoft: "#ffedd5",
    border: "#e7e0d5",
    navBg: "rgba(247,244,239,0.92)",
    codeBg: "#292524",
    heroTitle: "深度 · 复盘 · 方法",
    badge: "TECH ESSAYS",
    dark: false,
  },
  {
    id: "sky",
    name: "4 · 清新天空",
    subtitle: "浅色轻快，天蓝淡紫",
    tags: ["友好", "现代", "偏浅色"],
    pageBg: "#f0f7ff",
    cardBg: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    accentSoft: "#dbeafe",
    border: "#dbe3f0",
    navBg: "rgba(255,255,255,0.9)",
    codeBg: "#1e293b",
    heroTitle: "轻松记录每一次成长",
    badge: "学习笔记",
    dark: false,
  },
  {
    id: "ink",
    name: "5 · 墨色国风",
    subtitle: "书卷感，朱红点缀",
    tags: ["中文阅读", "沉稳", "沉浸"],
    pageBg: "#f6f1e7",
    cardBg: "#fbf7ef",
    text: "#1a1510",
    muted: "#7a6e60",
    accent: "#b91c1c",
    accentSoft: "#fee2e2",
    border: "#e4d8c4",
    navBg: "rgba(246,241,231,0.94)",
    codeBg: "#2a2218",
    heroTitle: "以文载道，以码致用",
    badge: "技术随笔",
    dark: false,
  },
  {
    id: "cyber",
    name: "6 · 赛博霓虹",
    subtitle: "紫粉青渐变，强个性",
    tags: ["个性强", "AI感", "偏深色"],
    pageBg: "#0a0614",
    cardBg: "#140d24",
    text: "#f3e8ff",
    muted: "#a78bfa",
    accent: "#e879f9",
    accentSoft: "rgba(232,121,249,0.15)",
    border: "#2e1b4d",
    navBg: "rgba(10,6,20,0.92)",
    codeBg: "#05020d",
    heroTitle: "Build · Ship · Glow",
    badge: "NEON LOG",
    dark: true,
  },
  {
    id: "linear",
    name: "7 · 线性工程风",
    subtitle: "产品站质感，靛蓝品牌色",
    tags: ["理性", "B端干净", "双模式"],
    pageBg: "#f8fafc",
    cardBg: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#4f46e5",
    accentSoft: "#e0e7ff",
    border: "#e2e8f0",
    navBg: "rgba(255,255,255,0.92)",
    codeBg: "#0f172a",
    heroTitle: "工程实践与方法论",
    badge: "Engineering Notes",
    dark: false,
  },
];

function BrowserChrome({
  theme,
  large,
}: {
  theme: ThemeDef;
  large?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-xl ${large ? "rounded-2xl" : ""}`}
      style={{ borderColor: theme.border, background: theme.pageBg }}
    >
      {/* 窗口栏 */}
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: theme.border, background: theme.navBg }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        <div
          className="ml-2 flex-1 truncate rounded-md px-2 py-1 text-[10px]"
          style={{ background: theme.cardBg, color: theme.muted }}
        >
          localhost:3000 · GrokDemo Blog
        </div>
      </div>

      {/* 导航 */}
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: theme.border, background: theme.navBg }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
            style={{
              background:
                theme.id === "cyber"
                  ? "linear-gradient(135deg,#c026d3,#22d3ee)"
                  : theme.id === "magazine"
                    ? "linear-gradient(135deg,#ea580c,#f59e0b)"
                    : theme.accent,
            }}
          >
            G
          </div>
          <span className="text-xs font-semibold" style={{ color: theme.text }}>
            GrokDemo
          </span>
        </div>
        <div className="flex gap-3 text-[10px]" style={{ color: theme.muted }}>
          <span style={{ color: theme.accent, fontWeight: 600 }}>首页</span>
          <span>文章</span>
          <span>标签</span>
          <span>关于</span>
        </div>
      </div>

      {/* 内容 */}
      <div className={`px-4 ${large ? "py-6" : "py-4"}`}>
        <p
          className="mb-1 text-[10px] font-medium tracking-wide"
          style={{ color: theme.accent }}
        >
          {theme.badge}
        </p>
        <h3
          className={`font-bold leading-tight ${large ? "text-2xl" : "text-base"} ${
            theme.id === "magazine" ? "tracking-tight" : ""
          } ${theme.id === "ink" ? "tracking-wide" : ""}`}
          style={{
            color: theme.text,
            fontFamily:
              theme.id === "ink"
                ? '"Noto Serif SC", "Songti SC", serif'
                : theme.id === "terminal"
                  ? "ui-monospace, monospace"
                  : "inherit",
          }}
        >
          {theme.heroTitle}
        </h3>
        <p
          className={`mt-2 leading-relaxed ${large ? "text-sm" : "text-[11px] line-clamp-2"}`}
          style={{ color: theme.muted }}
        >
          记录编程、工程实践与技术思考。分享前端、工具链与成长笔记。
        </p>

        {/* 文章卡片 */}
        <div
          className={`mt-4 rounded-lg border p-3 ${large ? "mt-5 p-4" : ""}`}
          style={{ borderColor: theme.border, background: theme.cardBg }}
        >
          <div className="mb-1.5 flex gap-2 text-[10px]" style={{ color: theme.muted }}>
            <span>2026年7月15日</span>
            <span>·</span>
            <span>4 分钟阅读</span>
          </div>
          <p
            className={`font-semibold ${large ? "text-base" : "text-xs"}`}
            style={{ color: theme.text }}
          >
            TypeScript 实用小技巧
          </p>
          <p
            className={`mt-1 ${large ? "text-sm" : "text-[10px] line-clamp-2"}`}
            style={{ color: theme.muted }}
          >
            几个在日常开发里高频用到的 TS 写法，帮助类型更准、代码更清晰。
          </p>
          <div className="mt-2 flex gap-1.5">
            {["TypeScript", "前端"].map((t) => (
              <span
                key={t}
                className="rounded-full px-2 py-0.5 text-[9px]"
                style={{ background: theme.accentSoft, color: theme.accent }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* 代码块示意 */}
        {large && (
          <div
            className="mt-4 overflow-hidden rounded-lg p-3 font-mono text-[11px] leading-relaxed text-zinc-200"
            style={{ background: theme.codeBg }}
          >
            <div style={{ color: "#8b949e" }}>{"// 类型守卫"}</div>
            <div>
              <span style={{ color: "#ff7b72" }}>function</span>{" "}
              <span style={{ color: theme.id === "cyber" ? "#e879f9" : "#d2a8ff" }}>
                isString
              </span>
              (v: unknown) {"{"}
            </div>
            <div className="pl-3">
              <span style={{ color: "#ff7b72" }}>return</span>{" "}
              <span style={{ color: "#79c0ff" }}>typeof</span> v ==={" "}
              <span style={{ color: "#a5d6ff" }}>&quot;string&quot;</span>;
            </div>
            <div>{"}"}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThemePreviewPage() {
  const [selected, setSelected] = useState<ThemeId>("paper");
  const current = useMemo(
    () => themes.find((t) => t.id === selected) ?? themes[0],
    [selected],
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">主题预览</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">看着选你喜欢的风格</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            点击下方卡片切换大图预览。选定后告诉我编号或名称（例如「2」或「深空终端」），我会应用到整站。
          </p>
        </header>

        {/* 大预览 */}
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{current.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{current.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-zinc-200/60 p-4 shadow-inner sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <BrowserChrome theme={current} large />
          </div>
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white/80 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
            当前选中：
            <strong className="mx-1 text-zinc-900 dark:text-zinc-50">{current.name}</strong>
            —— 在聊天里回复这个编号或名称即可应用。
          </p>
        </section>

        {/* 缩略图网格 */}
        <section>
          <h2 className="mb-4 text-sm font-medium text-zinc-500">全部主题（点击切换）</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => {
              const active = theme.id === selected;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelected(theme.id)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-teal-500 ring-2 ring-teal-500/30 shadow-lg"
                      : "border-zinc-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700"
                  } bg-white dark:bg-zinc-900`}
                >
                  <div className="mb-3 pointer-events-none scale-[0.98] origin-top">
                    <BrowserChrome theme={theme} />
                  </div>
                  <div className="flex items-start justify-between gap-2 px-1">
                    <div>
                      <p className="font-semibold text-sm">{theme.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{theme.subtitle}</p>
                    </div>
                    {active && (
                      <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-medium text-white">
                        预览中
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
          <p>
            提示：这是预览页，不影响线上内容。选定主题后回复我，例如：
            <code className="mx-1 rounded bg-zinc-200 px-1.5 py-0.5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              选 5 墨色国风
            </code>
          </p>
        </footer>
      </div>
    </div>
  );
}
