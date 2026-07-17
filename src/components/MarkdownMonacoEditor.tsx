"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { editor, IDisposable, languages } from "monaco-editor";
import { useTheme } from "@/components/ThemeProvider";
import {
  isAfterWhitespace,
  matchTriggerAtCursor,
  markdownHints,
  type MdHint,
  type TriggerMatch,
} from "@/lib/markdown-zh-docs";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: string | number;
};

/** 最近一次 Tab 匹配到的关键字（供补全 provider 读取） */
let lastTabMatch: TriggerMatch | null = null;
let providersRegistered = false;
const disposables: IDisposable[] = [];

function hintToSuggestion(
  monaco: typeof import("monaco-editor"),
  hint: MdHint,
  range: languages.CompletionItem["range"],
  index: number,
): languages.CompletionItem {
  return {
    label: {
      label: hint.label,
      description: hint.title,
      detail: ` ${hint.explain}`,
    },
    kind: monaco.languages.CompletionItemKind.Snippet,
    detail: `${hint.title} — ${hint.explain}`,
    documentation: {
      value: [`**${hint.title}**`, "", hint.explain, "", "```markdown", hint.label.replace(/\\n/g, "\n"), "```"].join(
        "\n",
      ),
    },
    insertText: hint.insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    range,
    sortText: String(index).padStart(3, "0"),
    filterText: `${hint.label} ${hint.title} ${hint.explain} ${(hint.keywords ?? []).join(" ")}`,
    preselect: index === 0,
  };
}

function registerMarkdownZhProviders(monaco: typeof import("monaco-editor")) {
  if (providersRegistered) return;
  providersRegistered = true;

  disposables.push(
    monaco.languages.registerCompletionItemProvider("markdown", {
      triggerCharacters: [],
      provideCompletionItems(model, position) {
        const line = model.getLineContent(position.lineNumber);

        // 优先用 Tab 时缓存的匹配；否则即时解析光标前关键字
        const matched =
          lastTabMatch &&
          lastTabMatch.startColumn > 0 &&
          position.lineNumber >= 1
            ? lastTabMatch
            : matchTriggerAtCursor(line, position.column);

        // 用完一次后清掉，避免脏数据
        lastTabMatch = null;

        if (matched && matched.hints.length > 0) {
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: matched.startColumn,
            endColumn: position.column,
          };
          return {
            suggestions: matched.hints.map((h, i) => hintToSuggestion(monaco, h, range, i)),
            incomplete: false,
          };
        }

        // 无关键字时给全量词条（仍仅主动触发时出现）
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: markdownHints.map((h, i) => hintToSuggestion(monaco, h, range, i)),
        };
      },
    }),
  );

  disposables.push(
    monaco.languages.registerHoverProvider("markdown", {
      provideHover(model, position) {
        const line = model.getLineContent(position.lineNumber);
        const matched = matchTriggerAtCursor(line, line.length + 1);
        // 悬停当前行：尝试整行前缀
        const atPos = matchTriggerAtCursor(line, position.column);
        const hint = (atPos ?? matched)?.hints[0];
        if (!hint) return null;
        return {
          contents: [
            { value: `**${hint.title}**` },
            { value: hint.explain },
            { value: "```markdown\n" + hint.label.replace(/\\n/g, "\n") + "\n```" },
          ],
        };
      },
    }),
  );
}

function insertNormalTab(ed: editor.ICodeEditor) {
  const selection = ed.getSelection();
  if (!selection) return;

  if (!selection.isEmpty() && selection.startLineNumber !== selection.endLineNumber) {
    ed.getAction("editor.action.indentLines")?.run();
    return;
  }

  // 与编辑器 options.tabSize: 2 保持一致
  const text = "  ";

  ed.executeEdits("normal-tab", [{ range: selection, text, forceMoveMarkers: true }]);
  ed.focus();
}

