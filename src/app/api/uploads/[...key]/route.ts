import { NextResponse } from "next/server";
import { getCloudflareEnv } from "@/lib/cloudflare";

type Ctx = { params: Promise<{ key: string[] }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { key: parts } = await ctx.params;
    if (!parts?.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // 防止路径穿越
    if (parts.some((p) => p === ".." || p.includes("\\"))) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const key = parts.join("/");
    const env = getCloudflareEnv();
    if (!env.UPLOADS) {
      return new NextResponse("R2 unavailable", { status: 500 });
    }

    const obj = await env.UPLOADS.get(key);
    if (!obj) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const headers = new Headers();
    const contentType = obj.httpMetadata?.contentType || "application/octet-stream";
    headers.set("Content-Type", contentType);
    headers.set(
      "Cache-Control",
      obj.httpMetadata?.cacheControl || "public, max-age=31536000, immutable",
    );
    headers.set("X-Content-Type-Options", "nosniff");
    if (obj.httpEtag) {
      headers.set("ETag", obj.httpEtag);
    } else if (obj.etag) {
      headers.set("ETag", obj.etag);
    }

    const body = await obj.arrayBuffer();
    return new NextResponse(body, { status: 200, headers });
  } catch (error) {
    console.error("Upload read failed", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
