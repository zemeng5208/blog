import { NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";
import { dbGetPostBySlug, dbUpsertPost } from "@/lib/posts-db";
import { isValidSlug, titleToSlug } from "@/lib/slug";

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
  series?: string;
  seriesOrder?: number | string;
};

function authorize(req: Request): boolean {
  const env = getCloudflareEnv();
  const secret = env.POST_WRITE_SECRET || process.env.POST_WRITE_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-post-token") ?? "";
  return header === secret;
}

export async function POST(req: Request) {
  try {
    if (!authorize(req)) {
      return NextResponse.json({ ok: false, error: "未授权" }, { status: 401 });
    }

    // 确保 D1 可用
    getCloudflareEnv();

    const body = (await req.json()) as Body;
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

    const overwrite = req.headers.get("x-overwrite") === "1";
    const description = (body.description ?? "").trim();
    const cover = (body.cover ?? "").trim() || undefined;
    const series = (body.series ?? "").trim() || undefined;
    const seriesOrder = Number(body.seriesOrder) || 0;
    const featured = Boolean(body.featured);
    const draft = Boolean(body.draft);

    if (!overwrite) {
      const existing = await dbGetPostBySlug(slug);
      if (existing) {
        return NextResponse.json(
          { ok: false, error: `已存在 slug：${slug}，勾选覆盖后可更新` },
          { status: 409 },
        );
      }
    }

    await dbUpsertPost({
      slug,
      title,
      description,
      content,
      date,
      tags,
      cover,
      series,
      seriesOrder,
      featured,
      draft,
    });

    return NextResponse.json({
      ok: true,
      slug,
      url: draft ? null : `/posts/${encodeURIComponent(slug)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
