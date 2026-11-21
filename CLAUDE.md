# Social Science Delivers (repo: big-wins-microsite)

Public static site from Stanford Impact Labs (SIL): eight case studies of social science research that helped change policy and practice, and eight lessons drawn from them. Open beta, `noindex`, deployed to GitHub Pages from `main`. The README is the technical reference (build, base path, settings, content schema, checks, code map); read it before changing anything.

## Rules for this repo

- **Content is checked before it lands here.** Every figure, date, name and quote in `content/` traces to a source and a fact-check ledger kept outside this repo. Do not edit facts in `content/` directly: change the source draft, re-verify the claim, then copy the file here. Wording fixes that change no fact are fine here, but keep the private copy in step.
- **Voice and rules** (also enforced by `npm run build` where possible): plain, specific, no hype or superlatives; no em or en dashes anywhere; US spelling; "Big Wins" only on the About page's working-title line; no SIL staff named and no internal notes quoted; attribution words match the evidence ("helped make the case for", not "caused"); revenue is never called savings; every home stake equals a stat on its case page.
- **Design** comes from the Stanford Impact Labs 2026 09 design system. Lesson colors are fixed by slug (README, "Lesson colors"). DM Sans ships until the Strawford web license is confirmed; never commit Strawford files before then.
- **Before pushing a change**, run `npm run build` (it must pass; one warning on the emissions-trading timeline is accepted) and `npm run lint`. For layout changes, check 1440x900 and 390x844: all four home stakes above the fold at 1440x900, no horizontal scroll at 320px, and 0 axe violations.
- **Ask before** adding dependencies, renaming directories or routes, or broad refactors. Routes and slugs are public URLs.
- **Feedback** goes through the Contribute form (`components/feedback/`) to an Apps Script web app (`backend/feedback/`); links come from `FEEDBACK.href()` in `lib/site.ts`, never from content.
- **Settings** live in `lib/site.ts` only (name, tagline, `LAST_UPDATED`, `NOINDEX`, `SITE_URL`, feedback endpoint). Set `LAST_UPDATED` when content changes.

## Open items (owner: Michael Eddy)

- Lesson titles and the lesson 5 short title are working versions pending his decision.
- Google Analytics (`app/layout.tsx`) runs without a privacy note.
- Hosting stays on the personal GitHub Pages URL for the beta; the formal announcement waits on Stanford's accessibility review.
