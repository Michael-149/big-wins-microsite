// Content loader and build-time checks.
//
// Reads content/case-studies/*.md, content/lessons/*.md, content/pages/*.md and
// content/considered.yaml, validates them against the content spec, and throws
// (failing the build) on any error. Warnings print once per process.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { citeIds, parseMarkdown, splitSections, walk, textOf, type MdNode } from './markdown';
import {
  PHASES,
  type BodySection,
  type CaseStudy,
  type Chart,
  type ConsideredEntry,
  type GoDeeperItem,
  type HomePage,
  type HomeStake,
  type KeyStudy,
  type Lesson,
  type Page,
  type PullQuote,
  type SiteContent,
  type Source,
  type SourceType,
  type Stat,
  type TimelineEvent,
} from './types';

const CONTENT_DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(process.cwd(), 'content');

const SOURCE_TYPES: SourceType[] = ['paper', 'report', 'book', 'article', 'data', 'web', 'video', 'law'];
const GO_DEEPER_TYPES = ['book', 'article', 'video', 'podcast', 'data', 'report'];
const CASE_SECTIONS = ['problem', 'research', 'change', 'impact', 'debated', 'teaches'];
/** Routes that exist or are planned; internal links must point to one of them. */
const STATIC_ROUTES = ['/', '/case-studies', '/lessons', '/method', '/about', '/contribute', '/cases-considered', '/considered'];
/** Page files whose route is not "/<slug>". */
const PAGE_ROUTES: Record<string, string> = { home: '/', considered: '/cases-considered' };

/** The route a content/pages/<slug>.md file renders at. */
export function pageRoute(slug: string): string {
  return PAGE_ROUTES[slug] ?? `/${slug}`;
}
/** Ids the templates add on every case, lesson or page (besides the h2 ids). */
const TEMPLATE_IDS = ['main', 'sources', 'people', 'go-deeper', 'timeline', 'form', 'cases', 'lessons', 'feedback'];

export class ContentError extends Error {}

class Problems {
  errors: string[] = [];
  warnings: string[] = [];
  error(file: string, msg: string) {
    this.errors.push(`${file}: ${msg}`);
  }
  warn(file: string, msg: string) {
    this.warnings.push(`${file}: ${msg}`);
  }
}

type Obj = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Field readers
// ---------------------------------------------------------------------------

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function dateString(v: unknown): unknown {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}

function str(p: Problems, file: string, o: Obj, key: string, where = ''): string {
  const v = dateString(o[key]);
  if (typeof v !== 'string' || v.trim() === '') {
    p.error(file, `missing required field ${where}${key}`);
    return '';
  }
  return v.trim();
}

function optStr(p: Problems, file: string, o: Obj, key: string, where = ''): string | undefined {
  const v = dateString(o[key]);
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'string') {
    p.error(file, `${where}${key} must be text`);
    return undefined;
  }
  return v.trim();
}

function int(p: Problems, file: string, o: Obj, key: string, where = ''): number {
  const v = o[key];
  if (typeof v !== 'number' || !Number.isInteger(v)) {
    p.error(file, `missing or non-integer field ${where}${key}`);
    return 0;
  }
  return v;
}

function arr(p: Problems, file: string, o: Obj, key: string, required = true): unknown[] {
  const v = o[key];
  if (v === undefined || v === null) {
    if (required) p.error(file, `missing required list ${key}`);
    return [];
  }
  if (!Array.isArray(v)) {
    p.error(file, `${key} must be a list`);
    return [];
  }
  return v;
}

function strList(p: Problems, file: string, o: Obj, key: string, required = true): string[] {
  return arr(p, file, o, key, required).flatMap((v, i) => {
    if (typeof v !== 'string' || !v.trim()) {
      p.error(file, `${key}[${i}] must be text`);
      return [];
    }
    return [v.trim()];
  });
}

function objList(p: Problems, file: string, o: Obj, key: string, required = true): Obj[] {
  return arr(p, file, o, key, required).flatMap((v, i) => {
    if (!isObj(v)) {
      p.error(file, `${key}[${i}] must be a mapping`);
      return [];
    }
    return [v];
  });
}

