/**
 * 从 content/posts/*.md 生成 D1 种子 SQL：drizzle/0001_seed_posts.sql
 * 用法：node scripts/seed-d1.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsDir = path.join(root, "content", "posts");
const outFile = path.join(root, "drizzle", "0001_seed_posts.sql");

function esc(s) {
  return String(s ?? "").replace(/'/g, "''");
}

function normalizeDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  if (date instanceof Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(date));
  return m ? m[1] : String(date).slice(0, 10);
}

const files = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
  : [];

const statements = [];
for (const file of files) {
  const slug = file.replace(/\.md$/i, "");
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);
  const title = data.title ?? slug;
  const description = data.description ?? "";
  const date = normalizeDate(data.date);
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const cover = typeof data.cover === "string" ? data.cover : null;
  const series = typeof data.series === "string" ? data.series : null;
  const seriesOrder = Number(data.seriesOrder) || 0;
  const featured = data.featured ? 1 : 0;
  const draft = data.draft ? 1 : 0;
  const body = content.trim();

  statements.push(
    `INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('${esc(slug)}', '${esc(title)}', '${esc(description)}', '${esc(body)}', '${esc(date)}', '${esc(JSON.stringify(tags))}', ${cover ? `'${esc(cover)}'` : "NULL"}, ${series ? `'${esc(series)}'` : "NULL"}, ${seriesOrder}, ${featured}, ${draft})
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;`,
  );
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  `-- Auto-generated seed from content/posts (do not edit by hand)\n` +
    statements.join("\n--> statement-breakpoint\n") +
    "\n",
  "utf8",
);

console.log(`Wrote ${statements.length} posts -> ${outFile}`);
