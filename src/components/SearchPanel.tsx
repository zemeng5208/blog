"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, snippetAround } from "@/lib/format";

export type SearchDocClient = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  content: string;
};

export function SearchPanel({ posts }: { posts: SearchDocClient[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as { post: SearchDocClient; snippet: string }[];
    const tokens = q.split(/\s+/).filter(Boolean);
    return posts
      .filter((post) => {
        const hay = [
          post.title,
          post.description,
          post.tags.join(" "),
          post.slug,
          post.series ?? "",
          post.content,
        ]
          .join(" ")
          .toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .map((post) => ({
        post,
        snippet: snippetAround(post.content, query),
      }));
  }, [posts, query]);

  return (
    <div>
      <label htmlFor="blog-search" className="sr-only">
        搜索文章
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--muted)]">
          ⌕
        </span>
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标题、摘要、标签、系列或正文……"
          autoFocus
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pr-4 pl-11 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]"
        />
      </div>

      <div className="mt-6">
        {!query.trim() && (
          <p className="text-sm text-[var(--muted)]">
            支持全文搜索：标题、描述、标签、系列名与正文内容。
          </p>
        )}
        {query.trim() && results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
            没有找到与「{query.trim()}」相关的文章
          </p>
        )}
        {results.length > 0 && (
          <ul className="space-y-3">
            <p className="mb-2 text-sm text-[var(--muted)]">找到 {results.length} 篇</p>
            {results.map(({ post, snippet }) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="post-card block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {post.series && (
                      <span className="rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[var(--chip-fg)]">
                        系列 · {post.series}
                        {post.seriesOrder ? ` #${post.seriesOrder}` : ""}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 font-semibold text-[var(--heading)]">{post.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                    {snippet || post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-[var(--chip-fg)]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
