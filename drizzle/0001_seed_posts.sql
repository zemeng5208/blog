-- Auto-generated seed from content/posts (do not edit by hand)
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('blog-from-zero', '从零搭个人技术博客：我踩过的坑', '用 Next.js 搭博客时，关于目录结构、Markdown、主题与本地部署的真实记录。', '## 为什么要自己搭

现成平台够用，但定制空间有限：主题、写作流、数据归属都不自由。  
我想要一个**完全在自己磁盘上的项目**（`D:\blog`），代码、文章、配置都在一起。

## 第一坑：内容和代码搅在一起

一开始把示例页和业务逻辑混放，改样式时经常误伤文章路由。  
后来固定约定：

| 路径 | 职责 |
|------|------|
| `content/posts/` | 只放 Markdown 文章 |
| `src/app/` | 路由与页面 |
| `src/lib/` | 读文章、数据库、站点配置 |
| `public/` | 图片与静态资源 |

**经验：** 先定目录边界，再堆功能，返工会少很多。

## 第二坑：主题看起来变了，卡片没变

全站 `data-theme` 切换后，背景变了，但封面 SVG 里写死了深紫霓虹色。  
看起来就像「主题没生效」。

解决办法：列表封面改用 **CSS 变量驱动的组件**，不要依赖写死颜色的装饰图。

## 第三坑：本地开发 ≠ 本地生产

`npm run dev` 热更新很爽，但和 `npm run build && npm start` 行为不完全一样。  
写文章接口、环境变量、静态生成都要在生产模式再验一遍。

## 小结

- 目录清晰 > 功能堆砌  
- 主题色走 CSS 变量，别写死在资源文件里  
- 本地也要会「生产部署」  

下一篇会写：把文章接到 MySQL 之后，读写与备份怎么做。', '2026-07-16', '["博客","Next.js","复盘"]', NULL, '博客搭建', 1, 1, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('mysql-for-blog', '博客接 MySQL：读写一体与文件备份', '个人博客用 MySQL 存文章的取舍：连接配置、建表导入、失败回退 Markdown 文件。', '## 要不要上数据库

纯 Markdown 已经能跑通博客。上 MySQL 的动机通常是：

1. 方便以后做后台管理（增删改查）  
2. 搜索、系列、草稿状态更好扩展  
3. 练习真实全栈链路  

代价是：多一套配置、备份与迁移。

## 我的策略：双写

- **读**：优先 MySQL，失败则回退 `content/posts/*.md`  
- **写**：先写 Markdown 文件，再同步写入 MySQL  

这样即使数据库挂了，站点仍能读文件；文章也不会只活在库里。

## 连接配置

全部放在项目内的 `.env.local`（不要提交密码）：

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
MYSQL_DATABASE=blog
```

初始化：

```bash
npm run db:init
```

会建库、建表，并把已有 Markdown 导入。

## 表结构要点

`posts` 表至少包含：`slug`、`title`、`content`、`date`、`tags`、`series`、`draft`。  
`slug` 做唯一索引，和 URL `/posts/[slug]` 一一对应。

## 踩坑

- **空密码**：不要靠「误连」启用数据库，用显式开关或非空密码字段控制  
- **JSON 标签**：MySQL JSON 字段读写时注意 `CAST(? AS JSON)`  
- **时区 / 日期**：前端展示用本地日历日解析，避免少一天  

## 小结

个人博客接 MySQL 不必一步做成 CMS。  
**双写 + 回退** 是性价比很高的折中：既能练数据库，又不失去文件的简单可靠。', '2026-07-17', '["MySQL","博客","工程化"]', NULL, '博客搭建', 2, 0, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('nextjs-markdown-blog', '用 Next.js 搭建 Markdown 技术博客', '从内容目录、frontmatter 到路由生成，拆解一个简洁可维护的静态博客架构。', '用 Markdown 写博客是许多开发者的默认选择：版本可控、专注内容、不依赖后台。

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

下一篇可以聊聊代码高亮、标签页与搜索等增强功能。', '2026-07-12', '["Next.js","Markdown","前端"]', '/covers/nextjs.svg', '博客搭建', 4, 0, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('theme-system-notes', '多主题博客：变量优先的设计笔记', '如何用一套 CSS 变量支撑八套主题，并让文章卡片、导航、按钮一起变色。', '## 目标

用户切换主题时，不只是背景变一下，而是：

- 导航、按钮、标签色  
- 文章卡片与封面  
- 阅读进度条、链接色  

都跟着变，而且选择要**记住**。

## 核心：`data-theme` + CSS 变量

```html
<html data-theme="paper">
```

```css
[data-theme="paper"] {
  --background: #fafafa;
  --card: #ffffff;
  --accent: #0d9488;
  /* ... */
}
```

组件里尽量写：

```tsx
className="bg-[var(--card)] text-[var(--heading)] border-[var(--border)]"
```

而不是 `bg-fuchsia-500` 这类写死色。

## 封面为什么曾「不变」

静态 SVG 封面内部写死了 `#0a0614`、紫色光晕。  
主题变量再正确，图片像素也不会改。

改法：列表封面用 **主题色渐变组件**（`PostCover`），标题和标签叠在上面。

## 状态保存

```ts
localStorage.setItem("blog-theme", themeId);
```

首屏用内联脚本读取，避免闪一下错误主题。

## 可维护性

主题列表集中在 `src/lib/themes.ts`：  
id、中文名、深浅色标记、预览色点。  
新增主题 = 加一条元数据 + 一段 CSS 变量，不必改每个组件。

## 小结

主题系统的关键不是「有多少套皮肤」，而是 **变量是否贯穿 UI**。  
卡片、封面、标签一旦漏网写死色，用户就会觉得「主题坏了」。', '2026-07-17', '["前端","CSS","主题"]', NULL, '博客搭建', 3, 0, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('typescript-practical-tips', 'TypeScript 实用小技巧', '几个在日常开发里高频用到的 TS 写法，帮助类型更准、代码更清晰。', 'TypeScript 的价值不只是「少报错」，更是把领域约束写进类型系统。下面是几个实用小技巧。

## 1. 用 `satisfies` 校验而不拓宽类型

```ts
const routes = {
  home: "/",
  posts: "/posts",
  about: "/about",
} as const satisfies Record<string, `/${string}`>;

// routes.home 仍是 "/" 字面量类型
```

相比 `as const` 后再断言，`satisfies` 能在保持精确类型的同时做结构校验。

## 2. 判别联合（Discriminated Unions）

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function handle(result: Result<number>) {
  if (result.ok) {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
}
```

用同一个字段区分分支，类型收窄会非常自然。

## 3. 从数据推导类型

```ts
const tags = ["Next.js", "TypeScript", "博客"] as const;
type Tag = (typeof tags)[number];
// "Next.js" | "TypeScript" | "博客"
```

先有真实数据，再让类型跟着走，减少重复维护。

## 4. 工具类型组合

```ts
type Post = {
  slug: string;
  title: string;
  content: string;
  draft?: boolean;
};

type PostMeta = Omit<Post, "content">;
type DraftPost = Required<Pick<Post, "draft">> & Post;
```

`Pick` / `Omit` / `Partial` / `Required` 组合使用，比重复声明更安全。

## 5. 未知输入先收窄

处理外部数据（API、Markdown frontmatter）时：

```ts
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}
```

不要默认 `any`，用类型守卫把「未知」变成「可信」。

## 写在最后

类型是给未来的自己写的文档。适度精确、避免过度工程，才是可持续的 TypeScript 实践。', '2026-07-15', '["TypeScript","前端","工程化"]', '/covers/typescript.svg', NULL, 0, 0, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('welcome', '欢迎来到我的技术博客', '第一篇文章：介绍这个博客的定位、写作计划，以及如何用 Markdown 发布内容。', '你好，欢迎来到这个个人技术博客。

## 为什么要写博客

写代码时我们会积累大量经验，但如果不记录，过几个月往往只记得「好像踩过坑」，却想不起具体细节。

这个博客希望做到三件事：

1. **沉淀**：把可复用的知识结构化
2. **复盘**：从项目中提炼方法论
3. **交流**：用文字与同行对话

## 你会看到什么内容

- 前端 / 全栈开发实践
- 工程化与工具链
- 可读、可维护的代码设计
- 学习笔记与项目总结

## 如何新增一篇文章

在项目根目录的 `content/posts` 下新建一个 Markdown 文件，例如 `my-post.md`：

```markdown
---
title: 文章标题
description: 一句话摘要
date: 2026-07-17
tags:
  - Next.js
  - 前端
---

正文从这里开始……
```

保存后重新运行开发服务器，文章会出现在首页与文章列表中。

## 写在最后

技术在变，写作习惯值得长期保持。希望这里的内容对你有所帮助——如果有任何想法，欢迎通过关于页联系我。', '2026-07-10', '["随笔","博客"]', '/covers/welcome.svg', '博客搭建', 0, 0, 0)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  description=excluded.description,
  content=excluded.content,
  date=excluded.date,
  tags=excluded.tags,
  cover=excluded.cover,
  series=excluded.series,
  series_order=excluded.series_order,
  featured=excluded.featured,
  draft=excluded.draft,
  updated_at=CURRENT_TIMESTAMP;
