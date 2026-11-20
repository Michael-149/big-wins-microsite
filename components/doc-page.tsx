// Layout for the text pages (How we built this, About): breadcrumbs, page
// head, an optional band under the head, then the rail and an 840px article
// with the page's sections, a feedback box and its Sources.

import type { ReactNode } from 'react';
import { Breadcrumbs, PageShell, type Section } from './chrome';
import { ArticleSections, SourcesList } from './content-blocks';
import { DocContents, DocRail, type OnThisPageItem, type RailLink } from './nav';
import { FeedbackBox, Html } from './ui';
import { getHome } from '@/lib/content';
import type { DocPageModel } from '@/lib/page-models';
import type { Page } from '@/lib/types';

export function DocPage({
  page,
  model,
  path,
  current,
  crumbs,
  where,
  related,
  band,
  feedback,
}: {
  page: Page;
  model: DocPageModel;
  /** Route path without the base path. */
  path: string;
  current: Section;
  crumbs: { label: string; to?: string }[];
  /** Orientation label for the rail, for example "How we built this". */
  where: string;
  related: RailLink[];
  band?: ReactNode;
  feedback: { title: string; text: string };
}) {
  const onThisPage: OnThisPageItem[] = [
    ...model.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(model.sources.count || model.sources.unused.length ? [{ id: 'sources', title: 'Sources' }] : []),
  ];
  const orientation = { where, title: page.shortTitle ?? page.title };
  return (
    <PageShell current={current} page={path} contributeTeaser={getHome()?.contributeTeaser}>
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <DocContents orientation={orientation} onThisPage={onThisPage} related={related} />
        <div className="page-head">
          <h1 className="t-h1">{page.title}</h1>
          {model.leadHtml && <Html as="p" className="t-lead page-head__lead" html={model.leadHtml} />}
        </div>
      </div>
      {band}
      <div className="container">
        <div className="layout grid12">
          <DocRail orientation={orientation} onThisPage={onThisPage} related={related} page={path} />
          <article className="article" aria-label={page.title}>
            {model.introHtml && <div className="prose" dangerouslySetInnerHTML={{ __html: model.introHtml }} />}
            <ArticleSections sections={model.sections} page={path} />
            <FeedbackBox
              title={feedback.title}
              text={feedback.text}
              links={[
                { label: 'Flag an error on this page', type: 'correction' },
                { label: 'Send other feedback', type: 'general' },
              ]}
              page={path}
            />
            <SourcesList model={model.sources} lastReviewed={page.lastReviewed} />
          </article>
        </div>
      </div>
    </PageShell>
  );
}
