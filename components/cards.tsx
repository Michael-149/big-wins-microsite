// Case cards and lesson rows. Per the DS StoryCard, the underlined headline is
// the only link on a card; lesson chips on cards are labels.

import { LessonChip, LessonTag } from './ui';
import { figureText, href, pad2 } from '@/lib/site';
import { stripCites } from '@/lib/markdown';
import { lessonsOfCase, casesOfLesson } from '@/lib/content';
import type { CaseStudy, Lesson } from '@/lib/types';

/**
 * Case card. "home" shows the win statement and the first stat; "hub" shows the
 * summary, the first two stats in compact size, and the years.
 */
export function CaseCard({ c, variant = 'home', headingLevel = 3 }: { c: CaseStudy; variant?: 'home' | 'hub'; headingLevel?: 2 | 3 }) {
  const stats = c.stats.slice(0, variant === 'hub' ? 2 : 1);
  const lessons = lessonsOfCase(c).map((x) => x.lesson);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="case-card">
      <p className="case-card__meta t-meta">
        <span>Case {pad2(c.order)}</span>
        <span>
          {c.domain}
          <span className="meta-sep" aria-hidden="true">/</span>
          <span className="visually-hidden">, </span>
          {variant === 'hub' ? c.years : c.geography}
        </span>
      </p>
      <H className="t-h3 case-card__title">
        <a className="title-link" href={href(`/case-studies/${c.slug}`)}>
          {c.title}
        </a>
      </H>
      <p className="t-body-lgs case-card__text">{stripCites(variant === 'hub' ? c.summary : c.winStatement)}</p>
      <dl
        className={`case-card__stats${stats.length > 1 ? ' case-card__stats--2' : ''}`}
        style={{ ['--n' as string]: String(stats.length) }}
      >
        {stats.map((s) => (
          <div className="case-card__stat" key={s.value + s.label}>
            <dt className="t-label">{s.label}</dt>
            <dd className="case-card__figure">{figureText(s.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="case-card__lessons">
        <p className="t-meta">Lessons</p>
        <ul className="lesson-tags">
          {lessons.map((l) => (
            <li key={l.slug}>
              <LessonTag lesson={l} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Abbreviations whose period does not end a sentence. */
const ABBREVIATIONS = /(?:\b(?:e\.g|i\.e|vs|etc|al|Dr|Mr|Ms|Mrs|St|No|Jr|Sr|Inc|Co)|\b[A-Z](?:\.[A-Z])*)\.$/;

/** The first sentence of a plain-text passage (the whole text if it is one sentence). */
export function firstSentence(text: string): string {
  const re = /[.?!]["\u201d\u2019)]?(?=\s+["\u201c(]?[A-Z0-9])/g;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const end = m.index + m[0].length;
    if (!ABBREVIATIONS.test(text.slice(0, m.index + 1))) return text.slice(0, end).trim();
  }
  return text.trim();
}

/**
 * Lesson row: 56px chip, linked title, the brief, and the cases it draws on.
 * The home page's compact rows add the short title and show only the brief's
 * first sentence, so the section stays scannable; hubs show the full brief.
 */
export function LessonRow({
  lesson,
  size = 'default',
  headingLevel = 3,
  compact = false,
}: {
  lesson: Lesson;
  size?: 'default' | 'large';
  headingLevel?: 2 | 3;
  compact?: boolean;
}) {
  const drawn = casesOfLesson(lesson);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const brief = stripCites(lesson.inBrief);
  return (
    <div className={`lesson-row${compact ? ' lesson-row--compact' : ''}`} id={`lesson-${lesson.number}`}>
      <LessonChip lesson={lesson} size={56} />
      <div>
        {compact && (
          <p className="t-tag lesson-row__short">{lesson.shortTitle}</p>
        )}
        <H className={size === 'large' ? 't-h3' : 't-h3s'}>
          <a className="title-link" href={href(`/lessons/${lesson.slug}`)}>
            <span className="visually-hidden">Lesson {lesson.number}: </span>
            {lesson.title}
          </a>
        </H>
        <p className="t-body lesson-row__brief">{compact ? firstSentence(brief) : brief}</p>
      </div>
      <div className="lesson-row__cases">
        <p className="t-meta">Drawn from</p>
        <ul className="t-body">
          {drawn.map(({ case: c }) => (
            <li key={c.slug}>
              <a className="link" href={href(`/case-studies/${c.slug}`)}>
                {c.shortTitle}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
