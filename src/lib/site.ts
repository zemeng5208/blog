/**
 * 个人站点配置
 *
 * GitHub 个性化：填写 github.username 后，头像 / 昵称 / bio / 仓库
 * 会自动从 GitHub 公开 API 拉取（可被下方字段作为缺省回退）。
 */
export const siteConfig = {
  name: "Blog · 技术博客",
  shortName: "Blog",
  description:
    "Build · Ship · Glow —— 记录编程、工程实践与技术思考。分享前端、后端、工具链与成长笔记。",
  /** 站点完整 URL，用于 RSS / sitemap / SEO（上线后请改成真实域名） */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zemeng5208-blog.nydiaruby20101986rvz.chatgpt.site",
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

  /** 关于页「代表作」——作品集展示 */
  featuredProjects: [
    {
      name: "Blog 技术博客",
      description:
        "Next.js + MySQL + Monaco 编辑器的个人技术博客：主题系统、Markdown 写作、PayPal 赞助与 GitHub 资料同步。",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zemeng5208-blog.nydiaruby20101986rvz.chatgpt.site",
      repo: "https://github.com/zemeng5208",
      tags: ["Next.js", "TypeScript", "MySQL"],
      highlight: "本站",
    },
    {
      name: "GitHub 主页",
      description: "开源仓库与日常代码练习，持续更新学习轨迹。",
      url: "https://github.com/zemeng5208",
      tags: ["Open Source"],
      highlight: "代码",
    },
  ],

  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/tags", label: "标签" },
    { href: "/series", label: "系列" },
    { href: "/search", label: "搜索" },
    { href: "/support", label: "赞助" },
    { href: "/write", label: "写文章" },
    { href: "/about", label: "关于" },
  ],

  social: {
    /** 会被 GitHub 主页链接覆盖展示，仍保留作回退 */
    github: "https://github.com/zemeng5208",
    email: "",
    twitter: "",
    rss: "/feed.xml",
  },

  /**
   * PayPal 收款（赞助页 /support）
   * 收款码图片放在 public/ 下，例如 public/paypal-qr.png
   */
  paypal: {
    /** PayPal.me 链接，如 https://paypal.me/yourname */
    meUrl: process.env.NEXT_PUBLIC_PAYPAL_ME_URL ?? "https://paypal.me/zemeng520",
    /** 收款码图片路径（项目内 public） */
    qrImage: process.env.NEXT_PUBLIC_PAYPAL_QR ?? "/paypal-qr.png",
    /** 展示用说明 */
    note: "感谢你的支持！每一笔赞助都会用于博客维护、工具订阅与内容创作。付款完全自愿，不绑定会员权益。",
    /** 建议金额文案（展示用） */
    suggestedAmounts: ["$3 咖啡", "$5 加餐", "$10 工具月费", "$20 大力支持"],
    /** 是否在赞助页显示邮箱联系 */
    showEmail: false,
    thanksTitle: "谢谢你 ☕",
    thanksBody:
      "赞助不是义务，而是认可。若文章帮到你，一条反馈或一杯咖啡都是莫大鼓励。",
  },

  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "zemeng5208/blog",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOTch2yA",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements",
    categoryId:
      process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOTch2yM4DDApf",
  },
};

export function isGiscusEnabled() {
  const { repo, repoId, categoryId } = siteConfig.giscus;
  return Boolean(repo && repoId && categoryId);
}
