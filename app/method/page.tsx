import { notFound } from 'next/navigation';
import { DocPage } from '@/components/doc-page';
import { GlanceBand, methodGlance } from '@/components/glance';
import { getCases, getLessons, getPage } from '@/lib/content';
import { numberWord } from '@/lib/site';
import { pageMetadata } from '@/lib/metadata';
import { buildDocPage } from '@/lib/page-models';

// How we built this (DESIGN-DECISION 6.6), from content/pages/method.md.

export function generateMetadata() {
  const p = getPage('method');
  return pageMetadata({ title: 'How we built this', description: p?.description ?? p?.lead ?? '', path: '/method' });
}

export default function MethodPage() {
  const page = getPage('method');
  if (!page) notFound();
  const model = buildDocPage(page);
  return (
    <DocPage
      page={page}
      model={model}
      path="/method"
      current="method"
      crumbs={[{ label: 'Home', to: '/' }, { label: 'How we built this' }]}
      where="How we built this"
      related={[
        { label: 'Cases we considered', to: '/cases-considered' },
        { label: `The ${numberWord(getCases().length, true)} cases`, to: '/case-studies' },
        { label: `The ${numberWord(getLessons().length, true)} lessons`, to: '/lessons' },
        { label: 'About this project', to: '/about' },
      ]}
      band={<GlanceBand figures={methodGlance(page)} link={{ to: '/cases-considered', label: 'See the cases we considered' }} />}
      feedback={{
        title: 'See a gap in our method?',
        text: 'Tell us what we missed, what we got wrong, or how a case or lesson could be tested better.',
      }}
    />
  );
}
