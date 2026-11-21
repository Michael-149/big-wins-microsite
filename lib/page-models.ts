// Page models: every string a case or lesson page shows, rendered to HTML in
// the order the page shows it, so citation numbers follow first appearance in
// the DOM. Templates render these models and must keep the same order.

import { Citer, blocksToHtml, inlineToHtml, textOf, walk, type MdNode, type NumberedSource } from './markdown';
import { casesOfLesson, getCases, getLessons, lessonsOfCase } from './content';
import { PHASES, type BodySection, type CaseStudy, type Chart, type Lesson, type Page, type Phase, type Source } from './types';
import type { FeedbackType } from './site';

// ---------------------------------------------------------------------------
// Phases (cases over time, phase strip)
// ---------------------------------------------------------------------------

export interface PhaseSpan {
  phase: Phase;
  start: number;
  end: number;
}

/**
 * A phase begins at the earliest event year with that phase and runs until the
 * next present phase begins; the last present phase runs to the latest year or
 * endYear among its events.
 */
export function phaseSpans(c: CaseStudy): PhaseSpan[] {
  const starts = PHASES.flatMap((phase) => {
    const ev = c.timeline.filter((t) => t.phase === phase);
    return ev.length ? [{ phase, start: Math.min(...ev.map((t) => t.year)), ev }] : [];
  });
  return starts.map((s, i) => {
    const next = starts[i + 1];
    const end = next ? next.start : Math.max(...s.ev.map((t) => t.endYear ?? t.year));
    return { phase: s.phase, start: s.start, end: Math.max(end, s.start) };
  });
}

export const PHASE_LABEL: Record<Phase, string> = {
  origin: 'Origin',
  research: 'Research',
  translation: 'Translation',
  scale: 'Scale',
};

