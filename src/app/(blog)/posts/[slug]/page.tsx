import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/AuthorCard";
import { GiscusComments } from "@/components/GiscusComments";
import { Markdown } from "@/components/Markdown";
import { ReadingProgress } from "@/components/ReadingProgress";
import { RelatedPosts } from "@/components/RelatedPosts";
import { TableOfContents } from "@/components/TableOfContents";
import { formatDate } from "@/lib/format";
import {
  extractHeadings,
  getAllPosts,
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        tags: post.tags,
        images: post.cover ? [{ url: post.cover }] : undefined,
      },
      alternates: {
        canonical: `${siteConfig.url}/posts/${slug}`,
      },
    };
  } catch {
    return { title: "文章未找到" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (post.draft) {
    notFound();
  }

  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  const prev = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const next = index > 0 ? all[index - 1] : null;
  const headings = extractHeadings(post.content);
  const related = getRelatedPosts(slug, 3);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/posts"
          className="mb-8 inline-flex items-center gap-1 text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← 返回文章列表
        </Link>

        {post.cover && (
          <div className="relative mb-8 aspect-[2.2/1] overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-contain object-center bg-[#0a0614]"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              unoptimized={post.cover.endsWith(".svg")}
            />
          </div>
        )}

        <header className="mb-10 border-b border-[var(--border)] pb-10">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            {post.featured && (
              <>
                <span aria-hidden>·</span>
                <span className="text-fuchsia-300">精选</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)] sm:text-4xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{post.description}</p>
          )}
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-sm text-fuchsia-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <TableOfContents headings={headings} />

        <Markdown content={post.content} />

        <div className="mt-12">
          <AuthorCard />
        </div>

        <nav className="mt-12 grid gap-4 border-t border-[var(--border)] pt-10 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-fuchsia-400/50"
            >
              <span className="text-xs text-[var(--muted)]">上一篇</span>
              <p className="mt-1 font-medium text-[var(--heading)]">{prev.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/posts/${next.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right transition hover:border-cyan-400/50"
            >
              <span className="text-xs text-[var(--muted)]">下一篇</span>
              <p className="mt-1 font-medium text-[var(--heading)]">{next.title}</p>
            </Link>
          )}
        </nav>

        <RelatedPosts posts={related} />
        <GiscusComments />
      </article>
    </>
  );
}
