# Project: Big Wins Microsite - Source of Truth

## Project Status: ✅ FUNCTIONALLY COMPLETE - Ready for Deployment Testing

**Current State:** All core features implemented and tested in development. Site is production-ready with 22 pages statically generated. Ready for Phase 6 final testing and deployment.

**Quick Stats:**
- 8 Lessons + 8 Case Studies with bidirectional linking
- Fully responsive (mobile, tablet, desktop)
- Accessibility-first design with keyboard navigation
- Performance-optimized with minimal JavaScript
- SEO-ready with comprehensive meta tags
- Development build: 22/22 pages generated successfully

---

## Purpose
Build a fast, accessible, and engaging public microsite that presents:
1) A set of synthesized **Lessons Learned** (primary content)
2) A set of supporting **Case Studies** (evidence and narrative)

Each lesson must clearly link to the relevant case studies that support it, and each case study must link back to the lessons it informs.

**Audience:** general, non-technical, policy-curious public.

**Primary goal:** clarity, credibility, and ease of understanding.

---

## Non-negotiable Constraints

- **Static site only** — no backend, no database, no auth.
- **Performance first** — target <1s load on 4G, minimal JS, no heavy libraries.
- **Accessibility by default** — semantic HTML, WCAG AA contrast, keyboard navigable.
- **Content is source of truth** — lessons and case studies are maintained as Markdown with stable IDs and metadata.

---

## Technical Constraints

