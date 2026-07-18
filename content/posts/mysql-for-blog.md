---
title: 博客接 MySQL：读写一体与文件备份
description: 个人博客用 MySQL 存文章的取舍：连接配置、建表导入、失败回退 Markdown 文件。
date: 2026-07-17
series: 博客搭建
seriesOrder: 2
tags:
  - MySQL
  - 博客
  - 工程化
---

## 要不要上数据库

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
**双写 + 回退** 是性价比很高的折中：既能练数据库，又不失去文件的简单可靠。
