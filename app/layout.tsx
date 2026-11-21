import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { sans } from './fonts';
import { NOINDEX, OG_IMAGE, ORG, SITE_NAME, SITE_URL, TAGLINE, absoluteUrl, asset } from '@/lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: TAGLINE,
  authors: [{ name: ORG }],
  creator: ORG,
  publisher: ORG,
  icons: {
    icon: [{ url: asset('/images/favicon.png'), type: 'image/png', sizes: '64x64' }],
    apple: [{ url: asset('/images/apple-touch-icon.png'), sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: absoluteUrl('/'),
    title: SITE_NAME,
    description: TAGLINE,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: TAGLINE,
    images: [OG_IMAGE.url],
  },
  robots: NOINDEX ? { index: false, follow: true } : { index: true, follow: true },
};

/**
 * The menu and Guide contents are native <details> and work without
 * JavaScript. These few lines (DESIGN-DECISION 7, MobileMenu) only add two
 * conveniences: Escape closes an open one and returns focus to its summary,
 * and choosing a link in Guide contents closes the panel before the page
 * scrolls to the section.
 */
const DISCLOSURE_KEYS = `(function(){
var sel='details.menu[open],details.guide[open]';
document.addEventListener('keydown',function(e){
if(e.key!=='Escape')return;
document.querySelectorAll(sel).forEach(function(d){
var had=d.contains(document.activeElement);d.open=false;
if(had){var s=d.querySelector('summary');if(s)s.focus();}
});
});
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest?e.target.closest('details.guide[open] a[href]'):null;
if(a)a.closest('details').open=false;
});
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: DISCLOSURE_KEYS }} />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4CK41ETM7D" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4CK41ETM7D');
          `}
        </Script>
      </body>
    </html>
  );
}
