'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './FeedbackForm.module.css';

export type FeedbackType = 'suggest-case' | 'correction' | 'vertical' | 'near-miss' | 'general';

const TYPES: { value: FeedbackType; label: string; prompt: string; topicLabel: string }[] = [
  {
    value: 'suggest-case',
    label: 'Suggest a case we missed',
    prompt: 'What changed, for whom, and what role did research play?',
    topicLabel: 'Name of the case',
  },
  {
    value: 'correction',
    label: 'Flag an error or correction',
    prompt: 'What is wrong, and what should it say? A source helps us fix it quickly.',
    topicLabel: 'Case, lesson or page',
  },
  {
    value: 'near-miss',
    label: 'Share a near miss or stalled effort',
    prompt: 'What looked promising, and what got in the way?',
    topicLabel: 'Name of the effort',
  },
  {
    value: 'vertical',
    label: 'Propose a topic area',
    prompt: 'Which field or policy area should we cover next, and why?',
    topicLabel: 'Topic area',
  },
  {
    value: 'general',
    label: 'Something else',
    prompt: 'Tell us what you think.',
    topicLabel: 'Topic',
  },
];

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

export interface FeedbackFormProps {
  /** Apps Script web app URL ending in /exec. Empty until deployed; then the form falls back to email. */
  endpoint: string;
  /** Address used when no endpoint is set or the request fails. */
  fallbackEmail: string;
  siteName: string;
  version: string;
  /** Build time in ms, so the no-JavaScript path passes the time-on-page check. */
  builtAt: number;
}

export default function FeedbackForm({ endpoint, fallbackEmail, siteName, version, builtAt }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>('suggest-case');
  const [page, setPage] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const startedAt = useRef<number>(builtAt);
  const statusRef = useRef<HTMLDivElement>(null);

  // Prefill from links such as /contribute?type=correction&page=/case-studies/needle-exchange
  useEffect(() => {
    startedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const t = params.get('type');
    if (t && TYPES.some((x) => x.value === t)) setType(t as FeedbackType);
    const p = params.get('page');
    if (p && p.startsWith('/') && p.length < 300) setPage(p);
  }, []);

  useEffect(() => {
    if (status.state === 'sent' || status.state === 'error') statusRef.current?.focus();
  }, [status.state]);

  const current = TYPES.find((x) => x.value === type) ?? TYPES[0];

  function mailtoFor(data: FormData) {
    const subject = `${siteName}: ${current.label.toLowerCase()}`;
    const lines = [
      `Type: ${current.label}`,
      `Page: ${data.get('page') || ''}`,
      `${current.topicLabel}: ${data.get('topic') || ''}`,
      '',
      String(data.get('message') || ''),
      '',
      `Links or sources: ${data.get('links') || ''}`,
      `Name: ${data.get('name') || ''}`,
      `Affiliation: ${data.get('affiliation') || ''}`,
      `May credit me by name: ${data.get('credit') === 'yes' ? 'Yes' : 'No'}`,
    ];
    return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('t0', String(startedAt.current));
    data.set('format', 'json');

    if (!endpoint) {
      window.location.href = mailtoFor(data);
      setStatus({ state: 'sent', message: 'Your email app should open with your message filled in. Send it from there.' });
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, String(value)));
      const response = await fetch(endpoint, { method: 'POST', body });
      const result = (await response.json()) as { ok: boolean; message: string };
      if (result.ok) {
        form.reset();
        setPage('');
        setStatus({ state: 'sent', message: 'Thank you. We received your submission and will review it.' });
      } else {
        setStatus({ state: 'error', message: result.message });
      }
    } catch {
      setStatus({
        state: 'error',
        message: `We could not reach our form just now. You can send the same message by email instead.`,
      });
    }
  }

  const actionAttr = endpoint || `mailto:${fallbackEmail}`;

  return (
    <form
      className={styles.form}
      action={actionAttr}
      method="post"
      encType={endpoint ? undefined : 'text/plain'}
      onSubmit={onSubmit}
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>What would you like to share?</legend>
        <div className={styles.choices}>
          {TYPES.map((t) => (
            <label key={t.value} className={styles.choice}>
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="fb-topic">
          {current.topicLabel} <span className={styles.optional}>(optional)</span>
        </label>
        <input id="fb-topic" name="topic" type="text" maxLength={300} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="fb-message">Your message</label>
        <p id="fb-message-hint" className={styles.hint}>
          {current.prompt}
        </p>
        <textarea
          id="fb-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          aria-describedby="fb-message-hint"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="fb-links">
          Links or sources <span className={styles.optional}>(optional)</span>
        </label>
        <textarea id="fb-links" name="links" maxLength={2000} rows={2} />
      </div>

      <div className={styles.field}>
        <label htmlFor="fb-page">
          Page this is about <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="fb-page"
          name="page"
          type="text"
          maxLength={300}
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="/case-studies/moving-to-opportunity"
        />
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legendSmall}>About you (all optional)</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="fb-name">Name</label>
            <input id="fb-name" name="name" type="text" maxLength={300} autoComplete="name" />
          </div>
          <div className={styles.field}>
            <label htmlFor="fb-email">Email</label>
            <input id="fb-email" name="email" type="email" maxLength={300} autoComplete="email" />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="fb-affiliation">Affiliation</label>
          <input id="fb-affiliation" name="affiliation" type="text" maxLength={300} autoComplete="organization" />
        </div>
        <label className={styles.choice}>
          <input type="checkbox" name="credit" value="yes" />
          <span>You may credit me by name if you use my suggestion.</span>
        </label>
      </fieldset>

      {/* Bot trap: hidden from people and assistive technology. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="fb-website">Leave this field empty</label>
        <input id="fb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="t0" value={String(builtAt)} />
      <input type="hidden" name="version" value={version} />
      <input type="hidden" name="format" value="html" />

      <p className={styles.privacy}>
        We store submissions in a spreadsheet that Stanford Impact Labs staff can see. We use your email only to follow up
        on your submission, and we name contributors only if you tick the box above.
      </p>

      <button type="submit" className={styles.button} disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending' : 'Send'}
      </button>

      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={status.state === 'error' ? styles.error : styles.status}
      >
        {status.message}
        {status.state === 'error' && (
          <>
            {' '}
            <a href={`mailto:${fallbackEmail}`}>Email {fallbackEmail}</a>
          </>
        )}
      </div>
    </form>
  );
}
