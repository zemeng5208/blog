import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "赞助支持",
  description: `通过 PayPal 支持 ${siteConfig.author.name} 的创作与维护。`,
};

export default function SupportPage() {
  const { paypal, author, shortName, social } = siteConfig;
  const hasLink = Boolean(paypal.meUrl);
  const qrSrc = paypal.qrImage || "/paypal-qr.png";
  const showEmail = paypal.showEmail !== false && Boolean(social.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium tracking-wide text-[var(--accent)]">赞助支持</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--heading)]">
          {paypal.thanksTitle || "赞助 / 付款支持"}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          {paypal.thanksBody ||
            `如果 ${shortName} 对你有帮助，欢迎通过 PayPal 支持一下。`}
        </p>
      </header>

      <div className="space-y-8">
        <section className="post-card overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div
            className="border-b border-[var(--border)] px-6 py-4 sm:px-8"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, #003087 22%, transparent), color-mix(in srgb, #009cde 12%, transparent), transparent)",
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 items-center rounded-lg bg-white px-3 text-sm font-bold tracking-tight text-[#003087] shadow-sm">
                Pay<span className="text-[#009cde]">Pal</span>
              </span>
              <div>
                <p className="font-semibold text-[var(--heading)]">PayPal 收款</p>
                <p className="text-xs text-[var(--muted)]">扫码或点击按钮完成付款 · 金额自定</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-[220px_1fr] sm:p-8">
            <div className="mx-auto w-full max-w-[220px]">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[0_0_30px_rgba(0,156,222,0.12)]">
                <Image
                  src={qrSrc}
                  alt="PayPal 收款码"
                  fill
                  className="object-contain p-2"
                  sizes="220px"
                  priority
                  unoptimized={qrSrc.endsWith(".svg") || qrSrc.endsWith(".png")}
                />
              </div>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                扫码打开 paypal.me/zemeng520
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--heading)]">收款人</h2>
                <p className="mt-1 text-[var(--muted)]">{author.name}</p>
                {paypal.note && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--prose)]">{paypal.note}</p>
                )}
              </div>

              {hasLink ? (
                <div className="space-y-3">
                  <a
                    href={paypal.meUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#003087] to-[#009cde] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    打开 PayPal 付款
                  </a>
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="max-w-full truncate rounded-lg border border-[var(--border)] bg-[var(--background)]/50 px-3 py-2 text-xs text-[var(--chip-fg)]">
                      {paypal.meUrl}
                    </code>
                    <CopyButton text={paypal.meUrl} label="复制链接" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">尚未配置 PayPal.me 链接。</p>
              )}

              {paypal.suggestedAmounts.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-[var(--muted)]">
                    可选金额参考（在 PayPal 页面自行填写，无强制）
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {paypal.suggestedAmounts.map((amount) => (
                      <span
                        key={amount}
                        className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm text-[var(--heading)]"
                      >
                        {amount}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {showEmail && (
                <p className="text-sm text-[var(--muted)]">
                  合作 / 定制需求可邮件：
                  <a href={`mailto:${social.email}`} className="ml-1 text-[var(--link)] hover:underline">
                    {social.email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="post-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--heading)]">付款说明</h2>
          <ul className="list-inside list-disc space-y-2 text-[var(--prose)] marker:text-[var(--accent)]">
            <li>支持扫码或点击 PayPal.me 链接付款，金额自定。</li>
            <li>赞助完全自愿，不绑定会员或广告权益。</li>
            <li>资金用途：域名/工具订阅、内容创作与站点维护。</li>
            <li>若扫码不便，直接打开链接同样可以完成支付。</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--heading)]"
          >
            关于作者
          </Link>
          <Link
            href="/posts"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--heading)]"
          >
            继续看文章
          </Link>
        </div>
      </div>
    </div>
  );
}
