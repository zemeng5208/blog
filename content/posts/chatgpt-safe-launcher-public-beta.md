---
title: ChatGPT Safe Launcher 首个公开测试版发布
description: 一个面向 Windows ChatGPT/Codex Desktop 三个 bundled 插件的检测、恢复与安全启动工具，现已开放源码和测试安装包。
date: 2026-08-09
featured: true
series: Windows 工具开发
seriesOrder: 1
tags:
  - Windows
  - ChatGPT
  - Codex
  - 开源工具
  - 插件修复
---

## 为什么做这个工具

Windows 版 ChatGPT/Codex Desktop 更新后，少数环境可能出现 Browser、Chrome 或 Computer Use 插件消失、缓存不一致、旧路径残留，或者浏览器后台进程锁住插件文件等问题。

这些现象往往不是一个简单的“重新安装插件”问题。Desktop 安装包、bundled marketplace、插件缓存、运行时路径、Native Host 和当前会话状态需要彼此一致。只修一个 `latest` 指针，下一次启动或更新后仍可能复发。

ChatGPT Safe Launcher 的目标，是把这套检查和恢复过程变成一个可以重复执行、可回滚、能看懂进度的 Windows 启动器。

## 它会做什么

启动器会在每次运行时识别当前电脑安装的官方 Desktop 版本，并检查三项 bundled 插件：

- Browser：ChatGPT 内置浏览器；
- Chrome：通过官方 Chrome 扩展连接真实标签页；
- Computer Use：Windows 界面控制能力。

正常流程包括：

1. 读取并复用一次性的系统环境画像；
2. 识别当前官方 Desktop 包和资源版本；
3. 关闭 Chrome 与 Edge，避免 Native Host 文件被 Windows 锁住；
4. 检查 marketplace、插件缓存、版本目录和注册状态；
5. 只在检测到不一致时，从当前官方包重建缺失部分；
6. 修改前创建可验证备份，并保留最近三份；
7. 启动 Desktop，等待连续两次干净的启动后检查；
8. 输出可读日志，并按保留策略清理旧日志。

它还提供原生 WPF 图形界面、主题切换、诊断模式、回滚、自检，以及等待期间可以玩的 Snake 和 Breakout 小游戏。

## 安全边界

这个工具不是 OpenAI 官方产品，也不会尝试绕过 Browser 的企业网络、安全或自动化策略。

它遵守以下边界：

- 不修改或接管 WindowsApps 权限；
- 不携带 OpenAI 账号凭据、浏览器密码、Cookie、Token、API Key、会话数据库或用户日志；
- 不把其他电脑上的固定版本或固定路径写死到安装包；
- 只使用当前电脑已经安装的官方 Desktop 包作为修复来源；
- 正常卸载默认保留恢复备份；
- 静态注册通过不会被描述成三个插件已经完整可用。

## 发布前做了哪些检查

这次公开版本不是直接把开发目录打包上传，而是重新建立了一份白名单源码树，并从这份源码重新构建安装包。

发布前检查结果：

- 公开源码文本秘密扫描：0 命中；
- 最终安装包反向提取：36 个 payload 文件；
- 个人绝对路径、用户编号、邮箱、Token、API Key、私钥模式：0 命中；
- 私钥、数据库、日志等敏感扩展名：0 个；
- 隔离安装：退出码 0，安装清单与存储配置正确生成；
- 隔离卸载：退出码 0，程序目录移除，备份目录保留。

安装包的 SHA-256 为：

```text
91540051215E9E514AE689DBD34EC35715BEF14F087ABF691B6EB2A5C54B6CD3
```

## 下载与源码

- [项目源码](https://github.com/zemeng5208/chatgpt-plugin-safe-launcher)
- [v2.0.0 Beta 1 发布页](https://github.com/zemeng5208/chatgpt-plugin-safe-launcher/releases/tag/v2.0.0-beta.1)

当前安装包使用自签名测试证书，不具备商业代码签名的公共信任链。Windows 可能显示未知发布者或 SmartScreen 提示。下载后请先核对发布页中的 SHA-256；哈希不一致时不要运行。

## 如何判断修复是否真的成功

三个插件必须分别验证，不能互相替代：

- Browser 需要在内置浏览器中真实打开页面、读取内容并完成一次交互；
- Chrome 需要通过扩展连接真实 Chrome 标签页、读取页面并完成一次交互；
- Computer Use 需要客户端、辅助传输和 Windows UI 真实操作都成功。

仅看到插件文件、注册项、`Connected` 或静态检查通过，都不足以证明完整可用。

## 当前阶段

这是首个公开测试版，适合愿意反馈问题和参与二次开发的测试者。建议先在非关键 Windows 账户上测试，并保留已有备份。

后续会继续关注不同 Windows 11 环境、不同 Desktop 更新版本、备份恢复、主题与界面、安装器兼容性，以及三插件真实交互验证的稳定性。