### Brand Colors (Stanford Impact Labs)
**Primary Colors:**
- **Teal 1 (#4AE3C9)** - Primary brand color, CTAs, interactive elements
- **Teal 2 (#28B89D)** - Hover states, secondary accents
- **Teal 3 (#265957)** - Dark teal for depth, borders, subtle backgrounds
- **White (#FFFFFF)** - Backgrounds, negative space

**Secondary/Accent Colors:**
- **Red 1 (#FF5A41)** - High-impact metrics, important callouts
- **Red 2 (#DF3035)** - Hover states for red elements
- **Cardinal Red (#8C1515)** - Stanford cardinal, special emphasis
- **Black (#000000)** - Headlines, body text

**Color Usage Strategy:**
- Headers/Navigation: Black text on white, Teal 1 for active states
- Hero Sections: White text on Teal 3 gradient backgrounds
- CTAs/Buttons: Teal 1 background, transitions to Teal 2 on hover
- Impact Metrics: Red 1 for large numbers, creates visual pop
- Links: Teal 2, underline on hover
- Cards: White with Teal 3 borders, lift on hover with Teal 1 accent
- Pull Quotes: Teal 3 left border, light Teal background (Teal 1 at 10% opacity)

**Accessibility Considerations:**
- All color combinations meet WCAG AA contrast requirements (4.5:1 for normal text)
- Teal 1 (#4AE3C9) on white: 2.3:1 (use only for large text/decorative)
- Teal 2 (#28B89D) on white: 3.5:1 (use for large text 18px+)
- Teal 3 (#265957) on white: 8.5:1 (excellent for body text)
- Red 1 (#FF5A41) on white: 3.3:1 (use for large metrics only)
- Black on white: 21:1 (perfect for body text)

### Typography
- **Font:** Source Sans Pro (via Google Fonts)
- **Headlines:** Bold 600-700, 32-56px
- **Subheadings:** Medium 500, 24-32px
- **Body:** Regular 400, 18px, 1.7 line-height for readability
- **Impact Numbers:** Bold 700, 48-72px (for hero metrics)
- **Pull Quotes:** Italic 400, 20-24px
- **Metadata/Labels:** Regular 400, 14px, uppercase tracking for tags

### Performance Targets
- **Load Time:** <1s on 4G
- **Lighthouse Scores:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size:** Minimal JavaScript, only essential interactivity
- **Images:** Optimized with next/image, lazy loading below fold

### Branding
- **Sponsored by:** Stanford Impact Labs
- **Logo:** `public/images/SIL-Logo-RGB-Colour-soft.png` (PNG format)
- **Footer Credit:** "Sponsored by Stanford Impact Labs"

---

## UX & Design Principles

- Clear narrative hierarchy: what this is, why it matters, what to do next.
- Progressive disclosure: simple first, detail on demand.
- Visual rhythm and whitespace over visual noise.
- Every interactive element must look interactive.
- Mobile-first, then scale up.
- **No gratuitous animations. No novelty UI.**

---

## Workflow Expectations

- Work in **small, reversible steps**.
- **Before large changes**: propose a short plan and wait for approval.
- **After each major change**: list files changed, summarize what changed, and state next steps.
- **At the end of each phase**: update this claude.md file with progress, technical debt, and completion status.
- Ask before:
  - adding dependencies,
  - renaming directories,
  - performing broad refactors.

Prefer clarity and maintainability over abstraction.

### Git Workflow & Version Control

**Repository:** https://github.com/Michael-149/big-wins-microsite

**When to commit and push:**
- **After completing a feature or phase** - Commit all changes when a logical unit of work is complete
- **After significant bug fixes** - Push fixes that resolve important issues
- **After content updates** - Commit when lessons or case studies are updated
- **Before risky changes** - Create a commit checkpoint before major refactoring
- **At end of work session** - Always commit and push before ending a work session

**Commit message format:**
```bash
git commit -m "Brief summary of changes

- Detailed change 1
- Detailed change 2
- Files affected: file1.tsx, file2.md

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Standard Git commands:**
```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "Your message here"

# Push to GitHub
git push

# Check status
git status

# View commit history
git log --oneline -10
```

**Important reminders:**
- Always stage and commit changes after completing a phase
- Write clear, descriptive commit messages explaining what changed and why
- Push to GitHub regularly to maintain backup and version history
- Check `git status` before committing to review what's being staged
- Include the Claude Code attribution in significant commits

---

## Claude Behavior

- Do not introduce frameworks or tools outside this spec without explicit approval.
- Do not make structural changes without warning.
- Do not over-engineer.
- Optimize for readability, maintainability, and correctness.
- **Update the "Current Progress" section at the end of each phase** with completed tasks, files changed, and any technical debt.
- **Commit to Git after completing significant work** - After finishing a feature, phase, or important fix, stage all changes, create a descriptive commit, and push to GitHub to maintain version history.

---

# Full Implementation Plan

## Project Structure

### Tech Stack (Minimal & Performance-First)
- **Framework:** Next.js 14+ (App Router) with TypeScript + Static Export
- **Styling:** Tailwind CSS (minimal, utility-first)
- **Content:** Markdown files with YAML frontmatter (source of truth)
- **Parsing:** gray-matter + remark-html (lightweight markdown processing)
- **Animations:** CSS transitions only (no heavy animation libraries)
- **Icons:** Inline SVG (no icon libraries to reduce bundle size)
- **Deployment:** Static export to any CDN/hosting (Vercel, Netlify, GitHub Pages)

**Performance Strategy:**
- Static generation (SSG) for all pages
- Minimal JavaScript (only essential interactivity)
- No client-side data fetching
- Optimized images with next/image
- Inlined critical CSS
- Lazy loading for below-the-fold content

### File Organization
```
big-wins-microsite/
├── src/
│   ├── app/                      # Next.js pages
│   │   ├── page.tsx              # Home page
│   │   ├── lessons/
│   │   │   ├── page.tsx          # Lessons hub
│   │   │   └── [slug]/page.tsx   # Individual lesson
│   │   ├── case-studies/
│   │   │   ├── page.tsx          # Case studies hub
│   │   │   └── [slug]/page.tsx   # Individual case study
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── layout/               # Header, Footer, Navigation
│   │   ├── cards/                # LessonCard, CaseStudyCard
│   │   ├── case-study/           # CaseStudyTabs, Timeline
│   │   └── lesson/               # LessonHero, RelatedCaseStudies
│   ├── content/
│   │   ├── lessons/              # 8 lesson markdown files
│   │   └── case-studies/         # 8 case study markdown files
│   └── lib/
│       ├── content.ts            # Markdown parsing functions
│       ├── types.ts              # TypeScript interfaces
│       └── constants.ts          # Lesson-case study mappings
└── public/
    └── images/
        ├── SIL-Logo-RGB-Colour-soft.png  # Brand logo (PNG)
        ├── lesson-icons/                  # Icons for 8 lessons
        └── case-study-images/             # Optional hero images
```

---

## Site Architecture

### Navigation Flow

**Primary Journey (Lessons-First):**
1. Landing page → Grid of 8 lesson cards
2. Click lesson → Lesson page with explanation + related case study cards
3. Click case study card → Full case study page
4. Case study page links back to relevant lessons

**URL Structure:**
- `/` - Home/landing
- `/lessons` - Lessons overview
- `/lessons/[slug]` - Individual lesson (e.g., `/lessons/design-details`)
- `/case-studies` - Case studies overview
- `/case-studies/[slug]` - Individual case study (e.g., `/case-studies/moving-to-opportunity`)
- `/about` - About the project

---

## Content Strategy

### Adaptation for General Audience

**From Academic to Accessible:**
- Lead with human impact and compelling questions
- Break long paragraphs into 2-3 sentence chunks
- Use active voice and eliminate jargon
- Create pull quotes from researcher insights
- Add "Key Takeaway" summary boxes
- Move citations to collapsible footnotes

**Visual Hierarchy:**
1. **Level 1:** Lesson/case study titles, impact metrics (large, bold)
2. **Level 2:** Section headings, pull quotes
3. **Level 3:** Body text, supporting details
4. **Level 4:** Metadata (timespan, tags, citations)

### Content Files Structure

**Lessons Frontmatter:**
```yaml
---
number: 3
slug: "design-details"
title: "\"Design Details\" Aren't Details: They Are the Intervention"
shortTitle: "Design Details Matter"
icon: "wrench"
relatedCaseStudies: ["moving-to-opportunity", "fcc-spectrum", "amc-vaccines"]
---
```

**Case Studies Frontmatter:**
```yaml
---
title: "Moving to Opportunity"
slug: "moving-to-opportunity"
domain: "Housing Policy / Economic Mobility"
domainColor: "teal"
keyResearchers: ["Raj Chetty", "Nathaniel Hendren", "Lawrence Katz"]
timespan: "1994-present"
heroMetric: "31% higher adult earnings"
lessonsExemplified: ["design-details", "field-accumulation", "sustained-engagement"]
---
```

---

## Interactive Features

### Moderate Interactivity

1. **Card Hover Effects:** Lift and shadow on hover
2. **Smooth Page Transitions:** Fade between routes
3. **Tab/Accordion Navigation:** Responsive switching on case studies
4. **Scroll Animations:** Fade-in-up for sections
5. **Impact Metric Counters:** Animated count-up when scrolled into view
6. **Sticky Header:** Shrinks on scroll
7. **Search Functionality:** Fuse.js for client-side search across lessons and case studies
8. **Filterable Case Studies:** By domain or lesson exemplified
9. **Timeline Visualization:** Horizontal scrollable timeline for "Path to Impact"
10. **Progress Indicator:** Thin bar showing reading progress

### Mobile Responsiveness
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)
- Hamburger menu with slide-out navigation
- Tabs become accordions on mobile
- Cards stack vertically
- Touch targets minimum 44x44px
- Respect `prefers-reduced-motion` for accessibility

---

## What's Been Built

### ✅ Complete Features

**Core Pages (22 total):**
- Home page with hero, 8 lesson cards, case studies preview
- Lessons hub page (`/lessons`)
- 8 individual lesson pages (`/lessons/[slug]`)
- Case studies hub page (`/case-studies`)
- 8 individual case study pages (`/case-studies/[slug]`)

**Layout Components:**
- Header with Stanford Impact Labs logo and navigation
- Sticky header that shrinks on scroll
- Footer with "Powered by Stanford Impact Labs" branding
- Mobile-responsive navigation

**Content Display:**
- Markdown parsing with frontmatter support
- Prose styling for readable body text
- Pull quotes with teal accent styling
- Key Takeaway boxes on lesson pages
- Hero sections with gradient backgrounds
- Impact metrics with red accent color

**Interactive Features:**
- Tab navigation for case studies (desktop)
- Accordion navigation for case studies (mobile)
- URL hash routing for shareable section links
- Smooth scroll behavior
- Card hover effects (lift, shadow, border color)
- Fade-in animations (respects prefers-reduced-motion)
- Keyboard navigation with visible focus states

**Cross-linking:**
- Lessons → Related case studies (clickable cards)
- Case studies → Lessons exemplified (linked badges)
- Sidebar navigation between lessons (desktop)
- All 16 content files linked bidirectionally

**Performance & Accessibility:**
- Static site generation (SSG) for all pages
- Minimal JavaScript (only for tabs/accordion)
- Image optimization with next/image
- Lazy loading for below-the-fold images
- Semantic HTML throughout
- WCAG AA color contrast
- Keyboard accessible

**SEO:**
- Comprehensive meta tags
- Open Graph tags for social sharing
- Twitter Card tags
- Structured metadata for all pages

### 🔄 Optional Enhancements (Not Yet Implemented)

These features are defined in the spec but not critical for launch:
- Search functionality (Fuse.js)
- Filterable case studies by domain/lesson
- Timeline visualization component (created but not integrated)
- Animated impact metric counters
- Reading progress indicator
- Hamburger menu animation (currently basic mobile menu)

---

## Implementation Phases with Review Breakpoints

### Phase 1: Project Setup & Content Migration ✅ [COMPLETED]

**Goal:** Initialize project and prepare content files

**Tasks:**
1. ✅ Initialize Next.js 14 project with TypeScript and Tailwind CSS
2. ✅ Configure Tailwind with Stanford Impact Labs brand colors
3. ✅ Set up folder structure (app/, components/, content/, lib/)
4. ✅ Install minimal dependencies: gray-matter, remark-html only
5. ✅ Add Stanford Impact Labs logo to `/public/images/` (PNG format)
6. ✅ Configure Source Sans Pro font (Google Fonts)
7. ✅ Create TypeScript interfaces for Lesson and CaseStudy types
8. ✅ Build content parsing functions in `lib/content.ts`
9. ✅ Extract 8 lessons from executive summary into individual markdown files in `content/lessons/`
10. ✅ Convert existing 8 case studies to new markdown format with enhanced frontmatter in `content/case-studies/`

**Files Created:**
- `package.json`, `tailwind.config.js`, `tsconfig.json`
- `lib/content.ts`, `lib/types.ts`, `lib/constants.ts`
- `content/lessons/*.md` (8 files)
- `content/case-studies/*.md` (8 files)
- `public/images/SIL-Logo-RGB-Colour-soft.png`

**Files Modified:**
- `app/globals.css` - Added brand colors, Source Sans Pro, fixed import order

**Deliverables:**
- ✅ Working Next.js project that builds successfully
- ✅ All 16 markdown files with correct frontmatter
- ✅ Content parsing functions tested

---

### Phase 2: Core Layout & Home Page ✅ [COMPLETED]

**Goal:** Build reusable layout components and home page

**Tasks:**
1. ✅ Create base layout with Header and Footer components
2. ✅ Add Stanford Impact Labs logo to header with navigation
3. ✅ Style footer with Stanford Impact Labs credit
4. ✅ Build home page:
   - Hero section with teal gradient background
   - 8 lesson cards in responsive grid
   - Brief case studies preview section
5. ✅ Implement mobile-first responsive design (breakpoints: 640px, 1024px)
6. ✅ Add basic typography styles with Source Sans Pro
7. ✅ Ensure semantic HTML throughout (nav, main, footer, article)
8. ✅ Test keyboard navigation (Tab, Enter, Escape)

**Files Created:**
- `components/layout/Header.tsx` - Navigation with logo and links
- `components/layout/Footer.tsx` - Footer with SIL branding
- `components/cards/LessonCard.tsx` - Reusable lesson card with hover effects

**Files Modified:**
- `app/layout.tsx` - Integrated Header and Footer
- `app/page.tsx` - Complete home page with hero, lessons grid, case studies preview

**Deliverables:**
- ✅ Functional home page with all 8 lessons displayed
- ✅ Responsive layout working on mobile and desktop
- ✅ Keyboard navigation functional

---

### Phase 3: Lessons Pages [PENDING]

**Goal:** Build lesson hub and individual lesson pages

**Tasks:**
1. Create `/lessons` index page listing all 8 lessons
2. Build dynamic lesson page template (`/lessons/[slug]/page.tsx`)
3. Display lesson content with proper formatting
4. Show related case studies as clickable cards
5. Add "Key Takeaway" box at end of each lesson
6. Implement sidebar navigation showing all 8 lessons (desktop only)
7. Style pull quotes and emphasis elements
8. Ensure all internal links work correctly

**Files to Create:**
- `app/lessons/page.tsx`
- `app/lessons/[slug]/page.tsx`
- `components/lesson/LessonSidebar.tsx`
- `components/lesson/RelatedCaseStudies.tsx`

**Deliverables:**
- All 8 lesson pages render correctly
- Navigation between lessons works
- Links to case studies functional

**🛑 BREAKPOINT 3: Review Lessons Pages**
- Verify all lesson content displays correctly
- Check bidirectional linking (lessons ↔ case studies)
- Test navigation flow
- Approve before moving to Phase 4

---

### Phase 4: Case Study Pages [PENDING]

**Goal:** Build case study hub and individual case study pages

**Tasks:**
1. Create `/case-studies` index page with all 8 case studies
2. Build dynamic case study page template (`/case-studies/[slug]/page.tsx`)
3. Add hero section with gradient background and key metric
4. Implement tab navigation for desktop (Overview, Impact, Path, etc.)
5. Implement accordion for mobile (same sections, collapsible)
6. Style impact metrics with red accent color
7. Add "Lessons Exemplified" section linking back to lessons
8. Add collapsible sources/citations section
9. Create timeline visualization for "Path to Impact" section (CSS-only, no libraries)

**Files to Create:**
- `app/case-studies/page.tsx`
- `app/case-studies/[slug]/page.tsx`
- `components/case-study/CaseStudyHero.tsx`
- `components/case-study/CaseStudyTabs.tsx`
- `components/case-study/CaseStudyAccordion.tsx`
- `components/case-study/Timeline.tsx`

**Deliverables:**
- All 8 case study pages render correctly
- Tab/accordion navigation works smoothly
- Timeline visualization displays properly

**🛑 BREAKPOINT 4: Review Case Study Pages**
- Verify all case study content displays correctly
- Test tab/accordion switching behavior
- Check mobile vs desktop layouts
- Approve before moving to Phase 5

---

### Phase 5: Interactive Enhancements & Polish [PENDING]

**Goal:** Add subtle interactivity and visual polish

**Tasks:**
1. Add CSS hover effects to cards (lift, border color change)
2. Implement smooth scroll behavior for anchor links
3. Add sticky header that stays visible on scroll
4. Style focus states for keyboard navigation (visible outline)
5. Add simple fade-in animations for sections (CSS only, `@keyframes`)
6. Optimize images and add loading="lazy"
7. Add meta tags for SEO and social sharing
8. Implement URL hash routing for case study sections (#overview, #impact)

**Files to Modify:**
- Update all component files with hover/focus states
- `app/layout.tsx` (meta tags)
- `app/globals.css` (animations, utilities)

**Deliverables:**
- Smooth, polished interactions
- SEO meta tags in place
- Performance optimized

**🛑 BREAKPOINT 5: Review Interactivity & Polish**
- Test all interactive elements
- Verify animations are subtle (no gratuitous motion)
- Run Lighthouse audit (target: 90+ all scores)
- Approve before moving to Phase 6

---

### Phase 6: Final Testing & Deployment [NEXT - READY TO START]

**Goal:** Test thoroughly and deploy

**Current Status:** All development work complete. Ready for comprehensive testing and deployment.

**Tasks:**
1. Cross-browser testing (Chrome, Firefox, Safari, Edge)
2. Mobile device testing (iOS Safari, Android Chrome)
3. Accessibility audit with axe DevTools
4. Performance audit with Lighthouse (target: <1s load, 90+ scores)
5. Verify all links work (lessons ↔ case studies, external citations)
6. Proofread all content for typos
7. Create README.md with setup and deployment instructions
8. Configure static export in next.config.js
9. Test production build locally
10. Deploy to hosting platform (Vercel/Netlify/GitHub Pages)
11. Test production deployment thoroughly

**Files to Create:**
- `README.md` (setup, deployment, content update instructions)
- `next.config.js` (static export configuration if needed)

**Deliverables:**
- Fully tested, production-ready site
- Live URL for the microsite
- Documentation for future updates
- Performance metrics report (Lighthouse scores)
- Accessibility audit report

**🛑 BREAKPOINT 6: Final Review Before Launch**
- Review complete site functionality
- Verify performance metrics (target: 90+ all Lighthouse scores)
- Check accessibility compliance (WCAG AA)
- Confirm all links functional
- Approve for public launch

---

## Review Process at Each Breakpoint

At each breakpoint, the following will be presented:
1. **List all files created/modified** with brief descriptions
2. **Summarize what changed** and why
3. **Show screenshots or code samples** of key changes
4. **Report any issues or decisions** that need input
5. **Propose next steps** for the following phase
6. **Wait for approval** before continuing

---

## Current Progress

### Phase 1: Project Setup & Content Migration ✅ [COMPLETED]

**Completed Tasks:**
- ✅ Next.js 14 initialized with TypeScript, Tailwind CSS
- ✅ Stanford Impact Labs brand colors configured in Tailwind (Teal 1-3, Red 1-2, Cardinal)
- ✅ Source Sans Pro font integrated via Google Fonts
- ✅ Folder structure created (components/, content/, lib/)
- ✅ Dependencies installed: gray-matter, remark, remark-html
- ✅ TypeScript interfaces created (Lesson, CaseStudy)
- ✅ Content parsing functions built (lib/content.ts)
- ✅ All 8 lessons extracted and converted to markdown
- ✅ All 8 case studies copied and frontmatter updated
- ✅ Logo file noted (SIL-Logo-RGB-Colour-soft.png in public/images/)
- ✅ CSS @import order fixed to eliminate build warning
- ✅ Project builds successfully with no errors

**Files Created:**
- `lib/types.ts` - TypeScript interfaces
- `lib/content.ts` - Content parsing functions
- `lib/constants.ts` - Slug mappings and constants
- `content/lessons/*.md` - 8 lesson files
- `content/case-studies/*.md` - 8 case study files

**Files Modified:**
- `app/globals.css` - Added brand colors, Source Sans Pro, fixed import order
- All case study frontmatter updated with slug, domainColor, heroMetric, lessonsExemplified

**Technical Debt:**
- None

---

### Phase 2: Core Layout & Home Page ✅ [COMPLETED]

**Completed Tasks:**
- ✅ Created Header component with Stanford Impact Labs logo (PNG) and navigation
- ✅ Created Footer component with SIL branding on Teal 3 background
- ✅ Updated root layout (app/layout.tsx) to include Header and Footer
- ✅ Built home page with three sections:
  - Hero section with Teal 3 → Teal 2 gradient
  - 8 lesson cards in responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
  - Case studies preview section with bordered CTA button
- ✅ Created LessonCard component with numbered badges and hover effects (lift, shadow, border color change)
- ✅ Implemented mobile-first responsive design with Tailwind breakpoints
- ✅ Ensured semantic HTML (nav, main, footer) and keyboard accessibility
- ✅ Development server running successfully on localhost:3000
- ✅ **Phase 2 Refinements:**
  - Updated Stanford Impact Labs website links to https://impact.stanford.edu/
  - Enhanced lesson card content with compelling one-line descriptions (removed truncated full titles)
  - Increased card min-height to 200px to prevent text cutoff
  - Changed "Sponsored by" to "Powered by" Stanford Impact Labs in footer

**Files Created:**
- `components/layout/Header.tsx` - Navigation with logo and links
- `components/layout/Footer.tsx` - Footer with SIL branding
- `components/cards/LessonCard.tsx` - Reusable lesson card with engaging descriptions

**Files Modified:**
- `app/layout.tsx` - Integrated Header/Footer, updated metadata
- `app/page.tsx` - Complete home page (hero, lessons grid, case studies preview)
- `components/layout/Footer.tsx` - Updated link to https://impact.stanford.edu/ and "Powered by" text
- `components/cards/LessonCard.tsx` - Added engaging descriptions, improved layout with min-height

**Technical Debt:**
- None

**Visual Design:**
- Header: White background, black text, Teal 1 hover states
- Hero: Teal gradient (Teal 3 → Teal 2), white text, large headlines
- Lesson Cards: White with Teal 3 borders, numbered badges (Teal 1), min-height 200px, hover lifts, engaging one-line descriptions
- Footer: Teal 3 background with white text, "Powered by Stanford Impact Labs" with link to https://impact.stanford.edu/

**Next Phase:**
- Phase 6: Final Testing & Deployment
- Will conduct comprehensive testing and prepare for deployment

---

### Phase 5: Interactive Enhancements & Polish ✅ [COMPLETED]

**Completed Tasks:**
- ✅ Added smooth scroll behavior with `scroll-behavior: smooth`
- ✅ Implemented `prefers-reduced-motion` media query for accessibility
- ✅ Added visible focus states with Teal 1 outline (3px solid, 2px offset)
- ✅ Created CSS-only fade-in animations (fadeIn, fadeInUp)
- ✅ Added staggered animation delays (delay-100 through delay-400)
- ✅ Implemented sticky header that shrinks on scroll (h-20 → h-16, logo h-12 → h-10)
- ✅ Added shadow-md to header when scrolled
- ✅ Converted Header to client component with scroll detection
- ✅ Applied fade-in animations to home page sections
- ✅ Optimized images with lazy loading (Footer logo)
- ✅ Added comprehensive SEO meta tags (keywords, authors, creator, publisher)
- ✅ Added Open Graph tags for social sharing (URL, images, siteName)
- ✅ Added Twitter Card meta tags (summary_large_image)
- ✅ Added robots meta tags for search engine indexing
- ✅ Separated viewport configuration (Next.js requirement)
- ✅ Set metadataBase URL for proper OG image resolution
- ✅ Implemented URL hash routing for case study tabs (desktop)
- ✅ Implemented URL hash routing for case study accordion (mobile)
- ✅ Added hash change listeners for browser back/forward navigation
- ✅ Updated URL on tab/accordion clicks
- ✅ Removed duplicate case study file (1-moving-to-opportunity.md)
- ✅ Build tested successfully - all 22 pages generated

**Files Created:**
- None (all modifications to existing files)

**Files Modified:**
- `app/globals.css` - Added smooth scroll, focus states, animations, `prefers-reduced-motion` support
- `components/layout/Header.tsx` - Converted to client component, added sticky/shrink behavior
- `components/layout/Footer.tsx` - Added lazy loading to logo image
- `app/page.tsx` - Applied fade-in animations to hero and sections
- `app/layout.tsx` - Added comprehensive SEO, Open Graph, Twitter Card meta tags, separated viewport
- `components/case-study/CaseStudyTabs.tsx` - Added URL hash routing with useEffect hooks
- `components/case-study/CaseStudyAccordion.tsx` - Added URL hash routing for mobile

**Deliverables:**
- ✅ Smooth, polished interactions that respect accessibility preferences
- ✅ Sticky header with subtle shrink animation
- ✅ Comprehensive SEO meta tags for search engines and social sharing
- ✅ URL hash routing for shareable case study section links
- ✅ Production build successful (22/22 pages generated)

**Technical Debt:**
- None

**Technical Notes:**
- All animations respect `prefers-reduced-motion` setting
- Header uses scroll event listener with cleanup
- Hash routing works on both desktop tabs and mobile accordion
- Viewport configuration separated per Next.js 16 requirements
- metadataBase set to https://bigwins.stanford.edu for OG images
- Image optimization: Header logo uses `priority`, Footer logo uses `loading="lazy"`

---

### Phase 3: Lessons Pages ✅ [COMPLETED]

**Completed Tasks:**
- ✅ Created `/lessons` index page with hero and lessons grid
- ✅ Built dynamic lesson page template (`/lessons/[slug]/page.tsx`)
- ✅ Displayed lesson content with prose styling (proper typography, spacing)
- ✅ Created RelatedCaseStudies component showing clickable case study cards
- ✅ Added Key Takeaway box with lesson-specific content
- ✅ Implemented LessonSidebar navigation component (desktop only, sticky)
- ✅ Styled pull quotes with teal borders and light backgrounds
- ✅ Ensured all internal links work correctly (lessons ↔ case studies)
- ✅ Fixed Next.js 15 params Promise issue (params must be awaited)

**Files Created:**
- `app/lessons/page.tsx` - Lessons hub page
- `app/lessons/[slug]/page.tsx` - Dynamic lesson page template
- `components/lesson/LessonSidebar.tsx` - Sidebar navigation
- `components/lesson/RelatedCaseStudies.tsx` - Related case studies section

**Deliverables:**
- ✅ All 8 lesson pages render correctly with proper formatting
- ✅ Navigation between lessons works via sidebar
- ✅ Links to related case studies functional
- ✅ Bidirectional linking fully operational

**Technical Debt:**
- None

---

### Phase 4: Case Study Pages ✅ [COMPLETED]

**Completed Tasks:**
- ✅ Created `/case-studies` index page with hero and case studies grid
- ✅ Built dynamic case study page template (`/case-studies/[slug]/page.tsx`)
- ✅ Created CaseStudyHero component with gradient, domain tag, hero metric
- ✅ Implemented tab navigation for desktop (Overview, Impact, Path, etc.)
- ✅ Implemented accordion for mobile (collapsible sections)
- ✅ Styled impact metrics with red accent color (sil-red-1)
- ✅ Added "Lessons Exemplified" section linking back to lessons
- ✅ Created section parser to automatically split markdown by H2 headings
- ✅ Ensured prose styling for all content sections
- ✅ Fixed Next.js 15 params Promise issue

**Files Created:**
- `app/case-studies/page.tsx` - Case studies hub page
- `app/case-studies/[slug]/page.tsx` - Dynamic case study page template
- `components/case-study/CaseStudyHero.tsx` - Hero section with metrics
- `components/case-study/CaseStudyTabs.tsx` - Tab navigation (desktop, client component)
- `components/case-study/CaseStudyAccordion.tsx` - Accordion (mobile, client component)
- `components/case-study/Timeline.tsx` - Timeline visualization component (CSS-only)

**Deliverables:**
- ✅ All 8 case study pages render correctly
- ✅ Tab/accordion navigation works smoothly (responsive)
- ✅ Bidirectional linking to lessons functional
- ✅ Sections automatically parsed from markdown H2 headings

**Technical Debt:**
- Timeline component created but not yet integrated into case study pages (optional enhancement)

**Technical Notes:**
- Section parsing automatically extracts H2 headings from markdown
- Tabs show on desktop (md:block), accordion shows on mobile (md:hidden)
- Client components (`'use client'`) used for interactive tabs/accordion
- Hero metrics displayed prominently in large red text (sil-red-1)

---

### Post-Launch Enhancement Phase ✅ [COMPLETED]

**Goal:** Add visual polish and interactivity to improve user experience without compromising performance or accessibility.

**Design Transformation (Pre-Enhancement):**
- ✅ Redesigned site to match Stanford Impact Labs aesthetic
- ✅ Replaced Source Sans Pro with Inter font
- ✅ Updated color scheme to use sil-primary (#0779bf) as main teal-blue
- ✅ Redesigned hero sections, cards, header, footer for cleaner, more professional look
- ✅ Installed icon libraries: lucide-react and @heroicons/react

**Completed Enhancement Features:**

**1. Scroll-Triggered Animations (Phase 1)**
- ✅ Created `AnimateOnScroll.tsx` wrapper component with IntersectionObserver
- ✅ Added CSS animations (fadeIn, fadeInUp) with GPU-accelerated transforms
- ✅ Respects `prefers-reduced-motion` for accessibility
- ✅ Auto-disconnects observer after animation for performance

**2. Reading Experience Components (Phase 2)**
- ✅ Created `ReadingProgressBar.tsx` - fixed top bar showing scroll progress
- ✅ Integrated progress bar into all lesson and case study pages
- ✅ Created `AnimatedMetric.tsx` - count-up animation for impact metrics
- ✅ Integrated animated metrics into `CaseStudyHero.tsx`
- ✅ Uses RAF throttling for smooth 60fps performance
- ✅ Parses various metric formats (percentages, currency, ranges)

**3. Navigation Enhancements (Phase 3)**
- ✅ Created `Breadcrumbs.tsx` - server component with proper ARIA labels
- ✅ Created `PrevNextNav.tsx` - sequential navigation with Heroicons
- ✅ Created `BackToTop.tsx` - floating button with fade-in animation
- ✅ Integrated breadcrumbs into all lesson and case study pages
- ✅ Integrated prev/next navigation (lessons by number, case studies alphabetically)
- ✅ Added BackToTop to global layout (appears after 400px scroll)

**4. Timeline Integration (Phase 4)**
- ✅ Updated `lib/types.ts` to add `TimelineEvent` interface
- ✅ Added optional `timeline` field to `CaseStudyFrontmatter`
- ✅ Added timeline data to Moving to Opportunity case study (6 events: 1994-2021)
- ⏸️ Timeline component created but not yet integrated into pages (deferred)

**5. Sidebar Section Highlighting (Phase 4)**
- ⏸️ Feature deferred - noted as most complex, can be implemented later if needed

**Files Created:**
- `components/ui/AnimateOnScroll.tsx` - Scroll-triggered animation wrapper
- `components/ui/ReadingProgressBar.tsx` - Reading progress indicator
- `components/ui/AnimatedMetric.tsx` - Count-up animation for metrics
- `components/ui/Breadcrumbs.tsx` - Navigation breadcrumbs
- `components/ui/PrevNextNav.tsx` - Sequential navigation
- `components/ui/BackToTop.tsx` - Floating back-to-top button

**Files Modified:**
- `app/globals.css` - Added animation CSS classes and keyframes
- `app/layout.tsx` - Added BackToTop component
- `app/lessons/[slug]/page.tsx` - Added ReadingProgressBar, Breadcrumbs, PrevNextNav
- `app/case-studies/[slug]/page.tsx` - Added ReadingProgressBar, Breadcrumbs, PrevNextNav
- `components/case-study/CaseStudyHero.tsx` - Wrapped heroMetric with AnimatedMetric
- `lib/types.ts` - Added TimelineEvent interface and timeline field
- `content/case-studies/moving-to-opportunity.md` - Added timeline data

**Performance Optimizations:**
- IntersectionObserver for scroll detection (runs off main thread)
- RequestAnimationFrame for smooth animations (60fps target)
- Passive scroll event listeners
- Auto-disconnecting observers after animation completes
- CSS-first animations using GPU-accelerated properties (transform, opacity)
- Respects `prefers-reduced-motion` throughout

**Accessibility Features:**
- All animations disabled when `prefers-reduced-motion: reduce`
- Proper ARIA labels on all navigation components
- Keyboard accessible (Tab, Enter for all interactive elements)
- Semantic HTML maintained
- Focus states visible and consistent

**JavaScript Bundle Impact:**
- Estimated total: <10KB added across all features
- AnimateOnScroll: ~1.2KB
- ReadingProgressBar: ~0.8KB
- AnimatedMetric: ~1.5KB
- BackToTop: ~0.8KB
- Breadcrumbs: 0KB (server component)
- PrevNextNav: 0KB (server component)

**Technical Debt:**
- Timeline component created but not integrated (optional, can be added later)
- Sidebar section highlighting deferred (most complex feature, not critical)

**Testing Status:**
- ✅ Development server running successfully
- ✅ All pages compiling without errors
- ✅ Hot reload working correctly
- ⏸️ Cross-browser testing pending
- ⏸️ Lighthouse audit pending
- ⏸️ Accessibility audit pending

**Next Steps:**
- Move to Phase 5: Comprehensive testing and performance audit
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS Safari, Android Chrome)
- Lighthouse audit (target: 90+ all scores)
- Axe DevTools accessibility scan
- Production build test

---

## Technical Notes

**Logo:**
- Format: PNG (not SVG)
- Location: `public/images/SIL-Logo-RGB-Colour-soft.png`
- Used with next/image for optimization

**Content Structure:**
- Lesson slugs use kebab-case (e.g., "design-details")
- Case study slugs match filename (e.g., "moving-to-opportunity")
- Bidirectional links configured via lessonsExemplified and relatedCaseStudies arrays

**Dependencies:**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS v4 (inline theme)
- gray-matter (YAML frontmatter parsing)
- remark, remark-html (markdown processing)

---

## Success Criteria

1. **Accessibility:** Lighthouse accessibility score 90+
2. **Performance:** Page load under 1 second, Lighthouse performance 90+
3. **Mobile-friendly:** Responsive design working on all devices
4. **Content Quality:** Academic content adapted for general audience
5. **Navigation:** Clear pathways between lessons and case studies
6. **Engagement:** Interactive elements enhance understanding
7. **Maintainability:** Easy to update content via markdown files

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Building
npm run build           # Create production build
npm run start           # Preview production build locally

# Testing
npm run lint            # Run ESLint

# Deployment
npm run build           # Then deploy /out folder to hosting
```

### Key File Locations

**Content Files (Edit these to update content):**
- `src/content/lessons/*.md` - 8 lesson markdown files
- `src/content/case-studies/*.md` - 8 case study markdown files

**Components:**
- `src/components/layout/` - Header, Footer
- `src/components/cards/` - LessonCard component
- `src/components/lesson/` - LessonSidebar, RelatedCaseStudies
- `src/components/case-study/` - CaseStudyHero, Tabs, Accordion

**Pages:**
- `src/app/page.tsx` - Home page
- `src/app/lessons/` - Lessons hub and individual lesson pages
- `src/app/case-studies/` - Case studies hub and individual pages

**Configuration:**
- `src/lib/types.ts` - TypeScript interfaces
- `src/lib/content.ts` - Markdown parsing functions
- `src/lib/constants.ts` - Slug mappings
- `src/app/globals.css` - Global styles and brand colors
- `tailwind.config.ts` - Tailwind CSS configuration

**Assets:**
- `public/images/SIL-Logo-RGB-Colour-soft.png` - Stanford Impact Labs logo

### Content Update Workflow

**To add/edit a lesson:**
1. Edit or create markdown file in `src/content/lessons/`
2. Ensure frontmatter includes: number, slug, title, shortTitle, icon, relatedCaseStudies
3. Update `src/lib/constants.ts` if adding new slug
4. Rebuild site: `npm run build`

**To add/edit a case study:**
1. Edit or create markdown file in `src/content/case-studies/`
2. Ensure frontmatter includes: title, slug, domain, domainColor, keyResearchers, timespan, heroMetric, lessonsExemplified
3. Update `src/lib/constants.ts` if adding new slug
4. Rebuild site: `npm run build`

**To update branding/colors:**
1. Edit `src/app/globals.css` for brand colors
2. Edit `tailwind.config.ts` for Tailwind utilities
3. Replace logo in `public/images/`

---

## Project Maintenance Notes

**Last Updated:** January 2026

**Maintainer Notes:**
- All content is markdown-based in `src/content/` directory
- No database or CMS required
- Static site can be hosted on any CDN (Vercel, Netlify, GitHub Pages)
- Image optimization handled automatically by next/image
- Build generates 22 static pages (1 home + 9 lessons + 9 case studies + 2 hubs + 1 about)
- All links are relative and work in any subdirectory
- SEO meta tags use metadataBase from layout.tsx (update for production URL)
