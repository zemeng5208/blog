import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium tracking-[0.3em] text-[var(--accent)]">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        <span className="text-neon-gradient">页面不存在</span>
      </h1>
      <p className="mt-3 text-[var(--muted)]">链接可能已失效，或文章尚未发布。</p>
      <Link
        href="/"
        className="btn-neon mt-8 inline-flex rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
      >
        返回首页
      </Link>
    </div>
  );
}
