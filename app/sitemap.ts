import type { MetadataRoute } from 'next';
import { getCases, getLessons, getPage } from '@/lib/content';
import { LAST_UPDATED, absoluteUrl } from '@/lib/site';

// sitemap.xml, written at build time (static export). It lists every content
// route at its public address; pages carry noindex while NOINDEX is true, so
// the sitemap matters once that switch is off.

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified = LAST_UPDATED) => ({ url: absoluteUrl(path), lastModified });
  return [
    page('/'),
    page('/case-studies'),
    ...getCases().map((c) => page(`/case-studies/${c.slug}`, c.lastReviewed)),
    page('/lessons'),
    ...getLessons().map((l) => page(`/lessons/${l.slug}`, l.lastReviewed ?? LAST_UPDATED)),
    page('/method', getPage('method')?.lastReviewed ?? LAST_UPDATED),
    page('/cases-considered'),
    page('/about', getPage('about')?.lastReviewed ?? LAST_UPDATED),
    page('/contribute'),
  ];
}
