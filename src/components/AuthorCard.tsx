import Image from "next/image";
import Link from "next/link";
import type { ResolvedProfile } from "@/lib/profile";
import { getResolvedProfile } from "@/lib/profile";

export async function AuthorCard({ compact = false }: { compact?: boolean }) {
  const profile: ResolvedProfile = await getResolvedProfile();

  return (
    <div
      className={`card-neon flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[var(--border-strong)] shadow-[0_0_16px_rgba(232,121,249,0.25)]">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          sizes="56px"
          className="object-cover"
          unoptimized={
            profile.avatar.endsWith(".svg") ||
            profile.avatar.includes("github") ||
            profile.avatar.includes("githubusercontent")
          }
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-semibold text-[var(--heading)]">{profile.name}</p>
          {profile.fromGitHub && (
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--muted)]">
              @{profile.username}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{profile.role}</p>
        {!compact && (
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{profile.bio}</p>
        )}
        {profile.fromGitHub && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            <span className="text-[var(--heading)]">{profile.followers}</span> 粉丝 ·{" "}
            <span className="text-[var(--heading)]">{profile.publicRepos}</span> 仓库
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link)] hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-[var(--link)] hover:text-[var(--accent)]"
            >
              邮箱
            </a>
          )}
          <Link href="/about" className="text-[var(--link)] hover:text-[var(--accent)]">
            关于
          </Link>
        </div>
      </div>
    </div>
  );
}
