// Orientation: the desktop rail, the mobile "Guide contents" disclosure and the
// lesson strip. The rail is a div of labeled navs (not an aside), so it never
// nests a complementary landmark inside main.

import { LessonChip, LessonTag } from './ui';
import { MinusIcon, PlusIcon } from './icons';
import { FEEDBACK, href, numberWord, pad2 } from '@/lib/site';
import type { CaseStudy, Lesson } from '@/lib/types';

export interface OnThisPageItem {
  id: string;
  title: string;
}

export interface Orientation {
  /** "Case 1 of 8" or "Lesson 3 of 8". */
  where: string;
  title: string;
  lesson?: Lesson;
}

function OnThisPage({ items, two = false, idPrefix }: { items: OnThisPageItem[]; two?: boolean; idPrefix: string }) {
  return (
    <nav aria-labelledby={`${idPrefix}-otp`}>
      <p className="t-label rail__title" id={`${idPrefix}-otp`}>
        On this page
      </p>
      <ol className={`rail-list${two ? ' rail-list--two' : ''}`}>
        {items.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CaseList({ cases, current, idPrefix, title }: { cases: CaseStudy[]; current?: string; idPrefix: string; title: string }) {
  return (
    <nav aria-labelledby={`${idPrefix}-cases`}>
      <p className="t-label rail__title" id={`${idPrefix}-cases`}>
        {title}
      </p>
      <ol className="rail-list">
        {cases.map((c) => (
          <li key={c.slug}>
            <a href={href(`/case-studies/${c.slug}`)} aria-current={c.slug === current ? 'page' : undefined}>
              <span className="num" aria-hidden="true">
                {pad2(c.order)}
              </span>
              <span>
                <span className="visually-hidden">Case {c.order}: </span>
                {c.shortTitle}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function LessonList({ lessons, idPrefix, title }: { lessons: Lesson[]; idPrefix: string; title: string }) {
  return (
    <nav aria-labelledby={`${idPrefix}-lessons`}>
      <p className="t-label rail__title" id={`${idPrefix}-lessons`}>
        {title}
      </p>
      <ul className="rail-lessons">
        {lessons.map((l) => (
          <li key={l.slug}>
            <LessonTag lesson={l} link />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Where({ o }: { o: Orientation }) {
  return (
    <div className="rail__where">
      {o.lesson && <LessonChip lesson={o.lesson} />}
      <p className="t-h6">
        <span className="t-meta">{o.where}</span>
        {o.title}
      </p>
    </div>
  );
}

/** Desktop rail (1024px and up): where am I, on this page, the eight cases, related lessons or cases. */
export function PageRail({
  orientation,
  onThisPage,
  cases,
  currentCase,
  lessons,
  lessonsTitle,
  casesTitle,
  page,
}: {
  orientation: Orientation;
  onThisPage: OnThisPageItem[];
  cases: CaseStudy[];
  currentCase?: string;
  lessons?: Lesson[];
  lessonsTitle?: string;
  casesTitle: string;
  page: string;
}) {
  return (
    <div className="rail">
      <div className="rail__inner">
        <Where o={orientation} />
        <OnThisPage items={onThisPage} idPrefix="rail" />
        <CaseList cases={cases} current={currentCase} idPrefix="rail" title={casesTitle} />
        {lessons && lessons.length > 0 && <LessonList lessons={lessons} idPrefix="rail" title={lessonsTitle ?? 'Lessons'} />}
        <p className="rail__flag">
          <a className="link" href={FEEDBACK.href('correction', page)}>
            Flag an error on this page
          </a>
        </p>
      </div>
    </div>
  );
}

/** Mobile and tablet (under 1024px): the rail's contents in one disclosure under the breadcrumbs. */
export function GuideContents({
  orientation,
  onThisPage,
  cases,
  currentCase,
  lessons,
}: {
  orientation: Orientation;
  onThisPage: OnThisPageItem[];
  cases: CaseStudy[];
  currentCase?: string;
  lessons: Lesson[];
}) {
  return (
    <details className="guide">
      <summary>
        <span>
          <span className="t-meta">Guide contents</span>
          <span className="t-h6">
            {orientation.where}: {orientation.title}
          </span>
        </span>
        <PlusIcon className="icon-plus" />
        <MinusIcon className="icon-minus" />
      </summary>
      <div className="guide__panel">
        <OnThisPage items={onThisPage} two idPrefix="guide" />
        <CaseList cases={cases} current={currentCase} idPrefix="guide" title={`${numberWord(cases.length)} cases`} />
        <LessonList lessons={lessons} idPrefix="guide" title={`${numberWord(lessons.length)} lessons`} />
      </div>
    </details>
  );
}

/** All eight lessons, current one enlarged (lesson pages). */
export function LessonStrip({ lessons, current }: { lessons: Lesson[]; current: string }) {
  return (
    <nav className="lesson-strip" aria-label="Lessons">
      <ol>
        {lessons.map((l) => {
          const on = l.slug === current;
          return (
            <li key={l.slug}>
              <a href={href(`/lessons/${l.slug}`)} aria-current={on ? 'page' : undefined}>
                <LessonChip lesson={l} size={28} />
                <LessonChip lesson={l} size={48} />
                <span className="lesson-tag__text">
                  <span className="visually-hidden">Lesson {l.number}: </span>
                  {l.shortTitle}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface RailLink {
  label: string;
  to: string;
}

function RelatedList({ links, idPrefix, title }: { links: RailLink[]; idPrefix: string; title: string }) {
  return (
    <nav aria-labelledby={`${idPrefix}-related`}>
      <p className="t-label rail__title" id={`${idPrefix}-related`}>
        {title}
      </p>
      <ul className="rail-list">
        {links.map((l) => (
          <li key={l.to}>
            <a href={href(l.to)}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Desktop rail for the method and about pages: where am I, on this page, related pages. */
export function DocRail({
  orientation,
  onThisPage,
  related,
  page,
}: {
  orientation: Orientation;
  onThisPage: OnThisPageItem[];
  related: RailLink[];
  page: string;
}) {
  return (
    <div className="rail">
      <div className="rail__inner">
        <Where o={orientation} />
        <OnThisPage items={onThisPage} idPrefix="rail" />
        {related.length > 0 && <RelatedList links={related} idPrefix="rail" title="Related" />}
        <p className="rail__flag">
          <a className="link" href={FEEDBACK.href('correction', page)}>
            Flag an error on this page
          </a>
        </p>
      </div>
    </div>
  );
}

/** Under 1024px: the doc rail's contents in one disclosure under the breadcrumbs. */
export function DocContents({
  orientation,
  onThisPage,
  related,
}: {
  orientation: Orientation;
  onThisPage: OnThisPageItem[];
  related: RailLink[];
}) {
  return (
    <details className="guide">
      <summary>
        <span>
          <span className="t-meta">Page contents</span>
          <span className="t-h6">
            {orientation.where}: {orientation.title}
          </span>
        </span>
        <PlusIcon className="icon-plus" />
        <MinusIcon className="icon-minus" />
      </summary>
      <div className="guide__panel">
        <OnThisPage items={onThisPage} two idPrefix="guide" />
        {related.length > 0 && <RelatedList links={related} idPrefix="guide" title="Related" />}
      </div>
    </details>
  );
}
