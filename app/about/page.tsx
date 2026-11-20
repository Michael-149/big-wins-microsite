import { notFound } from 'next/navigation';
import { DocPage } from '@/components/doc-page';
import { getPage } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { buildDocPage } from '@/lib/page-models';

// About (DESIGN-DECISION 6.8), from content/pages/about.md.

export function generateMetadata() {
  const p = getPage('about');
  return pageMetadata({ title: 'About', description: p?.description ?? p?.lead ?? '', path: '/about' });
}

export default function AboutPage() {
  const page = getPage('about');
  if (!page) notFound();
  const model = buildDocPage(page);
  return (
    <DocPage
      page={page}
      model={model}
      path="/about"
      current="about"
      crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      where="About"
      related={[
        { label: 'How we built this', to: '/method' },
        { label: 'Cases we considered', to: '/cases-considered' },
        { label: 'Contribute', to: '/contribute' },
      ]}
      feedback={{
        title: 'Something to add or correct?',
        text: 'Tell us what we got wrong or left out on this page. Corrections with a source help us fix things quickly.',
      }}
    />
  );
}
