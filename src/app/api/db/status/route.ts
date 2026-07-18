import { NextResponse } from "next/server";
import { dbPing } from "@/lib/posts-db";
import { tryGetCloudflareEnv } from "@/lib/cloudflare";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = tryGetCloudflareEnv();
  if (!env?.DB) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "D1 绑定 DB 不可用",
    });
  }

  const result = await dbPing();
  return NextResponse.json({
    ok: result.ok,
    configured: true,
    message: result.message,
  });
}
