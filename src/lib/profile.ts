import { fetchGitHubRepos, fetchGitHubUser, type GitHubRepo } from "@/lib/github";
import { siteConfig } from "@/lib/site";

export type ResolvedProfile = {
  name: string;
  username: string;
  role: string;
  bio: string;
  avatar: string;
  githubUrl: string;
  email: string;
  blog?: string;
  company?: string;
  location?: string;
  twitter?: string;
  publicRepos: number;
  followers: number;
  following: number;
  /** 是否成功从 GitHub API 拉取完整资料 */
  fromGitHub: boolean;
  repos: GitHubRepo[];
};

/** 无需 API 即可访问的 GitHub 头像（稳定 URL） */
export function githubAvatarUrl(username: string, size = 160) {
  return `https://github.com/${encodeURIComponent(username)}.png?size=${size}`;
}

export async function getResolvedProfile(options?: {
  includeRepos?: boolean;
}): Promise<ResolvedProfile> {
  const username = siteConfig.github.username.trim();
  const localFallback: ResolvedProfile = {
    name: siteConfig.author.name,
    username: username || "unknown",
    role: siteConfig.author.role,
    bio: siteConfig.author.bio,
    avatar: username ? githubAvatarUrl(username) : siteConfig.author.avatar || "/avatar.svg",
    githubUrl: username
      ? `https://github.com/${encodeURIComponent(username)}`
      : siteConfig.social.github,
    email: siteConfig.social.email,
    publicRepos: 0,
    followers: 0,
    following: 0,
    fromGitHub: false,
    repos: [],
  };

  if (!username) return localFallback;

  const user = await fetchGitHubUser(username);
  const repos = options?.includeRepos ? await fetchGitHubRepos(username, 6) : [];

  if (!user) {
    return { ...localFallback, repos };
  }

  const displayName = user.name?.trim() || user.login;
  const metaBits = [
    user.company ? String(user.company).replace(/^@/, "") : null,
    user.location,
  ].filter(Boolean);
  const role =
    metaBits.length > 0
      ? `${metaBits.join(" · ")}${siteConfig.author.role ? ` · ${siteConfig.author.role}` : ""}`
      : siteConfig.author.role;

  return {
    name: displayName,
    username: user.login,
    role,
    bio: user.bio?.trim() || siteConfig.author.bio,
    // 优先 API 头像；失败时仍可用 github.com/user.png
    avatar: user.avatar_url || githubAvatarUrl(user.login),
    githubUrl: user.html_url,
    email: siteConfig.social.email,
    blog: user.blog || undefined,
    company: user.company || undefined,
    location: user.location || undefined,
    twitter: user.twitter_username || undefined,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    fromGitHub: true,
    repos,
  };
}
