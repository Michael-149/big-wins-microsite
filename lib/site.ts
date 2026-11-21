// Site settings, in one place. Content files never hardcode any of these.

export const SITE_NAME = 'Social Science Delivers';
export const TAGLINE =
  'How research changed policy and practice for millions of people and generated billions of dollars.';
export const ORG = 'Stanford Impact Labs';
export const ORG_URL = 'https://impact.stanford.edu/';
/** SIL's mission line. Reuse it verbatim. */
export const MISSION = 'Putting social science to work for society';

/** Mirrors basePath in next.config.js (BASE_PATH, default "/big-wins-microsite"). */
export const BASE_PATH: string = (
  process.env.NEXT_PUBLIC_BASE_PATH ??
  process.env.BASE_PATH ??
  '/big-wins-microsite'
).replace(/\/+$/, '');

/** Public address of the site, used for canonical and Open Graph URLs. */
export const SITE_URL = 'https://michael-149.github.io/big-wins-microsite';

/** Open Graph and social card image (public/og.png, 1200 by 630), as an absolute URL. */
export const OG_IMAGE = { url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: `${SITE_NAME}. ${TAGLINE}` };

/** Set at release, not at build time, so a rebuild does not change it. */
export const LAST_UPDATED = '2026-11-20';
export const VERSION = 'Open beta, November 2026';
/** Shows the beta banner and the beta wording in the footer. */
export const BETA = true;
/** Adds <meta name="robots" content="noindex"> to every page while true. */
export const NOINDEX = true;

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export const FEEDBACK_EMAIL = 'stanfordimpact@stanford.edu';
/**
 * Apps Script web app URL (ends in /exec) that saves Contribute-page form
 * submissions to the feedback Google Sheet. Empty until deployed; while empty,
 * the form opens an email instead. See backend/feedback/README.md.
 */
export const FEEDBACK_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxb5Zjl6lmDFpWCCSaV0Mv65nj0lfdpbwbbCjU-sw2t7rU7e_WzHj6DjYLQ9nG9jZTEwQ/exec';
/**
 * Optional external form (for example a Google Form). When set, every
 * feedback link on the site goes straight to it instead of the Contribute page.
 */
export const FEEDBACK_FORM_URL = '';

/** The values FeedbackForm accepts in ?type=. */
export type FeedbackType = 'suggest-case' | 'correction' | 'near-miss' | 'vertical' | 'general';

const FEEDBACK_SUBJECTS: Record<FeedbackType, string> = {
  'suggest-case': 'suggest a case',
  correction: 'flag an error',
  'near-miss': 'share an effort that stalled',
  vertical: 'propose a topic',
  general: 'feedback',
};

const FEEDBACK_BODIES: Record<FeedbackType, string> = {
  'suggest-case':
    'Case name:\nWhat changed, for whom and at roughly what scale:\nWhich research played a part, and who did it:\nLinks to published sources:\n',
  correction: 'Page:\nWhat is wrong:\nWhat it should say:\nSource:\n',
  'near-miss': 'Name of the effort:\nWhat looked promising:\nWhat got in the way:\nSources:\n',
  vertical: 'Topic area:\nWhy it is worth covering:\nCases that might belong in it:\n',
  general: '',
};

/** Prefixes a site path with the base path. Adds the trailing slash routes use. */
export function href(path: string): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const [pathAndQuery, hash] = splitOnce(path, '#');
  const [pathname, query] = splitOnce(pathAndQuery, '?');
  let p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  return `${BASE_PATH}${p}${query !== undefined ? `?${query}` : ''}${hash !== undefined ? `#${hash}` : ''}`;
}

/** Like href(), but leaves absolute URLs, hashes and already-prefixed paths alone. */
export function resolve(to: string): string {
  if (/^(https?:|mailto:|#)/.test(to)) return to;
  if (BASE_PATH && (to === BASE_PATH || to.startsWith(`${BASE_PATH}/`))) return to;
  return href(to);
}

/** URL of a file in public/, respecting the base path. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolute public URL of a site path, for Open Graph and canonical links. */
export function absoluteUrl(path = '/'): string {
  const p = path === '/' ? '/' : href(path).slice(BASE_PATH.length);
  return `${SITE_URL}${p}`;
}

/** A mailto: link with a subject and a short body template for one request type. */
export function feedbackMailto(type: FeedbackType, page?: string): string {
  const subject = `${SITE_NAME}: ${FEEDBACK_SUBJECTS[type]}`;
  let body = FEEDBACK_BODIES[type];
  if (page) body = `Page: ${page}\n${body.replace(/^Page:\n/, '')}`;
  const q = [`subject=${encodeURIComponent(subject)}`];
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${FEEDBACK_EMAIL}?${q.join('&')}`;
}

/** The Contribute page form, prefilled with a request type and the page it is about. */
export function contributeHref(type: FeedbackType, page?: string): string {
  const params = new URLSearchParams({ type });
  if (page && page.startsWith('/')) params.set('page', page);
  return href(`/contribute?${params.toString()}#form`);
}

/**
 * Every feedback link on the site comes from FEEDBACK.href().
 *
 * - FEEDBACK_FORM_URL set: links go to that form.
 * - Otherwise: links go to the Contribute page form (/contribute?type=...&page=...#form),
 *   which saves to the Google Sheet through FEEDBACK_ENDPOINT, or, while that is
 *   empty, opens an email to FEEDBACK_EMAIL with the fields filled in.
 *
 * FEEDBACK.mailto() is the direct email route, for no-JavaScript fallbacks.
 * `page` is a route path without the base path, starting with "/".
 */
export const FEEDBACK = {
  href(type: FeedbackType, page?: string): string {
    if (FEEDBACK_FORM_URL) return FEEDBACK_FORM_URL;
    return contributeHref(type, page);
  },
  mailto: feedbackMailto,
  email: FEEDBACK_EMAIL,
  endpoint: FEEDBACK_ENDPOINT,
};

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-11-20" to "November 20, 2026". */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** 8 to "Eight"; numbers above twelve stay numerals. */
export function numberWord(n: number, lower = false): string {
  const w = NUMBER_WORDS[n] ?? String(n);
  return lower ? w.toLowerCase() : w;
}

/** 1 to "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function splitOnce(s: string, sep: string): [string, string | undefined] {
  const i = s.indexOf(sep);
  return i === -1 ? [s, undefined] : [s.slice(0, i), s.slice(i + 1)];
}
