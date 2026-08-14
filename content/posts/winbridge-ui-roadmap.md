---
title: WinBridge Issue #2：UI 与设置路线图——漂亮只是基础，状态必须看得懂
description: WinBridge v3.1.1 已经拥有完整 WPF 界面，下一阶段重点转向 DPI、可访问性、信息层级、日志可读性与跨窗口一致性。
date: 2026-08-14
featured: false
series: Windows 工具开发
seriesOrder: 5
tags:
  - WinBridge Recovery
  - WPF
  - UI
  - Accessibility
  - Windows
  - Issue
---

WinBridge 仓库里的 **Issue #2** 专门跟踪 UI / Settings。

它现在已经不是“给工具加一个好看的窗口”这么简单，因为 v3.1.1 本身已经有自定义无边框 WPF 启动器、Classic dark / Glass 两套主题、运行时主题切换、Reduce Motion、六种语言、五阶段恢复进度、三张插件状态卡、实时日志、齿轮菜单、Accordion 设置中心、Activity、Games 和 Update 等窗口。

所以接下来的问题不是“还缺几个按钮”，而是这些东西在不同电脑、不同缩放、不同语言和不同输入方式下是否真正可靠。

## P0：Windows DPI 和响应式布局

当前主窗口仍然有一些固定结构尺寸。在开发机上看起来没问题，不代表 1366×768 或 125%、150%、175%、200% DPI 都能正常工作。

未来需要真正测试这些组合，并逐步减少不必要的固定尺寸，尤其关注：

- 左侧阶段栏空间不足时能否收缩；
- 三张插件卡在窄窗口下是否应该重排；
- 法语、俄语长文本会不会撞到控件；
- 阿拉伯语是否只是翻译字符串，还是实际支持 RTL 布局。

## 当前动作应该比装饰更醒目

恢复工具最重要的问题永远是：**现在到底在干什么？**

所以 Issue #2 计划让界面明确区分：

- Healthy fast path；
- Targeted repair；
- Full repair。

还应该显示简短原因，例如 `Chrome latest target stale`、`Native Host registry missing`、`Computer Use runtime generation mismatch`。

最后也不能只显示一个“100%”。真正有用的完成摘要应该告诉用户修了什么、什么没动、有哪些 warning、是否发生 rollback、日志在哪里。

## 每个操作都必须有可见反馈

很多桌面应用都有一种很糟糕的体验：按钮点了，实际上成功了，但界面什么都不说。用户自然会以为“按钮坏了”。

WinBridge 后续会坚持一个原则：

> 每一个用户触发的操作，都应该有清楚的成功/失败结果。

打开日志、复制诊断、检查更新、改主题、运行诊断、执行修复，都不应该靠用户自己猜。

## 无障碍不能只做到“有按钮”

现在项目已经使用真实的 WPF Button / CheckBox / Slider，也给部分图标按钮加了 tooltip 和 automation name，但这还不算系统化无障碍。

Issue #2 里还包括：

- 所有 icon-only 控件补 accessible name；
- 检查合理 Tab order；
- 键盘也能展开 Accordion；
- 让 stage、plugin、percentage、final result 对辅助技术有意义；
- 不要每一行 log 都触发屏幕阅读器播报；
- 检查 muted text 和 Glass 模式下的对比度；
- 不依赖单一颜色表达成功/警告/错误；
- 尽量尊重 Windows High Contrast。

## 视觉一致性比“每个窗口都单独漂亮”更重要

随着窗口越来越多，如果每个窗口都各自硬编码颜色、圆角、阴影和标题栏，就会慢慢长成几套不同产品。

后续会把更多内容集中成 theme token：spacing、corner radius、border weight、control height、typography、hover / pressed / focus、title bar，而不是每个窗口都重复造一遍。

## 日志要同时照顾摘要和细节

完整日志不能删，因为排障需要；普通用户也不应该被上百行技术输出淹没。

未来比较理想的是同时存在：简洁恢复摘要、WARN/ERROR 过滤视图、完整文件日志、Copy all、Copy selected diagnostics 和可暂停 auto-scroll。

用户想知道“修好了吗”时，不需要读完整日志；真正排障时，又能拿到全部细节。

## 动画必须服从状态

3.1.1 已经降低动画负载，`Reduce Motion` 也可以关闭粒子。

后续还会继续做：最小化或不可见时暂停、进度收敛后停止 timer、高负载恢复阶段减少装饰效果。动画永远不能阻塞真实任务完成。

## 错误应该被翻译成人能做决定的状态

未来 UI 希望把底层错误归类成更稳定的用户语言：

- locked；
- stale；
- partial；
- protected-copy；
- Native Host；
- upstream runtime；
- unsupported policy。

然后再告诉用户：WinBridge 可以修、只能诊断、建议等待上游，还是因为安全策略主动停止。

- [Issue #2：UI / Settings roadmap](https://github.com/zemeng5208/winbridge-recovery/issues/2)
- [项目源码](https://github.com/zemeng5208/winbridge-recovery)

如果你遇到某个缩放比例文字被截断、键盘无法操作、阿拉伯语布局不对、日志卡顿，或者某个按钮“点了不知道有没有成功”，都可以直接在 #2 留下来。
