import { Breadcrumbs, PageShell } from '@/components/chrome';
import { LessonRow } from '@/components/cards';
import { LessonsMatrix } from '@/components/viz';
import { getCases, getHome, getLessons } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { href, numberWord } from '@/lib/site';

const FALLBACK_INTRO =
  'What the cases have in common, stated as claims that could be wrong, with the evidence from each case and what they mean for funders and research leaders.';

export function generateMetadata() {
  const intro = getHome()?.lessonsIntro ?? FALLBACK_INTRO;
  return pageMetadata({ title: `${numberWord(getLessons().length)} lessons`, description: intro, path: '/lessons' });
}

export default function LessonsHub() {
  const lessons = getLessons();
  const cases = getCases();
  const home = getHome();
  return (
    <PageShell current="lessons" page="/lessons" contributeTeaser={home?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Lessons' }]} />
        <div className="page-head">
          <h1 className="t-h1">{numberWord(lessons.length)} lessons</h1>
          <p className="t-lead page-head__lead">{home?.lessonsIntro ?? FALLBACK_INTRO}</p>
          <p className="t-body page-head__note">
            These are our reading of the cases, open to challenge.{' '}
            <a className="link" href={href('/method#lessons')}>
              How we drew the lessons
            </a>
          </p>
        </div>
        <ol className="lesson-list">
          {lessons.map((l) => (
            <li key={l.slug}>
              <LessonRow lesson={l} size="large" headingLevel={2} />
            </li>
          ))}
        </ol>
        <div style={{ paddingBottom: 'var(--space-2xl)' }}>
          <LessonsMatrix lessons={lessons} cases={cases} />
        </div>
      </div>
    </PageShell>
  );
}
