---
title: 多主题博客：变量优先的设计笔记
description: 如何用一套 CSS 变量支撑八套主题，并让文章卡片、导航、按钮一起变色。
date: 2026-07-17
series: 博客搭建
seriesOrder: 3
tags:
  - 前端
  - CSS
  - 主题
---

## 目标

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
卡片、封面、标签一旦漏网写死色，用户就会觉得「主题坏了」。
