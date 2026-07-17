"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { createHeadingIdGenerator } from "@/lib/format";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const el = node as { props?: { children?: React.ReactNode } };
    return extractText(el.props?.children);
  }
  return "";
}

function PreBlock({ children }: { children?: React.ReactNode }) {
  const codeText = extractText(children).replace(/\n$/, "");
  return (
    <div className="group/pre relative not-prose my-6">
      <pre className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[#05020d] p-4 text-sm leading-relaxed shadow-[0_0_30px_rgba(232,121,249,0.08)]">
        {children}
      </pre>
      <CopyCodeButton code={codeText} />
    </div>
  );
}

function createComponents(): Components {
  const nextId = createHeadingIdGenerator();

  return {
    pre: ({ children }) => <PreBlock>{children}</PreBlock>,
    code: ({ className, children, ...props }) => {
      const isBlock = Boolean(className?.includes("language-"));
      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="rounded bg-fuchsia-500/15 px-1.5 py-0.5 text-[0.9em] text-fuchsia-200 before:content-none after:content-none"
          {...props}
        >
          {children}
        </code>
      );
    },
    h2: ({ children }) => {
      const text = extractText(children);
      const id = nextId(text);
      return (
        <h2 id={id} className="scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractText(children);
      const id = nextId(text);
      return (
        <h3 id={id} className="scroll-mt-24">
          {children}
        </h3>
      );
    },
    a: ({ href, children }) => {
      const external = Boolean(href?.startsWith("http"));
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  };
}

export function Markdown({ content }: { content: string }) {
  const components = createComponents();

  return (
    <div className="markdown-body prose max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-[var(--heading)] prose-p:text-[var(--prose)] prose-strong:text-[var(--heading)] prose-a:text-[var(--link)] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-[var(--accent)]/40 prose-blockquote:text-[var(--muted)] prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-li:text-[var(--prose)] prose-th:text-[var(--heading)] prose-td:text-[var(--prose)] prose-hr:border-[var(--border)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
