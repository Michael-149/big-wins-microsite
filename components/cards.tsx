// Case cards and lesson rows. Per the DS StoryCard, the underlined headline is
// the only link on a card; lesson chips on cards are labels.

import { LessonChip, LessonTag } from './ui';
import { href, pad2 } from '@/lib/site';
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
            <dd className="case-card__figure">{s.value}</dd>
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

/** Lesson row: 56px chip, linked title, the brief, and the cases it draws on. */
export function LessonRow({ lesson, size = 'default', headingLevel = 3 }: { lesson: Lesson; size?: 'default' | 'large'; headingLevel?: 2 | 3 }) {
  const drawn = casesOfLesson(lesson);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="lesson-row" id={`lesson-${lesson.number}`}>
      <LessonChip lesson={lesson} size={56} />
      <div>
        <H className={size === 'large' ? 't-h3' : 't-h3s'}>
          <a className="title-link" href={href(`/lessons/${lesson.slug}`)}>
            <span className="visually-hidden">Lesson {lesson.number}: </span>
            {lesson.title}
          </a>
        </H>
        <p className="t-body lesson-row__brief">{stripCites(lesson.inBrief)}</p>
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
