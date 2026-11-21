import { Breadcrumbs, PageShell } from '@/components/chrome';
import { FeedbackBox, Html, MetaLine } from '@/components/ui';
import { getCases, getConsidered, getHome, getPage } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { inlineMarkdown, slugify, stripCites } from '@/lib/markdown';
import { href, numberWord, pad2 } from '@/lib/site';
import type { ConsideredEntry } from '@/lib/types';

// Cases we considered (DESIGN-DECISION 6.7), from content/considered.yaml and
// the intro in content/pages/considered.md. Grouped lists, no JavaScript:
// a domain index with counts, then one group per domain, largest first.

const PATH = '/cases-considered';
const FALLBACK_LEAD =
  'Before choosing the featured cases, we gathered a long list of candidates where social science research appeared to have helped change a policy, program, market or practice.';
const CAVEAT =
  'These are candidates, not vetted claims. Only the eight featured cases have been fact-checked in full. Summaries carry no impact figures on purpose.';

export function generateMetadata() {
  const p = getPage('considered');
  return pageMetadata({ title: 'Cases we considered', description: p?.description ?? p?.lead ?? FALLBACK_LEAD, path: PATH });
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function Entry({ e }: { e: ConsideredEntry }) {
  return (
    <li className="considered__entry">
      <h4 className="t-h5">{e.name}</h4>
      <MetaLine items={[e.geography, e.pathway]} className="considered__meta" />
      <p className="t-body considered__summary">{e.summary}</p>
      {e.researchers.length > 0 && <p className="t-body t-muted considered__people">Researchers: {joinNames(e.researchers)}</p>}
      {e.source && <p className="t-meta considered__source">Source: {e.source}</p>}
    </li>
  );
}

export default function ConsideredPage() {
  const page = getPage('considered');
  const entries = getConsidered();
  const cases = getCases();
  const others = entries.filter((e) => !e.selected);
  const domains = [...new Set(entries.map((e) => e.domain))];
  const groups = [...new Set(others.map((e) => e.domain))]
    .map((d) => ({ domain: d, id: `domain-${slugify(d)}`, items: others.filter((e) => e.domain === d).sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => b.items.length - a.items.length || a.domain.localeCompare(b.domain));
  // Featured cases show their case page's own domain and geography, so the
  // two pages never label a case differently.
  const featured = cases;
  const note = typeof page?.data.note === 'string' ? page.data.note : undefined;
  const lead = page?.lead ?? FALLBACK_LEAD;
  const nCases = numberWord(cases.length, true);

  return (
    <PageShell current="method" page={PATH} contributeTeaser={getHome()?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'How we built this', to: '/method' }, { label: 'Cases we considered' }]} />
        <div className="page-head">
          <h1 className="t-h1">{page?.title ?? 'Cases we considered'}</h1>
          <Html as="p" className="t-lead page-head__lead" html={inlineMarkdown(stripCites(lead))} />
        </div>

        <div className="considered__intro">
          <p className="well t-body-lgs">{CAVEAT}</p>
          <div className="considered__counts">
            <MetaLine items={[`${entries.length} candidates`, `${domains.length} domains`]} />
            {note && <Html as="p" className="t-body t-muted" html={inlineMarkdown(stripCites(note))} />}
            <p className="t-body">
              <a className="link" href={href('/method#how-we-chose')}>
                How we chose the {nCases}
              </a>
            </p>
          </div>
        </div>

        <section className="considered__part" aria-labelledby="featured">
          <h2 id="featured" className="t-h2">
            The {nCases} featured cases
          </h2>
          <ol className="considered__featured">
            {featured.map((c) => (
              <li key={c.slug}>
                <span className="considered__num" aria-hidden="true">
                  {pad2(c.order)}
                </span>
                <div>
                  <a className="title-link t-h5" href={href(`/case-studies/${c.slug}`)}>
                    <span className="visually-hidden">Case {c.order}: </span>
                    {c.title}
                  </a>
                  <MetaLine items={[c.domain, c.geography]} className="considered__meta" />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="considered__part" aria-labelledby="others">
          <h2 id="others" className="t-h2">
            The other candidates
          </h2>
          <p className="t-body-lgs considered__others-intro">
            {others.length} candidates in {groups.length} domains, largest group first.
          </p>
          <nav className="considered__index" aria-label="Domains">
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <a className="link" href={`#${g.id}`}>
                    {g.domain}
                  </a>{' '}
                  <span className="t-muted">({g.items.length})</span>
                </li>
              ))}
            </ul>
          </nav>
          {groups.map((g) => (
            <section key={g.id} className="considered__domain grid12" aria-labelledby={g.id}>
              <div className="considered__domain-head">
                <h3 id={g.id} className="t-h3">
                  {g.domain}
                </h3>
                <p className="t-meta t-muted">
                  {g.items.length} {g.items.length === 1 ? 'candidate' : 'candidates'}
                </p>
              </div>
              <ul className="considered__entries">
                {g.items.map((e) => (
                  <Entry key={e.name} e={e} />
                ))}
              </ul>
            </section>
          ))}
        </section>

        <div className="considered__feedback">
          <FeedbackBox
            title="Know a case that belongs here?"
            text="Suggest a case we missed, or tell us about an effort that looked ready to scale and stalled."
            links={[
              { label: 'Suggest a case', type: 'suggest-case' },
              { label: 'Share an effort that stalled', type: 'near-miss' },
            ]}
            page={PATH}
          />
        </div>
      </div>
    </PageShell>
  );
}
