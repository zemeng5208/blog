/**
 * 从 GitHub 公开 API 拉取个人资料与仓库。
 * 可选环境变量 GITHUB_TOKEN 提高配额（无需仓库写权限）。
 */

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  location: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  topics?: string[];
};

function authHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "blog",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: authHeaders(),
      next: { revalidate: 3600, tags: ["github-profile"] },
    });
    if (!res.ok) {
      console.error("[github] user fetch failed", res.status, await res.text());
      return null;
    }
    return (await res.json()) as GitHubUser;
  } catch (error) {
    console.error("[github] user fetch error", error);
    return null;
  }
}

export async function fetchGitHubRepos(
  username: string,
  limit = 6,
): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=owner`,
      {
        headers: authHeaders(),
        next: { revalidate: 3600, tags: ["github-repos"] },
      },
    );
    if (!res.ok) {
      console.error("[github] repos fetch failed", res.status);
      return [];
    }
    const repos = (await res.json()) as GitHubRepo[];
    return repos
      .filter((r) => !r.fork)
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return a.updated_at < b.updated_at ? 1 : -1;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("[github] repos fetch error", error);
    return [];
  }
}
