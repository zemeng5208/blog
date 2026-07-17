import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "全部文章",
  description: "浏览博客中的所有技术文章。",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">全部文章</h1>
        <p className="mt-2 text-[var(--muted)]">共 {posts.length} 篇，按发布时间倒序排列。</p>
      </header>

      <div className="relative flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
