"use client";

import { useEffect, useRef } from "react";
import { siteConfig, isGiscusEnabled } from "@/lib/site";
import { useTheme } from "@/components/ThemeProvider";
import { getThemeMeta } from "@/lib/themes";

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const dark = getThemeMeta(theme).dark;

  useEffect(() => {
    if (!isGiscusEnabled() || !ref.current) return;

    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", siteConfig.giscus.repo);
    script.setAttribute("data-repo-id", siteConfig.giscus.repoId);
    script.setAttribute("data-category", siteConfig.giscus.category);
    script.setAttribute("data-category-id", siteConfig.giscus.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", dark ? "transparent_dark" : "light");
    script.setAttribute("data-lang", "zh-CN");
    ref.current.appendChild(script);
  }, [theme, dark]);

  if (!isGiscusEnabled()) {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
        <p className="font-medium text-[var(--heading)]">评论区（未启用）</p>
        <p className="mt-2">
          在{" "}
          <a
            href="https://giscus.app/zh-CN"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:underline"
          >
            giscus.app
          </a>{" "}
          配置仓库后，把参数写入 <code className="text-fuchsia-300">.env.local</code>
          （参考 <code className="text-fuchsia-300">.env.example</code>）。
        </p>
      </div>
    );
  }

  return (
    <section className="mt-14">
      <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">评论</h2>
      <div ref={ref} />
    </section>
  );
}
