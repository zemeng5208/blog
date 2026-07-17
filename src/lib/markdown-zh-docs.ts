/**
 * Markdown 关键字提示词条
 * triggers：光标前精确匹配的符号（长的优先）
 * keywords：英文/拼音别名
 */

export type MdHint = {
  /** 补全列表主显示，如 `输入文本` */
  label: string;
  /** 插入片段（Monaco snippet） */
  insertText: string;
  /** 中文名 */
  title: string;
  /** 一句中文解释 */
  explain: string;
  /** 触发符号（光标前以该串结尾） */
  triggers: string[];
  /** 额外关键字（输入 code 等再 Tab） */
  keywords?: string[];
  category: string;
};

export const markdownHints: MdHint[] = [
  {
    label: "`输入文本`",
    insertText: "`${1:输入文本}`",
    title: "行内代码",
    explain: "标记命令、变量名等短代码，出现在句子中间。",
    triggers: ["`"],
    keywords: ["code", "inline", "行内代码"],
    category: "代码",
  },
  {
    label: "```ts … ```",
    insertText: "```${1:ts}\n${2:// 在此输入代码}\n```",
    title: "代码块",
    explain: "多行代码；可写 ts / js / python / bash 等语言名以高亮。",
    triggers: ["```"],
    keywords: ["codeblock", "代码块", "fence"],
    category: "代码",
  },
  {
    label: "# 一级标题",
    insertText: "# ${1:一级标题}",
    title: "一级标题",
    explain: "全文最重要的大标题，一般一篇只用一个。",
    triggers: ["#"],
    keywords: ["h1", "title", "一级标题"],
    category: "标题",
  },
  {
    label: "## 二级标题",
    insertText: "## ${1:二级标题}",
    title: "二级标题",
    explain: "章节标题，用来划分文章大段落。",
    triggers: ["##"],
    keywords: ["h2", "二级标题"],
    category: "标题",
  },
  {
    label: "### 三级标题",
    insertText: "### ${1:三级标题}",
    title: "三级标题",
    explain: "小节标题，放在二级标题下面。",
    triggers: ["###"],
    keywords: ["h3", "三级标题"],
    category: "标题",
  },
  {
    label: "#### 四级标题",
    insertText: "#### ${1:四级标题}",
    title: "四级标题",
    explain: "更细的层级标题。",
    triggers: ["####"],
    keywords: ["h4", "四级标题"],
    category: "标题",
  },
  {
    label: "**加粗文字**",
    insertText: "**${1:加粗文字}**",
    title: "加粗",
    explain: "强调重点内容，比斜体更醒目。",
    triggers: ["**"],
    keywords: ["bold", "strong", "加粗"],
    category: "强调",
  },
  {
    label: "*斜体文字*",
    insertText: "*${1:斜体文字}*",
    title: "斜体",
    explain: "轻微强调，或表示书名、术语。",
    triggers: ["*"],
    keywords: ["italic", "em", "斜体"],
    category: "强调",
  },
  {
    label: "~~删除线~~",
    insertText: "~~${1:删除线}~~",
    title: "删除线",
    explain: "表示作废或已修改前的内容。",
    triggers: ["~~", "~"],
    keywords: ["strike", "del", "删除线"],
    category: "强调",
  },
  {
    label: "- 列表项",
    insertText: "- ${1:列表项}",
    title: "无序列表",
    explain: "条目无先后顺序，可连续多行。",
    triggers: ["-"],
    keywords: ["ul", "list", "列表"],
    category: "列表",
  },
  {
    label: "1. 有序列表",
    insertText: "1. ${1:列表项}",
    title: "有序列表",
    explain: "有先后顺序的步骤列表。",
    triggers: ["1.", "1"],
    keywords: ["ol", "ordered", "有序"],
    category: "列表",
  },
  {
    label: "- [ ] 待办事项",
    insertText: "- [ ] ${1:待办事项}",
    title: "任务列表",
    explain: "可勾选的待办；`- [x]` 表示已完成。",
    triggers: ["- [", "-["],
    keywords: ["todo", "task", "任务", "待办"],
    category: "列表",
  },
  {
    label: "[链接文字](网址)",
    insertText: "[${1:链接文字}](${2:https://})",
    title: "链接",
    explain: "创建可点击的超链接。",
    triggers: ["["],
    keywords: ["link", "url", "链接", "a"],
    category: "链接",
  },
  {
    label: "![图片说明](路径)",
    insertText: "![${1:图片说明}](${2:/covers/welcome.svg})",
    title: "图片",
    explain: "插入图片，路径可以是网站地址或站内文件。",
    triggers: ["!["],
    keywords: ["image", "img", "图片"],
    category: "链接",
  },
  {
    label: "> 引用内容",
    insertText: "> ${1:引用内容}",
    title: "引用",
    explain: "引用别人的话，或突出一整段说明。",
    triggers: [">"],
    keywords: ["quote", "blockquote", "引用"],
    category: "引用",
  },
  {
    label: "---",
    insertText: "\n---\n",
    title: "分隔线",
    explain: "在章节之间画一条水平分割线。",
    triggers: ["---", "--"],
    keywords: ["hr", "line", "分隔"],
    category: "其他",
  },
  {
    label: "| 表头 | 表头 |",
    insertText: "| ${1:列1} | ${2:列2} |\n| --- | --- |\n| ${3:内容} | ${4:内容} |",
    title: "表格",
    explain: "用竖线分列；第二行的 --- 表示表头。",
    triggers: ["|"],
    keywords: ["table", "表格"],
    category: "表格",
  },
];

