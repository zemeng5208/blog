import type { GitHubRepo } from "@/lib/github";

export function GitHubRepos({ repos }: { repos: GitHubRepo[] }) {
  if (repos.length === 0) return null;

  return (
    <section className="card-neon rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
      <h2 className="mb-1 text-lg font-semibold text-[var(--heading)]">GitHub 仓库</h2>
      <p className="mb-5 text-sm text-[var(--muted)]">来自 GitHub 的公开项目（按星标与更新排序）</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {repos.map((repo) => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4 transition hover:border-[var(--accent)]"
            >
              <p className="font-medium text-[var(--heading)]">{repo.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                {repo.description || "暂无描述"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                {repo.language && <span>{repo.language}</span>}
                <span>★ {repo.stargazers_count}</span>
                <span>Fork {repo.forks_count}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
