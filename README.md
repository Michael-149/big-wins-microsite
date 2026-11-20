# Social Science Delivers

How research changed policy and practice for millions of people and saved billions of dollars. A static site published by Stanford Impact Labs (SIL), built with Next.js 16 (static export) on the Stanford Impact Labs 2026 09 design system.

Live (open beta): https://michael-149.github.io/big-wins-microsite/

## Run it

```bash
npm install
npm run dev      # http://localhost:3000/big-wins-microsite/
npm run build    # writes the static site to out/
npm run lint
```

`npm run build` also checks every content file and fails on any error (see "Content checks" below). Set `CONTENT_DIR=/path/to/content` to build from another content folder (for example, drafts under review).

## Hosting and the base path

The build is host-agnostic. `BASE_PATH` sets the folder the site is served from; it feeds `basePath` and `assetPrefix` in `next.config.js` and every link and image through `href()` and `asset()` in `lib/site.ts`.

```bash
npm run build                    # default: BASE_PATH=/big-wins-microsite (GitHub Pages)
BASE_PATH="" npm run build       # served from the root of a domain
BASE_PATH=/wssc npm run build    # served from /wssc
```

Every route is written as `<route>/index.html` (`trailingSlash: true`), so any static host works without rewrites. GitHub Pages deploys from `main` through `.github/workflows/deploy.yml`.

To preview a build locally with the base path, copy `out/` into a folder named after it and serve the parent:

```bash
mkdir -p /tmp/site && rm -rf /tmp/site/big-wins-microsite && cp -r out /tmp/site/big-wins-microsite
python3 -m http.server 8000 --directory /tmp/site   # http://localhost:8000/big-wins-microsite/
```

## Site settings

`lib/site.ts` holds the name, tagline, `LAST_UPDATED` (set at release, not at build), `BETA`, `NOINDEX` (adds `noindex` to every page during the beta), `SITE_URL` for Open Graph, and the feedback settings:

- `FEEDBACK_ENDPOINT`: the Apps Script web app that saves Contribute-page submissions to the feedback Google Sheet (setup in `backend/feedback/README.md`). Empty means the form opens an email to `FEEDBACK_EMAIL` instead.
- `FEEDBACK_FORM_URL`: optional external form. When set, every feedback link goes straight to it.
- Every feedback link comes from `FEEDBACK.href(type, page)`. Types: `suggest-case`, `correction`, `near-miss`, `vertical`, `general`. Content never hardcodes an address.

## Typeface: DM Sans now, Strawford later

The design system's primary face is Strawford. Its web license is not confirmed, so the site ships DM Sans (the system's sanctioned alternative), self-hosted by `next/font/google` in `app/fonts.ts`.

To switch once the Strawford web license is confirmed: put the woff2 files in `app/fonts/strawford/`, comment out the DM Sans block in `app/fonts.ts` and uncomment the one `localFont` line above it (add `import localFont from 'next/font/local'`). The CSS variable name stays the same, so nothing else changes. Do not commit the font files before the license is confirmed.

## Content

All text and figures live in `content/` as Markdown with YAML frontmatter; the schema is the content spec (`CONTENT-SPEC.md` in the private working folder).

- `content/case-studies/<slug>.md`: one per case; slugs are the URLs.
- `content/lessons/<n>-<name>.md`: one per lesson; the slug is the file name.
- `content/pages/*.md`: `home.md` (home page and the hub intros), `method.md` (How we built this, plus the `glance` figures and four `limitsSummary` items shown on the home page), `about.md`, `contribute.md`, and `considered.md` (title, `lead` and `note` for Cases we considered).
- `content/considered.yaml`: the long list behind "Cases we considered".

Each home `stakes` entry needs `value`, `label`, `case` and `source` matching a stat on that case page, and may add a short `detail` line (about 60 characters); without one, the home page shows the case stat's `detail`. Four stakes fit the first screen at 1440 by 900 only when each detail is about one line, so the build warns on longer ones.

