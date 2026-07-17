"use client";

import { useState } from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="absolute top-2 right-2 z-10 rounded-md border border-[var(--border)] bg-[var(--card)]/95 px-2 py-1 text-[11px] text-[var(--muted)] opacity-100 transition sm:opacity-0 sm:group-hover/pre:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)] focus:opacity-100"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}
