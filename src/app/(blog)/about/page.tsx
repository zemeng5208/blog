import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GitHubRepos } from "@/components/GitHubRepos";
import { getResolvedProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getResolvedProfile();
  return {
    title: "关于",
    description: `关于 ${profile.name}（@${profile.username}）与本技术博客。`,
  };
}

export default async function AboutPage() {
  const profile = await getResolvedProfile({ includeRepos: true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">关于</h1>
        <p className="mt-2 text-[var(--muted)]">
          {profile.fromGitHub
            ? "资料与头像已从 GitHub 同步"
            : "GitHub 暂不可用，显示本地配置"}
        </p>
      </header>

      <div className="space-y-8 text-[15px] leading-relaxed text-[var(--prose)]">
        <section className="card-neon flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-fuchsia-500/30 shadow-[0_0_24px_rgba(232,121,249,0.3)]">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              sizes="96px"
              className="object-cover"
              priority
              unoptimized={
                profile.avatar.endsWith(".svg") ||
                profile.avatar.includes("github") ||
                profile.avatar.includes("githubusercontent")
              }
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">{profile.name}</h2>
            <p className="mt-1 text-sm text-[var(--accent)]">
              @{profile.username}
              {profile.location ? ` · ${profile.location}` : ""}
              {profile.company ? ` · ${profile.company}` : ""}
            </p>
            <p className="mt-3 text-[var(--muted)]">{profile.bio}</p>
            {profile.fromGitHub && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <span>
                  <strong className="text-[var(--heading)]">{profile.followers}</strong> 粉丝
                </span>
                <span>
                  <strong className="text-[var(--heading)]">{profile.following}</strong> 关注
                </span>
                <span>
                  <strong className="text-[var(--heading)]">{profile.publicRepos}</strong> 仓库
                </span>
              </div>
            )}
          </div>
        </section>

        <GitHubRepos repos={profile.repos} />

        <section className="card-neon rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">博客在写什么</h2>
          <ul className="list-inside list-disc space-y-2 marker:text-fuchsia-400">
            <li>前端与全栈开发实践</li>
            <li>工程化、工具链与效率提升</li>
            <li>可读、可维护的代码设计</li>
            <li>学习笔记与项目复盘</li>
          </ul>
        </section>

        <section className="card-neon rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">技术栈</h2>
          <p className="mb-3 text-[var(--muted)]">本站使用以下技术构建：</p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "Tailwind CSS", "Markdown", "React", "GitHub API"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan-400/20 bg-gradient-to-r from-fuchsia-500/15 to-cyan-500/10 px-3 py-1 text-sm text-[var(--chip-fg)]"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="card-neon rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">联系我</h2>
          <p className="mb-4 text-[var(--muted)]">欢迎交流技术、项目合作或提出建议。</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon inline-flex rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              GitHub
            </a>
            {profile.blog && (
              <a
                href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--heading)] transition hover:border-cyan-400/40"
              >
                个人网站
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--heading)] transition hover:border-cyan-400/40"
              >
                发送邮件
              </a>
            )}
            <Link
              href={siteConfig.social.rss}
              className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
            >
              RSS 订阅
            </Link>
            <Link
              href="/posts"
              className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20"
            >
              去看文章
            </Link>
          </div>
          <p className="mt-5 text-xs text-[var(--muted)]">
            GitHub 用户名配置：
            <code className="text-[var(--chip-fg)]">src/lib/site.ts</code> 中{" "}
            <code className="text-[var(--chip-fg)]">github.username</code>，或环境变量{" "}
            <code className="text-[var(--chip-fg)]">NEXT_PUBLIC_GITHUB_USERNAME</code>
            。可选{" "}
            <code className="text-[var(--chip-fg)]">GITHUB_TOKEN</code> 提高 API 配额。
          </p>
        </section>
      </div>
    </div>
  );
}
