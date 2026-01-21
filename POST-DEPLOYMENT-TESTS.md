# Post-Deployment Testing Guide

## Tests You Need to Perform Manually

After deploying to https://michael-149.github.io/big-wins-microsite/, complete these tests:

---

## 1. Initial Load Test ✅

### Home Page
- [ ] Visit https://michael-149.github.io/big-wins-microsite/
- [ ] Page loads within 2 seconds
- [ ] No blank screen or 404 error
- [ ] Styles applied correctly (colors, fonts)
- [ ] Stanford Impact Labs logo visible in header
- [ ] All 8 lesson cards visible and styled
- [ ] "Play the Game" easter egg link visible in footer

**Expected Result:** Clean, styled home page with no errors

---

## 2. Styles and Assets Test ✅

### Visual Check
- [ ] **Colors correct:**
  - Primary teal (#0779bf) for links and CTAs
  - Black text on white background
  - Red (#FF5A41) for metrics (if visible on home)
- [ ] **Logo loads:** Stanford Impact Labs logo in header
- [ ] **Fonts correct:** Inter font family (not Times New Roman or default)
- [ ] **No FOUC:** No flash of unstyled content on page load

### Browser Console Check
1. Open DevTools (F12)
2. Go to Console tab
3. [ ] No red errors
4. [ ] No 404 errors for CSS/JS files
5. [ ] No missing image errors

**If you see errors, note them down**

---

## 3. Navigation Test ✅

### Header Navigation
- [ ] Click "Lessons" → Loads lessons hub page
- [ ] Click "Case Studies" → Loads case studies hub page
- [ ] Click "About" → Loads about page
- [ ] Click logo → Returns to home page

### Lesson Navigation
- [ ] From lessons hub, click first lesson (Public Engagement)
- [ ] Lesson page loads with content
- [ ] Sidebar shows all 8 lessons (desktop) or is hidden (mobile)
- [ ] Click related case study card
- [ ] Case study opens

### Case Study Navigation
- [ ] From case studies hub, click first case study
- [ ] Case study page loads with hero section
- [ ] Tabs visible on desktop (≥768px width)
- [ ] Click different tabs → Content switches
- [ ] Resize to mobile (<768px) → Tabs become accordion
- [ ] Click "Lessons Exemplified" badge → Links to lesson

### Breadcrumbs
- [ ] Breadcrumbs show on lesson pages
- [ ] Breadcrumbs show on case study pages
- [ ] Click breadcrumb links → Navigate correctly

### Prev/Next Navigation
- [ ] Prev/Next buttons at bottom of lesson pages
- [ ] Clicking navigates to adjacent lesson
- [ ] Prev/Next buttons on case study pages
- [ ] Clicking navigates to adjacent case study

---

## 4. External Links Test ✅

### Stanford Impact Labs Links
- [ ] Click "Stanford Impact Labs →" in footer
- [ ] Opens https://impact.stanford.edu/ in new tab
- [ ] Site loads correctly

### Easter Egg Game Links
- [ ] **Footer link:** Click "Play the Game" with 🎮 emoji
- [ ] Opens https://michael-149.github.io/big-wins/ in new tab
- [ ] Game loads correctly

- [ ] **Home hero link:** Click "Or play the game" on home page
- [ ] Opens same game URL in new tab
- [ ] Game loads correctly

### Citation Links (Spot Check)
- [ ] Open any case study (e.g., Moving to Opportunity)
- [ ] Scroll to citations/sources
- [ ] Click an external link (academic paper, HUD, etc.)
- [ ] Opens in new tab
- [ ] Destination loads

---

## 5. Interactive Features Test ✅

### Case Study Tabs (Desktop)
1. Open any case study on desktop (width ≥768px)
2. [ ] Tabs displayed horizontally
3. [ ] Click each tab → Content switches
4. [ ] Active tab highlighted with teal underline
5. [ ] URL hash updates (check browser address bar: #overview, #impact, etc.)
6. [ ] Press browser back button → Tab switches back
7. [ ] Copy URL with hash, paste in new tab → Opens to correct tab

### Case Study Accordion (Mobile)
1. Resize browser to mobile (<768px) or use device
2. [ ] Tabs replaced with accordion sections
3. [ ] Click section header → Expands/collapses
4. [ ] Multiple sections can be open simultaneously
5. [ ] Smooth expand/collapse animation

### Reading Progress Bar
- [ ] Open any lesson or case study
- [ ] Thin teal bar appears at top of page
- [ ] Scroll down → Bar fills from left to right
- [ ] At bottom of page → Bar fully filled

### Back to Top Button
- [ ] Scroll down on any page
- [ ] Floating button appears in bottom right (after ~400px scroll)
- [ ] Click button → Page smoothly scrolls to top
- [ ] Button fades out at top

### Hover Effects
- [ ] Hover over lesson cards → Lift and shadow effect
- [ ] Hover over links → Color changes to teal
- [ ] Hover over "Play the Game" → Emoji scales up
- [ ] Hover over buttons → Background color darkens

---

## 6. Responsive Design Test 📱

### Desktop (1024px+)
- [ ] Lesson cards: 4 columns
- [ ] Case study tabs: Horizontal
- [ ] Lesson sidebar: Visible
- [ ] Navigation: Full header with all links
- [ ] Footer: Two columns

### Tablet (768px)
- [ ] Lesson cards: 2 columns
- [ ] Case study tabs: Still horizontal
- [ ] Lesson sidebar: Visible
- [ ] Navigation: Full header
- [ ] Footer: Stacks to single column

### Mobile (375px)
- [ ] Lesson cards: 1 column, stacked
- [ ] Case study tabs: Accordion
- [ ] Lesson sidebar: Hidden (content full width)
- [ ] Navigation: Compact
- [ ] All text readable without zooming
- [ ] No horizontal scrolling

**Test Devices (if available):**
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad (Safari)

---

## 7. Content Quality Check ✅

### Random Spot Checks
- [ ] Open 2-3 lessons → Read through, check for typos
- [ ] Open 2-3 case studies → Verify formatting looks good
- [ ] Check hero metrics on case studies display prominently
- [ ] Verify pull quotes styled with teal border
- [ ] Check key takeaway boxes on lessons

### Images
- [ ] All images load (no broken image icons)
- [ ] Logo in header loads
- [ ] Logo in footer loads
- [ ] Any case study images load

---

## 8. Performance Test ⚡

### Lighthouse Audit
1. Open site in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select "Desktop" mode
5. Click "Analyze page load"
6. [ ] **Performance:** ≥90 (target)
7. [ ] **Accessibility:** ≥95 (target)
8. [ ] **Best Practices:** ≥95 (target)
9. [ ] **SEO:** ≥95 (target)

**Repeat for Mobile:**
10. Select "Mobile" mode in Lighthouse
11. Run audit
12. [ ] Scores documented

**Record Scores:**
- Desktop Performance: _______
- Desktop Accessibility: _______
- Mobile Performance: _______
- Mobile Accessibility: _______

---

## 9. Accessibility Test ♿

### Keyboard Navigation
- [ ] Use Tab key to navigate entire home page
- [ ] All interactive elements reachable
- [ ] Focus indicators visible (teal outline)
- [ ] Press Enter on links → Activates
- [ ] Tab through lesson sidebar → All lessons reachable
- [ ] Tab through case study tabs → Can switch tabs with Enter

### axe DevTools Test
1. Install axe DevTools Chrome extension (if not installed)
2. Open site
3. Run axe scan
4. [ ] No critical issues
5. [ ] No serious issues
6. [ ] Document any moderate issues

### Screen Reader Test (Optional)
- [ ] Enable screen reader (NVDA/JAWS/VoiceOver)
- [ ] Navigate home page
- [ ] Verify content announced properly
- [ ] Images have alt text announced

---

## 10. Cross-Browser Test 🌐

### Desktop Browsers
- [ ] **Chrome** (latest) - Primary test
- [ ] **Firefox** (latest) - Verify CSS compatibility
- [ ] **Safari** (latest, Mac) - WebKit differences
- [ ] **Edge** (latest) - Chromium-based

**For each browser:**
- Site loads correctly
- Styles applied
- Animations work
- No console errors

### Mobile Browsers
- [ ] **iOS Safari** - iPhone/iPad
- [ ] **Chrome Mobile** - Android

---

## 11. Console Error Check 🐛

### Check Each Page Type
1. **Home page** - Open console, check for errors
2. **Lessons hub** - Check console
3. **Individual lesson** - Check console
4. **Case studies hub** - Check console
5. **Individual case study** - Check console
6. **About page** - Check console

**Document Any Errors:**
- Page: ______________
- Error: ______________
- Type: (404, JS error, etc.)

---

## 12. URL and Meta Tags Test 🔍

### URL Structure
- [ ] Home: `/big-wins-microsite/`
- [ ] Lessons hub: `/big-wins-microsite/lessons`
- [ ] Individual lesson: `/big-wins-microsite/lessons/public-engagement`
- [ ] Case studies hub: `/big-wins-microsite/case-studies`
- [ ] Individual case study: `/big-wins-microsite/case-studies/moving-to-opportunity`

### Meta Tags (View Page Source)
- [ ] `<title>` tag present and descriptive
- [ ] Meta description present
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter Card tags present

---

## 13. Social Sharing Test 🔗

### Share on Social Media (Optional)
1. Copy URL: https://michael-149.github.io/big-wins-microsite/
2. Paste in social media post (Twitter, LinkedIn, Facebook)
3. [ ] Preview card displays with title
4. [ ] Preview card shows description
5. [ ] Preview card shows image (if configured)

---

## Issues to Report

If you encounter any issues, note:

**Issue Template:**
```
Page: [URL or page name]
Issue: [Description of problem]
Expected: [What should happen]
Actual: [What actually happened]
Browser: [Chrome/Firefox/Safari/etc.]
Device: [Desktop/Mobile/Tablet]
Screenshot: [If applicable]
```

---

## Sign-Off Checklist ✅

After completing all tests above:

- [ ] All critical functionality works
- [ ] No blocking errors or issues
- [ ] Performance meets targets (90+ Lighthouse)
- [ ] Accessibility compliant (WCAG AA)
- [ ] Responsive design works on all viewports
- [ ] All links functional (internal and external)
- [ ] Easter eggs discoverable and working
- [ ] Content displays correctly
- [ ] Ready for public launch

---

## Quick Test (5 Minutes)

If you're short on time, do this abbreviated test:

1. [ ] Load home page → Looks good, no errors
2. [ ] Click first lesson → Opens, styled correctly
3. [ ] Click related case study → Opens, tabs work
4. [ ] Click "Play the Game" easter egg → Opens game
5. [ ] Open DevTools console → No red errors
6. [ ] Resize to mobile width → Layout adapts
7. [ ] Run Lighthouse → Scores 90+

**If all pass:** ✅ Site is working!

---

**Testing completed by:** ______________
**Date:** ______________
**Overall status:** ☐ Pass ☐ Fail (with issues noted)
