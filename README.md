# GrokDemo 个人技术博客

基于 **Next.js + TypeScript + Tailwind CSS + Markdown** 的赛博霓虹风个人技术博客。

## 项目唯一根目录

```text
D:\grokdemo
```

**所有文件（源码、文章、脚本、配置、文档）都必须在此文件夹内。**  
不要写到 `C:\Users\...` 或其他路径。

## 目录结构

```text
D:\grokdemo\
├── content/posts/       # 博客文章（Markdown）
├── docs/                # 项目文档
├── public/              # 静态资源、封面、头像
├── scripts/             # 本地部署脚本
├── src/                 # 全部源码
│   ├── app/             # 页面与 API
│   ├── components/      # UI 组件
│   └── lib/             # 工具与配置
├── .env.example         # 环境变量模板（提交 git）
├── .env.local           # 本地密钥（不提交）
├── package.json
└── README.md
```

## 开发模式

```powershell
cd D:\grokdemo
npm install
npm run dev
```

打开 http://localhost:3000

## 本地生产部署（不上公网）

详见 [`docs/本地部署.md`](docs/本地部署.md)。

```powershell
cd D:\grokdemo
npm run prod
# 或
npm run deploy:local
```

## 功能一览

- GitHub 头像 / 资料同步（`zemeng5208`）
- Markdown 文章 + 封面 + 精选
- 标签、搜索、RSS、sitemap
- 阅读进度、目录 TOC、代码复制、相关文章
- 霓虹 / 护眼黑主题
- 写文章：Monaco 编辑器 + 中文关键字 Tab 提示
- Giscus 评论（可选）

## 个人化

编辑 **`src/lib/site.ts`**，或配置 **`.env.local`**：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_USERNAME=zemeng5208
POST_WRITE_SECRET=local-dev-secret
```

## 写文章

1. 浏览器打开 http://localhost:3000/write  
2. 或在 **`content/posts/`** 新建 `.md`：

```markdown
---
title: 文章标题
description: 一句话摘要
date: 2026-07-17
featured: true
cover: /covers/my-cover.svg
tags:
  - 前端
---

正文……
```

## 常用地址

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/posts` | 文章列表 |
| `/write` | 写文章 |
| `/search` | 搜索 |
| `/tags` | 标签 |
| `/about` | 关于 |
| `/feed.xml` | RSS |
| `/sitemap.xml` | 站点地图 |

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发 |
| `npm run build` | 生产构建 |
| `npm run start` | 生产启动 |
| `npm run prod` | 构建并启动 |
| `npm run deploy:local` | 本地部署脚本 |
| `npm run lint` | 代码检查 |