function words(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Shared checks
// ---------------------------------------------------------------------------

const BAD_URL = [
  { re: /stanford\.idm\.oclc\.org/i, why: 'a Stanford proxy link' },
  { re: /^https?:\/\/(www\.)?google\.[a-z.]+\/url\?/i, why: 'a Google redirect link' },
  { re: /[?&]utm_[a-z]+=/i, why: 'utm_ tracking parameters' },
  { re: /chatgpt\.com/i, why: 'a chatgpt.com tag or link' },
];

function checkUrl(p: Problems, file: string, url: string, where: string) {
  for (const b of BAD_URL) if (b.re.test(url)) p.error(file, `${where} is ${b.why}: ${url}`);
  if (!/^(https?:\/\/|mailto:|\/|#)/.test(url)) p.error(file, `${where} is not a valid link: ${url}`);
}

function readSources(p: Problems, file: string, data: Obj): Source[] {
  const seen = new Set<string>();
  return objList(p, file, data, 'sources').flatMap((s, i) => {
    const where = `sources[${i}].`;
    const id = str(p, file, s, 'id', where);
    if (id && !/^[a-z0-9-]+$/.test(id)) p.error(file, `source id "${id}" must use lowercase letters, digits and hyphens`);
    if (id && seen.has(id)) p.error(file, `duplicate source id "${id}"`);
    seen.add(id);
    const citation = str(p, file, s, 'citation', where);
    const url = optStr(p, file, s, 'url', where);
    const altUrl = optStr(p, file, s, 'altUrl', where);
    const type = str(p, file, s, 'type', where) as SourceType;
    if (type && !SOURCE_TYPES.includes(type)) p.error(file, `source "${id}" has unknown type "${type}"`);
    if (!url && !citation.includes('[draft]')) p.warn(file, `source "${id}" has no url`);
    if (url) checkUrl(p, file, url, `source "${id}" url`);
    if (altUrl) checkUrl(p, file, altUrl, `source "${id}" altUrl`);
    return id ? [{ id, citation, url, altUrl, type }] : [];
  });
}

/** Checks every cite token against the file's sources. Returns the ids used. */
function checkCites(p: Problems, file: string, texts: string[], sources: Source[], structured: string[]): Set<string> {
  const ids = new Set(sources.map((s) => s.id));
  const used = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    const opens = (t.match(/\{\{/g) ?? []).length;
    const tokens = (t.match(/\{\{cite:[^{}]*\}\}/g) ?? []).length;
    if (opens !== tokens) p.error(file, `unclosed or malformed citation token near "${t.slice(t.indexOf('{{'), t.indexOf('{{') + 40)}"`);
    for (const id of citeIds(t)) {
      if (!ids.has(id)) p.error(file, `cites unknown source id "${id}"`);
      used.add(id);
    }
  }
  for (const id of structured) {
    if (!id) continue;
    if (!ids.has(id)) p.error(file, `source field names unknown source id "${id}"`);
    used.add(id);
  }
  for (const s of sources) if (!used.has(s.id)) p.warn(file, `source "${s.id}" is never cited (listed under "Also consulted")`);
  return used;
}

/** Dash and naming rules from the content spec, on the raw file text. */
function checkText(p: Problems, file: string, raw: string, allowWorkingTitle = false) {
  const lines = raw.split('\n');
  lines.forEach((line, i) => {
    if (/[\u2013\u2014]/.test(line)) p.error(file, `line ${i + 1} has an em or en dash: "${line.trim().slice(0, 80)}"`);
  });
  const hits = raw.match(/\bbig wins?\b/gi) ?? [];
  if (hits.length > (allowWorkingTitle ? 1 : 0)) {
    p.error(file, `uses "Big Wins" as a label (${hits.length}x); only one mention is allowed, on the About page`);
  }
}

/** Folders whose files hold UI strings (templates, components, site settings). */
const UI_DIRS = ['app', 'components', 'lib'];
/** The checker itself names the rules it enforces. */
const UI_SKIP = [path.join('lib', 'content.ts')];

/** The same dash and naming rules on every UI string in the templates (DESIGN-DECISION 13.3, items 2 and 3). */
function checkUiStrings(p: Problems) {
  const root = process.cwd();
  const visit = (rel: string) => {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) return;
    if (fs.statSync(full).isDirectory()) {
      for (const f of fs.readdirSync(full).sort()) visit(path.join(rel, f));
      return;
    }
    if (!/\.(tsx?|css)$/.test(rel) || UI_SKIP.includes(rel)) return;
    readFile(full)
      .split('\n')
      .forEach((line, i) => {
        if (/[–—]/.test(line)) p.error(rel, `line ${i + 1} has an em or en dash: "${line.trim().slice(0, 80)}"`);
        if (/\bbig wins?\b/i.test(line)) p.error(rel, `line ${i + 1} uses "Big Wins"; only the About page content may mention it`);
      });
  };
  UI_DIRS.forEach(visit);
}

const MD_SYNTAX = /\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*\n]+\*\*/;

/**
 * Frontmatter strings render in one of three ways: with citations (`cite`),
 * as inline Markdown with citations (`markdown`), or as plain text. A cite
 * token or Markdown in a plain-text field would show on the page as raw text,
 * so it fails the build. Paths look like "stats[0].detail".
 */
function checkFieldSyntax(p: Problems, file: string, data: Obj, fields: { cite: RegExp; markdown?: RegExp }) {
  const visit = (v: unknown, at: string) => {
    if (typeof v === 'string') {
      const md = fields.markdown?.test(at) ?? false;
      if (v.includes('{{') && !md && !fields.cite.test(at)) p.error(file, `${at} has a citation token, but that field shows plain text`);
      if (MD_SYNTAX.test(v) && !md) p.error(file, `${at} has Markdown (a link or bold), but that field shows plain text`);
    } else if (Array.isArray(v)) v.forEach((x, i) => visit(x, `${at}[${i}]`));
    else if (isObj(v)) for (const [k, x] of Object.entries(v)) visit(x, at ? `${at}.${k}` : k);
  };
  visit(data, '');
}

/** Case fields rendered with citation markers (lib/page-models.ts). */
const CASE_CITE_FIELDS = /^(winStatement|stats\[\d+\]\.detail|lessons\[\d+\]\.note|timeline\[\d+\]\.text|keyStudies\[\d+\]\.finding|pullQuote\.(text|cite)|chart\.note)$/;
/** Page fields that render as inline Markdown; the others strip cite tokens or show plain text. */
const PAGE_MARKDOWN_FIELDS = /^(lead|methodTeaser|note)$/;
const PAGE_CITE_FIELDS = /^(description|heroLead|stakes\[\d+\]\.detail)$/;

/** Links inside frontmatter strings that render as Markdown. */
function fieldLinks(data: Obj, fields: RegExp): { url: string; text: string }[] {
  const links: { url: string; text: string }[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== 'string' || !fields.test(k)) continue;
    walk(parseMarkdown(v).children ?? [], (n) => {
      if (n.type === 'link' && typeof n.url === 'string') links.push({ url: n.url, text: textOf(n) });
    });
  }
  return links;
}

interface ParsedBody {
  intro: MdNode[];
  sections: BodySection[];
  links: { url: string; text: string }[];
}

function parseBody(p: Problems, file: string, body: string): ParsedBody {
  const root = parseMarkdown(body);
  const links: { url: string; text: string }[] = [];
  walk(root.children ?? [], (n) => {
    if (n.type === 'link' && typeof n.url === 'string') links.push({ url: n.url, text: textOf(n) });
    if (n.type === 'heading' && n.depth === 1) p.error(file, `body has a "# ${textOf(n)}" heading; the page renders the title`);
    if (n.type === 'html') p.warn(file, `raw HTML in the body is dropped: ${String(n.value).slice(0, 60)}`);
  });
  for (const l of links) if (!l.url.startsWith('/') && !l.url.startsWith('#')) checkUrl(p, file, l.url, `link "${l.text}"`);
  const { intro, sections } = splitSections(root);
  return { intro, sections, links };
}

function readFile(file: string): string {
  return fs.readFileSync(file, 'utf8');
}

function listMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
}

