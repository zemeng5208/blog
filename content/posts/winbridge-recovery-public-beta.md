---
title: WinBridge Recovery 首个公开测试版发布
description: 一个独立的 Windows GPT/Codex Desktop 插件修复与安全启动工具，支持 Browser、Chrome 和 Computer Use 状态恢复。
date: 2026-08-10
featured: true
series: Windows 工具开发
seriesOrder: 1
tags:
  - Windows
  - GPT 插件修复
  - Codex
  - 开源工具
  - 插件恢复
---

## 为什么重新命名

这个项目最初使用了容易让人误解为官方产品的名称和视觉元素。公开发布前，我将它统一改名为 **WinBridge Recovery**，并重新设计了独立图标、安装器、快捷方式和公开文档。

WinBridge Recovery 是一个学生独立开发的非商业社区测试项目，与 OpenAI 没有隶属、赞助或认可关系。文中出现 GPT、Codex、Browser、Chrome 和 Computer Use 等名称，仅用于说明兼容对象和实际技术功能。

## 它解决什么问题

Windows 版 GPT/Codex Desktop 更新或重启后，少数环境可能出现 Browser、Chrome 或 Computer Use 插件消失、缓存不一致、`latest` 指针失效、旧运行时路径残留，或者浏览器后台进程锁住 Native Host 文件等问题。

这些问题通常涉及 Desktop 安装包、bundled marketplace、插件缓存、运行时路径、Native Host 和当前会话状态。只修复一个目录或指针，下一次更新后仍可能复发。

WinBridge Recovery 将检查、备份、恢复、启动和启动后验证组织成一套可重复执行且能够回滚的流程。

## 主要功能

1. 识别当前电脑安装的官方 Desktop 包和资源版本；
2. 关闭 Chrome 与 Edge，降低 Windows 文件锁造成缓存更新失败的概率；
3. 检查 Browser、Chrome、Computer Use 的 marketplace、缓存、版本目录和注册状态；
4. 只在发现不一致时，从目标电脑当前安装的官方包重建缺失部分；
5. 修改前创建可校验备份，并只保留最近三份有效备份；
6. 启动 Desktop，并等待连续两次干净的启动后静态检查；
7. 提供诊断、回滚、自检、主题以及 Snake 和 Breakout 小游戏。

## 安全和品牌边界

- 不修改或接管 `WindowsApps` 权限；
- 不绕过 Browser 的企业网络、安全或自动化策略；
- 不携带账号凭据、浏览器密码、Cookie、Token、API Key、会话数据库、用户日志或私钥；
- 不重新分发官方 Desktop 或官方插件文件；
- 修复来源仅为用户自己电脑上当前安装的官方包；
- 使用原创产品名称和图标，不包含第三方品牌图标；
- 正常卸载默认保留恢复备份；
- 卸载器只删除安装清单确认属于本工具的目录，不递归删除用户选择的父目录。

## 发布前验证

- 启动器与守护程序编译：通过；
- 安装器编译：通过；
- 隔离静默安装：通过；
- 隔离卸载：通过；
- 安装父目录中的无关测试文件在卸载后仍然存在：通过；
- 恢复备份目录默认保留：通过；
- 个人绝对路径、邮箱和常见密钥模式扫描：0 命中；
- GitHub Secret Scanning 当前公开警报：0。

当前安装包 SHA-256：

```text
73C59D0253760465CD77052B3B009DE1A013EBC5C8512A2283A8F14F3E810910
```

## 下载与源码

- [项目源码](https://github.com/zemeng5208/winbridge-recovery)
- [WinBridge Recovery v2.1 Beta 发布页](https://github.com/zemeng5208/winbridge-recovery/releases/tag/v2.1.0-beta.1)

安装包使用自签名测试证书，不具备商业代码签名证书的公共信任链。Windows 可能显示未知发布者或 SmartScreen 提示。运行前应核对发布页面中的 SHA-256。

## 如何判断修复成功

三个插件必须分别进行真实验证：

- Browser：在内置浏览器中真实打开页面、读取内容并完成交互；
- Chrome：通过扩展连接真实 Chrome 标签页、读取页面并完成交互；
- Computer Use：客户端、辅助传输和 Windows UI 操作全部成功。

仅看到插件文件、注册项、`Connected` 或静态检查通过，不足以证明完整可用。

## 当前阶段

这是公开测试版，适合愿意反馈问题和参与二次开发的测试者。MIT 许可证只适用于项目自己的原创代码和素材，不授予任何第三方软件、名称、商标或资产的权利。

本项目目前免费、非商业，主要用于学习、测试和帮助遇到同类 Windows 插件状态问题的用户。
