# Sites 公网部署说明（给 Codex）

本地迁移已完成。请 **Codex** 用 Sites 推到公网。**不要提交 `.env.local` 或任何密钥。**

## 项目路径

```text
D:\blog
```

## 本地已就绪

- 技术栈：Next.js App Router + **vinext** + Cloudflare Workers
- 数据：**D1**（Drizzle，`binding: DB`）
- 上传：**R2**（`binding: UPLOADS`）
- 发文/上传鉴权：请求头 `x-post-token` = 环境变量 `POST_WRITE_SECRET`
- 构建命令：`npm run build`（产出 `dist/server/index.js`、`dist/client`）
- 配置：
  - `.openai/hosting.json` → `{ "d1": "DB", "r2": "UPLOADS" }`
  - `wrangler.jsonc` → D1 `blog`、R2 `blog-uploads`
  - 迁移 SQL：`drizzle/0000_init.sql`、`drizzle/0001_seed_posts.sql`

## 部署前检查

```powershell
cd D:\blog
npm install --legacy-peer-deps
npm run build
# 确认存在：
#   dist\server\index.js
#   dist\client\
```

## 建议部署步骤（Sites）

1. 在 Sites / OpenAI Hosting 创建项目，绑定本仓库或本目录。
2. 写入 **secrets / 环境变量**（勿进 Git）：
   - `POST_WRITE_SECRET` = 高强度随机串
   - `NEXT_PUBLIC_SITE_URL` = 公网最终 URL
   - 可选：`NEXT_PUBLIC_GISCUS_*`、PayPal 相关已在 `wrangler.jsonc` vars 有默认值
3. 确保 D1 / R2 绑定名与 `.openai/hosting.json` 一致：`DB`、`UPLOADS`。
4. 对 **远程 D1** 执行迁移（含种子 6 篇）：
   ```powershell
   npx wrangler d1 migrations apply blog --remote
   ```
   若 Sites 控制台有「Run migrations」，优先用控制台。
5. 构建并发布（Sites 一键或）：
   ```powershell
   npm run build
   # 按 Sites 文档 push / deploy；project_id 由 Sites 创建后回填，勿伪造
   ```
6. 公网验收：
   - `GET /` 首页有文章列表
   - `GET /posts`、`/posts/<slug>`
   - `GET /api/db/status` → 连接正常
   - 无 token：`POST /api/posts` → **401**
   - 正确 `x-post-token`：可发文；重复 slug 无覆盖 → **409**
   - `POST /api/upload` + 图片 → R2，URL `/api/uploads/...` 可访问
   - SVG 上传应被拒绝

## 本地开发（非公网）

```powershell
cd D:\blog
# 开发（vinext + cloudflare vite plugin）：
npm run dev

# 生产构建 + workerd 预览（推荐验收 D1/R2）：
# 1) 确保 .dev.vars 含 POST_WRITE_SECRET
# 2) 构建
npm run build
# 3) 对 preview 用的本地 D1 迁移（注意 config 路径）
npx wrangler d1 migrations apply blog --local --config dist/server/wrangler.json
# 4) 启动
npm run preview:cf
# 或双击 一键生产启动.bat
```

`.env.local` / `.dev.vars` 示例见 `.env.example`。本地密钥示例：`POST_WRITE_SECRET=local-dev-secret`。  
**不要**用纯 Node 的 `vinext start` 验收 D1——它无法解析 `cloudflare:workers`。

## 禁止事项

- 不要删除写文章页、图片上传、主题、系列、搜索、PayPal 赞助等功能
- 不要把 `POST_WRITE_SECRET`、`.env.local` 提交到 Git
- 不要伪造 Sites `project_id`
- 不要改回 MySQL / 本地 `fs.writeFile` 作为运行时存储

## 相关文件

| 路径 | 用途 |
|------|------|
| `vite.config.ts` | vinext + cloudflare + sitesPlugin |
| `worker/index.ts` | Worker 入口 |
| `src/lib/posts-db.ts` | D1 读写 |
| `src/app/api/posts/route.ts` | 发文 API |
| `src/app/api/upload/route.ts` | R2 上传 |
| `src/app/api/uploads/[...key]/route.ts` | R2 读取 |
| `drizzle/` | D1 迁移与种子 |
| `.openai/hosting.json` | Sites D1/R2 绑定名 |
