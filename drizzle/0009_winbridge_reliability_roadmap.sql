-- Generated from content/posts/winbridge-reliability-roadmap.md
INSERT INTO posts (slug, title, description, content, date, tags, cover, series, series_order, featured, draft)
VALUES ('winbridge-reliability-roadmap', 'WinBridge Issue #3：真正难的长期可靠性——文件锁、四层一致性、Native Host 与 Application Protected', '这篇把 WinBridge 最长期也最难的可靠性问题拆开：谁锁住了文件、状态从哪一层开始漂移、Native Host 应该谁来重建，以及受保护 Store 文件如何安全验证。', '如果说 Issue #1 是“怎么更快”，Issue #2 是“怎么更清楚”，那 **Issue #3** 就是 WinBridge 最核心、也最难长期做完的一条路线：**怎么保证恢复真的正确。**

它覆盖文件锁、四层状态一致性、Last-Known-Good、Native Host 生命周期、Application Protected / EFS、Authenticode、WSL 边界和可选 self-heal。

## 当前 3.1.1 的安全地基

先说已经有的，而不是把路线图写成“什么都没做”。现在 WinBridge 已经可以：

- 识别当前 Store AppX 包和资源布局；
- 用包版本 + bundled plugin / CLI / CUA 内容 hash 判断代际变化；
- 用 FileStream 做字节流复制；
- 对复制结果做 SHA-256；
- 在 staging 里先构建，再切换；
- 同父目录下尽量用原子 swap；
- 失败时反向 rollback；
- 保留 Recovery / Golden backup；
- 记录 pending transaction；
- 用 launcher mutex 阻止并发修复；
- 修复前关闭 Chrome / Edge 和已知 helper；
- 目标仍被锁时拒绝进入破坏性 swap/remove；
- 验证 marketplace、plugin cache、`latest`、Node runtime、app-server、Native Host 等状态；
- 静态健康时跳过修复；
- 启动后要求连续一致性检查。

这些东西必须一直保留。

## P0：真正找到谁锁了文件

现在 WinBridge 能知道“这个目标被锁了”，也能停止一些已知 helper 名称。

但更完整的实现应该回答：哪个 PID、哪个可执行文件、哪条命令行、它为什么打开这个路径。

这比“猜测可能是 node.exe”可靠得多。尤其 Codex 自己可能启动 Node / CUA worker，不能为了释放一个插件缓存路径，就把系统里所有 Node 进程都杀掉。

未来会更偏向**基于锁所有权和真实路径**处理，而不是基于进程名猜。

## 四层一致性模型

WinBridge 现在实际上已经检查很多层，但 Issue #3 希望把它明确成一张人能读懂的矩阵：

1. **AppX / app resources**
2. **active bundled marketplace**
3. **versioned plugin cache + latest**
4. **Native Host / v2 state / app-server / runtime paths**

理想诊断不是只说 `state inconsistent`，而是说：

```text
AppX current
  ↓
Marketplace stale
  ↓
Chrome cache stale
  ↓
Native Host path still points to previous generation
```

这样能直接告诉开发者“第一个分叉点在哪里”。

## Last-Known-Good 不是“有备份”这么简单

真正安全的 LKG 需要满足：staging 完整复制并验证前不切 active；critical file 缺失或 hash 不对时直接 abort；swap 失败时按反向顺序回滚；Recovery backup 必须经过验证；中断后还能通过 transaction record 继续审计；Store 包在修复过程中换代时必须停下来；一个损坏的 mirror 不能因为“目录存在”就被当成健康状态。

3.1.1 已经实现了大部分。未来还考虑在 forensic/debug 模式下保留失败 staging，方便定位极难复现的问题。

## Native Host：能让官方 Desktop 重建，就不要永远自己猜内部结构

当前 WinBridge 对 Native Host 的验证很完整，但在必要时也会直接重建 manifest、Chrome / Edge HKCU NativeMessagingHosts 和 `chrome-native-hosts-v2.json`。

这个能力有价值，但也更耦合内部实现。

长期方向是：

1. 先恢复 runtime、marketplace、plugin cache；
2. 尽量让官方 Desktop 自己完成 Native Host reconciliation；
3. WinBridge 做只读验证；
4. 只有官方 reconciliation 不可用时才进入受控 fallback；
5. fallback 必须有已知 schema/version gate 和完整 rollback。

这个方向更保守，也更不容易因为上游内部格式变化而误修。

## Application Protected / EFS：现在仍然是实验性研究

这是我最不愿意“假装已经解决”的部分。

Microsoft Store 的 `Application Protected` / `Archive, Encrypted` 行为，不一定等同于用户自己管理的传统 NTFS EFS。

3.1.1 已经做了几件正确的事：不接管 WindowsApps、不解密或 patch 官方包、用 FileStream 字节流复制、复制后验证 SHA-256、只复制到普通用户可写 mirror、复制或 hash 失败就终止 staging。

但要把这条路径叫“稳定”，还远远不够。

还需要：

- 明确记录源文件保护/加密属性；
- 把 `copyfile UNKNOWN`、`-4094`、Windows error `6000` 等和普通 I/O 错误分开；
- 在多台真实机器、多次 Store 更新、多版 Windows 上重复测试；
- 为关键 CLI exe 和代表性 CUA / plugin 树做专门回归；
- 加 Authenticode 验证；
- 确认 hash、签名和真实运行行为都一致。

所以在 Issue #3 里，这一块明确标记为 **Experimental / Research**。

## SHA-256 之外，还要看 Authenticode

现在的完整性验证主要建立在 Store package identity、`SignatureKind` 和 source/destination SHA-256 上。

未来还希望对关键 EXE/DLL 验证 Authenticode 状态、检查复制后签名仍有效、记录 signer subject / thumbprint，并在关键可执行文件签名异常时停止自动修复。

这样诊断里可以明确区分 `Store package identity OK` 和 `individual PE signature OK`，它们不是一回事。

## Self-heal 必须是可选的

项目已经拥有内容代际检测、mutex、fast path、staging、rollback、retention 等自愈基础设施，但我不想默认安装常驻服务。

未来即使监听 AppX 更新事件，也应该 opt-in、least privilege、有最大执行时间、不唤醒设备、不绕过企业或浏览器策略、日志可见。

## WSL 和 Windows 是另一条信任边界

普通 Windows 下，项目可以配置当前 Node、CLI、`node_repl`、module path 和 trusted browser-client hash。

但 WSL 场景还会出现 `/mnt/c/...` 和 `C:\...` 两套路径语义。未来第一阶段仍然会以 diagnose-only 为主，不默认生成 wrapper，也不 patch 内部 skill/runtime。

## 这条 Issue 为什么不会很快关闭

Issue #3 的关闭条件很严格：P0 可靠性项完成并回归；Application Protected 路径经过真实 Store 的重复验证，或者被明确宣布不支持；Native Host 默认恢复不再依赖脆弱的未知内部状态；主要失败类型能在 diagnose-only 模式中被清楚归因。

也就是说，上游某一个版本突然“不再复现”，并不等于问题永久解决。

- [Issue #3：Long-term recovery roadmap](https://github.com/zemeng5208/winbridge-recovery/issues/3)
- [项目源码](https://github.com/zemeng5208/winbridge-recovery)

如果你手里有真实的 locked、protected-copy、Native Host、WSL 边界或更新后状态分裂案例，Issue #3 是最适合留下复现信息的地方。日志请务必先脱敏。', '2026-08-14', '["WinBridge Recovery","WindowsApps","Native Host","EFS","可靠性","Issue"]', NULL, 'Windows 工具开发', 6, 0, 0)
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
