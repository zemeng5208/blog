import type { Metadata } from "next";
import { WritePostForm } from "@/components/WritePostForm";

export const metadata: Metadata = {
  title: "写文章",
  description: "在线编写并保存 Markdown 博客文章。",
  robots: { index: false, follow: false },
};

export default function WritePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-[var(--accent)]">编辑器</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--heading)]">写文章</h1>
        <p className="mt-2 text-[var(--muted)]">
          VS Code 风格 Markdown 编辑：语法高亮、中文词条提示、补全与悬停说明。也可上传本地{" "}
          <code className="text-[var(--chip-fg)]">.md</code> 文件，保存到{" "}
          <code className="text-[var(--chip-fg)]">content/posts/</code>。
        </p>
      </header>
      <WritePostForm />
    </div>
  );
}
