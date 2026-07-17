/** 将标题转为 URL 安全的 slug */
export function titleToSlug(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 纯中文 slug 在文件系统可用；若为空则用时间戳
  if (base) return base.slice(0, 80);

  return `post-${Date.now()}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[\w\u4e00-\u9fff-]{1,80}$/.test(slug) && !slug.includes("..");
}
