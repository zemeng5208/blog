import type { Metadata } from "next";
import { SearchPanel } from "@/components/SearchPanel";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索博客文章标题、摘要与标签。",
};

export default function SearchPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">搜索</h1>
        <p className="mt-2 text-[var(--muted)]">在 {posts.length} 篇文章中查找内容。</p>
      </header>
      <SearchPanel posts={posts} />
    </div>
  );
}
