import { Breadcrumbs, PageShell } from '@/components/chrome';
import { CaseCard } from '@/components/cards';
import { CasesOverTime } from '@/components/viz';
import { getCases, getHome, getPage } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { href, numberWord } from '@/lib/site';
import { candidateCount } from '@/lib/derived';

const FALLBACK_INTRO =
  'Each case follows research from the problem it addressed to the change it informed, with a source for every figure.';

export function generateMetadata() {
  const intro = getHome()?.casesIntro ?? FALLBACK_INTRO;
  return pageMetadata({ title: `${numberWord(getCases().length)} cases`, description: intro, path: '/case-studies' });
}

export default function CasesHub() {
  const cases = getCases();
  const home = getHome();
  const candidates = candidateCount(getPage('method'));
  return (
    <PageShell current="cases" page="/case-studies" contributeTeaser={home?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cases' }]} />
        <div className="page-head">
          <h1 className="t-h1">{numberWord(cases.length)} cases</h1>
          <p className="t-lead page-head__lead">{home?.casesIntro ?? FALLBACK_INTRO}</p>
          <p className="t-body page-head__note">
            {candidates
              ? `These ${numberWord(cases.length, true)} were chosen from ${candidates} candidates. `
              : `These ${numberWord(cases.length, true)} were chosen from a longer list of candidates. `}
            <a className="link" href={href('/method#how-we-chose')}>
              How we chose them
            </a>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span className="visually-hidden">, </span>
            <a className="link" href={href('/cases-considered')}>
              Cases we considered
            </a>
          </p>
        </div>
        <CasesOverTime cases={cases} />
        <section className="section" aria-labelledby="all-cases">
          <h2 id="all-cases" className="visually-hidden">
            The cases
          </h2>
          <div className="case-grid">
            {cases.map((c) => (
              <CaseCard key={c.slug} c={c} variant="hub" />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
