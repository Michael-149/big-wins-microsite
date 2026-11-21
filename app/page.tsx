import { PageShell } from '@/components/chrome';
import { CaseCard, LessonRow } from '@/components/cards';
import { CasesOverTime } from '@/components/viz';
import { ArrowLink, Button, MetaLine, StatList, type StatItem } from '@/components/ui';
import { getCases, getHome, getLessons, getPage } from '@/lib/content';
import { escapeHtml, inlineMarkdown, stripCites } from '@/lib/markdown';
import { pageMetadata } from '@/lib/metadata';
import { ORG, SITE_NAME, TAGLINE, href, numberWord } from '@/lib/site';
import type { GlanceFigure, LimitSummary } from '@/lib/types';

// Home (DESIGN-DECISION 6.1). Text comes from content/pages/home.md and the
// method page's glance figures; until those files exist, the page falls back
// to the first stat of the first cases and leaves the method band out.

export function generateMetadata() {
  const home = getHome();
  return pageMetadata({ description: home?.description ?? home?.heroLead ?? TAGLINE, path: '/' });
}

function SectionHead({ id, part, title, intro }: { id: string; part: string; title: string; intro?: string }) {
  return (
    <div className="section-head">
      <div className="section-head__title">
        <p className="t-meta">{part}</p>
        <h2 id={id} className="t-h2">
          {title}
        </h2>
      </div>
      {intro && <p className="t-body-lgs section-head__intro">{intro}</p>}
    </div>
  );
}

export default function Home() {
  const cases = getCases();
  const lessons = getLessons();
  const home = getHome();
  const method = getPage('method');
  const glance = (Array.isArray(method?.data.glance) ? method!.data.glance : []) as GlanceFigure[];
  const limits = (Array.isArray(method?.data.limitsSummary) ? method!.data.limitsSummary : []) as LimitSummary[];
  const nCases = numberWord(cases.length, true);
  // The method page's lead, minus sentences that only make sense on that page ("This page explains ...").
  const methodLead = method?.lead
    ? stripCites(method.lead)
        .split(/(?<=\.)\s+/)
        .filter((s) => !/^this page\b/i.test(s))
        .join(' ')
    : undefined;
  const nLessons = numberWord(lessons.length, true);

  const stakes: StatItem[] = home
    ? home.stakes.map((s) => {
        const c = cases.find((x) => x.slug === s.case)!;
        // The build guarantees a matching stat (same value and source); its detail is the row's one line.
        const stat = c.stats.find((x) => x.value === s.value && x.source === s.source);
        return {
          value: s.value,
          label: s.label,
          detailHtml: (s.detail ?? stat?.detail) ? escapeHtml(stripCites(s.detail ?? stat?.detail ?? '')) : undefined,
          href: href(`/case-studies/${c.slug}`),
          caseName: c.shortTitle,
        };
      })
    : cases.slice(0, 4).map((c) => ({
        value: c.stats[0].value,
        label: c.stats[0].label,
        detailHtml: c.stats[0].detail ? escapeHtml(stripCites(c.stats[0].detail)) : undefined,
        href: href(`/case-studies/${c.slug}`),
        caseName: c.shortTitle,
      }));

  return (
    <PageShell current="home" page="/" band="full" contributeTeaser={home?.contributeTeaser}>
      <div className="container">
        <div className="home-hero grid12">
          <div className="home-hero__top">
            <MetaLine items={[ORG, 'Open beta']} />
            <h1 className="t-display">{home?.heroTitle ?? SITE_NAME}</h1>
            <p className="t-lead home-hero__subtitle">{TAGLINE}</p>
          </div>
          <div className="home-hero__stakes">
            <StatList items={stakes} variant="stacked" headingId="home-stakes" className="stats--home" />
          </div>
          <div className="home-hero__rest">
            {home?.heroLead && <p className="t-body-lg home-hero__lead">{stripCites(home.heroLead)}</p>}
            <p className="home-hero__actions">
              <Button to="#cases">Read the {nCases} cases</Button>
              <ArrowLink to="#lessons">See the {nLessons} lessons</ArrowLink>
            </p>
            <p className="t-body home-hero__limits">
              {home?.methodTeaser ? (
                <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(stripCites(home.methodTeaser)) }} />
              ) : (
                <>
                  <strong>Only successes.</strong> These {nCases} cases show how change happened, not how often research
                  like this falls short.
                </>
              )}{' '}
              <a className="link" href={href('/method#how-we-chose')}>
                How we chose them
              </a>
            </p>
          </div>
        </div>

        <section className="section" id="cases" aria-labelledby="cases-title">
          <SectionHead id="cases-title" part="Part one" title={`The ${nCases} cases`} intro={home?.casesIntro} />
          <div className="case-grid">
            {cases.map((c) => (
              <CaseCard key={c.slug} c={c} />
            ))}
          </div>
          <CasesOverTime cases={cases} headingLevel={3} />
        </section>

        <section className="section" id="lessons" aria-labelledby="lessons-title">
          <SectionHead id="lessons-title" part="Part two" title={`${numberWord(lessons.length)} lessons`} intro={home?.lessonsIntro} />
          <ul className="lesson-list">
            {lessons.map((l) => (
              <li key={l.slug}>
                <LessonRow lesson={l} compact />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {method && (
        <section className="method-band" aria-labelledby="method-title">
          <div className="container grid12">
            <div className="method-band__intro">
              <p className="t-meta">How we built this</p>
              <h2 id="method-title" className="t-h2">
                How we chose these {nCases} cases
              </h2>
              {methodLead && <p className="t-body-lgs">{methodLead}</p>}
              <p className="method-band__links">
                <ArrowLink to="/method">Read the method</ArrowLink>
                <ArrowLink to="/cases-considered">See the cases we considered</ArrowLink>
              </p>
            </div>
            {glance.length > 0 && (
              <div className="method-band__figures">
                <StatList
                  variant="ink"
                  heading="At a glance"
                  headingId="method-glance"
                  items={glance.map((g) => ({ value: String(g.value), label: String(g.label) }))}
                />
              </div>
            )}
            {limits.length > 0 && (
              <div className="method-band__limits">
                <h3 className="t-meta">What this collection cannot tell you</h3>
                <ul>
                  {limits.map((x) => (
                    <li key={x.title}>
                      <h4 className="t-h6">{x.title}</h4>
                      <p className="t-body">{x.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </PageShell>
  );
}