function frontmatter(raw: string): { data: Obj; body: string } {
  const parsed = matter(raw, {});
  return { data: structuredClone(parsed.data) as Obj, body: parsed.content };
}

function hasDraftMarker(...parts: unknown[]): boolean {
  return parts.some((x) => JSON.stringify(x ?? '').includes('[draft]'));
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

function readCase(p: Problems, fileName: string): { item: CaseStudy; links: ParsedBody['links'] } {
  const file = `content/case-studies/${fileName}`;
  const raw = readFile(path.join(CONTENT_DIR, 'case-studies', fileName));
  checkText(p, file, raw);
  const { data, body } = frontmatter(raw);
  const slug = fileName.replace(/\.md$/, '');
  const fmSlug = str(p, file, data, 'slug');
  if (fmSlug && fmSlug !== slug) p.error(file, `slug "${fmSlug}" does not match the file name "${slug}"`);

  const shortTitle = str(p, file, data, 'shortTitle');
  if (shortTitle && words(shortTitle) > 4) p.warn(file, `shortTitle "${shortTitle}" is over 4 words`);
  const winStatement = str(p, file, data, 'winStatement');
  if (winStatement && words(winStatement) > 40) p.warn(file, `winStatement is ${words(winStatement)} words; keep it to about 35 (card text)`);

  const stats: Stat[] = objList(p, file, data, 'stats').map((s, i) => {
    const where = `stats[${i}].`;
    return {
      value: str(p, file, s, 'value', where),
      label: str(p, file, s, 'label', where),
      detail: optStr(p, file, s, 'detail', where),
      source: str(p, file, s, 'source', where),
    };
  });
  if (stats.length < 2 || stats.length > 4) p.warn(file, `has ${stats.length} stats; the spec asks for 2 to 4`);

  const timeline: TimelineEvent[] = objList(p, file, data, 'timeline').map((t, i) => {
    const where = `timeline[${i}].`;
    const phase = str(p, file, t, 'phase', where) as TimelineEvent['phase'];
    if (phase && !PHASES.includes(phase)) p.error(file, `${where}phase "${phase}" must be one of ${PHASES.join(', ')}`);
    const year = int(p, file, t, 'year', where);
    const endYear = t.endYear === undefined ? undefined : int(p, file, t, 'endYear', where);
    if (endYear !== undefined && endYear < year) p.error(file, `${where}endYear is before year`);
    return { year, endYear, phase, text: str(p, file, t, 'text', where), source: str(p, file, t, 'source', where) };
  });
  if (timeline.length < 5 || timeline.length > 9) p.warn(file, `has ${timeline.length} timeline events; the spec asks for 5 to 9`);
  if (!timeline.some((t) => t.phase === 'research')) p.warn(file, 'timeline has no research event');
  if (!timeline.some((t) => t.phase === 'scale')) p.warn(file, 'timeline has no scale event');

  const goDeeper: GoDeeperItem[] = objList(p, file, data, 'goDeeper', false).map((g, i) => {
    const where = `goDeeper[${i}].`;
    const item = {
      title: str(p, file, g, 'title', where),
      url: str(p, file, g, 'url', where),
      type: str(p, file, g, 'type', where) as GoDeeperItem['type'],
      note: optStr(p, file, g, 'note', where) ?? '',
    };
    if (item.type && !GO_DEEPER_TYPES.includes(item.type)) p.warn(file, `${where}type "${item.type}" is not one of ${GO_DEEPER_TYPES.join(', ')}`);
    if (item.url) checkUrl(p, file, item.url, `${where}url`);
    return item;
  });

  const keyStudies: KeyStudy[] | undefined = data.keyStudies
    ? objList(p, file, data, 'keyStudies').map((k, i) => {
        const where = `keyStudies[${i}].`;
        return {
          source: str(p, file, k, 'source', where),
          year: int(p, file, k, 'year', where),
          title: str(p, file, k, 'title', where),
          byline: str(p, file, k, 'byline', where),
          finding: str(p, file, k, 'finding', where),
        };
      })
    : undefined;

  let pullQuote: PullQuote | undefined;
  if (data.pullQuote !== undefined) {
    if (!isObj(data.pullQuote)) p.error(file, 'pullQuote must be a mapping');
    else {
      const q = data.pullQuote;
      const section = (optStr(p, file, q, 'section', 'pullQuote.') ?? 'research') as PullQuote['section'];
      if (!CASE_SECTIONS.includes(section)) p.error(file, `pullQuote.section "${section}" must be one of ${CASE_SECTIONS.join(', ')}`);
      pullQuote = {
        text: str(p, file, q, 'text', 'pullQuote.'),
        cite: str(p, file, q, 'cite', 'pullQuote.'),
        source: str(p, file, q, 'source', 'pullQuote.'),
        section,
      };
    }
  }

  let chart: Chart | undefined;
  if (data.chart !== undefined) {
    if (!isObj(data.chart)) p.error(file, 'chart must be a mapping');
    else {
      const c = data.chart;
      const section = (optStr(p, file, c, 'section', 'chart.') ?? 'impact') as Chart['section'];
      if (!CASE_SECTIONS.includes(section)) p.error(file, `chart.section "${section}" must be one of ${CASE_SECTIONS.join(', ')}`);
      chart = {
        title: str(p, file, c, 'title', 'chart.'),
        note: optStr(p, file, c, 'note', 'chart.'),
        unit: optStr(p, file, c, 'unit', 'chart.'),
        max: typeof c.max === 'number' ? c.max : undefined,
        section,
        source: str(p, file, c, 'source', 'chart.'),
        groups: objList(p, file, c, 'groups').map((g, gi) => ({
          label: str(p, file, g, 'label', `chart.groups[${gi}].`),
          bars: objList(p, file, g, 'bars').map((b, bi) => {
            const value = b.value;
            if (typeof value !== 'number') p.error(file, `chart.groups[${gi}].bars[${bi}].value must be a number`);
            return { label: str(p, file, b, 'label', `chart.groups[${gi}].bars[${bi}].`), value: Number(value) };
          }),
        })),
      };
    }
  }

  if (chart) {
    for (const g of chart.groups) {
      for (const b of g.bars) {
        if (chart.max !== undefined && b.value > chart.max) p.error(file, `chart bar "${g.label} / ${b.label}" (${b.value}) is above chart.max (${chart.max})`);
        if (b.value < 0) p.error(file, `chart bar "${g.label} / ${b.label}" is negative`);
      }
    }
  }

  const lessonRefs = objList(p, file, data, 'lessons').map((x, i) => ({
    slug: str(p, file, x, 'slug', `lessons[${i}].`),
    note: optStr(p, file, x, 'note', `lessons[${i}].`) ?? '',
  }));

  const sources = readSources(p, file, data);
  const parsed = parseBody(p, file, body);
  checkFieldSyntax(p, file, data, { cite: CASE_CITE_FIELDS });
  checkCites(
    p,
    file,
    [
      body,
      winStatement,
      ...stats.map((s) => s.detail ?? ''),
      ...lessonRefs.map((l) => l.note),
      ...timeline.map((t) => t.text),
      ...(keyStudies ?? []).map((k) => k.finding),
      pullQuote?.text ?? '',
      pullQuote?.cite ?? '',
      chart?.note ?? '',
    ],
    sources,
    [
      ...stats.map((s) => s.source),
      ...timeline.map((t) => t.source),
      ...(keyStudies ?? []).map((k) => k.source),
      pullQuote?.source ?? '',
      chart?.source ?? '',
    ],
  );

  const lastReviewed = str(p, file, data, 'lastReviewed');
  if (lastReviewed && !/^\d{4}-\d{2}-\d{2}$/.test(lastReviewed)) p.error(file, 'lastReviewed must be YYYY-MM-DD');

  const item: CaseStudy = {
    slug,
    title: str(p, file, data, 'title'),
    shortTitle,
    order: int(p, file, data, 'order'),
    domain: str(p, file, data, 'domain'),
    disciplines: strList(p, file, data, 'disciplines'),
    geography: str(p, file, data, 'geography'),
    years: str(p, file, data, 'years'),
    winStatement,
    summary: str(p, file, data, 'summary'),
    people: objList(p, file, data, 'people').map((x, i) => ({
      name: str(p, file, x, 'name', `people[${i}].`),
      role: str(p, file, x, 'role', `people[${i}].`),
    })),
    lessons: lessonRefs,
    stats,
    timeline,
    goDeeper,
    lastReviewed,
    sources,
    keyStudies,
    pullQuote,
    chart,
    body,
    intro: parsed.intro,
    sections: parsed.sections,
    draft: hasDraftMarker(data, body),
  };
  if (item.lessons.length < 2 || item.lessons.length > 4) p.warn(file, `lists ${item.lessons.length} lessons; the spec asks for 2 to 4`);
  if (item.people.length < 3 || item.people.length > 6) p.warn(file, `lists ${item.people.length} people; the spec asks for 3 to 6`);
  const ids = new Set(item.sections.map((s) => s.id));
  for (const s of CASE_SECTIONS) if (!ids.has(s) && !item.draft) p.warn(file, `has no "${s}" section`);
  return { item, links: parsed.links };
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

function readLesson(p: Problems, fileName: string): { item: Lesson; links: ParsedBody['links'] } {
  const file = `content/lessons/${fileName}`;
  const raw = readFile(path.join(CONTENT_DIR, 'lessons', fileName));
  checkText(p, file, raw);
  const { data, body } = frontmatter(raw);
  const slug = fileName.replace(/\.md$/, '');
  const fmSlug = optStr(p, file, data, 'slug');
  if (fmSlug && fmSlug !== slug) p.error(file, `slug "${fmSlug}" does not match the file name "${slug}" (lesson slug = file name)`);
  const shortTitle = str(p, file, data, 'shortTitle');
  if (shortTitle && words(shortTitle) > 3) p.warn(file, `shortTitle "${shortTitle}" is over 3 words`);
  const inBrief = str(p, file, data, 'inBrief');
  const sources = readSources(p, file, data);
  const parsed = parseBody(p, file, body);
  const cases = objList(p, file, data, 'cases').map((x, i) => ({
    slug: str(p, file, x, 'slug', `cases[${i}].`),
    how: optStr(p, file, x, 'how', `cases[${i}].`) ?? '',
  }));
  checkFieldSyntax(p, file, data, { cite: /^inBrief$/ });
  checkCites(p, file, [body, inBrief], sources, []);
  const lastReviewed = optStr(p, file, data, 'lastReviewed');
  const item: Lesson = {
    number: int(p, file, data, 'number'),
    slug,
    title: str(p, file, data, 'title'),
    shortTitle,
    inBrief,
    cases,
    sources,
    lastReviewed,
    body,
    intro: parsed.intro,
    sections: parsed.sections,
    draft: hasDraftMarker(data, body),
  };
  if (!/^\d+-/.test(slug) || Number(slug.split('-')[0]) !== item.number) {
    p.error(file, `file name should start with the lesson number (${item.number}-)`);
  }
  return { item, links: parsed.links };
}

// ---------------------------------------------------------------------------
// Pages and the considered list
// ---------------------------------------------------------------------------

function readPage(p: Problems, fileName: string): { item: Page; links: ParsedBody['links'] } {
  const file = `content/pages/${fileName}`;
  const slug = fileName.replace(/\.md$/, '');
  const raw = readFile(path.join(CONTENT_DIR, 'pages', fileName));
  checkText(p, file, raw, slug === 'about');
  const { data, body } = frontmatter(raw);
  const sources = data.sources === undefined ? [] : readSources(p, file, data);
  const parsed = parseBody(p, file, body);
  parsed.links.push(...fieldLinks(data, PAGE_MARKDOWN_FIELDS));
  checkFieldSyntax(p, file, data, { cite: PAGE_CITE_FIELDS, markdown: PAGE_MARKDOWN_FIELDS });
  const textFields = Object.values(data).filter((v): v is string => typeof v === 'string');
  checkCites(p, file, [body, ...textFields], sources, []);
  const item: Page = {
    slug,
    title: str(p, file, data, 'title'),
    shortTitle: optStr(p, file, data, 'shortTitle'),
    description: optStr(p, file, data, 'description'),
    lead: optStr(p, file, data, 'lead'),
    lastReviewed: optStr(p, file, data, 'lastReviewed'),
    sources,
    body,
    intro: parsed.intro,
    sections: parsed.sections,
    data,
  };
  return { item, links: parsed.links };
}

function toHome(p: Problems, page: Page): HomePage {
  const file = 'content/pages/home.md';
  const d = page.data;
  const stakes: HomeStake[] = objList(p, file, d, 'stakes').map((s, i) => ({
    value: str(p, file, s, 'value', `stakes[${i}].`),
    label: str(p, file, s, 'label', `stakes[${i}].`),
    detail: optStr(p, file, s, 'detail', `stakes[${i}].`),
    case: str(p, file, s, 'case', `stakes[${i}].`),
    source: str(p, file, s, 'source', `stakes[${i}].`),
  }));
  if (stakes.length < 3 || stakes.length > 4) p.warn(file, `has ${stakes.length} stakes; the spec asks for 3 to 4`);
  const opt = (k: string) => optStr(p, file, d, k);
  return {
    ...page,
    heroTitle: opt('heroTitle'),
    heroLead: opt('heroLead'),
    stakes,
    casesIntro: opt('casesIntro'),
    lessonsIntro: opt('lessonsIntro'),
    methodTeaser: opt('methodTeaser'),
    contributeTeaser: opt('contributeTeaser'),
  };
}

function readConsidered(p: Problems): ConsideredEntry[] {
  const file = 'content/considered.yaml';
  const full = path.join(CONTENT_DIR, 'considered.yaml');
  if (!fs.existsSync(full)) return [];
  const raw = readFile(full);
  checkText(p, file, raw);
  let data: unknown;
  try {
    // gray-matter's bundled YAML engine (js-yaml, safe schema); the types omit it.
    const engines = (matter as unknown as { engines: { yaml: { parse: (s: string) => unknown } } }).engines;
    data = engines.yaml.parse(raw);
  } catch (e) {
    p.error(file, `is not valid YAML: ${(e as Error).message}`);
    return [];
  }
  if (!Array.isArray(data)) {
    p.error(file, 'must be a list of entries');
    return [];
  }
  return data.flatMap((e, i) => {
    if (!isObj(e)) {
      p.error(file, `entry ${i + 1} must be a mapping`);
      return [];
    }
    const where = `entry ${i + 1} `;
    const selected = e.selected === true;
    const entry: ConsideredEntry = {
      name: str(p, file, e, 'name', where),
      domain: str(p, file, e, 'domain', where),
      geography: optStr(p, file, e, 'geography', where) ?? '',
      pathway: optStr(p, file, e, 'pathway', where) ?? '',
      researchers: strList(p, file, e, 'researchers', false),
      summary: str(p, file, e, 'summary', where),
      selected,
      slug: optStr(p, file, e, 'slug', where),
      source: optStr(p, file, e, 'source', where) ?? '',
    };
    if (selected && !entry.slug) p.error(file, `${where}(${entry.name}) is selected but has no slug`);
    return [entry];
  });
}

// ---------------------------------------------------------------------------
// Cross-file checks and the cached loader
// ---------------------------------------------------------------------------

function checkInternalLinks(
  p: Problems,
  file: string,
  links: { url: string; text: string }[],
  anchors: Map<string, Set<string> | null>,
  own: Set<string>,
) {
  for (const { url, text } of links) {
    if (url.startsWith('#')) {
      const id = url.slice(1);
      if (id && !own.has(id) && !TEMPLATE_IDS.includes(id)) p.error(file, `link "${text}" points to #${id}, which is not on this page`);
      continue;
    }
    if (!url.startsWith('/')) continue;
    const [pathAndQuery, hash] = url.split('#');
    const route = pathAndQuery.split('?')[0].replace(/\/+$/, '') || '/';
    if (!anchors.has(route)) {
      p.error(file, `link "${text}" points to ${url}, which is not a page on this site`);
      continue;
    }
    const ids = anchors.get(route);
    if (hash && ids && !ids.has(hash) && !TEMPLATE_IDS.includes(hash)) {
      p.error(file, `link "${text}" points to ${url}, but that page has no #${hash}`);
    }
  }
}

let cache: SiteContent | null = null;
let warned = false;

export function loadContent(): SiteContent {
  if (cache) return cache;
  const p = new Problems();

  const caseFiles = listMd(path.join(CONTENT_DIR, 'case-studies'));
  const lessonFiles = listMd(path.join(CONTENT_DIR, 'lessons'));
  const pageFiles = listMd(path.join(CONTENT_DIR, 'pages'));
  const caseReads = caseFiles.map((f) => readCase(p, f));
  const lessonReads = lessonFiles.map((f) => readLesson(p, f));
  const pageReads = pageFiles.map((f) => readPage(p, f));
  const considered = readConsidered(p);
  checkUiStrings(p);

  const cases = caseReads.map((r) => r.item).sort((a, b) => a.order - b.order);
  const lessons = lessonReads.map((r) => r.item).sort((a, b) => a.number - b.number);
  const pages: Record<string, Page> = Object.fromEntries(pageReads.map((r) => [r.item.slug, r.item]));

  if (cases.length === 0) p.error('content/case-studies', 'no case files found');
  if (lessons.length === 0) p.error('content/lessons', 'no lesson files found');

  // Order and numbering
  const orders = cases.map((c) => c.order);
  cases.forEach((c, i) => {
    if (c.order !== i + 1) p.error(`content/case-studies/${c.slug}.md`, `order ${c.order} breaks the sequence 1 to ${cases.length} (orders: ${orders.join(', ')})`);
  });
  lessons.forEach((l, i) => {
    if (l.number !== i + 1) p.error(`content/lessons/${l.slug}.md`, `number ${l.number} breaks the sequence 1 to ${lessons.length}`);
  });

  // Cross references
  const caseBySlug = new Map(cases.map((c) => [c.slug, c]));
  const lessonBySlug = new Map(lessons.map((l) => [l.slug, l]));
  for (const c of cases) {
    const file = `content/case-studies/${c.slug}.md`;
    for (const ref of c.lessons) {
      const lesson = lessonBySlug.get(ref.slug);
      if (!lesson) {
        p.error(file, `lessons lists "${ref.slug}", which is not a lesson file`);
        continue;
      }
      if (!lesson.cases.some((x) => x.slug === c.slug)) {
        p.warn(file, `lists lesson "${ref.slug}", but that lesson's cases do not include "${c.slug}" (lesson frontmatter is canonical)`);
      }
    }
  }
  for (const l of lessons) {
    const file = `content/lessons/${l.slug}.md`;
    const seen = new Set<string>();
    for (const ref of l.cases) {
      if (!caseBySlug.has(ref.slug)) p.error(file, `cases lists "${ref.slug}", which is not a case file`);
      if (seen.has(ref.slug)) p.error(file, `cases lists "${ref.slug}" twice`);
      seen.add(ref.slug);
    }
  }

  let home: HomePage | undefined;
  if (pages.home) {
    home = toHome(p, pages.home);
    for (const s of home.stakes) {
      const c = caseBySlug.get(s.case);
      if (!c) {
        p.error('content/pages/home.md', `stake "${s.value}" names case "${s.case}", which does not exist`);
        continue;
      }
      const stat = c.stats.find((x) => x.value === s.value && x.source === s.source);
      if (!stat) {
        p.error('content/pages/home.md', `stake "${s.value}" (source ${s.source}) does not match a stat on ${s.case}`);
        continue;
      }
      // The home StatList shows one short line per stake; long lines push rows below the fold.
      const shown = (s.detail ?? stat.detail ?? '').replace(/\s*\{\{cite:[^}]*\}\}/g, '');
      if (shown.length > 60) {
        p.warn('content/pages/home.md', `stake "${s.value}" detail is ${shown.length} characters; the spec allows 60 or fewer, so the stakes fit above the fold`);
      }
    }
  }

  // Method glance figures and limits, shown on the home page and the method page.
  if (pages.method) {
    const file = 'content/pages/method.md';
    const d = pages.method.data;
    const glance = objList(p, file, d, 'glance');
    glance.forEach((g, i) => {
      str(p, file, g, 'value', `glance[${i}].`);
      str(p, file, g, 'label', `glance[${i}].`);
    });
    if (glance.length !== 3) p.warn(file, `has ${glance.length} glance figures; the spec asks for three`);
    const limits = objList(p, file, d, 'limitsSummary');
    limits.forEach((x, i) => {
      str(p, file, x, 'title', `limitsSummary[${i}].`);
      str(p, file, x, 'text', `limitsSummary[${i}].`);
    });
    if (limits.length !== 4) p.warn(file, `has ${limits.length} limitsSummary items; the spec asks for exactly four`);
  }
  for (const e of considered) {
    if (e.slug && !caseBySlug.has(e.slug)) p.error('content/considered.yaml', `entry "${e.name}" links to case "${e.slug}", which does not exist`);
  }

  // Internal links resolve to a route, and hashes to a heading id
  const anchors = new Map<string, Set<string> | null>();
  for (const r of STATIC_ROUTES) anchors.set(r, null);
  for (const c of cases) anchors.set(`/case-studies/${c.slug}`, new Set(c.sections.map((s) => s.id)));
  for (const l of lessons) anchors.set(`/lessons/${l.slug}`, new Set(l.sections.map((s) => s.id)));
  for (const pg of Object.values(pages)) {
    anchors.set(pageRoute(pg.slug), new Set(pg.sections.map((s) => s.id)));
  }
  for (const r of caseReads) {
    checkInternalLinks(p, `content/case-studies/${r.item.slug}.md`, r.links, anchors, new Set(r.item.sections.map((s) => s.id)));
  }
  for (const r of lessonReads) {
    checkInternalLinks(p, `content/lessons/${r.item.slug}.md`, r.links, anchors, new Set(r.item.sections.map((s) => s.id)));
  }
  for (const r of pageReads) {
    checkInternalLinks(p, `content/pages/${r.item.slug}.md`, r.links, anchors, new Set(r.item.sections.map((s) => s.id)));
  }

  if (!warned && p.warnings.length) {
    warned = true;
    console.warn(`\nContent warnings (${p.warnings.length}):\n  ${p.warnings.join('\n  ')}\n`);
  }
  if (p.errors.length) {
    throw new ContentError(`Content check failed with ${p.errors.length} error(s):\n  ${p.errors.join('\n  ')}`);
  }

  cache = { cases, lessons, pages, home, considered };
  return cache;
}

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export function getCases(): CaseStudy[] {
  return loadContent().cases;
}

export function getCase(slug: string): CaseStudy {
  const c = loadContent().cases.find((x) => x.slug === slug);
  if (!c) throw new ContentError(`No case with slug "${slug}"`);
  return c;
}

export function getLessons(): Lesson[] {
  return loadContent().lessons;
}

export function getLesson(slug: string): Lesson {
  const l = loadContent().lessons.find((x) => x.slug === slug);
  if (!l) throw new ContentError(`No lesson with slug "${slug}"`);
  return l;
}

export function getPage(slug: string): Page | undefined {
  return loadContent().pages[slug];
}

export function getHome(): HomePage | undefined {
  return loadContent().home;
}

export function getConsidered(): ConsideredEntry[] {
  return loadContent().considered;
}

/** Lessons a case illustrates most clearly (case frontmatter `lessons`), with the lesson objects. */
export function lessonsOfCase(c: CaseStudy): { lesson: Lesson; note: string }[] {
  const all = loadContent().lessons;
  return c.lessons.flatMap((ref) => {
    const lesson = all.find((l) => l.slug === ref.slug);
    return lesson ? [{ lesson, note: ref.note }] : [];
  });
}

/** Every case a lesson draws on (lesson frontmatter `cases`, the canonical mapping). */
export function casesOfLesson(l: Lesson): { case: CaseStudy; how: string }[] {
  const all = loadContent().cases;
  return l.cases.flatMap((ref) => {
    const c = all.find((x) => x.slug === ref.slug);
    return c ? [{ case: c, how: ref.how }] : [];
  });
}

/** Lessons whose canonical `cases` list includes this case. */
export function lessonsDrawingOn(c: CaseStudy): Lesson[] {
  return loadContent().lessons.filter((l) => l.cases.some((x) => x.slug === c.slug));
}
