import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  createHeadingIdGenerator,
  formatDate,
  normalizeDate,
  normalizeHeadingText,
  slugifyHeading,
} from "@/lib/format";

export { formatDate, slugifyHeading };

const postsDirectory = path.join(process.cwd(), "content/posts");

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
};

export type Post = PostMeta & {
  content: string;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

function ensurePostsDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

/** 从 Markdown 提取二级/三级标题，生成目录（id 与 Markdown 组件一致） */
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

export function getPostSlugs(): string[] {
  ensurePostsDir();
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

/** 仅已发布文章的 slug（用于静态生成） */
export function getPublishedSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);
  const minutes = Math.max(1, Math.ceil(stats.minutes));

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: `${minutes} 分钟阅读`,
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    cover: typeof data.cover === "string" ? data.cover : undefined,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        tags: post.tags,
        readingTime: post.readingTime,
        draft: post.draft,
        featured: post.featured,
        cover: post.cover,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(): PostMeta[] {
  const featured = getAllPosts().filter((p) => p.featured);
  if (featured.length > 0) return featured;
  return getAllPosts().slice(0, 1);
}

export function getPostsByTag(tag: string): PostMeta[] {
  const decoded = decodeURIComponent(tag);
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decoded.toLowerCase()),
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

/** 按共同标签推荐；不足时用最新文章补齐 */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  let current: Post;
  try {
    current = getPostBySlug(slug);
  } catch {
    return [];
  }
  if (current.draft) return [];

  const others = getAllPosts().filter((p) => p.slug !== slug);
  const scored = others
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));

  const related = scored.filter((x) => x.score > 0).map((x) => x.post);
  if (related.length >= limit) return related.slice(0, limit);

  const fill = others.filter((p) => !related.some((r) => r.slug === p.slug));
  return [...related, ...fill].slice(0, limit);
}

export function searchPosts(query: string): PostMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return getAllPosts().filter((post) => {
    const hay = [post.title, post.description, post.tags.join(" "), post.slug]
      .join(" ")
      .toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}
