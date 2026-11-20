import type { Metadata } from 'next';
import { NOINDEX, OG_IMAGE, SITE_NAME, absoluteUrl } from './site';
import { stripCites } from './markdown';

/** Title "<page> | Social Science Delivers" (from the layout template), description, Open Graph. */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const desc = stripCites(description).replace(/\s+/g, ' ').trim();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = absoluteUrl(path);
  return {
    title: title ?? { absolute: SITE_NAME },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images: [OG_IMAGE.url] },
    robots: NOINDEX ? { index: false, follow: true } : undefined,
  };
}
