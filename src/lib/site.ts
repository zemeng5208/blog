/**
 * 个人站点配置
 *
 * GitHub 个性化：填写 github.username 后，头像 / 昵称 / bio / 仓库
 * 会自动从 GitHub 公开 API 拉取（可被下方字段作为缺省回退）。
 */
export const siteConfig = {
  name: "Grok Demo 技术博客",
  shortName: "GrokDemo",
  description:
    "Build · Ship · Glow —— 记录编程、工程实践与技术思考。分享前端、后端、工具链与成长笔记。",
  /** 站点完整 URL，用于 RSS / sitemap / SEO（上线后请改成真实域名） */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-CN",

  /**
   * 连接 GitHub
   * username 默认读取环境变量，否则使用本机已识别账号
   */
  github: {
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "zemeng5208",
  },

  author: {
    /** GitHub 无 name 时的回退显示名 */
    name: "zemeng5208",
    role: "全栈开发者 · 终身学习者",
    bio: "喜欢用代码解决问题，也喜欢把踩坑与收获写下来。关注前端工程化、TypeScript 与可读性。",
    /** GitHub 拉取失败时的本地头像 */
    avatar: "/avatar.svg",
  },

  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/tags", label: "标签" },
    { href: "/search", label: "搜索" },
    { href: "/write", label: "写文章" },
    { href: "/about", label: "关于" },
  ],

  social: {
    /** 会被 GitHub 主页链接覆盖展示，仍保留作回退 */
    github: "https://github.com/zemeng5208",
    email: "2403543757@qq.com",
    twitter: "",
    rss: "/feed.xml",
  },

  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Announcements",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
  },
};

export function isGiscusEnabled() {
  const { repo, repoId, categoryId } = siteConfig.giscus;
  return Boolean(repo && repoId && categoryId);
}