export function MarkdownMonacoEditor({ value, onChange, height = 420 }: Props) {
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [ready, setReady] = useState(false);
  const [hintBar, setHintBar] = useState<string>("在关键字后按 Tab 查看提示，例如输入 ` 再按 Tab");

  const monacoTheme = theme === "soft" ? "md-soft" : "md-neon";

  const handleMount: OnMount = useCallback(
    (ed, monaco) => {
      editorRef.current = ed;
      registerMarkdownZhProviders(monaco);

      monaco.editor.defineTheme("md-neon", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "8b7aa8", fontStyle: "italic" },
          { token: "keyword", foreground: "e879f9" },
          { token: "string", foreground: "67e8f9" },
        ],
        colors: {
          "editor.background": "#0b0614",
          "editor.foreground": "#f3e8ff",
          "editorLineNumber.foreground": "#6b5b8c",
          "editorLineNumber.activeForeground": "#e879f9",
          "editor.selectionBackground": "#e879f944",
          "editor.lineHighlightBackground": "#1a0f2e88",
          "editorCursor.foreground": "#e879f9",
          "editorWidget.background": "#140d24",
          "editorWidget.border": "#2e1b4d",
          "editorSuggestWidget.background": "#140d24",
          "editorSuggestWidget.border": "#e879f955",
          "editorSuggestWidget.selectedBackground": "#e879f933",
          "editorHoverWidget.background": "#140d24",
          "editorHoverWidget.border": "#e879f955",
        },
      });

      monaco.editor.defineTheme("md-soft", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#0f0f10",
          "editor.foreground": "#e4e4e7",
          "editorLineNumber.foreground": "#52525b",
          "editorSuggestWidget.background": "#141416",
          "editorSuggestWidget.selectedBackground": "#27272a",
          "editorWidget.background": "#141416",
        },
      });

      monaco.editor.setTheme(theme === "soft" ? "md-soft" : "md-neon");
      setReady(true);

      // 提示列表打开：Tab = 选用当前词条
      ed.addAction({
        id: "markdown-accept-suggest-tab",
        label: "接受补全",
        keybindings: [monaco.KeyCode.Tab],
        precondition: "suggestWidgetVisible",
        keybindingContext: "suggestWidgetVisible",
        run: (editorInstance) => {
          // 兼容不同 Monaco 版本的「接受补全」命令
          editorInstance.trigger("tab-accept", "acceptSelectedSuggestion", {});
          try {
            const contrib = editorInstance.getContribution(
              "editor.contrib.suggestController",
            ) as { acceptSelectedSuggestion?: (w?: boolean, e?: boolean) => void } | null;
            contrib?.acceptSelectedSuggestion?.(true, false);
          } catch {
            /* ignore */
          }
          setHintBar("已插入。片段中再按 Tab 可跳到下一处占位");
        },
      });

      // 片段占位跳转
      ed.addAction({
        id: "markdown-snippet-next",
        label: "片段下一处",
        keybindings: [monaco.KeyCode.Tab],
        precondition: "inSnippetMode && !suggestWidgetVisible",
        run: (editorInstance) => {
          editorInstance.trigger("snippet", "jumpToNextSnippetPlaceholder", {});
        },
      });

      // 默认 Tab：关键字提示 / 空格后缩进（不与上面两条抢权）
      ed.addAction({
        id: "markdown-keyword-tab",
        label: "关键字提示或缩进",
        keybindings: [monaco.KeyCode.Tab],
        precondition: "!suggestWidgetVisible && !inSnippetMode",
        run: (editorInstance) => {
          const model = editorInstance.getModel();
          const pos = editorInstance.getPosition();
          if (!model || !pos) return;

          const line = model.getLineContent(pos.lineNumber);

          // 空格后 / 行首 → 普通缩进
          if (isAfterWhitespace(line, pos.column)) {
            lastTabMatch = null;
            insertNormalTab(editorInstance);
            setHintBar("空格后的 Tab = 普通缩进");
            return;
          }

          // 按关键字匹配（如 ` → 行内代码）
          const matched = matchTriggerAtCursor(line, pos.column);
          if (matched && matched.hints.length > 0) {
            lastTabMatch = matched;
            const first = matched.hints[0];
            setHintBar(
              `关键字「${matched.trigger}」→ ${first.label}（${first.title}：${first.explain}）` +
                (matched.hints.length > 1 ? ` · 另有 ${matched.hints.length - 1} 项可用 ↑↓ 选择` : " · 再按 Tab 插入"),
            );

            window.requestAnimationFrame(() => {
              editorInstance.focus();
              editorInstance.trigger("tab-keyword", "editor.action.triggerSuggest", {});
            });
            return;
          }

          lastTabMatch = null;
          setHintBar("未识别关键字。示例：`  **  ##  ###  -  >  [  ![  |");
          insertNormalTab(editorInstance);
        },
      });
    },
    [theme],
  );

  useEffect(() => {
    if (!ready) return;
    const monaco = (window as unknown as { monaco?: typeof import("monaco-editor") }).monaco;
    if (monaco) {
      monaco.editor.setTheme(theme === "soft" ? "md-soft" : "md-neon");
    }
  }, [theme, ready]);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[inset_0_0_0_1px_rgba(232,121,249,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--background)]/50 px-3 py-2 text-xs text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-[var(--heading)]">Markdown</span>
          <span className="hidden sm:inline">按关键字 + Tab</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span>
            例：<code className="text-[var(--chip-fg)]">`</code> +{" "}
            <kbd className="rounded border border-[var(--border)] px-1">Tab</kbd>
            {" → "}
            <code className="text-[var(--chip-fg)]">`输入文本`</code>
          </span>
        </div>
      </div>

      <div className="border-b border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] leading-relaxed text-[var(--muted)]">
        {hintBar}
      </div>

      <Editor
        height={height}
        defaultLanguage="markdown"
        language="markdown"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        theme={monacoTheme}
        loading={
          <div className="flex h-[420px] items-center justify-center text-sm text-[var(--muted)]">
            正在加载编辑器…
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily:
            "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          lineNumbers: "on",
          minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
          wordWrap: "on",
          wrappingIndent: "same",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          suggestOnTriggerCharacters: false,
          quickSuggestions: false,
          wordBasedSuggestions: "off",
          tabCompletion: "off",
          acceptSuggestionOnEnter: "on",
          acceptSuggestionOnCommitCharacter: false,
          snippetSuggestions: "top",
          suggest: {
            showWords: false,
            showSnippets: true,
            preview: true,
            previewMode: "subwordSmart",
            insertMode: "replace",
            selectionMode: "always",
            filterGraceful: true,
            localityBonus: true,
          },
          hover: { enabled: true, delay: 150 },
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          unicodeHighlight: { ambiguousCharacters: false },
        }}
      />
    </div>
  );
}
