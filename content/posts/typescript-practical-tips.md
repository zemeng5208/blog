---
title: TypeScript 实用小技巧
description: 几个在日常开发里高频用到的 TS 写法，帮助类型更准、代码更清晰。
date: 2026-07-15
cover: /covers/typescript.svg
tags:
  - TypeScript
  - 前端
  - 工程化
---

TypeScript 的价值不只是「少报错」，更是把领域约束写进类型系统。下面是几个实用小技巧。

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

类型是给未来的自己写的文档。适度精确、避免过度工程，才是可持续的 TypeScript 实践。
