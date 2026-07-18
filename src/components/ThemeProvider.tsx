"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_THEME,
  THEME_IDS,
  type ThemeId,
  getThemeMeta,
  normalizeThemeId,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  /** 在主题列表中循环切换到下一个 */
  cycleTheme: () => void;
  themes: typeof THEME_IDS;
  meta: ReturnType<typeof getThemeMeta>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "blog-theme";
const THEME_EVENT = "blog-theme-change";

function readTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const fromDom = normalizeThemeId(document.documentElement.getAttribute("data-theme"));
    if (fromDom) return fromDom;
    const saved =
      normalizeThemeId(window.localStorage.getItem(STORAGE_KEY)) ||
      normalizeThemeId(window.localStorage.getItem("grokdemo-theme"));
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(THEME_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(THEME_EVENT, handler);
  };
}

export function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  // 同步 color-scheme，减轻浏览器表单/滚动条不匹配
  const dark = ["neon", "soft", "terminal"].includes(theme);
  root.style.colorScheme = dark ? "dark" : "light";
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

  const setTheme = useCallback((t: ThemeId) => {
    applyTheme(t);
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = THEME_IDS.indexOf(theme);
    const next = THEME_IDS[(idx + 1) % THEME_IDS.length];
    applyTheme(next);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      cycleTheme,
      themes: THEME_IDS,
      meta: getThemeMeta(theme),
    }),
    [theme, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme 必须在 ThemeProvider 内使用");
  return ctx;
}

/** @deprecated 使用 ThemeId */
export type ThemeMode = ThemeId;
