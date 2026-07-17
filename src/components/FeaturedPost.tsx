import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="card-neon group relative block overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-[var(--card)] transition hover:border-fuchsia-400/50"
    >
      <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-[#140d24]">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-contain object-center transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            unoptimized={post.cover.endsWith(".svg")}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-purple-700/30 to-cyan-600/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0614] via-[#0a0614]/40 to-transparent" />
        <div className="absolute top-3 left-3 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/20 px-2.5 py-1 text-[11px] font-medium tracking-wide text-fuchsia-200 backdrop-blur">
          精选
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="text-xl font-semibold text-[var(--heading)] transition group-hover:text-fuchsia-300 sm:text-2xl">
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
