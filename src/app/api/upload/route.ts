import { NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

function authorize(req: Request): boolean {
  const env = getCloudflareEnv();
  const secret = env.POST_WRITE_SECRET || process.env.POST_WRITE_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-post-token") ?? "";
  return header === secret;
}

function extFromType(type: string): string {
  if (type === "image/png") return ".png";
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/webp") return ".webp";
  if (type === "image/gif") return ".gif";
  return ".bin";
}

export async function POST(req: Request) {
  try {
    if (!authorize(req)) {
      return NextResponse.json({ ok: false, error: "未授权" }, { status: 401 });
    }

    const env = getCloudflareEnv();
    if (!env.UPLOADS) {
      return NextResponse.json({ ok: false, error: "R2 绑定 UPLOADS 不可用" }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "请选择图片文件" }, { status: 400 });
    }

    if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
      return NextResponse.json({ ok: false, error: "禁止上传 SVG（安全风险）" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "仅支持 png / jpeg / webp / gif" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "图片不能超过 5MB" }, { status: 400 });
    }

    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const id = crypto.randomUUID();
    const ext = extFromType(file.type);
    // R2 object key（读取走 /api/uploads/[...key]）
    const key = `${y}/${m}/${id}${ext}`;

    const ab = await file.arrayBuffer();
    await env.UPLOADS.put(key, ab, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
      customMetadata: {
        originalName: file.name.slice(0, 200),
      },
    });

    const url = `/api/uploads/${key}`;
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ ok: false, error: "服务器处理失败" }, { status: 500 });
  }
}