/** "Moving to Opportunity: origin from 1966, research from 1994, ... scale from 2021 to 2026." */
export function phaseSentence(c: CaseStudy, spans = phaseSpans(c)): string {
  const parts = spans.map((s, i) =>
    i === spans.length - 1 && s.end > s.start ? `${s.phase} from ${s.start} to ${s.end}` : `${s.phase} from ${s.start}`,
  );
  return `${c.title}: ${parts.join(', ')}.`;
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export interface SourcesModel {
  numbered: NumberedSource[];
  unused: Source[];
  count: number;
}

export type Block =
  | { kind: 'html'; html: string }
  | { kind: 'keyStudies'; items: { year: number; title: string; url?: string; byline: string; findingHtml: string }[] }
  | { kind: 'quote'; textHtml: string; citeHtml: string }
  | { kind: 'phaseStrip' }
  | { kind: 'timeline'; items: { years: string; phase: Phase; textHtml: string }[] }
  | { kind: 'chart'; chart: Chart; noteHtml?: string; sourceHtml: string }
  | { kind: 'lessonChips' }
  | { kind: 'examples'; items: ExampleItem[] }
  | { kind: 'practices'; items: { html: string; n: number }[]; questions: string[] }
  | { kind: 'link'; to: string; label: string }
  | { kind: 'feedbackLink'; type: FeedbackType; label: string }
  | { kind: 'well'; html: string; label?: string }
  | { kind: 'version' }
  | { kind: 'form' };

export interface ExampleItem {
  leadHtml: string;
  textHtml: string;
  caseSlug?: string;
  caseOrder?: number;
  caseShortTitle?: string;
}

export interface SectionModel {
  id: string;
  title: string;
  blocks: Block[];
}

function sourcesModel(citer: Citer): SourcesModel {
  return { numbered: citer.list(), unused: citer.unused(), count: citer.count };
}

function trimLeading(nodes: MdNode[]): MdNode[] {
  const copy = structuredClone(nodes) as MdNode[];
  const first = copy[0];
  if (first && first.type === 'text' && typeof first.value === 'string') {
    first.value = first.value.replace(/^[\s:.\u2060]+/, '');
    if (!first.value) copy.shift();
  }
  return copy;
}

function startsWithStrong(n: MdNode): boolean {
  return n.type === 'paragraph' && n.children?.[0]?.type === 'strong';
}

/** Paragraphs that open with a bold lead-in become a small heading plus the paragraph. */
function leadInHtml(nodes: MdNode[], citer: Citer): string {
  return nodes
    .map((n) => {
      if (!startsWithStrong(n)) return citer.html(blocksToHtml([n]));
      const [strong, ...rest] = n.children!;
      const lead = citer.html(inlineToHtml(strong.children ?? []));
      const body = citer.html(inlineToHtml(trimLeading(rest)));
      return `<h3 class="leadin">${lead}</h3>${body ? `<p>${body}</p>` : ''}`;
    })
    .join('\n');
}

function html(nodes: MdNode[], citer: Citer): Block[] {
  const out = citer.html(blocksToHtml(nodes));
  return out ? [{ kind: 'html', html: out }] : [];
}

// ---------------------------------------------------------------------------
// Case page
// ---------------------------------------------------------------------------

export interface CasePageModel {
  winHtml: string;
  shows: { lesson: Lesson; noteHtml: string }[];
  stats: { value: string; label: string; detailHtml: string }[];
  introHtml: string;
  sections: SectionModel[];
  sources: SourcesModel;
  index: number;
  total: number;
  prev?: CaseStudy;
  next?: CaseStudy;
}

export function buildCasePage(c: CaseStudy): CasePageModel {
  const citer = new Citer(c.sources, `content/case-studies/${c.slug}.md`);
  const cases = getCases();
  const index = cases.findIndex((x) => x.slug === c.slug);

  // Hero, in DOM order: win statement, the StatList (right column on
  // desktop), then facts and "Lessons this case shows".
  const winHtml = citer.text(c.winStatement);
  const stats = c.stats.map((s) => ({
    value: s.value,
    label: s.label,
    detailHtml: citer.withSource(s.detail ? citer.text(s.detail) : '', s.source),
  }));
  const shows = lessonsOfCase(c).map(({ lesson, note }) => ({ lesson, noteHtml: citer.text(note) }));

  // Article.
  const introHtml = citer.html(blocksToHtml(c.intro as MdNode[]));
  const quoteBlock = (): Block[] =>
    c.pullQuote
      ? [{ kind: 'quote', textHtml: citer.text(c.pullQuote.text), citeHtml: citer.withSource(citer.text(c.pullQuote.cite), c.pullQuote.source) }]
      : [];
  const chartBlock = (): Block[] =>
    c.chart
      ? [
          {
            kind: 'chart',
            chart: c.chart,
            noteHtml: c.chart.note ? citer.text(c.chart.note) : undefined,
            sourceHtml: citer.withSource(shortCitation(c, c.chart.source), c.chart.source),
          },
        ]
      : [];
  const timelineBlock = (): Block => ({
    kind: 'timeline',
    items: c.timeline.map((t) => ({
      years: t.endYear && t.endYear !== t.year ? `${t.year} to ${t.endYear}` : String(t.year),
      phase: t.phase,
      textHtml: citer.withSource(citer.text(t.text), t.source),
    })),
  });

  const sectionIds = new Set(c.sections.map((s) => s.id));
  const sections: SectionModel[] = c.sections.map((s: BodySection) => {
    const nodes = s.nodes as MdNode[];
    const blocks: Block[] = [];
    if (s.id === 'change') blocks.push({ kind: 'phaseStrip' });
    if (s.id === 'debated') {
      const h = leadInHtml(nodes, citer);
      if (h) blocks.push({ kind: 'html', html: h });
    } else {
      blocks.push(...html(nodes, citer));
    }
    if (s.id === 'research' && c.keyStudies?.length) {
      blocks.push({
        kind: 'keyStudies',
        items: [...c.keyStudies]
          .sort((a, b) => a.year - b.year)
          .map((k) => {
            const src = c.sources.find((x) => x.id === k.source);
            return { year: k.year, title: k.title, url: src?.url, byline: k.byline, findingHtml: citer.withSource(citer.text(k.finding), k.source) };
          }),
      });
    }
    if (c.pullQuote && c.pullQuote.section === s.id) blocks.push(...quoteBlock());
    if (c.chart && c.chart.section === s.id) blocks.push(...chartBlock());
    if (s.id === 'change') blocks.push(timelineBlock());
    if (s.id === 'teaches') blocks.push({ kind: 'lessonChips' });
    return { id: s.id, title: s.title, blocks };
  });
  // Drafts without the spec's sections still show the timeline (and any
  // quote or chart whose section is missing).
  const extra: Block[] = [];
  if (c.pullQuote && !sectionIds.has(c.pullQuote.section)) extra.push(...quoteBlock());
  if (c.chart && !sectionIds.has(c.chart.section)) extra.push(...chartBlock());
  if (!sectionIds.has('change') && c.timeline.length) {
    sections.push({ id: 'timeline', title: 'Timeline', blocks: [{ kind: 'phaseStrip' }, ...extra, timelineBlock()] });
  } else if (extra.length) {
    sections.push({ id: 'more', title: 'More on this case', blocks: extra });
  }

  return {
    winHtml,
    shows,
    stats,
    introHtml,
    sections,
    sources: sourcesModel(citer),
    index,
    total: cases.length,
    prev: cases[index - 1],
    next: cases[index + 1],
  };
}

/** "Bergman et al. (2024)" style label from a source's citation text. */
function shortCitation(c: CaseStudy, id: string): string {
  const s = c.sources.find((x) => x.id === id);
  if (!s) return '';
  const m = /^([^,(]+)[^(]*\((\d{4})/.exec(s.citation);
  const etAl = /et al\.|&/.test(s.citation.split('(')[0]);
  // Organization authors end in a period ("Dalberg. (2021)"); drop it before the year.
  return m ? `Source: ${m[1].trim().replace(/\.$/, '')}${etAl ? ' et al.' : ''} (${m[2]})` : `Source: ${s.citation}`;
}

// ---------------------------------------------------------------------------
// Lesson page
// ---------------------------------------------------------------------------

export interface LessonPageModel {
  inBriefHtml: string;
  drawn: { case: CaseStudy; how: string }[];
  introHtml: string;
  sections: SectionModel[];
  sources: SourcesModel;
  total: number;
  prev?: Lesson;
  next?: Lesson;
  warnings: string[];
}

const CASE_LINK = /\/case-studies\/([a-z0-9-]+)\/?(#.*)?$/;

export function buildLessonPage(l: Lesson): LessonPageModel {
  const citer = new Citer(l.sources, `content/lessons/${l.slug}.md`);
  const lessons = getLessons();
  const cases = getCases();
  const i = lessons.findIndex((x) => x.slug === l.slug);
  const warnings: string[] = [];

  const inBriefHtml = citer.text(l.inBrief);
  const drawn = casesOfLesson(l);
  const introHtml = citer.html(blocksToHtml(l.intro as MdNode[]));

  const sections: SectionModel[] = l.sections.map((s) => {
    const nodes = s.nodes as MdNode[];
    const blocks: Block[] = [];
    if (s.id === 'in-the-cases') {
      // Paragraphs that open with a bold lead-in become example entries.
      let pending: MdNode[] = [];
      let examples: ExampleItem[] = [];
      const flush = () => {
        if (pending.length) blocks.push(...html(pending, citer));
        pending = [];
      };
      const flushExamples = () => {
        if (examples.length) blocks.push({ kind: 'examples', items: examples });
        examples = [];
      };
      for (const n of nodes) {
        if (!startsWithStrong(n)) {
          flushExamples();
          pending.push(n);
          continue;
        }
        flush();
        const [strong, ...rest] = n.children!;
        let caseSlug: string | undefined;
        walk(rest, (x) => {
          if (!caseSlug && x.type === 'link' && typeof x.url === 'string') {
            const m = CASE_LINK.exec(x.url);
            if (m) caseSlug = m[1];
          }
        });
        const found = cases.find((c) => c.slug === caseSlug);
        if (!found) warnings.push(`content/lessons/${l.slug}.md: example "${textOf(strong)}" has no link to a case page`);
        examples.push({
          leadHtml: citer.html(inlineToHtml(strong.children ?? [])),
          textHtml: citer.html(inlineToHtml(trimLeading(rest))),
          caseSlug: found?.slug,
          caseOrder: found?.order,
          caseShortTitle: found?.shortTitle,
        });
      }
      flushExamples();
      flush();
    } else if (s.id === 'for-funders') {
      // The section's first list becomes the practices callout; an item that
      // ends with "?" moves to the "A question for your own project" box.
      const li = nodes.findIndex((n) => n.type === 'list');
      if (li === -1) {
        blocks.push(...html(nodes, citer));
      } else {
        blocks.push(...html(nodes.slice(0, li), citer));
        const items: { html: string; n: number }[] = [];
        const questions: string[] = [];
        for (const item of nodes[li].children ?? []) {
          const text = textOf(item).trim();
          const inner = (item.children ?? []) as MdNode[];
          const h =
            inner.length === 1 && inner[0].type === 'paragraph'
              ? citer.html(inlineToHtml(inner[0].children ?? []))
              : citer.html(blocksToHtml(inner));
          if (text.endsWith('?')) questions.push(h);
          else items.push({ html: h, n: items.length + 1 });
        }
        blocks.push({ kind: 'practices', items, questions });
        blocks.push(...html(nodes.slice(li + 1), citer));
      }
    } else {
      blocks.push(...html(nodes, citer));
    }
    if (s.id === 'limits') blocks.push({ kind: 'link', to: '/method#limits', label: 'Limits of this collection' });
    return { id: s.id, title: s.title, blocks };
  });

  return {
    inBriefHtml,
    drawn,
    introHtml,
    sections,
    sources: sourcesModel(citer),
    total: lessons.length,
    prev: lessons[i - 1],
    next: lessons[i + 1],
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Other pages (method, about, contribute)
// ---------------------------------------------------------------------------

export interface DocPageModel {
  leadHtml?: string;
  introHtml: string;
  sections: SectionModel[];
  sources: SourcesModel;
}

/** A paragraph that is a formatted reference ("Stanford Impact Labs. (2026). ..."). */
const REFERENCE = /^[A-Z][^.]{1,80}\. \((19|20)\d{2}\)\./;

/**
 * Method, about and contribute pages: Markdown sections with citations, plus
 * the template blocks the design adds to named sections (links to the
 * Contribute form, the citation well, the version line, the form itself).
 * Content never carries a contribute URL; these links come from the template.
 */
export function buildDocPage(p: Page): DocPageModel {
  const citer = new Citer(p.sources, `content/pages/${p.slug}.md`);
  const leadHtml = p.lead ? citer.inline(p.lead) : undefined;
  const introHtml = citer.html(blocksToHtml(p.intro as MdNode[]));

  const sections: SectionModel[] = p.sections.map((s) => {
    const nodes = s.nodes as MdNode[];
    const blocks: Block[] = [];
    if (s.id === 'builds-on') {
      // Paragraphs that open with a bold lead-in become subheadings.
      const h = leadInHtml(nodes, citer);
      if (h) blocks.push({ kind: 'html', html: h });
    } else if (s.id === 'how-to-cite') {
      // Formatted references sit in a grey well as selectable text.
      let pending: MdNode[] = [];
      const flush = () => {
        blocks.push(...html(pending, citer));
        pending = [];
      };
      for (const n of nodes) {
        if (n.type === 'paragraph' && REFERENCE.test(textOf(n))) {
          flush();
          blocks.push({ kind: 'well', html: citer.html(inlineToHtml(n.children ?? [])) });
        } else {
          pending.push(n);
        }
      }
      flush();
    } else {
      blocks.push(...html(nodes, citer));
    }

    // Template additions, by stable section id.
    if (p.slug === 'method' && s.id === 'how-we-chose') blocks.push({ kind: 'link', to: '/cases-considered', label: 'See the cases we considered' });
    if (p.slug === 'method' && s.id === 'lessons') blocks.push({ kind: 'link', to: '/lessons', label: 'Read the lessons' });
    if (s.id === 'corrections') blocks.push({ kind: 'feedbackLink', type: 'correction', label: 'Flag an error or correction' });
    if (p.slug === 'about' && s.id === 'where-this-is-going') blocks.push({ kind: 'feedbackLink', type: 'suggest-case', label: 'Suggest a case' });
    if (p.slug === 'about' && s.id === 'this-version') blocks.push({ kind: 'version' });
    if (p.slug === 'contribute' && s.id === 'topics-we-would-like-to-add') blocks.push({ kind: 'feedbackLink', type: 'vertical', label: 'Propose a topic area' });
    if (p.slug === 'contribute' && s.id === 'form-section') blocks.push({ kind: 'form' });
    return { id: s.id, title: s.title, blocks };
  });

  return { leadHtml, introHtml, sections, sources: sourcesModel(citer) };
}
