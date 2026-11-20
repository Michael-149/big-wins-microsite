import { Breadcrumbs, PageShell } from '@/components/chrome';
import { ArticleSections, GoDeeperList, PeopleList, SourcesList } from '@/components/content-blocks';
import { GuideContents, PageRail, type OnThisPageItem } from '@/components/nav';
import { FeedbackBox, Html, LessonChip, MetaLine, Pager, StatList } from '@/components/ui';
import { getCase, getCases, getHome, getLessons } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { buildCasePage } from '@/lib/page-models';
import { formatDate, href, numberWord } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const c = getCase(slug);
  return pageMetadata({ title: c.title, description: c.summary, path: `/case-studies/${c.slug}` });
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const c = getCase(slug);
  const m = buildCasePage(c);
  const cases = getCases();
  const lessons = getLessons();
  const path = `/case-studies/${c.slug}`;
  const where = `Case ${c.order} of ${m.total}`;
  const caseLessons = m.shows.map((s) => s.lesson);
  const onThisPage: OnThisPageItem[] = [
    ...m.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(c.people.length ? [{ id: 'people', title: 'People' }] : []),
    ...(c.goDeeper.length ? [{ id: 'go-deeper', title: 'Go deeper' }] : []),
    ...(m.sources.count || m.sources.unused.length ? [{ id: 'sources', title: 'Sources' }] : []),
  ];
  const orientation = { where, title: c.shortTitle };
  const all = numberWord(cases.length, true);

  return (
    <PageShell current="cases" page={path} contributeTeaser={getHome()?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cases', to: '/case-studies' }, { label: c.title }]} />
        <GuideContents orientation={orientation} onThisPage={onThisPage} cases={cases} currentCase={c.slug} lessons={lessons} />

        <div className="case-hero grid12">
          <div className="case-hero__top">
            <MetaLine items={[where, c.domain, c.years]} />
            <h1 className="t-h1">{c.title}</h1>
            <Html as="p" className="t-lead case-hero__win" html={m.winHtml} />
          </div>

          <div className="case-hero__stats">
            <StatList
              variant="stacked"
              headingId="what-changed"
              items={m.stats.map((s) => ({ value: s.value, label: s.label, detailHtml: s.detailHtml }))}
            />
          </div>

          <div className="case-hero__rest">
            <dl className="facts">
              <div>
                <dt className="t-meta">Years</dt>
                <dd className="t-body">{c.years}</dd>
              </div>
              <div>
                <dt className="t-meta">Where</dt>
                <dd className="t-body">{c.geography}</dd>
              </div>
              <div>
                <dt className="t-meta">Disciplines</dt>
                <dd className="t-body">{c.disciplines.join(', ')}</dd>
              </div>
            </dl>
            <p className="t-meta case-hero__reviewed">
              Last reviewed <time dateTime={c.lastReviewed}>{formatDate(c.lastReviewed)}</time>
              <span className="meta-sep" aria-hidden="true">/</span>
              <span className="visually-hidden">, </span>
              <a className="link" href="#sources">
                {m.sources.count} {m.sources.count === 1 ? 'source' : 'sources'}
              </a>
            </p>

            {m.shows.length > 0 && (
              <section className="shows" aria-labelledby="shows-title">
                <h2 id="shows-title" className="t-label shows__heading">
                  Lessons this case shows
                </h2>
                <ul>
                  {m.shows.map(({ lesson, noteHtml }) => (
                    <li key={lesson.slug}>
                      <LessonChip lesson={lesson} size={56} />
                      <div>
                        <h3 className="t-h5">
                          <a className="title-link" href={href(`/lessons/${lesson.slug}`)}>
                            <span className="visually-hidden">Lesson {lesson.number}: </span>
                            {lesson.title}
                          </a>
                        </h3>
                        {noteHtml && <Html as="p" className="t-body" html={noteHtml} />}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <div className="layout grid12">
          <PageRail
            orientation={orientation}
            onThisPage={onThisPage}
            cases={cases}
            currentCase={c.slug}
            casesTitle={`${numberWord(cases.length)} cases`}
            lessons={caseLessons}
            lessonsTitle="Lessons in this case"
            page={path}
          />
          <article className="article" aria-label={c.title}>
            {m.introHtml && <div className="prose" dangerouslySetInnerHTML={{ __html: m.introHtml }} />}
            <ArticleSections sections={m.sections} caseStudy={c} lessons={caseLessons} />
            <PeopleList people={c.people} />
            <GoDeeperList items={c.goDeeper} />
            <FeedbackBox
              title="Know this case well?"
              text="Tell us what we got wrong or left out. Corrections with a source help us fix things quickly."
              links={[
                { label: 'Flag an error on this page', type: 'correction' },
                { label: 'Suggest a related case', type: 'suggest-case' },
              ]}
              page={path}
            />
            <SourcesList model={m.sources} lastReviewed={c.lastReviewed} />
            <Pager
              label="Previous and next case"
              prev={
                m.prev
                  ? { dir: 'Previous case', title: m.prev.shortTitle, to: `/case-studies/${m.prev.slug}` }
                  : { dir: 'All cases', title: `All ${all} cases`, to: '/case-studies' }
              }
              next={
                m.next
                  ? { dir: 'Next case', title: m.next.shortTitle, to: `/case-studies/${m.next.slug}` }
                  : { dir: 'Next', title: `The ${numberWord(lessons.length, true)} lessons`, to: '/lessons' }
              }
            />
          </article>
        </div>
      </div>
    </PageShell>
  );
}
