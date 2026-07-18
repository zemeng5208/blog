import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getPostsBySeries } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `系列：${decoded}`,
    description: `「${decoded}」系列文章列表。`,
  };
}

export default async function SeriesPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const posts = await getPostsBySeries(decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/series"
        className="mb-8 inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
      >
        ← 全部系列
      </Link>

      <header className="mb-10">
        <p className="text-sm text-[var(--accent)]">系列</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--heading)]">{decoded}</h1>
        <p className="mt-2 text-[var(--muted)]">共 {posts.length} 篇，按系列序号排列。</p>
      </header>

      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <div key={post.slug} className="relative">
            <div className="mb-2 text-xs font-medium text-[var(--accent)]">
              第 {post.seriesOrder || i + 1} 篇
            </div>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
