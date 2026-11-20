// Article blocks for case and lesson pages: prose, key studies, pull quote,
// people, go deeper, examples, practices callout and the Sources list.

import type { ReactNode } from 'react';
import { ArrowLink, LessonTag } from './ui';
import { SymbolClusterSmall } from './icons';
import { BarChart, PhaseStrip, TimelineList } from './viz';
import { FEEDBACK, LAST_UPDATED, VERSION, formatDate, href, type FeedbackType } from '@/lib/site';
import type { Block, SectionModel, SourcesModel } from '@/lib/page-models';
import type { CaseStudy, GoDeeperItem, Lesson, Person } from '@/lib/types';

const GO_DEEPER_LABEL: Record<string, string> = {
  book: 'Book',
  article: 'Article',
  video: 'Video',
  podcast: 'Podcast',
  data: 'Data',
  report: 'Report',
};

function KeyStudies({ items }: { items: Extract<Block, { kind: 'keyStudies' }>['items'] }) {
  return (
    <div className="studies">
      <h3 className="t-h3s">Key studies</h3>
      <ol>
        {items.map((k, i) => (
          <li key={i}>
            <p className="t-h3s">{k.year}</p>
            <div>
              <p className="t-h5">{k.url ? <a className="title-link" href={k.url}>{k.title}</a> : k.title}</p>
              <p className="t-meta studies__by">{k.byline}</p>
              <p className="t-body-lgs studies__finding" dangerouslySetInnerHTML={{ __html: k.findingHtml }} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PullQuote({ textHtml, citeHtml }: { textHtml: string; citeHtml: string }) {
  return (
    <figure className="quote">
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: textHtml }} />
      </blockquote>
      <figcaption>
        <footer dangerouslySetInnerHTML={{ __html: citeHtml }} />
      </figcaption>
    </figure>
  );
}

function Examples({ items }: { items: Extract<Block, { kind: 'examples' }>['items'] }) {
  return (
    <div className="examples">
      {items.map((e, i) => (
        <div className="example" key={i}>
          {e.caseOrder && (
            <p className="t-meta">
              Case {String(e.caseOrder).padStart(2, '0')}
              <span className="meta-sep" aria-hidden="true">/</span>
              <span className="visually-hidden">, </span>
              {e.caseShortTitle}
            </p>
          )}
          <h3 className="t-h5" dangerouslySetInnerHTML={{ __html: e.leadHtml }} />
          <p className="t-body-lg" dangerouslySetInnerHTML={{ __html: e.textHtml }} />
          {e.caseSlug && <ArrowLink to={`/case-studies/${e.caseSlug}`}>Read case {e.caseOrder}</ArrowLink>}
        </div>
      ))}
    </div>
  );
}

function Practices({ items, questions }: Extract<Block, { kind: 'practices' }>) {
  return (
    <div className="practices">
      <SymbolClusterSmall className="practices__sym" />
      <p className="t-meta">What to do</p>
      {items.length > 0 && (
        <ol>
          {items.map((p) => (
            <li key={p.n}>
              <span className="practices__n" aria-hidden="true">
                {p.n}
              </span>
              <p className="t-body-lg" dangerouslySetInnerHTML={{ __html: p.html }} />
            </li>
          ))}
        </ol>
      )}
      {questions.map((q, i) => (
        <div className="practices__ask" key={i}>
          <p className="t-meta">A question for your own project</p>
          <p className="t-body-lg" dangerouslySetInnerHTML={{ __html: q }} />
        </div>
      ))}
    </div>
  );
}

/** A feedback link for a section. On the Contribute page it jumps to the form on the same page. */
function feedbackTo(type: FeedbackType, page?: string): string {
  if (page && page.startsWith('/contribute')) return `${href('/contribute')}?type=${type}#form`;
  return FEEDBACK.href(type, page);
}

/**
 * Renders a page model's sections, each with an h2 and its blocks in order.
 * `form` is passed in by the Contribute page so the client form never joins
 * the module graph of other pages.
 */
export function ArticleSections({
  sections,
  caseStudy,
  lessons,
  page,
  form,
}: {
  sections: SectionModel[];
  caseStudy?: CaseStudy;
  lessons?: Lesson[];
  page?: string;
  form?: ReactNode;
}) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className="article-section" aria-labelledby={s.id}>
          <h2 id={s.id} className="t-h2">
            {s.title}
          </h2>
          {s.blocks.map((b, i) => {
            switch (b.kind) {
              case 'html':
                return <div key={i} className="prose" dangerouslySetInnerHTML={{ __html: b.html }} />;
              case 'keyStudies':
                return <KeyStudies key={i} items={b.items} />;
              case 'quote':
                return <PullQuote key={i} textHtml={b.textHtml} citeHtml={b.citeHtml} />;
              case 'phaseStrip':
                return caseStudy ? <PhaseStrip key={i} c={caseStudy} /> : null;
              case 'timeline':
                return <TimelineList key={i} items={b.items} />;
              case 'chart':
                return <BarChart key={i} chart={b.chart} noteHtml={b.noteHtml} sourceHtml={b.sourceHtml} />;
              case 'lessonChips':
                return lessons && lessons.length ? (
                  <ul key={i} className="lesson-tags" aria-label="Lessons in this case">
                    {lessons.map((l) => (
                      <li key={l.slug}>
                        <LessonTag lesson={l} link />
                      </li>
                    ))}
                  </ul>
                ) : null;
              case 'examples':
                return <Examples key={i} items={b.items} />;
              case 'practices':
                return <Practices key={i} {...b} />;
              case 'link':
                return (
                  <p key={i}>
                    <ArrowLink to={b.to}>{b.label}</ArrowLink>
                  </p>
                );
              case 'feedbackLink':
                return (
                  <p key={i}>
                    <ArrowLink to={feedbackTo(b.type, page)}>{b.label}</ArrowLink>
                  </p>
                );
              case 'well':
                return <p key={i} className="well t-body-lgs" dangerouslySetInnerHTML={{ __html: b.html }} />;
              case 'version':
                return (
                  <dl key={i} className="facts facts--version">
                    <div>
                      <dt className="t-meta">Version</dt>
                      <dd className="t-body">{VERSION}</dd>
                    </div>
                    <div>
                      <dt className="t-meta">Last updated</dt>
                      <dd className="t-body">
                        <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>
                      </dd>
                    </div>
                  </dl>
                );
              case 'form':
                return form ? (
                  <div key={i} id="form" className="form-wrap">
                    {form}
                  </div>
                ) : null;
              default:
                return null;
            }
          })}
        </section>
      ))}
    </>
  );
}

