import { notFound } from 'next/navigation';
import { Breadcrumbs, PageShell } from '@/components/chrome';
import { ArticleSections } from '@/components/content-blocks';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { ArrowLink, Html } from '@/components/ui';
import { getHome, getPage } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { buildDocPage } from '@/lib/page-models';
import { FEEDBACK_EMAIL, FEEDBACK_ENDPOINT, SITE_NAME, VERSION, feedbackMailto } from '@/lib/site';

// Contribute (DESIGN-DECISION 6.9): an 840px article without a rail, with the
// feedback form in the "Send a suggestion" section (#form). The form reads
// ?type= and ?page= itself; it is the site's only client component.

/** Build time, so the form's no-JavaScript path passes the time-on-page check. */
const BUILT_AT = Date.now();

export function generateMetadata() {
  const p = getPage('contribute');
  return pageMetadata({ title: 'Contribute', description: p?.description ?? p?.lead ?? '', path: '/contribute' });
}

export default function ContributePage() {
  const page = getPage('contribute');
  if (!page) notFound();
  const model = buildDocPage(page);
  const form = (
    <>
      <FeedbackForm endpoint={FEEDBACK_ENDPOINT} fallbackEmail={FEEDBACK_EMAIL} siteName={SITE_NAME} version={VERSION} builtAt={BUILT_AT} />
      <p className="t-body form-email">
        Prefer email? Write to{' '}
        <a className="link" href={feedbackMailto('general')}>
          {FEEDBACK_EMAIL}
        </a>
        .
      </p>
    </>
  );
  const hasForm = model.sections.some((s) => s.blocks.some((b) => b.kind === 'form'));
  return (
    <PageShell current="contribute" page="/contribute" contributeTeaser={getHome()?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contribute' }]} />
        <div className="page-head">
          <h1 className="t-h1">{page.title}</h1>
          {model.leadHtml && <Html as="p" className="t-lead page-head__lead" html={model.leadHtml} />}
          <p className="page-head__jump">
            <ArrowLink to="#form">Go to the form</ArrowLink>
          </p>
        </div>
        <article className="article article--solo" aria-label={page.title}>
          {model.introHtml && <div className="prose" dangerouslySetInnerHTML={{ __html: model.introHtml }} />}
          <ArticleSections sections={model.sections} page="/contribute" form={form} />
          {!hasForm && (
            <section className="article-section" aria-labelledby="form-section">
              <h2 id="form-section" className="t-h2">
                Send a suggestion
              </h2>
              <div id="form" className="form-wrap">
                {form}
              </div>
            </section>
          )}
        </article>
      </div>
    </PageShell>
  );
}
