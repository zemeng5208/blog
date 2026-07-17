"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "neon" | "soft";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "grokdemo-theme";
const THEME_EVENT = "grokdemo-theme-change";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "neon" || value === "soft";
}

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "neon";
  try {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (isThemeMode(fromDom)) return fromDom;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeMode(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "neon";
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

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "neon" as ThemeMode);

  const setTheme = useCallback((t: ThemeMode) => {
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "neon" ? "soft" : "neon");
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme 必须在 ThemeProvider 内使用");
  return ctx;
}
