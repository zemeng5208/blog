import Link from "next/link";
import { AuthorCard } from "@/components/AuthorCard";
import { FeaturedPost } from "@/components/FeaturedPost";
import { PostCard } from "@/components/PostCard";
import { getAllPosts, getAllTags, getFeaturedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts()[0];
  const latest = posts.filter((p) => p.slug !== featured?.slug).slice(0, 5);
  const tags = getAllTags().slice(0, 8);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-12">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[var(--accent)]">
          NEON LOG · 个人技术博客
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-neon-gradient">Build · Ship · Glow</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {siteConfig.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/posts"
            className="btn-neon inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            浏览全部文章
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--heading)] transition hover:border-[var(--accent)]"
          >
            搜索
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--heading)]"
          >
            关于我
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <AuthorCard compact />
      </section>

      {featured && (
        <section className="mb-12">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-sm font-medium text-[var(--muted)]">精选文章</h2>
          </div>
          <FeaturedPost post={featured} />
        </section>
      )}

      {tags.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--muted)]">热门标签</h2>
            <Link href="/tags" className="text-sm text-cyan-300 hover:text-fuchsia-300 hover:underline">
              全部标签
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:border-fuchsia-400/50 hover:text-fuchsia-200"
              >
                #{tag}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--heading)]">最新文章</h2>
          <Link href="/posts" className="text-sm text-cyan-300 hover:text-fuchsia-300 hover:underline">
            查看更多 →
          </Link>
        </div>

        {latest.length === 0 && !featured ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted)]">
            还没有文章，请在 <code className="text-fuchsia-300">content/posts</code> 下添加 Markdown
            文件。
          </p>
        ) : (
          <div className="relative flex flex-col gap-4">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
