---
title: 用 Next.js 搭建 Markdown 技术博客
description: 从内容目录、frontmatter 到路由生成，拆解一个简洁可维护的静态博客架构。
date: 2026-07-12
cover: /covers/nextjs.svg
tags:
  - Next.js
  - Markdown
  - 前端
---

用 Markdown 写博客是许多开发者的默认选择：版本可控、专注内容、不依赖后台。

## 整体架构

```text
content/posts/*.md   →  文章源文件
src/lib/posts.ts     →  读取与解析
src/app/posts/[slug] →  文章页面
```

核心思路是：**内容与展示分离**。改样式不必动文章，写文章也不必懂 React。

## Frontmatter 约定

每篇文章顶部使用 YAML frontmatter：

| 字段 | 说明 |
|------|------|
| `title` | 标题 |
| `description` | 摘要，用于列表与 SEO |
| `date` | 发布日期 `YYYY-MM-DD` |
| `tags` | 标签数组 |
| `draft` | 可选，为 `true` 时不展示 |

## 解析流程

1. 用 Node `fs` 读取 `content/posts`
2. 用 `gray-matter` 拆出元数据与正文
3. 用 `reading-time` 估算阅读时长
4. 在页面里用 `react-markdown` 渲染

示例代码：

```ts
import fs from "fs";
import matter from "gray-matter";

const raw = fs.readFileSync("content/posts/hello.md", "utf8");
const { data, content } = matter(raw);
```

## 路由与静态生成

Next.js App Router 中，动态路由 `[slug]` 配合 `generateStaticParams`，可以在构建时预生成所有文章页，适合博客这类以读为主的站点。

## 小结

- 内容放 Markdown，逻辑放 TypeScript
- 元数据用 frontmatter 统一管理
- 构建时静态化，访问快、部署简单

下一篇可以聊聊代码高亮、标签页与搜索等增强功能。
