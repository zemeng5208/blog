/** 将 frontmatter / 字符串日期规范为 YYYY-MM-DD（避免时区偏移） */
export function normalizeDate(date: unknown): string {
  if (!date) return "";
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof date === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date.trim());
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      return normalizeDate(parsed);
    }
    return date;
  }
  return String(date);
}

/** 中文友好日期展示，按本地日历日解析，避免 UTC 差一天 */
export function formatDate(date: string): string {
  if (!date) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date.trim());
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 去掉 Markdown 行内语法，保证 TOC 与正文锚点一致 */
export function normalizeHeadingText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\{#[^}]+\}/g, "")
    .replace(/#+\s*$/g, "")
    .trim();
}

export function slugifyHeading(text: string): string {
  return (
    normalizeHeadingText(text)
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

/** 生成唯一标题 id（处理重复标题） */
export function createHeadingIdGenerator() {
  const used = new Map<string, number>();
  return (text: string) => {
    let id = slugifyHeading(text);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    return id;
  };
}

/** 从正文中截一段含关键词的预览（客户端可用） */
export function snippetAround(content: string, query: string, radius = 40): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const q = query.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (!q) return plain.slice(0, radius * 2);
  const idx = plain.toLowerCase().indexOf(q);
  if (idx < 0) return plain.slice(0, radius * 2) + (plain.length > radius * 2 ? "…" : "");
  const start = Math.max(0, idx - radius);
  const end = Math.min(plain.length, idx + q.length + radius);
  return `${start > 0 ? "…" : ""}${plain.slice(start, end)}${end < plain.length ? "…" : ""}`;
}
