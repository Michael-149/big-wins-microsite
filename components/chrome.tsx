// Page chrome shared by every page: skip link, beta banner, masthead with the
// primary navigation, cover band, breadcrumbs, the teal footer band and the
// Stanford global footer. All server-rendered; menus are native <details>.

import type { ReactNode } from 'react';
import { CloseIcon, MenuIcon, SymbolCluster } from './icons';
import { ArrowLink } from './ui';
import {
  BETA,
  FEEDBACK,
  LAST_UPDATED,
  MISSION,
  ORG,
  ORG_URL,
  SITE_NAME,
  asset,
  formatDate,
  href,
} from '@/lib/site';

export type Section = 'home' | 'cases' | 'lessons' | 'method' | 'about' | 'contribute' | 'none';

const NAV: { label: string; to: string; section: Section }[] = [
  { label: 'Cases', to: '/case-studies', section: 'cases' },
  { label: 'Lessons', to: '/lessons', section: 'lessons' },
  { label: 'How we built this', to: '/method', section: 'method' },
  { label: 'About', to: '/about', section: 'about' },
  { label: 'Contribute', to: '/contribute', section: 'contribute' },
];

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to main content
    </a>
  );
}

function BetaBanner({ page }: { page: string }) {
  if (!BETA) return null;
  return (
    <div className="beta">
      <div className="container beta__inner">
        <span className="beta__pill">Open beta</span>
        <p className="beta__text">
          An unfinished, growing collection. Last updated <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>.
        </p>
        <a href={FEEDBACK.href('correction', page)}>Flag an error or suggest a case</a>
      </div>
    </div>
  );
}

