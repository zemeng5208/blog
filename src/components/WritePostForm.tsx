"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
        正在加载编辑器…
      </div>
    ),
  },
);

const fieldClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]";

const DRAFT_KEY = "blog-write-draft-v1";

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

type DraftShape = {
  title: string;
  description: string;
  slug: string;
  slugTouched: boolean;
  date: string;
  tags: string;
  cover: string;
  series: string;
  seriesOrder: string;
  featured: boolean;
  draft: boolean;
  overwrite: boolean;
  content: string;
  savedAt: string;
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WritePostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(todayStr);
  const [tags, setTags] = useState("");
  const [cover, setCover] = useState("");
  const [series, setSeries] = useState("");
  const [seriesOrder, setSeriesOrder] = useState("1");
  const [featured, setFeatured] = useState(false);
  const [draft, setDraft] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [content, setContent] = useState(TEMPLATE);
  const [token, setToken] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [autoSaveHint, setAutoSaveHint] = useState("草稿将自动保存在浏览器");
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
    url?: string | null;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const autoSlug = useMemo(() => titleToSlug(title || "untitled"), [title]);

  // 恢复草稿
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as DraftShape;
        setTitle(d.title ?? "");
        setDescription(d.description ?? "");
        setSlug(d.slug ?? "");
        setSlugTouched(Boolean(d.slugTouched));
        setDate(d.date || todayStr());
        setTags(d.tags ?? "");
        setCover(d.cover ?? "");
        setSeries(d.series ?? "");
        setSeriesOrder(d.seriesOrder ?? "1");
        setFeatured(Boolean(d.featured));
        setDraft(Boolean(d.draft));
        setOverwrite(Boolean(d.overwrite));
        setContent(d.content || TEMPLATE);
        if (d.savedAt) {
          setAutoSaveHint(`已恢复本地草稿（${new Date(d.savedAt).toLocaleString("zh-CN")}）`);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // 自动保存（防抖）
  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const payload: DraftShape = {
        title,
        description,
        slug,
        slugTouched,
        date,
        tags,
        cover,
        series,
        seriesOrder,
        featured,
        draft,
        overwrite,
        content,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        setAutoSaveHint(`已自动保存 ${new Date().toLocaleTimeString("zh-CN")}`);
      } catch {
        setAutoSaveHint("自动保存失败（存储空间可能已满）");
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [
    hydrated,
    title,
    description,
    slug,
    slugTouched,
    date,
    tags,
    cover,
    series,
    seriesOrder,
    featured,
    draft,
    overwrite,
    content,
  ]);

  const clearLocalDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setAutoSaveHint("已清除本地草稿");
  }, []);

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

  const insertMarkdownAtEnd = (md: string) => {
    setContent((prev) => {
      const needsNl = prev.length > 0 && !prev.endsWith("\n");
      return `${prev}${needsNl ? "\n\n" : ""}${md}\n`;
    });
    setPreview(false);
  };

  const onImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          ...(token ? { "x-post-token": token } : {}),
        },
        body: form,
      });
      const data = (await res.json()) as { ok: boolean; error?: string; url?: string };
      if (!data.ok || !data.url) {
        setMessage({ type: "err", text: data.error || "图片上传失败" });
        return;
      }
      const alt = file.name.replace(/\.[^.]+$/, "");
      insertMarkdownAtEnd(`![${alt}](${data.url})`);
      setMessage({ type: "ok", text: `图片已上传：${data.url}（已插入正文）` });
    } catch {
      setMessage({ type: "err", text: "图片上传网络错误" });
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
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
          series,
          seriesOrder: Number(seriesOrder) || 0,
          featured,
          draft,
          content,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        slug?: string;
        url?: string | null;
      };
      if (!data.ok) {
        setMessage({ type: "err", text: data.error || "保存失败" });
        return;
      }
      clearLocalDraft();
      setMessage({
        type: "ok",
        text: data.url ? `已发布：${data.slug}` : `已保存草稿：${data.slug}`,
        url: data.url,
      });
    } catch {
      setMessage({ type: "err", text: "网络错误，请稍后重试" });
    } finally {
      setLoading(false);
    }
  };

  const onMdFileUpload = async (file: File | null) => {
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

  const resetForm = () => {
    if (!window.confirm("确定清空编辑器并删除本地草稿？")) return;
    setTitle("");
    setDescription("");
    setSlug("");
    setSlugTouched(false);
    setDate(todayStr());
    setTags("");
    setCover("");
    setSeries("");
    setSeriesOrder("1");
    setFeatured(false);
    setDraft(false);
    setOverwrite(false);
    setContent(TEMPLATE);
    clearLocalDraft();
    setMessage(null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--muted)]">
        <span>{autoSaveHint}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-md border border-[var(--border)] px-2 py-1 hover:text-[var(--heading)]"
          >
            清空草稿
          </button>
        </div>
      </div>

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
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
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
            placeholder="/uploads/xxx.png"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">系列名（可选）</span>
          <input
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className={fieldClass}
            placeholder="例如：博客搭建"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--muted)]">系列序号</span>
          <input
            type="number"
            min={0}
            value={seriesOrder}
            onChange={(e) => setSeriesOrder(e.target.value)}
            className={fieldClass}
            placeholder="1"
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
            onChange={(e) => onMdFileUpload(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--heading)] transition hover:border-[var(--accent)]">
          {uploading ? "上传中…" : "上传图片到正文"}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onImageUpload(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--heading)]"
        >
          {preview ? "继续编辑" : "预览正文"}
        </button>
      </div>

      {!preview ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-sm text-[var(--muted)]">正文（Markdown 语法）*</span>
              <span className="text-[11px] text-[var(--muted)]">自动保存 · 可插图片</span>
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
          写入密钥（必填，请求头 x-post-token，对应 POST_WRITE_SECRET）
        </span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={fieldClass}
          placeholder="请输入 POST_WRITE_SECRET"
          autoComplete="off"
          required
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-neon inline-flex rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, var(--grad-from), var(--grad-via), var(--grad-to))",
          }}
        >
          {loading ? "保存中…" : "发布 / 保存文章"}
        </button>
        <Link href="/posts" className="text-sm text-[var(--link)] hover:underline">
          返回文章列表
        </Link>
        <Link href="/series" className="text-sm text-[var(--link)] hover:underline">
          系列列表
        </Link>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-[var(--heading)]"
              : "border-red-500/30 bg-red-500/10 text-[var(--heading)]"
          }`}
        >
          <p>{message.text}</p>
          {message.url && (
            <Link href={message.url} className="mt-2 inline-block text-[var(--link)] underline">
              查看文章 →
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
