import { tryGetCloudflareEnv } from "@/lib/cloudflare";
import {
  createHeadingIdGenerator,
  formatDate,
  normalizeHeadingText,
  slugifyHeading,
} from "@/lib/format";
import {
  dbGetAllPosts,
  dbGetAllPostsWithContent,
  dbGetAllSeries,
  dbGetFeaturedPosts,
  dbGetPostBySlug,
  dbGetPostsBySeries,
  dbGetPublishedSlugs,
} from "@/lib/posts-db";

export { formatDate, slugifyHeading };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  draft?: boolean;
  featured?: boolean;
  cover?: string;
  series?: string;
  seriesOrder?: number;
};

export type Post = PostMeta & {
  content: string;
};

export type SearchDoc = PostMeta & {
  content: string;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

/** 生产环境唯一数据源：D1。不可用时明确报错（不再回退 MySQL/本地 md 运行时读取） */
function assertD1() {
  const env = tryGetCloudflareEnv();
  if (!env?.DB) {
    throw new Error(
      "D1 绑定 DB 不可用。请通过 Sites/vinext 运行，并确保 hosting.json 中配置了 d1: DB。",
    );
  }
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const nextId = createHeadingIdGenerator();
  const lines = content.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const raw = match[2];
    const text = normalizeHeadingText(raw);
    const id = nextId(text);
    headings.push({ id, text, level });
  }
  return headings;
}

export async function getPublishedSlugs(): Promise<string[]> {
  assertD1();
  return dbGetPublishedSlugs();
}

export async function getPostBySlug(slug: string): Promise<Post> {
  assertD1();
  const post = await dbGetPostBySlug(slug);
  if (!post) {
    throw new Error(`文章不存在: ${slug}`);
  }
  return post;
}

export async function getAllPosts(): Promise<PostMeta[]> {
  assertD1();
  return dbGetAllPosts();
}

export async function getAllPostsWithContent(): Promise<Post[]> {
  assertD1();
  return dbGetAllPostsWithContent();
}

export async function getFeaturedPosts(): Promise<PostMeta[]> {
  assertD1();
  return dbGetFeaturedPosts();
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const decoded = decodeURIComponent(tag);
  const all = await getAllPosts();
  return all.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decoded.toLowerCase()),
  );
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const map = new Map<string, number>();
  for (const post of await getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

export async function getPostsBySeries(series: string): Promise<PostMeta[]> {
  assertD1();
  return dbGetPostsBySeries(decodeURIComponent(series));
}

export async function getAllSeries(): Promise<{ series: string; count: number }[]> {
  assertD1();
  return dbGetAllSeries();
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<PostMeta[]> {
  let current: Post;
  try {
    current = await getPostBySlug(slug);
  } catch {
    return [];
  }
  if (current.draft) return [];

  const others = (await getAllPosts()).filter((p) => p.slug !== slug);
  const scored = others
    .map((p) => ({
      post: p,
      score:
        (p.series && p.series === current.series ? 10 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));

  const related = scored.filter((x) => x.score > 0).map((x) => x.post);
  if (related.length >= limit) return related.slice(0, limit);
  const fill = others.filter((p) => !related.some((r) => r.slug === p.slug));
  return [...related, ...fill].slice(0, limit);
}

export async function searchPosts(query: string): Promise<SearchDoc[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const all = await getAllPostsWithContent();
  return all.filter((post) => {
    const hay = [
      post.title,
      post.description,
      post.tags.join(" "),
      post.slug,
      post.series ?? "",
      post.content,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}
