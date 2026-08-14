-- Generated from content/posts/winbridge-performance-roadmap.md
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('winbridge-performance-roadmap', 'WinBridge Issue #1：性能路线图——少做重复工作，但绝不拿完整性换速度', '从重复 SHA-256、启动后深度扫描到 UI 日志渲染，记录 WinBridge v3.1.1+ 的性能优化方向与安全边界。', '我在 WinBridge 仓库里长期保留了一个性能路线图 Issue：**#1 Performance roadmap**。

它不是“程序太慢所以先删检查”，而是反过来：先承认安全检查不能随便删，再去找那些**重复、可以缓存、可以增量化**的工作。

## 现在已经做了什么

v3.1.1 已经有一些基础但很重要的性能措施：

- 静态状态健康时直接跳过完整修复；
- 有效的内容寻址资源镜像可以复用，不必每次重建；
- 首次环境画像可以缓存；
- PowerShell 引擎输出先排队，再批量刷新 UI；
- 可见日志行数有上限，旧日志块批量移除；
- 备份和日志会话数量可以限制；
- 主进度动画和粒子工作量已经降低；
- `Reduce Motion` 可以停止粒子动画；
- 重型修复仍然在 PowerShell 引擎进程里做，不跑在 WPF UI 线程上。

这些都是后续优化不能推翻的地基。

## 第一件事：先测，不要凭感觉

Issue #1 里我把 “Measure before optimizing” 放在 P0。

后续希望每次运行都能给出类似这样的摘要：

```text
Performance
  package-discovery     0.4s
  source-fingerprint    1.2s
  static-diagnosis      2.8s / 9,421 hashes
  staging               skipped
  launch                0.7s
  post-launch-checks    5.3s / 2 passes
  total                 10.9s
```

除了耗时，还应该知道一共 hash 了多少文件、读了多少字节、复制了多少字节，以及走的是 healthy fast path、targeted repair 还是 full rebuild。

没有这些数据，“优化”很容易变成主观猜测。

## 最大热点：重复深度哈希

WinBridge 的安全模型会比较 Browser、Chrome、Computer Use、`@oai/sky`、CUA runtime、app-server helper、marketplace，以及启动后的再次一致性检查。

SHA-256 本身没错，问题是同一个未变化文件在一次运行里不应该重复算很多遍。

未来计划包括：

- 建立单次运行内的 metadata/hash cache；
- 已经算过的 package/source hash 直接复用；
- 先做轻量检查：存在性、文件数、相对路径、大小、版本、关键 manifest；
- 只有轻量检查发现漂移时才进入完整深度 hash；
- 但新复制/新 staging 的内容在激活前仍然必须做 SHA-256 验证。

一句话：**减少重复验证，不是减少必要验证。**

## 启动后检查不能每 5 秒全量重扫

3.1.1 会等待连续两次干净状态，以避免把瞬时正常当成真正稳定，这个原则要保留。

但如果每一次重试都重新做完整树比较，成本就会迅速放大。

未来更合理的结构是：高频做轻量 readiness check，只看 Desktop、包身份、manifest、版本、`latest`、Native Host、runtime path 等易变项；状态稳定后再做一次深度一致性检查；只有关键版本、路径或 mtime 变化时才重新决定是否需要深查。

## 从“全修”走向“有计划地修”

另一个重点是 targeted repair。

如果只有 Native Host 状态坏了，就不应该为了保险把三个插件缓存全重建；如果只有 Chrome 的 `latest` 错了，也不应该连 Browser 和 Computer Use 一起复制。

未来希望诊断先生成明确的 repair plan，然后按计划执行，同时保留 staging、验证和 rollback。

## UI 性能也属于性能问题

恢复引擎再快，如果 UI 因为 RichTextBox、大量日志、动画或重复布局而卡顿，用户感受到的仍然是“软件慢”。

所以 Issue #1 也包括：到达目标进度后暂停不必要的 timer、最小化或不可见时暂停粒子、合并一批状态更新、profile 高日志量场景，如果必要再评估更轻量的日志视图。

## 并发不是默认答案

读文件和 hash 看起来很适合并发，但在 WindowsApps、杀毒扫描、SSD 竞争和文件锁环境下，并发也可能让事情更糟。

所以路线图只把它列为研究项：普通用户目录里的镜像/cache 树可以做有限并发 benchmark；WindowsApps / Application Protected 源继续保守；原子 swap、注册表和配置修改阶段不并发；并发必须有明确上限。

## 不可跨越的优化边界

性能优化不能：

- 跳过新 staging 内容的激活前验证；
- 为了快而削弱 rollback；
- 修改 WindowsApps ACL；
- 在包代际变化后继续相信旧缓存元数据。

- [Issue #1：Performance roadmap](https://github.com/zemeng5208/winbridge-recovery/issues/1)
- [项目源码](https://github.com/zemeng5208/winbridge-recovery)

如果你实际遇到“启动慢、某个阶段卡很久、日志很多时 UI 卡顿”，欢迎直接在 Issue #1 留下环境和现象。真实机器上的慢点，比我在开发机上猜出来的慢点更有价值。', '2026-08-14', '["WinBridge Recovery","性能优化","SHA-256","WPF","Windows","Issue"]', NULL, 'Windows 工具开发', 4, 0, 0)
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
