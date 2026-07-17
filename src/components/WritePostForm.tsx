"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { MarkdownCheatsheet } from "@/components/MarkdownCheatsheet";
import { titleToSlug } from "@/lib/slug";

const MarkdownMonacoEditor = dynamic(
  () =>
    import("@/components/MarkdownMonacoEditor").then((m) => m.MarkdownMonacoEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted)]">
        正在加载 VS Code 风格编辑器…
      </div>
    ),
  },
);

const fieldClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]";

const TEMPLATE = `## 引言

在这里写下你的开场……

## 正文

支持 **加粗**、\`行内代码\`、列表与代码块：

\`\`\`ts
function hello(name: string) {
  return \`Hello, \${name}\`;
}
\`\`\`

## 小结

记录收获与下一步。
`;

export function WritePostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [tags, setTags] = useState("");
  const [cover, setCover] = useState("");
  const [featured, setFeatured] = useState(false);
  const [draft, setDraft] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [content, setContent] = useState(TEMPLATE);
  const [token, setToken] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
    url?: string | null;
  } | null>(null);

  const autoSlug = useMemo(() => titleToSlug(title || "untitled"), [title]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(titleToSlug(value));
  };

  const insertSnippet = (snippet: string) => {
    setContent((prev) => {
      const needsNl = prev.length > 0 && !prev.endsWith("\n");
      return `${prev}${needsNl ? "\n" : ""}${snippet}\n`;
    });
    setPreview(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage({ type: "err", text: "正文不能为空" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(overwrite ? { "x-overwrite": "1" } : {}),
          ...(token ? { "x-post-token": token } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          slug: slug || autoSlug,
          date,
          tags,
          cover,
          featured,
          draft,
          content,
          token: token || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        slug?: string;
        url?: string | null;
        path?: string;
      };
      if (!data.ok) {
        setMessage({ type: "err", text: data.error || "保存失败" });
        return;
      }
      setMessage({
        type: "ok",
        text: `已保存到 ${data.path}`,
        url: data.url,
      });
    } catch {
      setMessage({ type: "err", text: "网络错误，请稍后重试" });
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setContent(text);
    const name = file.name.replace(/\.md$/i, "");
    if (name && !slugTouched) {
      setSlug(name);
      setSlugTouched(true);
    }
    setMessage({ type: "ok", text: `已载入本地文件：${file.name}` });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">标题 *</span>
          <input
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={fieldClass}
            placeholder="例如：我的第一篇笔记"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">摘要</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldClass}
            placeholder="一句话介绍，显示在列表与 SEO"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">Slug（文件名）</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={`${fieldClass} font-mono text-sm`}
            placeholder={autoSlug}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">日期</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">标签（逗号分隔）</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={fieldClass}
            placeholder="前端, TypeScript"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">封面路径（可选）</span>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className={`${fieldClass} font-mono text-sm`}
            placeholder="/covers/welcome.svg"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          首页精选
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={draft} onChange={(e) => setDraft(e.target.checked)} />
          存为草稿（不展示）
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
          覆盖已有同名文章
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--heading)] transition hover:border-[var(--accent)]">
          上传 .md 文件
          <input
            type="file"
            accept=".md,text/markdown,text/plain"
            className="hidden"
            onChange={(e) => onFileUpload(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--heading)]"
        >
          {preview ? "继续编辑" : "预览 Markdown"}
        </button>
      </div>

      {!preview ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm text-[var(--muted)]">正文 Markdown *</span>
              <span className="text-[11px] text-[var(--muted)]">类 VS Code 编辑器</span>
            </div>
            <MarkdownMonacoEditor value={content} onChange={setContent} height={480} />
          </div>
          <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <MarkdownCheatsheet onInsert={insertSnippet} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
          <p className="mb-4 text-xs tracking-wide text-[var(--muted)] uppercase">预览</p>
          <h2 className="mb-4 text-2xl font-bold text-[var(--heading)]">{title || "未命名文章"}</h2>
          <Markdown content={content || "*暂无内容*"} />
        </div>
      )}

      <label className="block max-w-md">
        <span className="mb-1.5 block text-sm text-[var(--muted)]">
          写入密钥（仅生产环境需要，对应 POST_WRITE_SECRET）
        </span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={fieldClass}
          placeholder="本地开发可留空"
          autoComplete="off"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-neon inline-flex rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "保存中…" : "发布 / 保存文章"}
        </button>
        <Link href="/posts" className="text-sm text-[var(--link)] hover:underline">
          返回文章列表
        </Link>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <p>{message.text}</p>
          {message.url && (
            <Link href={message.url} className="mt-2 inline-block underline">
              查看文章 →
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
