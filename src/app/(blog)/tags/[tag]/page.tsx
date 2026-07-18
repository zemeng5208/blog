import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `标签：${decoded}`,
    description: `与「${decoded}」相关的技术文章。`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/tags"
        className="mb-8 inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
      >
        ← 全部标签
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-neon-gradient">#{decoded}</span>
        </h1>
        <p className="mt-2 text-[var(--muted)]">共 {posts.length} 篇文章</p>
      </header>

      <div className="relative flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
