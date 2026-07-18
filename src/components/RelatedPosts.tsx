import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">相关文章</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="card-neon block h-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
            >
              <p className="text-xs text-[var(--muted)]">{formatDate(post.date)}</p>
              <p className="mt-1.5 text-sm font-medium leading-snug text-[var(--heading)] transition group-hover:text-[var(--accent)]">
                {post.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
