import type { PostMeta } from "@/lib/posts";

type Props = {
  post: Pick<PostMeta, "title" | "tags" | "cover">;
  /** 列表缩略 / 精选大图 */
  size?: "sm" | "lg";
  className?: string;
};

/**
 * 主题感知封面：不用写死颜色的 SVG，
 * 用 CSS 变量画渐变 + 装饰光斑 + 标题，切换主题会立刻变色。
 */
export function PostCover({ post, size = "sm", className = "" }: Props) {
  const tag = post.tags[0];
  const isLg = size === "lg";

  return (
    <div
      className={`post-cover relative overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(ellipse 80% 70% at 15% 20%, color-mix(in srgb, var(--accent) 45%, transparent), transparent 55%),
          radial-gradient(ellipse 70% 60% at 90% 80%, color-mix(in srgb, var(--accent-cyan) 35%, transparent), transparent 50%),
          linear-gradient(145deg, var(--card-cover-bg, var(--card)), color-mix(in srgb, var(--accent) 12%, var(--card)))
        `,
      }}
    >
      {/* 装饰几何块，强调主题色 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-4 h-24 w-24 rounded-3xl opacity-40"
        style={{
          background: "color-mix(in srgb, var(--accent) 55%, transparent)",
          transform: "rotate(18deg)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-28 rounded-full opacity-30"
        style={{
          background: "color-mix(in srgb, var(--accent-cyan) 50%, transparent)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-1/4 h-2 w-16 -translate-y-1/2 rounded-full opacity-50"
        style={{ background: "var(--accent)" }}
      />

      <div
        className={`relative z-10 flex h-full flex-col justify-end ${
          isLg ? "p-5 sm:p-6" : "p-3"
        }`}
      >
        {tag && (
          <span
            className={`mb-1.5 inline-flex w-fit rounded-full border px-2 py-0.5 font-medium ${
              isLg ? "text-xs" : "text-[10px]"
            }`}
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 40%, var(--border))",
              background: "color-mix(in srgb, var(--card) 70%, transparent)",
              color: "var(--accent)",
              backdropFilter: "blur(6px)",
            }}
          >
            #{tag}
          </span>
        )}
        <p
          className={`font-semibold leading-snug text-[var(--heading)] ${
            isLg ? "line-clamp-2 text-lg sm:text-xl" : "line-clamp-3 text-sm"
          }`}
          style={{
            textShadow: "0 1px 8px color-mix(in srgb, var(--background) 50%, transparent)",
          }}
        >
          {post.title}
        </p>
      </div>
    </div>
  );
}
