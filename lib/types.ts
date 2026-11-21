// Content types for When Social Science Scales. The schemas are defined in the
// content spec (cases, lessons, pages, considered list) and the design decision
// (optional keyStudies, pullQuote, chart, method glance).

export type SourceType = 'paper' | 'report' | 'book' | 'article' | 'data' | 'web' | 'video' | 'law';

export interface Source {
  id: string;
  citation: string;
  url?: string;
  altUrl?: string;
  type: SourceType;
}

/** The four phases a case moves through, in order. Each draws a bar segment. */
export type Phase = 'origin' | 'research' | 'translation' | 'scale';
export const PHASES: Phase[] = ['origin', 'research', 'translation', 'scale'];
/**
 * A timeline event is one of the four phases or a `setback`: a repeal, lapse
 * or withdrawal. Setbacks are dated marks, not a phase: they never start,
 * end or extend a phase bar.
 */
export type TimelinePhase = Phase | 'setback';
export const TIMELINE_PHASES: TimelinePhase[] = [...PHASES, 'setback'];

export interface Stat {
  value: string;
  label: string;
  detail?: string;
  source: string;
}

export interface TimelineEvent {
  year: number;
  endYear?: number;
  phase: TimelinePhase;
  text: string;
  source: string;
}

export interface Person {
  name: string;
  role: string;
}

export interface CaseLessonRef {
  slug: string;
  note: string;
}

export type GoDeeperType = 'book' | 'article' | 'video' | 'podcast' | 'data' | 'report';

export interface GoDeeperItem {
  title: string;
  url: string;
  type: GoDeeperType;
  note: string;
}

export interface KeyStudy {
  source: string;
  year: number;
  title: string;
  byline: string;
  finding: string;
}

export type CaseSectionKey = 'problem' | 'research' | 'change' | 'impact' | 'debated' | 'teaches';

export interface PullQuote {
  text: string;
  cite: string;
  source: string;
  section: CaseSectionKey;
}

export interface ChartBar {
  label: string;
  value: number;
}

export interface Chart {
  title: string;
  note?: string;
  unit?: string;
  max?: number;
  section: CaseSectionKey;
  source: string;
  groups: { label: string; bars: ChartBar[] }[];
}

/** A Markdown body split at its `##` headings. */
export interface BodySection {
  /** Stable id for the h2 (for example "problem" or "in-the-cases"). */
  id: string;
  title: string;
  /** mdast children of the section (everything after the h2). */
  nodes: unknown[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  domain: string;
  disciplines: string[];
  geography: string;
  years: string;
  winStatement: string;
  summary: string;
  people: Person[];
  lessons: CaseLessonRef[];
  stats: Stat[];
  timeline: TimelineEvent[];
  goDeeper: GoDeeperItem[];
  lastReviewed: string;
  sources: Source[];
  keyStudies?: KeyStudy[];
  pullQuote?: PullQuote;
  chart?: Chart;
  /** Markdown body. */
  body: string;
  /** Text before the first `##` (rare) plus one entry per `##` section. */
  intro: unknown[];
  sections: BodySection[];
  /** True while any field still carries a "[draft]" placeholder. */
  draft: boolean;
}

export interface LessonCaseRef {
  slug: string;
  how: string;
}

export interface Lesson {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  inBrief: string;
  cases: LessonCaseRef[];
  sources: Source[];
  lastReviewed?: string;
  body: string;
  intro: unknown[];
  sections: BodySection[];
  draft: boolean;
}

export interface HomeStake {
  value: string;
  label: string;
  /** Optional short line under the label; defaults to the matching case stat's detail. */
  detail?: string;
  case: string;
  source: string;
}

export interface GlanceFigure {
  value: string;
  label: string;
}

export interface LimitSummary {
  title: string;
  text: string;
}

export interface Page {
  slug: string;
  title: string;
  shortTitle?: string;
  description?: string;
  lead?: string;
  lastReviewed?: string;
  sources: Source[];
  body: string;
  intro: unknown[];
  sections: BodySection[];
  /** Every frontmatter field, for page-specific data (heroTitle, stakes, glance and so on). */
  data: Record<string, unknown>;
}

export interface HomePage extends Page {
  heroTitle?: string;
  heroLead?: string;
  stakes: HomeStake[];
  casesIntro?: string;
  lessonsIntro?: string;
  methodTeaser?: string;
  contributeTeaser?: string;
}

export interface ConsideredEntry {
  name: string;
  domain: string;
  geography: string;
  pathway: string;
  researchers: string[];
  summary: string;
  selected: boolean;
  slug?: string;
  source: string;
}

export interface SiteContent {
  cases: CaseStudy[];
  lessons: Lesson[];
  pages: Record<string, Page>;
  home?: HomePage;
  considered: ConsideredEntry[];
}