Cite sources in the body with `{{cite:id}}` or `{{cite:id1,id2}}`; each id must be in the file's `sources`. The site numbers sources in order of first use on the page and builds the Sources list. Stats, timeline events, key studies, the pull quote and the chart cite through their `source` field. The lesson frontmatter `cases` list is the canonical lesson-to-case mapping; a case's `lessons` must agree with it.

Case pages render optional `keyStudies`, `pullQuote` and `chart` blocks when those fields exist.

Content never carries a contribute URL. The templates add the feedback links: "Flag an error or correction" after every `## Corrections` section, "Suggest a case" after About's "Where this is going", "Propose a topic area" after Contribute's topic list, and the form itself in Contribute's `## Send a suggestion` section (`#form`). About's "How to cite" puts each formatted reference paragraph in a grey well, and its "This version" section shows `VERSION` and `LAST_UPDATED` from `lib/site.ts`.

## Pages

| Route | Source |
|---|---|
| `/` | `home.md`, all cases and lessons, `method.md` glance and limits |
| `/case-studies/`, `/case-studies/<slug>/` | case files |
| `/lessons/`, `/lessons/<slug>/` | lesson files |
| `/method/` | `method.md` |
| `/cases-considered/` | `considered.yaml` and `considered.md` (`/considered/` forwards here) |
| `/about/` | `about.md` |
| `/contribute/` | `contribute.md` and the feedback form |
| `404.html` | fixed copy in `app/not-found.tsx` |

The social card is `public/og.png` (1200 by 630), a screenshot of a simple HTML card on the design system's cover-band motif. To change it, replace it with a PNG of the same size and name; `OG_IMAGE` in `lib/site.ts` points to it.

## Content checks

`lib/content.ts` runs on every build. It fails the build on: a missing required field, an unknown or malformed cite, a lesson or case cross-reference to a missing slug, a home stake that does not match a stat on its case, an internal link to a missing page or heading, Stanford proxy, Google redirect, `utm_` or chatgpt.com links, em or en dashes anywhere in content, and "Big Wins" outside the one line on the About page. It warns on unused sources (listed under "Also consulted"), counts outside the spec (stats, timeline events, people, lessons), win statements over 40 words, and lesson-case mismatches.

## Code map

- `app/`: routes (`page.tsx` home, `case-studies/`, `lessons/`, `method/`, `cases-considered/`, `considered/` alias, `about/`, `contribute/`, `not-found.tsx`), `layout.tsx` (metadata, font), `globals.css` (all styles), `tokens.css` (design tokens and the lesson colors).
- `components/`: `chrome.tsx` (banner, header, cover band, footers), `doc-page.tsx` (layout for How we built this and About), `glance.tsx` (the At a glance band), `ui.tsx` (meta, button, arrow link, lesson chip, StatList, feedback box, pager), `cards.tsx`, `nav.tsx` (rail, guide contents, lesson strip), `viz.tsx` (cases over time, phase strip, timeline, bar chart, lessons table), `content-blocks.tsx` (article blocks and Sources), `icons.tsx` (DS icons and symbols), `feedback/` (the Contribute form, the only client component).
- `lib/`: `site.ts` (settings and link helpers), `content.ts` (loader and checks), `markdown.ts` (Markdown and citations), `page-models.ts` (case, lesson and text pages rendered in DOM order).

Styles use the design tokens as CSS variables. Tailwind v4 supplies only its base reset; no utility classes are used. To use utilities later, import `tailwindcss/theme.css` and `tailwindcss/utilities.css` in `app/globals.css` with an `@theme` block that sets `--color-*: initial` and maps the brand tokens, so the default palette never appears.

## Lesson colors

Each lesson has one brand fill, always with its numeral and short title (color is never the only cue), and only on white grounds:

| Lesson | Fill | Text on fill |
|---|---|---|
| 1 | Teal 1 | black |
| 2 | Cardinal | white |
| 3 | Teal 2 | black |
| 4 | Black | white |
| 5 | Teal 3 | white |
| 6 | Red 1 | black |
| 7 | Grey 700 | white |
| 8 | Red 2 | white |