export function PeopleList({ people }: { people: Person[] }) {
  if (!people.length) return null;
  return (
    <section className="article-section" aria-labelledby="people">
      <h2 id="people" className="t-h2">
        People
      </h2>
      <ul className="people" style={{ marginTop: 24 }}>
        {people.map((p) => (
          <li key={p.name}>
            <p className="t-h5">{p.name}</p>
            <p className="t-body people__role">{p.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function GoDeeperList({ items }: { items: GoDeeperItem[] }) {
  if (!items.length) return null;
  return (
    <section className="article-section" aria-labelledby="go-deeper">
      <h2 id="go-deeper" className="t-h2">
        Go deeper
      </h2>
      <ul className="deeper" style={{ marginTop: 24 }}>
        {items.map((g) => (
          <li key={g.url}>
            <p className="t-meta deeper__type">{GO_DEEPER_LABEL[g.type] ?? g.type}</p>
            <p className="t-body">
              <a className="link t-h6" href={g.url}>
                {g.title}
              </a>
              {g.note ? `. ${g.note}` : ''}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Numbered sources with labeled links and back links to every marker. */
export function SourcesList({ model, lastReviewed }: { model: SourcesModel; lastReviewed?: string }) {
  if (model.count === 0 && model.unused.length === 0) return null;
  return (
    <section className="article-section sources" aria-labelledby="sources">
      <h2 id="sources" className="t-h2">
        Sources
      </h2>
      <p className="t-body sources__intro">
        Numbered in order of first use.{lastReviewed ? ` Last reviewed ${formatDate(lastReviewed)}.` : ''}
      </p>
      {model.count > 0 && (
        <ol>
          {model.numbered.map(({ n, source, refs }) => {
            const isDoi = source.url ? /^https?:\/\/(dx\.)?doi\.org\//.test(source.url) : false;
            return (
              <li key={source.id} id={`source-${source.id}`}>
                <span className="sources__n t-body" aria-hidden="true">
                  {n}
                </span>
                <div className="t-body">
                  <span className="visually-hidden">Source {n}: </span>
                  {source.citation}
                  <span className="sources__links">
                    {source.url && <a href={source.url}>{isDoi ? 'DOI' : 'Link'}</a>}
                    {source.altUrl && <a href={source.altUrl}>Open version</a>}
                    {refs.length === 1 ? (
                      <a href={`#${refs[0]}`} aria-label={`Back to text, citation ${n}`}>
                        Back to text
                      </a>
                    ) : (
                      <span className="sources__back">
                        <span>Back to text:</span>
                        {refs.map((r, i) => (
                          <a key={r} href={`#${r}`} aria-label={`Back to text, citation ${n}, use ${i + 1}`}>
                            {i + 1}
                          </a>
                        ))}
                      </span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {model.unused.length > 0 && (
        <div className="sources__also">
          <h3 className="t-h3s">Also consulted</h3>
          <ul>
            {model.unused.map((s) => (
              <li key={s.id} id={`source-${s.id}`} className="t-body">
                {s.citation}{' '}
                {s.url && (
                  <a href={s.url}>{/^https?:\/\/(dx\.)?doi\.org\//.test(s.url) ? 'DOI' : 'Link'}</a>
                )}
                {s.altUrl && (
                  <>
                    {' '}
                    <a href={s.altUrl}>Open version</a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