function NavList({ current }: { current: Section }) {
  return (
    <ul>
      {NAV.map((item) => (
        <li key={item.to}>
          <a href={href(item.to)} aria-current={item.section === current ? 'page' : undefined}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Masthead({ current }: { current: Section }) {
  return (
    <div className="masthead">
      <div className="container">
        <div className="masthead__inner">
          <a className="masthead__logo" href={href('/')} aria-label={`${SITE_NAME} home`}>
            <img src={asset('/images/SIL-Logo-RGB-Colour-soft.png')} alt={ORG} width={228} height={103} />
          </a>
          <div className="masthead__right">
            <p className="t-statement masthead__statement">{SITE_NAME}</p>
            <nav className="primary-nav" aria-label="Primary">
              <NavList current={current} />
            </nav>
          </div>
          <details className="menu">
            <summary>
              Menu
              <MenuIcon className="icon-menu" />
              <CloseIcon className="icon-close" />
            </summary>
            <nav className="menu__panel" aria-label="Primary">
              <NavList current={current} />
            </nav>
          </details>
        </div>
        <p className="t-statement masthead__statement-sm">{SITE_NAME}</p>
      </div>
    </div>
  );
}

/** The DS cover-band motif: Teal 1 60%, Teal 2, Teal 3, black with one cardinal square. */
export function CoverBand({ variant = 'slim' }: { variant?: 'full' | 'slim' }) {
  return (
    <div className={`cover-band${variant === 'slim' ? ' cover-band--slim' : ''}`} aria-hidden="true">
      <span className="cb-t1">
        <SymbolCluster className="cb-sym" />
      </span>
      <span className="cb-t2" />
      <span className="cb-t3" />
      <span className="cb-k">
        <span className="cb-em" />
      </span>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol className="t-meta">
        {items.map((item, i) => (
          <li key={i}>
            {item.to ? <a href={href(item.to)}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const DEFAULT_CONTRIBUTE_TEASER =
  'This is a beta. Tell us about cases we missed, facts we got wrong and efforts that stalled.';

function SiteFooter({ page, teaser }: { page: string; teaser?: string }) {
  const onContribute = page.startsWith('/contribute');
  const link = (type: Parameters<typeof FEEDBACK.href>[0], withPage: boolean) =>
    onContribute ? `${href('/contribute')}?type=${type}#form` : FEEDBACK.href(type, withPage ? page : undefined);
  return (
    <div className="site-footer__band">
      <SymbolCluster className="site-footer__sym" />
      <div className="container grid12">
        <div className="footer-cta">
          <h2 className="t-h2">Help us improve this collection</h2>
          <p className="t-lead">{teaser ?? DEFAULT_CONTRIBUTE_TEASER}</p>
        </div>
        <ul className="footer-links">
          <li>
            <ArrowLink to={link('suggest-case', false)}>Suggest a case</ArrowLink>
          </li>
          <li>
            <ArrowLink to={link('correction', true)}>Flag an error on this page</ArrowLink>
          </li>
          <li>
            <ArrowLink to={link('near-miss', false)}>Share an effort that stalled</ArrowLink>
          </li>
          <li>
            <ArrowLink to={link('vertical', false)}>Propose a topic</ArrowLink>
          </li>
        </ul>
        <div className="footer-base">
          <a className="footer-base__logo" href={ORG_URL}>
            <img src={asset('/images/SIL-Logo-RGB-White-soft.png')} alt={ORG} width={160} height={72} loading="lazy" />
          </a>
          <div>
            <p className="t-h3s footer-base__mission">{MISSION}</p>
            <p className="t-body footer-base__publisher">
              {SITE_NAME} is published by {ORG}.{' '}
              {BETA ? (
                <>
                  Open beta, last updated <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>.
                </>
              ) : (
                <>
                  Last updated <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>.
                </>
              )}
            </p>
          </div>
          <nav className="footer-nav" aria-label="Site">
            <ul>
              <li><a href={href('/case-studies')}>Cases</a></li>
              <li><a href={href('/lessons')}>Lessons</a></li>
              <li><a href={href('/method')}>How we built this</a></li>
              <li><a href={href('/cases-considered')}>Cases we considered</a></li>
              <li><a href={href('/about')}>About</a></li>
              <li><a href={href('/contribute')}>Contribute</a></li>
              <li><a href={ORG_URL}>impact.stanford.edu</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

const STANFORD_LINKS: [string, string][] = [
  ['Stanford Home', 'https://www.stanford.edu/'],
  ['Maps & Directions', 'https://visit.stanford.edu/plan/'],
  ['Search Stanford', 'https://www.stanford.edu/search/'],
  ['Emergency Info', 'https://emergency.stanford.edu/'],
  ['Terms of Use', 'https://www.stanford.edu/site/terms/'],
  ['Privacy', 'https://www.stanford.edu/site/privacy/'],
  ['Copyright', 'https://uit.stanford.edu/security/copyright-infringement'],
  ['Trademarks', 'https://adminguide.stanford.edu/chapter-1/subchapter-5/policy-1-5-4'],
  ['Non-Discrimination', 'https://non-discrimination.stanford.edu/'],
  ['Accessibility', 'https://www.stanford.edu/site/accessibility'],
];

function StanfordFooter() {
  return (
    <div className="global-footer">
      <div className="container global-footer__inner">
        <a href="https://www.stanford.edu/">
          <img src={asset('/images/SUSig_White.png')} alt="Stanford University" width={190} height={23} loading="lazy" />
        </a>
        <nav aria-label="Stanford University">
          <ul>
            {STANFORD_LINKS.map(([label, url]) => (
              <li key={url}>
                <a href={url}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="global-footer__copy">&copy; Stanford University, Stanford, California 94305.</p>
      </div>
    </div>
  );
}

/**
 * Every page: skip link, header (banner, logo, primary nav), cover band, main,
 * footer (teal band and Stanford footer). `page` is the route path without the
 * base path; it feeds the feedback links. `current` marks the nav item.
 */
export function PageShell({
  current,
  page,
  band = 'slim',
  className,
  contributeTeaser,
  children,
}: {
  current: Section;
  page: string;
  band?: 'full' | 'slim';
  className?: string;
  contributeTeaser?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <header>
        <BetaBanner page={page} />
        <Masthead current={current} />
      </header>
      <CoverBand variant={band} />
      <main id="main" tabIndex={-1} className={className}>
        {children}
      </main>
      <footer>
        <SiteFooter page={page} teaser={contributeTeaser} />
        <StanfordFooter />
      </footer>
    </>
  );
}
