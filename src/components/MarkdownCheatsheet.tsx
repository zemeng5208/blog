"use client";

import { useState } from "react";
import { markdownCategories, markdownZhDocs } from "@/lib/markdown-zh-docs";

type Props = {
  onInsert?: (snippet: string) => void;
};

export function MarkdownCheatsheet({ onInsert }: Props) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<string>("标题");

  const items = markdownZhDocs.filter((d) => d.category === active);

  return (
    <aside className="card-neon overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[var(--heading)]"
      >
        <span>Markdown 中文词条</span>
        <span className="text-[var(--muted)]">{open ? "收起" : "展开"}</span>
      </button>

      {open && (
        <div className="border-t border-[var(--border)]">
          <div className="flex flex-wrap gap-1 border-b border-[var(--border)] p-2">
            {markdownCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-2.5 py-1 text-xs transition ${
                  active === cat
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--heading)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <ul className="max-h-[420px] space-y-2 overflow-y-auto p-3">
            {items.map((doc) => (
              <li
                key={doc.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--heading)]">{doc.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">{doc.label}</p>
                  </div>
                  {onInsert && (
                    <button
                      type="button"
                      onClick={() => onInsert(doc.insertText.replace(/\$\{\d+:?([^}]*)\}/g, "$1").replace(/\$\d+/g, ""))}
                      className="shrink-0 rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--link)] hover:border-[var(--accent)]"
                    >
                      插入
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{doc.detail}</p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-2 font-mono text-[11px] leading-relaxed text-fuchsia-100/90">
                  {doc.example}
                </pre>
              </li>
            ))}
          </ul>

          <p className="border-t border-[var(--border)] px-3 py-2 text-[11px] text-[var(--muted)]">
            按<strong className="text-[var(--heading)]">关键字</strong>触发：例如输入{" "}
            <code className="text-[var(--chip-fg)]">`</code> 再按{" "}
            <kbd className="rounded border border-[var(--border)] px-1">Tab</kbd>，会显示{" "}
            <code className="text-[var(--chip-fg)]">`输入文本`</code>
            （行内代码）。空格后再 Tab 为缩进。
          </p>
        </div>
      )}
    </aside>
  );
}
