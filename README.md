# Blog · 技术博客

**在线访问：** [https://zemeng5208-blog.nydiaruby20101986rvz.chatgpt.site](https://zemeng5208-blog.nydiaruby20101986rvz.chatgpt.site)

基于 **Next.js + vinext + TypeScript + Tailwind + D1 + R2** 的个人技术博客，面向 **OpenAI Sites / Cloudflare Workers** 部署。

## 项目目录

```text
D:\blog
```

所有源码、文章、脚本、配置均在此文件夹内。依赖安装在：

```text
D:\blog\node_modules
```

## 快速启动（本地）

1. 复制环境变量：将 `.env.example` 复制为 `.env.local`，填写 `POST_WRITE_SECRET`。
2. 初始化本地 D1（首次）：

```powershell
cd D:\blog
npm install --legacy-peer-deps
npm run db:migrate:local
```

3. 启动开发：

```powershell
npm run dev
# 或双击 一键启动.bat
```

打开 http://localhost:3000

## 生产构建（本地验收）

```powershell
cd D:\blog
npm run build
# 产物：dist/server/index.js 、 dist/client/
npm run start
```

## 目录结构

```text
D:\blog\
├── content/posts/       历史 Markdown（种子来源）
├── db/                  Drizzle schema
├── drizzle/             D1 迁移 + 种子 SQL
├── docs/                文档（含 Sites 公网部署说明）
├── src/                 应用源码
├── worker/              Worker 入口
├── .openai/hosting.json Sites D1/R2 绑定
├── wrangler.jsonc       Cloudflare 本地/部署配置
├── vite.config.ts       vinext 构建
├── 一键启动.bat
└── 一键生产启动.bat
```

## 常用功能

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/posts` | 文章列表 |
| `/series` | 系列 |
| `/search` | 全文搜索 |
| `/write` | 在线写文章（需 `POST_WRITE_SECRET`） |
| `/support` | PayPal 赞助 |
| `/about` | 关于 / 代表作 |

## 数据与上传

- **文章**：Cloudflare **D1**（binding `DB`），不再使用 MySQL
- **图片上传**：Cloudflare **R2**（binding `UPLOADS`），禁止 SVG
- **鉴权**：请求头 `x-post-token` 必须等于环境变量 `POST_WRITE_SECRET`

## 公网部署

本地已完成迁移与构建验收。**Sites 推公网**请交给 Codex，说明见：

- [`docs/Sites部署-给Codex.md`](./docs/Sites部署-给Codex.md)

## 配置

- 站点信息：`src/lib/site.ts`
- 环境变量模板：`.env.example`（本地用 `.env.local`，勿提交）
- 公开 vars：`wrangler.jsonc` 中的 `vars`
