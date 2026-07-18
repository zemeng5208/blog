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
  const projects = siteConfig.featuredProjects ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">关于</h1>
        <p className="mt-2 text-[var(--muted)]">
          {profile.fromGitHub
            ? "资料与头像已从 GitHub 同步 · 作品集与联系方式"
            : "GitHub 暂不可用，显示本地配置"}
        </p>
      </header>

      <div className="space-y-8 text-[15px] leading-relaxed text-[var(--prose)]">
        <section className="post-card flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:p-8">
          <div
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border"
            style={{
              borderColor: "var(--border-strong)",
              boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 30%, transparent)",
            }}
          >
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

        {/* 代表作 */}
        {projects.length > 0 && (
          <section className="post-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h2 className="mb-1 text-lg font-semibold text-[var(--heading)]">代表作</h2>
            <p className="mb-5 text-sm text-[var(--muted)]">精选项目，适合快速了解我在做什么。</p>
            <ul className="space-y-4">
              {projects.map((p) => (
                <li
                  key={p.name}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[var(--heading)]">
                        {p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[var(--accent)]"
                          >
                            {p.name}
                          </a>
                        ) : (
                          p.name
                        )}
                      </p>
                      {p.highlight && (
                        <span className="mt-1 inline-block rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[11px] text-[var(--chip-fg)]">
                          {p.highlight}
                        </span>
                      )}
                    </div>
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--link)] hover:underline"
                      >
                        仓库 →
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{p.description}</p>
                  {p.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--chip-fg)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <GitHubRepos repos={profile.repos} />

        <section className="post-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">博客在写什么</h2>
          <ul className="list-inside list-disc space-y-2 marker:text-[var(--accent)]">
            <li>前端与全栈开发实践</li>
            <li>工程化、工具链与效率提升</li>
            <li>可读、可维护的代码设计</li>
            <li>学习笔记与项目复盘</li>
          </ul>
        </section>

        <section className="post-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">技术栈</h2>
          <p className="mb-3 text-[var(--muted)]">本站使用以下技术构建：</p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "TypeScript", "MySQL", "Tailwind CSS", "Monaco", "GitHub API"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--border)] bg-[var(--chip-bg)] px-3 py-1 text-sm text-[var(--chip-fg)]"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </section>

        <section className="post-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">联系我</h2>
          <p className="mb-4 text-[var(--muted)]">欢迎交流技术、项目合作或提出建议。</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon inline-flex rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{
                background: "linear-gradient(135deg, var(--grad-from), var(--grad-via), var(--grad-to))",
              }}
            >
              GitHub
            </a>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--heading)]"
              >
                发送邮件
              </a>
            )}
            <Link
              href="/support"
              className="inline-flex rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]"
            >
              PayPal 赞助
            </Link>
            <Link
              href="/posts"
              className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)]"
            >
              去看文章
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
