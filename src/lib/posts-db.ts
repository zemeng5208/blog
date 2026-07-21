import { and, asc, count, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import readingTime from "reading-time";
import { createDb, type BlogDb } from "../../db";
import { posts } from "../../db/schema";
import { tryGetCloudflareEnv } from "@/lib/cloudflare";
import { normalizeDate } from "@/lib/format";
import type { Post, PostMeta } from "@/lib/posts";

function getDb(): BlogDb {
  const env = tryGetCloudflareEnv();
  if (!env?.DB) {
    throw new Error("D1 数据库绑定 DB 不可用");
  }
  return createDb(env.DB);
}

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return String(raw)
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

function rowToPost(row: typeof posts.$inferSelect): Post {
  const content = row.content ?? "";
  const minutes = Math.max(1, Math.ceil(readingTime(content).minutes));
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    date: normalizeDate(row.date),
    tags: parseTags(row.tags),
    readingTime: `${minutes} 分钟阅读`,
    draft: Boolean(row.draft),
    featured: Boolean(row.featured),
    cover: row.cover || undefined,
    series: row.series || undefined,
    seriesOrder: row.seriesOrder ?? 0,
    content,
  };
}

function toMeta(post: Post): PostMeta {
  const { content: _c, ...meta } = post;
  void _c;
  return meta;
}

export async function dbGetAllPosts(): Promise<PostMeta[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.draft, 0))
    .orderBy(desc(posts.date), desc(posts.id));
  return rows.map((r) => toMeta(rowToPost(r)));
}

export async function dbGetAllPostsWithContent(): Promise<Post[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.draft, 0))
    .orderBy(desc(posts.date), desc(posts.id));
  return rows.map(rowToPost);
}

export async function dbGetPublishedSlugs(): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.draft, 0))
    .orderBy(desc(posts.date), desc(posts.id));
  return rows.map((r) => r.slug);
}

export async function dbGetPostBySlug(slug: string): Promise<Post | null> {
  const db = getDb();
  const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!rows[0]) return null;
  return rowToPost(rows[0]);
}

export async function dbGetFeaturedPosts(): Promise<PostMeta[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.draft, 0), eq(posts.featured, 1)))
    .orderBy(desc(posts.date), desc(posts.id));
  if (rows.length > 0) return rows.map((r) => toMeta(rowToPost(r)));
  const all = await dbGetAllPosts();
  return all.slice(0, 1);
}

export async function dbGetPostsBySeries(series: string): Promise<PostMeta[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.draft, 0), eq(posts.series, series)))
    .orderBy(asc(posts.seriesOrder), asc(posts.date), asc(posts.id));
  return rows.map((r) => toMeta(rowToPost(r)));
}

export async function dbGetAllSeries(): Promise<{ series: string; count: number }[]> {
  const db = getDb();
  const rows = await db
    .select({
      series: posts.series,
      count: count(),
    })
    .from(posts)
    .where(and(eq(posts.draft, 0), isNotNull(posts.series), ne(posts.series, "")))
    .groupBy(posts.series)
    .orderBy(desc(sql`max(${posts.date})`));

  return rows
    .filter((r) => r.series)
    .map((r) => ({ series: String(r.series), count: Number(r.count) }));
}

export async function dbUpsertPost(input: {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
  cover?: string;
  series?: string;
  seriesOrder?: number;
  featured?: boolean;
  draft?: boolean;
}) {
  const db = getDb();
  const now = new Date().toISOString();
  const values = {
    slug: input.slug,
    title: input.title,
    description: input.description,
    content: input.content,
    date: input.date,
    tags: JSON.stringify(input.tags ?? []),
    cover: input.cover || null,
    series: input.series || null,
    seriesOrder: input.seriesOrder ?? 0,
    featured: input.featured ? 1 : 0,
    draft: input.draft ? 1 : 0,
    updatedAt: now,
  };

  await db
    .insert(posts)
    .values({
      ...values,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: posts.slug,
      set: {
        title: values.title,
        description: values.description,
        content: values.content,
        date: values.date,
        tags: values.tags,
        cover: values.cover,
        series: values.series,
        seriesOrder: values.seriesOrder,
        featured: values.featured,
        draft: values.draft,
        updatedAt: now,
      },
    });
}

export async function dbPing(): Promise<{ ok: boolean; message: string }> {
  try {
    const db = getDb();
    await db.run(sql`SELECT 1 AS ok`);
    return { ok: true, message: "D1 连接正常" };
  } catch (error) {
    console.error("D1 health check failed", error);
    return { ok: false, message: "Database health check failed" };
  }
}
