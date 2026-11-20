// Site typeface. The design system's primary face is Strawford; its web license
// is not confirmed, so the site ships DM Sans, the system's sanctioned
// alternative, self-hosted by next/font at build time.
//
// To switch to Strawford once its web license is confirmed (see README):
// put the woff2 files in app/fonts/strawford/, comment out the DM Sans block
// and uncomment the one line below. Do not commit the files before then.
//
// export const sans = localFont({ src: [{ path: './fonts/strawford/strawford-regular-webfont.woff2', weight: '400' }, { path: './fonts/strawford/strawford-regularitalic-webfont.woff2', weight: '400', style: 'italic' }, { path: './fonts/strawford/strawford-medium-webfont.woff2', weight: '500' }, { path: './fonts/strawford/strawford-bold-webfont.woff2', weight: '700' }], variable: '--font-dm-sans', display: 'swap', fallback: ['DM Sans', 'Helvetica Neue', 'Arial', 'sans-serif'] });
//
// (localFont is imported from 'next/font/local'. The variable name stays
// --font-dm-sans so app/tokens.css needs no change.)

import { DM_Sans } from 'next/font/google';

export const sans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-dm-sans',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});
