/**
 * Cloudflare Workers 绑定访问
 *
 * 在 Sites / wrangler(workerd) 下使用官方模块：
 *   import { env } from "cloudflare:workers"
 *
 * 本地请用：npm run preview:cf（wrangler dev + D1/R2）
 * 纯 Node 的 `vinext start` 无法解析 cloudflare: 协议，不能访问 D1。
 *
 * 测试可注入：globalThis.__BLOG_CF_ENV__
 */

import { env as workersEnv } from "cloudflare:workers";

export type CloudflareEnv = {
  DB: D1Database;
  UPLOADS: R2Bucket;
  ASSETS?: Fetcher;
  POST_WRITE_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_GITHUB_USERNAME?: string;
  NEXT_PUBLIC_PAYPAL_ME_URL?: string;
  NEXT_PUBLIC_PAYPAL_QR?: string;
  NEXT_PUBLIC_GISCUS_REPO?: string;
  NEXT_PUBLIC_GISCUS_REPO_ID?: string;
  NEXT_PUBLIC_GISCUS_CATEGORY?: string;
  NEXT_PUBLIC_GISCUS_CATEGORY_ID?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __BLOG_CF_ENV__: CloudflareEnv | undefined;
}

export function getCloudflareEnv(): CloudflareEnv {
  if (globalThis.__BLOG_CF_ENV__?.DB) {
    return globalThis.__BLOG_CF_ENV__;
  }

  // workerd / Sites：官方 env 代理
  try {
    if (workersEnv && typeof workersEnv === "object" && "DB" in workersEnv && workersEnv.DB) {
      return workersEnv as CloudflareEnv;
    }
  } catch {
    /* outside workerd */
  }

  throw new Error(
    "Cloudflare env (DB/UPLOADS) 不可用。本地请运行 npm run preview:cf（wrangler）；公网由 Sites 注入 D1/R2。",
  );
}

export function tryGetCloudflareEnv(): CloudflareEnv | null {
  try {
    return getCloudflareEnv();
  } catch {
    return null;
  }
}
