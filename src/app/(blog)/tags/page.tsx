import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览技术文章。",
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">标签</h1>
        <p className="mt-2 text-[var(--muted)]">共 {tags.length} 个标签，点击可筛选相关文章。</p>
      </header>

      <ul className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span>#{tag}</span>
              <span className="rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--chip-fg)]">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
