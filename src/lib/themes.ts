/**
 * 全站可选主题（与 data-theme 属性、globals.css 一一对应）
 */

export const THEME_IDS = [
  "neon",
  "soft",
  "paper",
  "terminal",
  "magazine",
  "sky",
  "ink",
  "linear",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  shortName: string;
  description: string;
  /** 是否深色主题（影响编辑器、Giscus 等） */
  dark: boolean;
  /** 预览色点 */
  swatch: [string, string, string];
};

export const THEMES: ThemeMeta[] = [
  {
    id: "neon",
    name: "赛博霓虹",
    shortName: "霓虹",
    description: "紫黑底 + 粉青渐变，个性张扬",
    dark: true,
    swatch: ["#0a0614", "#e879f9", "#22d3ee"],
  },
  {
    id: "soft",
    name: "护眼黑",
    shortName: "护眼",
    description: "低刺激深灰，适合长时间阅读",
    dark: true,
    swatch: ["#0b0b0c", "#a1a1aa", "#93c5fd"],
  },
  {
    id: "paper",
    name: "极简纸感",
    shortName: "纸感",
    description: "浅色笔记风，青绿点缀",
    dark: false,
    swatch: ["#fafafa", "#0d9488", "#18181b"],
  },
  {
    id: "terminal",
    name: "深空终端",
    shortName: "终端",
    description: "黑客终端感，荧光绿",
    dark: true,
    swatch: ["#0b0f0e", "#34d399", "#d7f5e9"],
  },
  {
    id: "magazine",
    name: "杂志排版",
    shortName: "杂志",
    description: "暖色纸张 + 琥珀强调",
    dark: false,
    swatch: ["#f7f4ef", "#ea580c", "#1c1917"],
  },
  {
    id: "sky",
    name: "清新天空",
    shortName: "天空",
    description: "浅蓝底，亲和现代",
    dark: false,
    swatch: ["#f0f7ff", "#2563eb", "#0f172a"],
  },
  {
    id: "ink",
    name: "墨色国风",
    shortName: "国风",
    description: "宣纸色 + 朱红点缀",
    dark: false,
    swatch: ["#f6f1e7", "#b91c1c", "#1a1510"],
  },
  {
    id: "linear",
    name: "线性工程",
    shortName: "工程",
    description: "产品站质感，靛蓝品牌色",
    dark: false,
    swatch: ["#f8fafc", "#4f46e5", "#0f172a"],
  },
];

export const DEFAULT_THEME: ThemeId = "neon";

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return !!value && (THEME_IDS as readonly string[]).includes(value);
}

export function getThemeMeta(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** 兼容旧 localStorage：cyber → neon */
export function normalizeThemeId(value: string | null): ThemeId | null {
  if (!value) return null;
  if (value === "cyber") return "neon";
  if (isThemeId(value)) return value;
  return null;
}
