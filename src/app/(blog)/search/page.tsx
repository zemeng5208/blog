import type { Metadata } from "next";
import { SearchPanel } from "@/components/SearchPanel";
import { getAllPostsWithContent } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "搜索",
  description: "全文搜索博客文章：标题、摘要、标签、系列与正文。",
};

export default async function SearchPage() {
  const posts = await getAllPostsWithContent();
  const docs = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    series: p.series,
    seriesOrder: p.seriesOrder,
    content: p.content,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">搜索</h1>
        <p className="mt-2 text-[var(--muted)]">
          在 {docs.length} 篇文章中全文检索（含正文）。
        </p>
      </header>
      <SearchPanel posts={docs} />
    </div>
  );
}
