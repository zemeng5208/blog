import type { Metadata } from "next";
import Link from "next/link";
import { getAllSeries } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "文章系列",
  description: "按系列浏览技术文章。",
};

export default async function SeriesIndexPage() {
  const seriesList = await getAllSeries();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--heading)]">文章系列</h1>
        <p className="mt-2 text-[var(--muted)]">
          把相关文章组成系列，方便按主题连续阅读。共 {seriesList.length} 个系列。
        </p>
      </header>

      {seriesList.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted)]">
          还没有系列。写文章时填写「系列名」即可自动归类。
        </p>
      ) : (
        <ul className="space-y-3">
          {seriesList.map(({ series, count }) => (
            <li key={series}>
              <Link
                href={`/series/${encodeURIComponent(series)}`}
                className="post-card flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition"
              >
                <span className="font-semibold text-[var(--heading)]">{series}</span>
                <span className="rounded-full bg-[var(--chip-bg)] px-2.5 py-1 text-xs text-[var(--chip-fg)]">
                  {count} 篇
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
