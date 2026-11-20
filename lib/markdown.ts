// Markdown to HTML for content bodies, plus the citation pass.
//
// Bodies are parsed once (remark + remark-gfm), split at their `##` headings,
// and each block is turned into sanitized HTML (remark-html's default schema;
// raw HTML in content is dropped). Internal links are rewritten through the
// base path. `{{cite:id}}` tokens survive as text and are replaced by numbered
// markers in a second pass (Citer), in the order the page renders them.

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { href } from './site';
import type { BodySection, Source } from './types';

// Minimal mdast shapes (the packages ship their own types, but this module only
// needs a few fields and keeps nodes as plain objects).
export interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  url?: string;
  depth?: number;
  ordered?: boolean;
  [key: string]: unknown;
}

const parser = remark().use(remarkGfm);
const compiler = remark().use(remarkGfm).use(remarkHtml);

export function parseMarkdown(md: string): MdNode {
  return parser.parse(md) as unknown as MdNode;
}

/** Plain text of a node tree. */
export function textOf(node: MdNode | MdNode[]): string {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node.value === 'string' && node.type !== 'html') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** Stable ids for the headings the content spec defines; other headings are slugified. */
const SECTION_IDS: Record<string, string> = {
  // Case pages
  'the problem': 'problem',
  'the research': 'research',
  'from research to change': 'change',
  'the impact': 'impact',
  'what is still debated': 'debated',
  'what this case teaches': 'teaches',
  // Lesson pages
  'in the cases': 'in-the-cases',
  'the pattern': 'pattern',
  'why it is easy to miss': 'easy-to-miss',
  'what it means for funders and research leaders': 'for-funders',
  'where it may not hold': 'limits',
  'what others have found': 'others-found',
  // How we built this
  'what we mean by social science': 'social-science',
  'what counts as a case': 'what-counts',
  'how we chose the eight': 'how-we-chose',
  'what our choices favored': 'what-we-favored',
  'how we drew the lessons': 'lessons',
  'limits to keep in mind': 'limits',
  'what this builds on': 'builds-on',
  'how we researched and checked the facts': 'checking',
  corrections: 'corrections',
  // Contribute
  'send a suggestion': 'form-section',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sectionId(title: string): string {
  const key = title.trim().toLowerCase().replace(/\s+/g, ' ');
  return SECTION_IDS[key] ?? slugify(title);
}

/** Splits a parsed body at its depth-2 headings. An explicit `{#id}` at the end of a heading wins. */
export function splitSections(root: MdNode): { intro: MdNode[]; sections: BodySection[] } {
  const intro: MdNode[] = [];
  const sections: BodySection[] = [];
  let current: BodySection | null = null;
  const used = new Set<string>();
  for (const node of root.children ?? []) {
    if (node.type === 'heading' && node.depth === 2) {
      let title = textOf(node).trim();
      let id: string;
      const explicit = /\s*\{#([a-z0-9-]+)\}$/.exec(title);
      if (explicit) {
        id = explicit[1];
        title = title.slice(0, explicit.index).trim();
      } else {
        id = sectionId(title);
      }
      let unique = id;
      for (let i = 2; used.has(unique); i++) unique = `${id}-${i}`;
      used.add(unique);
      current = { id: unique, title, nodes: [] };
      sections.push(current);
    } else if (current) {
      (current.nodes as MdNode[]).push(node);
    } else {
      intro.push(node);
    }
  }
  return { intro, sections };
}

/** Walks a tree depth first. */
export function walk(nodes: MdNode[], fn: (node: MdNode) => void): void {
  for (const n of nodes) {
    fn(n);
    if (n.children) walk(n.children, fn);
  }
}

function rewriteLinks(nodes: MdNode[]): MdNode[] {
  const copy = structuredClone(nodes) as MdNode[];
  walk(copy, (n) => {
    if (n.type === 'link' && typeof n.url === 'string' && n.url.startsWith('/')) n.url = href(n.url);
  });
  return copy;
}

/** Block nodes to sanitized HTML. Tables get a scrollable, labeled wrapper. */
export function blocksToHtml(nodes: MdNode[]): string {
  if (nodes.length === 0) return '';
  const tree = { type: 'root', children: rewriteLinks(nodes) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = String(compiler.stringify(compiler.runSync(tree as any) as any));
  return html
    .replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .trim();
}

/** Phrasing nodes (the inside of a paragraph) to HTML, without the <p>. */
export function inlineToHtml(nodes: MdNode[]): string {
  const html = blocksToHtml([{ type: 'paragraph', children: nodes }]);
  return html.replace(/^<p>/, '').replace(/<\/p>$/, '');
}

/** Inline Markdown in a frontmatter string (emphasis, links) to HTML. */
export function inlineMarkdown(text: string): string {
  const root = parseMarkdown(text);
  const first = root.children?.[0];
  if (!first) return '';
  if (root.children!.length === 1 && first.type === 'paragraph') return inlineToHtml(first.children ?? []);
  return blocksToHtml(root.children ?? []);
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Citations
// ---------------------------------------------------------------------------

/** `{{cite:a}}` or `{{cite:a,b}}`, with any whitespace before it. */
export const CITE_TOKEN = /\s*\{\{cite:([^{}]*)\}\}/g;

/** Removes cite tokens, for card and meta text shown without a Sources list. */
export function stripCites(text: string): string {
  return text.replace(CITE_TOKEN, '');
}

export function citeIds(text: string): string[] {
  const ids: string[] = [];
  for (const m of text.matchAll(CITE_TOKEN)) {
    for (const id of m[1].split(',')) {
      const t = id.trim();
      if (t) ids.push(t);
    }
  }
  return ids;
}

export interface NumberedSource {
  n: number;
  source: Source;
  /** Ids of every marker that cites this source, in order. */
  refs: string[];
}

/**
 * Numbers sources by first appearance. Call it on every rendered string in
 * the order the page shows them (DOM order); repeated citations reuse their
 * number, and each marker gets its own id for the Sources list back links.
 */
export class Citer {
  private byId = new Map<string, Source>();
  private numbered = new Map<string, NumberedSource>();
  private ordered: NumberedSource[] = [];

  constructor(sources: Source[], private context: string) {
    for (const s of sources) this.byId.set(s.id, s);
  }

  private use(id: string): { n: number; refId: string } {
    let entry = this.numbered.get(id);
    if (!entry) {
      const source = this.byId.get(id);
      if (!source) throw new Error(`${this.context}: unknown source id "${id}"`);
      entry = { n: this.ordered.length + 1, source, refs: [] };
      this.numbered.set(id, entry);
      this.ordered.push(entry);
    }
    const refId = `cite-${id}-${entry.refs.length + 1}`;
    entry.refs.push(refId);
    return { n: entry.n, refId };
  }

  /** The superscript marker for one or more source ids. */
  marker(ids: string[]): string {
    const unique = [...new Set(ids.map((i) => i.trim()).filter(Boolean))];
    if (unique.length === 0) return '';
    const links = unique.map((id) => {
      const { n, refId } = this.use(id);
      return { id, n, refId };
    });
    // U+2060 WORD JOINER keeps the marker on the line of the word before it.
    if (links.length === 1) {
      const l = links[0];
      return `\u2060<sup class="cite"><a href="#source-${l.id}" id="${l.refId}" aria-label="Source ${l.n}">[${l.n}]</a></sup>`;
    }
    const inner = links
      .map((l) => `<a href="#source-${l.id}" id="${l.refId}" aria-label="Source ${l.n}">${l.n}</a>`)
      .join(', ');
    return `\u2060<sup class="cite cite--multi">[${inner}]</sup>`;
  }

  /** Replaces cite tokens in an HTML string. */
  html(html: string): string {
    return html.replace(CITE_TOKEN, (_m, ids: string) => this.marker(ids.split(',')));
  }

  /** Plain text (escaped) with cite tokens replaced. */
  text(text: string): string {
    return this.html(escapeHtml(text));
  }

  /** Inline Markdown with cite tokens replaced. */
  inline(text: string): string {
    return this.html(inlineMarkdown(text));
  }

  /** HTML followed by the marker for a structured `source` field. */
  withSource(html: string, source?: string): string {
    return source ? `${html}${this.marker([source])}` : html;
  }

  list(): NumberedSource[] {
    return this.ordered;
  }

  /** Sources in the file that this page never cited. */
  unused(): Source[] {
    return [...this.byId.values()].filter((s) => !this.numbered.has(s.id));
  }

  get count(): number {
    return this.ordered.length;
  }
}