/** 按触发符长度从长到短，避免 # 抢掉 ## */
const TRIGGERS_ORDERED = Array.from(
  new Set(markdownHints.flatMap((h) => h.triggers)),
).sort((a, b) => b.length - a.length);

export type TriggerMatch = {
  trigger: string;
  /** 1-based start column of trigger in line */
  startColumn: number;
  hints: MdHint[];
};

/** 光标前是否匹配到关键字触发符 */
export function matchTriggerAtCursor(line: string, column: number): TriggerMatch | null {
  const before = line.slice(0, column - 1);
  if (!before.length) return null;

  for (const trigger of TRIGGERS_ORDERED) {
    if (before.endsWith(trigger)) {
      // 单独的 ` 不要在 ``` 中间误匹配：若是 ``` 的一部分且不是完整 ``` 触发，上面长触发已先匹配
      // 单独 * 不要在 ** 中间：同样靠长触发优先
      // 单独 #：若 before 是 ##，长触发 ## 先命中
      const hints = markdownHints.filter((h) => h.triggers.includes(trigger));
      if (hints.length === 0) continue;
      return {
        trigger,
        startColumn: column - trigger.length,
        hints,
      };
    }
  }

  // 单词关键字：code、bold、link…
  const word = /([a-zA-Z\u4e00-\u9fff]{1,16})$/.exec(before);
  if (word) {
    const w = word[1].toLowerCase();
    const hints = markdownHints.filter((h) =>
      (h.keywords ?? []).some((k) => k.toLowerCase() === w || k.toLowerCase().startsWith(w)),
    );
    if (hints.length > 0) {
      return {
        trigger: word[1],
        startColumn: column - word[1].length,
        hints,
      };
    }
  }

  return null;
}

/** 空格后 / 行首 → 应普通缩进 */
export function isAfterWhitespace(line: string, column: number): boolean {
  if (column <= 1) return true;
  const ch = line.charAt(column - 2);
  return ch === " " || ch === "\t";
}

// ——— 供右侧速查面板 ———
export const markdownCategories = [
  "标题",
  "强调",
  "列表",
  "链接",
  "代码",
  "引用",
  "表格",
  "其他",
] as const;

export type MdDocItem = {
  label: string;
  insertText: string;
  title: string;
  detail: string;
  example: string;
  category: (typeof markdownCategories)[number];
};

export const markdownZhDocs: MdDocItem[] = markdownHints.map((h) => ({
  label: h.triggers[0] || h.title,
  insertText: h.insertText,
  title: h.title,
  detail: h.explain,
  example: h.label.replace(/\\n/g, "\n"),
  category: h.category as MdDocItem["category"],
}));

export function matchMdDoc(line: string, word: string) {
  const m = matchTriggerAtCursor(line, line.length + 1);
  if (m?.hints[0]) {
    const h = m.hints[0];
    return {
      label: h.label,
      insertText: h.insertText,
      title: h.title,
      detail: h.explain,
      example: h.label,
      patterns: [] as RegExp[],
      category: h.category,
    };
  }
  const hit = markdownHints.find(
    (h) => h.title.includes(word) || h.keywords?.some((k) => k.includes(word)),
  );
  if (!hit) return undefined;
  return {
    label: hit.label,
    insertText: hit.insertText,
    title: hit.title,
    detail: hit.explain,
    example: hit.label,
    patterns: [] as RegExp[],
    category: hit.category,
  };
}
