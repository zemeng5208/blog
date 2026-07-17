import Link from "next/link";
import { getResolvedProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const year = new Date().getFullYear();
  const profile = await getResolvedProfile();

  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {profile.name} · {siteConfig.shortName}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="transition hover:text-[var(--link)]"
            >
              邮箱
            </a>
          )}
          <Link href={siteConfig.social.rss} className="transition hover:text-[var(--accent)]">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
