import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PostCover } from "@/components/PostCover";

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="post-card group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition"
    >
      <div className="relative aspect-[2.2/1] w-full overflow-hidden">
        <PostCover post={post} size="lg" className="absolute inset-0 h-full w-full" />
        <div className="absolute top-3 left-3 z-20 rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-medium tracking-wide text-[var(--accent)] backdrop-blur">
          精选
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="text-xl font-semibold text-[var(--heading)] transition group-hover:text-[var(--accent)] sm:text-2xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--chip-fg)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
