// "At a glance": the shared method figures (method.md `glance`) on a grey band,
// figures in ink (DESIGN-DECISION 6.6). Grey grounds carry no red and no
// lesson chips.

import { ArrowLink } from './ui';
import type { GlanceFigure, Page } from '@/lib/types';

export function methodGlance(method?: Page): GlanceFigure[] {
  const g = method?.data.glance;
  if (!Array.isArray(g)) return [];
  return g.flatMap((x) =>
    x && typeof x === 'object' && 'value' in x && 'label' in x ? [{ value: String(x.value), label: String(x.label) }] : [],
  );
}

export function GlanceBand({ figures, link }: { figures: GlanceFigure[]; link?: { to: string; label: string } }) {
  if (figures.length === 0) return null;
  return (
    <section className="glance-band" aria-labelledby="glance-title">
      <div className="container">
        <h2 id="glance-title" className="t-label glance-band__title">
          At a glance
        </h2>
        <ul className="glance">
          {figures.map((f) => (
            <li key={f.label}>
              <span className="glance__value">{f.value}</span>
              <span className="t-label glance__label">{f.label}</span>
            </li>
          ))}
        </ul>
        {link && (
          <p className="glance-band__link">
            <ArrowLink to={link.to}>{link.label}</ArrowLink>
          </p>
        )}
      </div>
    </section>
  );
}
