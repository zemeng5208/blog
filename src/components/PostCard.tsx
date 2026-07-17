import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card-neon group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition duration-300 hover:border-fuchsia-400/50 sm:flex sm:items-center">
      {/* 左侧封面：完整显示文字，居中裁切 */}
      <Link
        href={`/posts/${post.slug}`}
        className="relative mx-4 mt-4 block aspect-[16/9] shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[#0a0614] sm:mx-4 sm:my-4 sm:aspect-auto sm:h-[7.5rem] sm:w-[13.5rem] md:h-32 md:w-56"
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-contain object-center p-1 transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 224px"
            unoptimized={post.cover.endsWith(".svg")}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-fuchsia-600/30 via-purple-700/25 to-cyan-600/20 px-3 text-center text-sm font-semibold leading-snug text-fuchsia-100">
            {post.title}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1 p-5 pt-4 sm:py-5 sm:pr-6 sm:pl-1">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
          {post.featured && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[var(--chip-fg)]">精选</span>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-[var(--heading)] transition group-hover:text-[var(--accent)]">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:underline decoration-[var(--accent)]/60 underline-offset-4"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[var(--muted)]">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs text-[var(--chip-fg)] transition hover:border-[var(--accent)]"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
