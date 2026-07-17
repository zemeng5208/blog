import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isValidSlug, titleToSlug } from "@/lib/slug";

export const runtime = "nodejs";

type Body = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string | string[];
  content?: string;
  slug?: string;
  featured?: boolean;
  draft?: boolean;
  cover?: string;
  token?: string;
};

function postsDir() {
  return path.join(process.cwd(), "content", "posts");
}

function authorize(req: Request, bodyToken?: string): boolean {
  const secret = process.env.POST_WRITE_SECRET;
  // 开发环境默认开放；生产环境必须配置密钥
  if (process.env.NODE_ENV !== "production") return true;
  if (!secret) return false;
  const header = req.headers.get("x-post-token") ?? "";
  return header === secret || bodyToken === secret;
}

function yamlEscape(value: string): string {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

function buildMarkdown(data: {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  cover?: string;
  content: string;
}) {
  const lines = [
    "---",
    `title: ${yamlEscape(data.title)}`,
    `description: ${yamlEscape(data.description)}`,
    `date: ${data.date}`,
  ];
  if (data.featured) lines.push("featured: true");
  if (data.draft) lines.push("draft: true");
  if (data.cover) lines.push(`cover: ${yamlEscape(data.cover)}`);
  lines.push("tags:");
  if (data.tags.length === 0) {
    lines.push("  []");
  } else {
    for (const tag of data.tags) {
      lines.push(`  - ${yamlEscape(tag)}`);
    }
  }
  lines.push("---", "", data.content.replace(/^\uFEFF/, "").trimEnd(), "");
  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!authorize(req, body.token)) {
      return NextResponse.json(
        { ok: false, error: "未授权：生产环境请配置 POST_WRITE_SECRET" },
        { status: 401 },
      );
    }

    const title = (body.title ?? "").trim();
    const content = (body.content ?? "").trim();
    if (!title) {
      return NextResponse.json({ ok: false, error: "标题不能为空" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ ok: false, error: "正文不能为空" }, { status: 400 });
    }

    const slugRaw = (body.slug ?? "").trim() || titleToSlug(title);
    const slug = slugRaw.replace(/\.md$/i, "");
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { ok: false, error: "slug 仅允许字母、数字、中文、连字符" },
        { status: 400 },
      );
    }

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : String(body.tags ?? "")
          .split(/[,，]/)
          .map((t) => t.trim())
          .filter(Boolean);

    const today = new Date();
    const date =
      (body.date ?? "").trim() ||
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ ok: false, error: "日期格式应为 YYYY-MM-DD" }, { status: 400 });
    }

    const dir = postsDir();
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${slug}.md`);

    if (fs.existsSync(filePath) && req.headers.get("x-overwrite") !== "1") {
      return NextResponse.json(
        { ok: false, error: `已存在同名文章：${slug}.md，勾选覆盖后可更新` },
        { status: 409 },
      );
    }

    const markdown = buildMarkdown({
      title,
      description: (body.description ?? "").trim(),
      date,
      tags,
      featured: Boolean(body.featured),
      draft: Boolean(body.draft),
      cover: (body.cover ?? "").trim() || undefined,
      content,
    });

    fs.writeFileSync(filePath, markdown, "utf8");

    // 刷新列表与相关页面缓存
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath("/tags");
    revalidatePath("/search");
    revalidatePath("/feed.xml");
    revalidatePath("/sitemap.xml");
    if (!body.draft) {
      revalidatePath(`/posts/${slug}`);
    }

    return NextResponse.json({
      ok: true,
      slug,
      path: `content/posts/${slug}.md`,
      url: body.draft ? null : `/posts/${encodeURIComponent(slug)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
