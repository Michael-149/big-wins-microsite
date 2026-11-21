// Small shared pieces: meta line, button, arrow link, lesson chips, StatList,
// feedback box, pager, and an HTML block for pre-rendered (sanitized) content.

import type { ReactNode } from 'react';
import { ArrowIcon, ArrowNextIcon, ArrowPrevIcon } from './icons';
import { FEEDBACK, figureText, href, resolve, type FeedbackType } from '@/lib/site';
import type { Lesson } from '@/lib/types';

/** Renders HTML produced by lib/markdown (sanitized Markdown plus citation markers). */
export function Html({ html, as: Tag = 'div', className, id }: { html: string; as?: 'div' | 'p' | 'span' | 'li' | 'h3'; className?: string; id?: string }) {
  return <Tag id={id} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** DS Meta: uppercase items joined with " / ", at most three. */
export function MetaLine({ items, className = '', as: Tag = 'p' }: { items: ReactNode[]; className?: string; as?: 'p' | 'span' | 'div' }) {
  const shown = items.filter((x) => x !== null && x !== undefined && x !== '').slice(0, 3);
  return (
    <Tag className={`t-meta meta-line ${className}`.trim()}>
      {shown.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="meta-sep" aria-hidden="true">/</span>}
          {i > 0 && <span className="visually-hidden">, </span>}
          {item}
        </span>
      ))}
    </Tag>
  );
}

/** DS primary button. One per view. */
export function Button({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a className="btn" href={resolve(to)}>
      {children}
    </a>
  );
}

/** Label-style link with the DS arrow. `to` is a site path, a #hash or an absolute URL. */
export function ArrowLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <a className={`arrow-link ${className}`.trim()} href={resolve(to)}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

/** Lesson identity square. As a label it is hidden from assistive technology unless `label` is set. */
export function LessonChip({ lesson, size = 28, label }: { lesson: Pick<Lesson, 'number' | 'shortTitle'>; size?: 12 | 28 | 36 | 48 | 56; label?: string }) {
  return (
    <span
      className={`chip chip--${size} l${lesson.number}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {size === 12 ? '' : lesson.number}
    </span>
  );
}

/** A 28px chip with the lesson's short title, as a link or a label. */
export function LessonTag({ lesson, link = false }: { lesson: Pick<Lesson, 'number' | 'shortTitle' | 'slug'>; link?: boolean }) {
  const inner = (
    <>
      <LessonChip lesson={lesson} />
      <span className="lesson-tag__text">
        <span className="visually-hidden">Lesson {lesson.number}: </span>
        {lesson.shortTitle}
      </span>
    </>
  );
  return link ? (
    <a className="lesson-tag" href={href(`/lessons/${lesson.slug}`)}>
      {inner}
    </a>
  ) : (
    <span className="lesson-tag">{inner}</span>
  );
}

export interface StatItem {
  value: string;
  label: string;
  /** HTML (may include a citation marker). */
  detailHtml?: string;
  /** Linked rows show a plus in emphasis and go to `href`. */
  href?: string;
  /** Shown under the detail on linked home rows: the case name. */
  caseName?: string;
}

/**
 * DS statistics block. Variants: "row" (figure column beside the name),
 * "stacked" (figure over name), "ink" (figures in ink, for grey grounds).
 */
export function StatList({
  items,
  heading = 'What changed',
  headingId,
  variant = 'row',
  className = '',
}: {
  items: StatItem[];
  heading?: string;
  headingId?: string;
  variant?: 'row' | 'stacked' | 'ink';
  className?: string;
}) {
  const id = headingId ?? `stats-${slugifyId(heading)}`;
  return (
    <section className={`stats stats--${variant} ${className}`.trim()} aria-labelledby={id}>
      <h2 id={id} className="t-label stats__heading">
        {heading}
      </h2>
      <ul>
        {items.map((s, i) => {
          const long = s.value.length > 8;
          const body = (
            <>
              <span className={`stat__value${long ? ' stat__value--long' : ''}`}>{figureText(s.value)}</span>
              <span className="stat__name">
                {s.label}
                {s.href && variant !== 'ink' && (
                  <span className="stat__plus" aria-hidden="true">
                    +
                  </span>
                )}
                {s.detailHtml && <span className="stat__detail" dangerouslySetInnerHTML={{ __html: s.detailHtml }} />}
                {s.caseName && <span className="t-meta stat__case">{s.caseName}</span>}
              </span>
            </>
          );
          return (
            <li key={i}>
              {s.href ? (
                <a className="stat" href={s.href}>
                  {body}
                </a>
              ) : (
                <div className="stat">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function slugifyId(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Grey well with two or three feedback links for this page. */
export function FeedbackBox({
  title,
  text,
  links,
  page,
}: {
  title: string;
  text: string;
  links: { label: string; type: FeedbackType }[];
  page?: string;
}) {
  return (
    <section className="feedback-box" aria-labelledby="feedback-title" id="feedback">
      <h2 id="feedback-title" className="t-h4">
        {title}
      </h2>
      <p className="t-body">{text}</p>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            <ArrowLink to={FEEDBACK.href(l.type, page)}>{l.label}</ArrowLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface PagerLink {
  dir: string;
  title: string;
  to: string;
  lesson?: Pick<Lesson, 'number' | 'shortTitle'>;
}

/** Previous and next, under a black rule. */
export function Pager({ prev, next, label }: { prev: PagerLink; next: PagerLink; label: string }) {
  const half = (l: PagerLink, side: 'prev' | 'next') => (
    <div className={`pager__${side}`}>
      <a href={href(l.to)} rel={side}>
        <span className="t-meta pager__dir">
          {side === 'prev' && <ArrowPrevIcon />}
          {l.dir}
          {side === 'next' && <ArrowNextIcon />}
        </span>
        <span className="pager__title-wrap">
          {l.lesson && <LessonChip lesson={l.lesson} />}
          <span className="t-h5 pager__title">{l.title}</span>
        </span>
      </a>
    </div>
  );
  return (
    <nav className="pager" aria-label={label}>
      {half(prev, 'prev')}
      {half(next, 'next')}
    </nav>
  );
}
