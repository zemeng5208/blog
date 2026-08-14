---
title: WinBridge Recovery 4.0 Alpha 1：从“修复脚本外壳”走向隔离运行时与诊断优先
description: 4.0 Alpha 1 已发布源码开发预览：新的 Electron/Worker 架构、诊断优先流程、独立插件状态面板与 74 项自动化测试。
date: 2026-08-14
featured: true
series: Windows 工具开发
seriesOrder: 3
tags:
  - WinBridge Recovery
  - Electron
  - Worker
  - Codex
  - 软件架构
  - Alpha
---

WinBridge Recovery `4.0.0 Alpha 1` 已经作为 **Development Preview** 发布。

这不是给普通用户“升级安装”的版本，而是一次源码层面的架构公开：我想先把新的运行时边界、界面结构、诊断流程和验证体系放出来，再继续推进真正的 4.0 修复能力。

## 为什么 4.0 要单独做

3.1.1 已经可以作为稳定版本继续使用，但随着项目从最初的脚本型修复工具逐渐加入 GUI 启动器、设置中心、多语言、公开动态、应用内更新、游戏和更复杂的诊断状态，继续在同一套结构上无限叠加会越来越难维护。

所以 4.0 没有简单地在 `main` 上继续改，而是以 `v4-development` 作为集成分支，明确和 3.1.1 稳定线分开。

## 新的隔离运行时架构

Alpha 1 已经包含新的 **Electron runtime + Worker architecture**。

最重要的不是“Electron”三个字，而是隔离：UI 不应该直接承担恢复引擎的全部责任，重任务和界面线程要有清晰边界，诊断、状态流、日志和用户操作也需要结构化通信。

3.x 更像是在成熟恢复脚本外面逐步长出桌面体验；4.0 则是在重新定义这些层之间的契约。

## Diagnose First：先告诉用户发生了什么

4.0 的一个核心方向是 **Diagnose First**。

新的流程更强调：先读取环境和状态，清楚告诉用户发现了什么，区分“健康”“可修复”“实验性”“可能是上游问题”等状态，再由用户决定是否进入修复阶段。

Browser、Chrome、Computer Use 的故障并不都属于同一种原因。企业策略、上游运行时错误、文件锁、缓存漂移，本来就不应该被一个“自动修复”按钮混为一谈。

## 三个插件分开显示

4.0 会把 Browser、Chrome、Computer Use 独立呈现，而不是只给一个笼统的“插件正常/异常”。

真实排障里经常会出现：Browser 异常但 Chrome 正常、Native Host 丢失但插件缓存没问题、Computer Use 的运行时树出现代际不一致等情况。

把它们拆开，最终也是为了让修复计划可以拆开。

## 终端输出开始结构化

Alpha 1 加入了受限、结构化的终端输出和语义高亮。

完整日志仍然保留，但用户快速读懂的摘要会和原始诊断分开。UI 不能因为每一行输出都重新布局，也不能用漂亮动画掩盖真正的错误信息。

## 新界面系统不是单纯换皮

Alpha 1 还包含可配置布局、material 模式、颜色系统、无障碍回退，以及更可信的 progress gating。

未来“进度到了 100%”应该对应真实状态，而不是动画自己走到了 100%。

Snake 和 Minesweeper 仍然保留，公开动态也继续存在，但这些非核心功能必须服从一个原则：**不能影响恢复可靠性，也不能把网络不可达变成主程序故障。**

## 74 项自动化测试只是起点

Alpha 1 发布检查点记录了：

- Runtime tests：**74 passed, 0 failed**；
- Frontend integrity verification：通过；
- Frozen 3.1.1 snapshot verification：通过；
- Packaging input validation：通过。

Frozen 3.1.1 snapshot 很重要：4.0 在重构时仍然保留对稳定恢复引擎基线的冻结验证，避免新架构在不知不觉中改变已经验证过的边界。

## 为什么没有安装包

Alpha 1 **没有提供 installer、portable ZIP 或 executable**，真实修复默认也关闭。

这是刻意的。一个 Alpha 如果还没完成最终恢复验收，就不应该靠一个看起来很正式的安装包让用户误以为它已经可以替代稳定版。

现在它更适合源码审查、架构讨论、开发协作、UI 和运行时测试。

## 当前分工

如果只是正常使用：继续用 **3.1.1**。

如果想参与 4.0：以 `v4-development` 为集成基础，做聚焦的分支和 PR。

- [4.0.0 Alpha 1](https://github.com/zemeng5208/winbridge-recovery/releases/tag/v4.0.0-alpha.1)
- [WinBridge Recovery](https://github.com/zemeng5208/winbridge-recovery)
- [快速反馈](https://github.com/zemeng5208/winbridge-recovery/issues/new?template=quick_feedback.yml)

我会继续把 4.0 的进展拆成文章记录，而不是等“全部做完”以后才回头写一份无法还原决策过程的总结。
