import type { Metadata } from 'next';
import { PageShell } from '@/components/chrome';
import { ArrowLink } from '@/components/ui';
import { FEEDBACK, numberWord } from '@/lib/site';
import { getCases, getLessons } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const nCases = numberWord(getCases().length, true);
  const nLessons = numberWord(getLessons().length, true);
  return (
    <PageShell current="none" page="/404">
      <div className="container">
        <div className="not-found">
          <h1 className="t-h1">We could not find that page</h1>
          <p className="t-body-lg">
            The link may be out of date, or the page may have moved while this collection is in beta.
          </p>
          <ul>
            <li>
              <ArrowLink to="/case-studies">The {nCases} cases</ArrowLink>
            </li>
            <li>
              <ArrowLink to="/lessons">The {nLessons} lessons</ArrowLink>
            </li>
            <li>
              <ArrowLink to="/">Home page</ArrowLink>
            </li>
            <li>
              <ArrowLink to={FEEDBACK.href('correction')}>Tell us about a broken link</ArrowLink>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
