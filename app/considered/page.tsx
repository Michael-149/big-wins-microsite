import { PageShell } from '@/components/chrome';
import { ArrowLink } from '@/components/ui';
import { href } from '@/lib/site';

// Short alias: /considered forwards to /cases-considered, the page's address.
// A static host cannot send a redirect, so the page refreshes to it and shows
// a link for anyone whose browser does not follow the refresh.

export const metadata = { title: 'Cases we considered', robots: { index: false, follow: true } };

export default function ConsideredAlias() {
  const to = href('/cases-considered');
  return (
    <PageShell current="method" page="/considered">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={to} />
      <div className="container">
        <div className="not-found">
          <h1 className="t-h1">Cases we considered</h1>
          <p className="t-body-lg">This page has moved.</p>
          <ul>
            <li>
              <ArrowLink to="/cases-considered">Go to Cases we considered</ArrowLink>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
