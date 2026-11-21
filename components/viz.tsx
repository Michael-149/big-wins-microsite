// Visualizations built at build time as HTML and CSS: no chart library, no
// JavaScript, and a text equivalent in the DOM for each.

import { LessonChip } from './ui';
import { LAST_UPDATED, href, numberWord, pad2 } from '@/lib/site';
import { PHASE_LABEL, phaseSentence, phaseSpans } from '@/lib/page-models';
import type { CaseStudy, Chart, Lesson, Phase } from '@/lib/types';

const PHASE_DEFINITIONS: Record<Phase, string> = {
  origin: 'the problem or idea appears.',
  research: 'studies test it.',
  translation: 'findings reach decision makers.',
  scale: 'change across a system.',
};

function PhaseKey({ phase }: { phase: Phase }) {
  return <span className={`phase-key ph-${phase}${phase === 'origin' ? ' phase-key--origin' : ''}`} aria-hidden="true" />;
}

export function PhaseLegend() {
  return (
    <ul className="cot__legend t-body">
      {(Object.keys(PHASE_LABEL) as Phase[]).map((p) => (
        <li key={p}>
          <PhaseKey phase={p} />
          <span>
            <strong className="t-h6">{PHASE_LABEL[p]}:</strong> {PHASE_DEFINITIONS[p]}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Every case on one shared year axis, phases drawn from its timeline (DESIGN-DECISION 9.1). */
export function CasesOverTime({ cases, headingLevel = 2 }: { cases: CaseStudy[]; headingLevel?: 2 | 3 }) {
  const today = Number(LAST_UPDATED.slice(0, 4));
  const rows = cases.map((c) => ({ c, spans: phaseSpans(c) }));
  const minYear = Math.min(...rows.flatMap((r) => r.spans.map((s) => s.start)));
  const from = Math.floor(minYear / 10) * 10;
  const to = today;
  const pct = (y: number) => `${(((Math.min(y, to) - from) / (to - from)) * 100).toFixed(2)}%`;
  const ticks: number[] = [];
  for (let y = from; y <= to; y += 10) ticks.push(y);
  // The "Today" label sits at the right end; drop a decade tick too close to it to read.
  if (ticks.length > 1 && to - ticks[ticks.length - 1] < 8) ticks.pop();
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <figure className="cot" aria-labelledby="cot-title">
      <H id="cot-title" className="t-h3">
        {numberWord(cases.length)} cases over time
      </H>
      <div style={{ marginTop: 16 }}>
        <PhaseLegend />
      </div>
      <div className="cot__axis" aria-hidden="true">
        <span />
        <div className="cot__ticks">
          {ticks.map((y) => (
            <span key={y} className={`cot__tick t-meta${(y - from) % 20 !== 0 ? ' cot__tick--minor' : ''}`} style={{ left: pct(y) }}>
              {y}
            </span>
          ))}
          <span className="cot__tick cot__tick--today t-meta" style={{ left: '100%' }}>
            Today
          </span>
        </div>
      </div>
      <ol>
        {rows.map(({ c, spans }) => {
          const first = spans[0];
          const scale = spans.find((s) => s.phase === 'scale');
          return (
            <li key={c.slug} className="cot__row">
              <div className="cot__label">
                <a className="title-link t-h6" href={href(`/case-studies/${c.slug}`)}>
                  <span aria-hidden="true">{pad2(c.order)} </span>
                  <span className="visually-hidden">Case {c.order}: </span>
                  {c.shortTitle}
                </a>
                <span className="t-meta">{c.domain}</span>
              </div>
              <div className="cot__track" aria-hidden="true">
                {spans.map((s) => (
                  <span
                    key={s.phase}
                    className={`cot__seg ph-${s.phase}`}
                    style={{ left: pct(s.start), width: `calc(${pct(s.end)} - ${pct(s.start)} + ${s.end === s.start ? '3px' : '0px'})` }}
                  />
                ))}
                {first && (
                  <span className="cot__year" style={{ left: pct(first.start) }}>
                    {first.start}
                  </span>
                )}
                {scale && scale !== first && (
                  <span className={`cot__year${scale.start > to - 12 ? ' cot__year--end' : ''}`} style={{ left: pct(scale.start) }}>
                    {scale.start}
                  </span>
                )}
                <span className="cot__today" style={{ left: pct(today) }} />
              </div>
              <span className="visually-hidden">{phaseSentence(c, spans)}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className="cot__caption t-body">
        Each row shows when each phase began, using the dated events on the case page. Phases overlap in practice. The
        line at the right marks today ({today}).
      </figcaption>
    </figure>
  );
}

/** One case's phases at full article width (DESIGN-DECISION 9.2). */
export function PhaseStrip({ c }: { c: CaseStudy }) {
  const spans = phaseSpans(c);
  if (spans.length === 0) return null;
  const from = spans[0].start;
  const to = Math.max(...spans.map((s) => s.end), from + 1);
  const at = (y: number) => ((y - from) / (to - from)) * 100;
  return (
    <div className="phase-strip-wrap">
      <p className="visually-hidden">{phaseSentence(c, spans)}</p>
      <div className="phase-strip" aria-hidden="true">
        {spans.map((s, i) => {
          const left = at(s.start);
          const right = left > 72;
          return (
            <span
              key={`l-${s.phase}`}
              className={`phase-strip__label t-body phase-strip__label--${i % 2 === 0 ? 'above' : 'below'}${right ? ' phase-strip__label--right' : ''}`}
              style={right ? undefined : { left: `${left}%` }}
            >
              <strong className="t-h6">{PHASE_LABEL[s.phase]}</strong> {s.start}
            </span>
          );
        })}
        <div className="phase-strip__bar">
          {spans.map((s) => (
            <span
              key={s.phase}
              className={`phase-strip__seg ph-${s.phase}`}
              style={{ left: `${at(s.start)}%`, width: `calc(${(at(s.end) - at(s.start)).toFixed(2)}% + ${s.end === s.start ? '4px' : '0px'})` }}
            />
          ))}
        </div>
      </div>
      <ul className="phase-strip__list t-body" aria-hidden="true">
        {spans.map((s) => (
          <li key={s.phase}>
            <PhaseKey phase={s.phase} />
            <span>
              <strong className="t-h6">{PHASE_LABEL[s.phase]}</strong> {s.start}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TimelineList({ items }: { items: { years: string; phase: Phase; textHtml: string }[] }) {
  return (
    <>
      <h3 className="t-h3s timeline-head" id="timeline">
        Timeline
      </h3>
      <ol className="timeline">
        {items.map((t, i) => (
          <li key={i}>
            <div>
              <p className="t-h3s">{t.years}</p>
              <p className="t-meta timeline__phase">
                <PhaseKey phase={t.phase} />
                {PHASE_LABEL[t.phase]}
              </p>
            </div>
            <p className="t-body-lgs timeline__text" dangerouslySetInnerHTML={{ __html: t.textHtml }} />
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * A chart value in its unit: "$" and "$ billion" go before the number ("$12",
 * "$2.67 billion"), "%" sits right after it, and words follow a space
 * ("720 days", "752 thousand"). `withWords` false drops word units, for the
 * inner axis ticks.
 */
export function formatChartValue(value: number, unit = '', withWords = true): string {
  const n = Number(value.toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const u = unit.trim();
  if (u.startsWith('$')) {
    const rest = u.slice(1).trim();
    return rest && withWords ? `$${n} ${rest}` : `$${n}`;
  }
  if (u === '%') return `${n}%`;
  return u && withWords ? `${n} ${u}` : n;
}

/** Bars fill at most this share of the value column, leaving room for the label at the end. */
const BAR_SPAN = 0.8;

const isRound = (x: number) => [1, 2, 2.5, 5, 10].some((m) => Math.abs(x / 10 ** Math.floor(Math.log10(x)) - m) < 1e-9);

/**
 * Axis ticks from 0 to max: quarters of max (0, 25, 50, 75, 100%) when a
 * quarter is a round number, otherwise the smallest round step that gives at
 * most five intervals, so labels stay short and never collide on phones.
 */
function axisTicks(max: number): number[] {
  let step = max / 4;
  if (!isRound(step)) {
    const mag = 10 ** Math.floor(Math.log10(max / 5));
    step = [1, 2, 2.5, 5, 10, 20].map((m) => m * mag).find((s) => max / s <= 5) ?? max;
  }
  const ticks: number[] = [];
  for (let i = 0; i * step <= max * (1 + 1e-9); i++) ticks.push(i * step);
  return ticks;
}

/** A direct-labeled bar chart built as a table (DESIGN-DECISION 9.3). */
export function BarChart({ chart, noteHtml, sourceHtml }: { chart: Chart; noteHtml?: string; sourceHtml: string }) {
  const max = chart.max ?? Math.max(...chart.groups.flatMap((g) => g.bars.map((b) => b.value)));
  const unit = chart.unit ?? '';
  // Tick labels carry "$" or "%"; a word unit ("days") gets its own line under the axis.
  const ticks = axisTicks(max).map((v) => ({ left: `${(v / max) * BAR_SPAN * 100}%`, label: formatChartValue(v, unit, false) }));
  const unitWords = unit.replace(/[$%]/g, '').trim();
  return (
    <figure className="chart">
      <table>
        <caption className="t-h5">{chart.title}</caption>
        <thead className="visually-hidden">
          <tr>
            <th scope="col">Group</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {chart.groups.map((g) =>
            g.bars.map((b, i) => (
              <tr key={`${g.label}-${b.label}`} className={i === 0 ? 'chart__group' : undefined}>
                <th scope="row">
                  {i === 0 && <span className="t-meta" style={{ display: 'block' }}>{g.label}</span>}
                  {b.label}
                </th>
                <td>
                  <div className="bar">
                    <span className={`bar__fill${i % 2 === 1 ? ' bar__fill--alt' : ''}`} style={{ width: `${Math.max(0.5, (b.value / max) * 100) * BAR_SPAN}%` }} aria-hidden="true" />
                    <span className="t-body">{formatChartValue(b.value, unit)}</span>
                  </div>
                </td>
              </tr>
            )),
          )}
        </tbody>
        <tfoot aria-hidden="true">
          <tr>
            <td />
            <td>
              <div className="chart__axis">
                {ticks.map((t) => (
                  <span key={t.left} className="chart__tick t-meta" style={{ left: t.left }}>
                    {t.label}
                  </span>
                ))}
              </div>
              {unitWords && <p className="chart__axis-unit t-meta">{unitWords}</p>}
            </td>
          </tr>
        </tfoot>
      </table>
      <figcaption>
        {noteHtml && <p className="t-body chart__note" dangerouslySetInnerHTML={{ __html: noteHtml }} />}
        <p className="t-body chart__source" dangerouslySetInnerHTML={{ __html: sourceHtml }} />
      </figcaption>
    </figure>
  );
}

/** Which cases each lesson draws on (DESIGN-DECISION 9.4). Hidden under 768px. */
export function LessonsMatrix({ lessons, cases }: { lessons: Lesson[]; cases: CaseStudy[] }) {
  const has = (l: Lesson, c: CaseStudy) => l.cases.some((x) => x.slug === c.slug);
  return (
    <div className="matrix">
      <div className="table-wrap" role="region" aria-labelledby="matrix-caption" tabIndex={0}>
        <table>
          <caption id="matrix-caption" className="t-h3">
            Which cases each lesson draws on
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Lesson</span>
              </th>
              {cases.map((c) => (
                <th key={c.slug} scope="col">
                  <span className="num">{pad2(c.order)}</span>
                  <a href={href(`/case-studies/${c.slug}`)}>{c.shortTitle}</a>
                </th>
              ))}
              <th scope="col">Cases</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.slug}>
                <th scope="row">
                  <a href={href(`/lessons/${l.slug}`)}>
                    <LessonChip lesson={l} />
                    <span>
                      <span className="visually-hidden">Lesson {l.number}: </span>
                      {l.shortTitle}
                    </span>
                  </a>
                </th>
                {cases.map((c) => (
                  <td key={c.slug}>
                    {has(l, c) ? (
                      <>
                        <LessonChip lesson={l} size={12} />
                        <span className="visually-hidden">Yes</span>
                      </>
                    ) : (
                      <span className="visually-hidden">No</span>
                    )}
                  </td>
                ))}
                <td className="matrix__count">{cases.filter((c) => has(l, c)).length}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Lessons</th>
              {cases.map((c) => (
                <td key={c.slug}>{lessons.filter((l) => has(l, c)).length}</td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
