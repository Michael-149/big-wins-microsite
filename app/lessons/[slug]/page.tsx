import { Breadcrumbs, PageShell } from '@/components/chrome';
import { ArticleSections, SourcesList } from '@/components/content-blocks';
import { GuideContents, LessonStrip, PageRail, type OnThisPageItem } from '@/components/nav';
import { FeedbackBox, Html, MetaLine, Pager } from '@/components/ui';
import { getCases, getHome, getLesson, getLessons } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { buildLessonPage } from '@/lib/page-models';
import { LAST_UPDATED, href, numberWord, pad2 } from '@/lib/site';
import type { Lesson } from '@/lib/types';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const l = getLesson(slug);
  return pageMetadata({ title: `Lesson ${l.number}: ${l.shortTitle}`, description: l.inBrief, path: `/lessons/${l.slug}` });
}

function LessonTab({ lesson }: { lesson: Lesson }) {
  return (
    <div className={`lesson-tab l${lesson.number}`} aria-hidden="true">
      <span className="t-meta lesson-tab__word">Lesson</span>
      <span className="lesson-tab__n">{lesson.number}</span>
    </div>
  );
}

export default async function LessonPage({ params }: Params) {
  const { slug } = await params;
  const l = getLesson(slug);
  const m = buildLessonPage(l);
  if (m.warnings.length) console.warn(m.warnings.join('\n'));
  const lessons = getLessons();
  const cases = getCases();
  const path = `/lessons/${l.slug}`;
  const where = `Lesson ${l.number} of ${m.total}`;
  const drawnCases = m.drawn.map((d) => d.case);
  const onThisPage: OnThisPageItem[] = [
    ...m.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(m.sources.count || m.sources.unused.length ? [{ id: 'sources', title: 'Sources' }] : []),
  ];
  const orientation = { where, title: l.shortTitle, lesson: l };

  return (
    <PageShell current="lessons" page={path} className={`lesson-page l${l.number}`} contributeTeaser={getHome()?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Lessons', to: '/lessons' }, { label: `Lesson ${l.number}: ${l.shortTitle}` }]}
        />
        <LessonStrip lessons={lessons} current={l.slug} />
        <GuideContents orientation={orientation} onThisPage={onThisPage} cases={cases} lessons={lessons} />

        <div className="lesson-hero grid12">
          <div className="lesson-hero__rule" aria-hidden="true" />
          <div className="lesson-hero__main">
            <div className="lesson-hero__head">
              <LessonTab lesson={l} />
              <div>
                <MetaLine items={[where, l.shortTitle]} />
                <h1 className="t-h1">{l.title}</h1>
              </div>
            </div>
            <section className="in-brief" aria-labelledby="in-brief-title">
              <h2 id="in-brief-title" className="t-meta in-brief__tab">
                In brief
              </h2>
              <Html as="p" className="t-lead" html={m.inBriefHtml} />
              {m.drawn.length > 0 && (
                <div className="in-brief__drawn">
                  <p className="t-meta">
                    Drawn from {numberWord(m.drawn.length, true)} {m.drawn.length === 1 ? 'case' : 'cases'}
                  </p>
                  {m.drawn.map(({ case: c }) => (
                    <a key={c.slug} className="link t-body" href={href(`/case-studies/${c.slug}`)}>
                      <span className="num" aria-hidden="true">
                        {pad2(c.order)}
                      </span>
                      <span className="visually-hidden">Case {c.order}: </span>
                      {c.shortTitle}
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>
          <div className="lesson-hero__tab">
            <LessonTab lesson={l} />
          </div>
        </div>

        <div className="layout grid12">
          <PageRail
            orientation={orientation}
            onThisPage={onThisPage}
            cases={drawnCases}
            casesTitle="Cases in this lesson"
            page={path}
          />
          <article className="article" aria-label={`Lesson ${l.number}: ${l.shortTitle}`}>
            {m.introHtml && <div className="prose" dangerouslySetInnerHTML={{ __html: m.introHtml }} />}
            <ArticleSections sections={m.sections} />
            <FeedbackBox
              title="Does this lesson hold in your field?"
              text="These lessons are our reading of eight cases. Tell us where they fit your experience and where they do not."
              links={[
                { label: 'Challenge this lesson', type: 'general' },
                { label: 'Suggest a case that tests it', type: 'suggest-case' },
              ]}
              page={path}
            />
            <SourcesList model={m.sources} lastReviewed={l.lastReviewed ?? LAST_UPDATED} />
            <Pager
              label="Previous and next lesson"
              prev={
                m.prev
                  ? { dir: 'Previous lesson', title: m.prev.shortTitle, to: `/lessons/${m.prev.slug}`, lesson: m.prev }
                  : { dir: 'All lessons', title: `All ${numberWord(m.total, true)} lessons`, to: '/lessons' }
              }
              next={
                m.next
                  ? { dir: 'Next lesson', title: m.next.shortTitle, to: `/lessons/${m.next.slug}`, lesson: m.next }
                  : { dir: 'Next', title: 'How we built this', to: '/method' }
              }
            />
          </article>
        </div>
      </div>
    </PageShell>
  );
}
