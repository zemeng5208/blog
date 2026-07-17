"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function SearchPanel({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      const hay = [post.title, post.description, post.tags.join(" "), post.slug]
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
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
          placeholder="搜索标题、摘要或标签……"
          autoFocus
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pr-4 pl-11 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-fuchsia-400/50 focus:shadow-[0_0_0_3px_rgba(232,121,249,0.15)]"
        />
      </div>

      <div className="mt-6">
        {!query.trim() && (
          <p className="text-sm text-[var(--muted)]">输入关键词开始搜索，支持标题、描述与标签。</p>
        )}
        {query.trim() && results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
            没有找到与「{query.trim()}」相关的文章
          </p>
        )}
        {results.length > 0 && (
          <ul className="space-y-3">
            <p className="mb-2 text-sm text-[var(--muted)]">找到 {results.length} 篇</p>
            {results.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="card-neon block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-fuchsia-400/45"
                >
                  <div className="text-xs text-[var(--muted)]">{formatDate(post.date)}</div>
                  <h2 className="mt-1 font-semibold text-[var(--heading)]">{post.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-fuchsia-300">
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
