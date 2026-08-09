import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const [slug, outputName] = process.argv.slice(2);

if (!slug || !outputName || !/^[a-z0-9-]+$/.test(slug)) {
  throw new Error(
    "Usage: node scripts/create-post-migration.mjs <slug> <migration.sql>",
  );
}

if (!/^\d{4}_[a-z0-9_-]+\.sql$/.test(outputName)) {
  throw new Error("Migration filename must look like 0002_post_name.sql");
}

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(value ?? ""));
  if (!match) throw new Error("Post date must use YYYY-MM-DD");
  return match[1];
}

const sourcePath = path.join(root, "content", "posts", `${slug}.md`);
const outputPath = path.join(root, "drizzle", outputName);
const raw = fs.readFileSync(sourcePath, "utf8");
const { data, content } = matter(raw);
const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
const cover = typeof data.cover === "string" ? `'${escapeSql(data.cover)}'` : "NULL";
const series = typeof data.series === "string" ? `'${escapeSql(data.series)}'` : "NULL";

const sql = `-- Generated from content/posts/${slug}.md
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('${escapeSql(slug)}', '${escapeSql(data.title ?? slug)}', '${escapeSql(data.description ?? "")}', '${escapeSql(content.trim())}', '${escapeSql(normalizeDate(data.date))}', '${escapeSql(JSON.stringify(tags))}', ${cover}, ${series}, ${Number(data.seriesOrder) || 0}, ${data.featured ? 1 : 0}, ${data.draft ? 1 : 0})
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
  updated_at=CURRENT_TIMESTAMP;
`;

fs.writeFileSync(outputPath, sql, "utf8");
console.log(`Wrote ${path.relative(root, outputPath)}`);
