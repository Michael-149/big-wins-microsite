# Deployment Guide: Big Wins Microsite to GitHub Pages

## Pre-Deployment Checklist

Before deploying to GitHub Pages, ensure you've completed these verification steps:

### ✅ Build Verification
- [ ] Run `npm run build` successfully
- [ ] Verify `out/` directory is created with 22 HTML files
- [ ] Check that all assets are in `out/_next/` directory
- [ ] Verify images are in `out/big-wins-microsite/images/`

### ✅ Link Verification
- [ ] All internal links work (lessons ↔ case studies)
- [ ] External links open in new tabs (Stanford Impact Labs, game easter egg)
- [ ] Breadcrumbs navigate correctly
- [ ] Prev/Next navigation works on lesson and case study pages

### ✅ Content Quality
- [ ] All 8 lessons display correctly
- [ ] All 8 case studies display correctly
- [ ] No typos or formatting issues
- [ ] Citations and sources are accurate
- [ ] Hero metrics display prominently on case studies

### ✅ Performance Testing
Run Lighthouse audit in Chrome DevTools:
1. Open site in Chrome (localhost:3000 or production URL)
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Run audit in "Desktop" and "Mobile" modes
5. Target scores: 90+ for all categories

**Expected Results:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### ✅ Accessibility Testing
Using Chrome DevTools or axe DevTools:
- [ ] No critical accessibility errors
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements keyboard accessible (Tab, Enter)
- [ ] Focus states visible with teal outline
- [ ] Animations respect `prefers-reduced-motion`

### ✅ Keyboard Navigation
Test these flows with keyboard only:
- [ ] Tab through header navigation
- [ ] Navigate lesson sidebar with Tab/Enter
- [ ] Switch case study tabs with Tab/Enter
- [ ] Use Prev/Next navigation at bottom of pages
- [ ] Activate "Back to Top" button
- [ ] All links reachable and activatable

### ✅ Responsive Design
Test on these viewports:
- [ ] Mobile (375px) - iPhone SE
- [ ] Tablet (768px) - iPad
- [ ] Desktop (1024px) - Standard laptop
- [ ] Wide (1440px+) - Large desktop

Verify:
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately
- [ ] Navigation collapses to mobile menu on small screens
- [ ] Case study tabs become accordion on mobile
- [ ] Cards stack properly on narrow viewports

---

## Deployment to GitHub Pages

### Option 1: Manual Deployment (Recommended for First Deploy)

```bash
# 1. Build the site
cd big-wins-microsite
npm run build

# 2. Verify build succeeded
ls -la out/

# 3. Initialize git in out directory (if not already done)
cd out
git init
git add -A
git commit -m "Deploy Big Wins Microsite to GitHub Pages"

# 4. Push to gh-pages branch
git remote add origin https://github.com/Michael-149/big-wins-microsite.git
git push -f origin HEAD:gh-pages

# 5. Return to project root
cd ..
```

### Option 2: Using gh-pages Package

```bash
# 1. Install gh-pages globally (one-time)
npm install -g gh-pages

# 2. Build the site
npm run build

# 3. Deploy to gh-pages branch
gh-pages -d out

# Alternative: Add to package.json scripts
# "deploy": "npm run build && gh-pages -d out"
# Then run: npm run deploy
```

### Option 3: Using Git Subtree (Alternative Method)

```bash
# 1. Build the site
npm run build

# 2. Add out directory to git (temporarily)
git add out -f

# 3. Commit the out directory
git commit -m "Build for deployment"

# 4. Push out/ directory to gh-pages branch
git subtree push --prefix out origin gh-pages

# 5. Remove out from tracking
git reset HEAD~1
```

---

## GitHub Pages Configuration

### Repository Settings

1. Go to repository: https://github.com/Michael-149/big-wins-microsite
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`
4. Click **Save**

### Custom Domain (Optional)

If using a custom domain:
1. Add CNAME record in DNS:
   ```
   CNAME bigwins.stanford.edu michael-149.github.io
   ```
2. In GitHub Pages settings, add custom domain: `bigwins.stanford.edu`
3. Enable "Enforce HTTPS"
4. Update `metadataBase` in `app/layout.tsx` to match custom domain

### Verify Deployment

After deploying, the site will be available at:
- **Default:** https://michael-149.github.io/big-wins-microsite/
- **Custom:** https://bigwins.stanford.edu (if configured)

---

## Post-Deployment Testing

### 1. Verify Site Loads
- [ ] Visit the live URL
- [ ] Check that styles load correctly
- [ ] Verify images display (logo, icons)
- [ ] Test on mobile device

### 2. Test Navigation
- [ ] Click through all 8 lessons
- [ ] Click through all 8 case studies
- [ ] Test all header navigation links
- [ ] Test footer links (Stanford, About, Game)
- [ ] Verify easter egg game link opens correctly

### 3. Test Case Study Tabs
- [ ] On desktop: tabs switch correctly
- [ ] On mobile: accordion expands/collapses
- [ ] URL hash updates when clicking tabs
- [ ] Browser back/forward buttons work with tabs

### 4. Test External Links
- [ ] Stanford Impact Labs link opens: https://impact.stanford.edu/
- [ ] Easter egg game link opens: https://michael-149.github.io/big-wins/
- [ ] All citation links in case studies work
- [ ] All links open in new tabs (target="_blank")

### 5. Performance Check
Run Lighthouse on production URL:
```bash
# Using Chrome DevTools Lighthouse
# Or using CLI:
npm install -g lighthouse
lighthouse https://michael-149.github.io/big-wins-microsite/ --view
```

---

## Troubleshooting

### Images Not Loading
**Problem:** Images show broken or don't display

**Solution:**
1. Check `next.config.js` has correct basePath: `/big-wins-microsite`
2. Verify images use full path: `/big-wins-microsite/images/filename.png`
3. Ensure `images.unoptimized: true` in next.config.js
4. Rebuild: `npm run build`

### 404 Errors on Page Refresh
**Problem:** Direct navigation to /lessons/slug returns 404

**Solution:**
GitHub Pages serves static files. This is expected behavior. Users should:
- Navigate from home page, not bookmark deep links
- Or configure custom 404.html to redirect (advanced)

### Styles Not Loading
**Problem:** Site loads but has no styling

**Solution:**
1. Check browser console for CSS errors
2. Verify assetPrefix in next.config.js: `/big-wins-microsite`
3. Clear browser cache (Ctrl+Shift+R)
4. Rebuild and redeploy

### Build Fails
**Problem:** `npm run build` throws errors

**Solution:**
1. Check for TypeScript errors: `npm run lint`
2. Verify all content files have valid YAML frontmatter
3. Check for missing images referenced in content
4. Clear cache: `rm -rf .next && npm run build`

---

## Updating Content After Deployment

### Editing Lessons or Case Studies

1. Edit markdown file in `content/lessons/` or `content/case-studies/`
2. Test locally: `npm run dev`
3. Rebuild: `npm run build`
4. Redeploy using one of the methods above

### Adding New Lesson or Case Study

1. Create new markdown file with proper frontmatter
2. Update slug mappings in `lib/constants.ts` if needed
3. Add to relatedCaseStudies or lessonsExemplified arrays
4. Test locally, then rebuild and redeploy

---

## GitHub Actions (Future Enhancement)

For automated deployments, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd big-wins-microsite
          npm install

      - name: Build
        run: |
          cd big-wins-microsite
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./big-wins-microsite/out
```

---

## Monitoring & Maintenance

### Regular Checks
- **Weekly:** Check site loads correctly
- **Monthly:** Run Lighthouse audit, verify scores remain 90+
- **Quarterly:** Update dependencies: `npm update`
- **As needed:** Update content when new research published

### Analytics (Optional)
Consider adding Google Analytics or Plausible for:
- Page view tracking
- Most visited lessons/case studies
- User engagement metrics
- Geographic distribution

---

## Support & Resources

- **Documentation:** See README.md and CLAUDE.md
- **GitHub Issues:** Report problems at https://github.com/Michael-149/big-wins-microsite/issues
- **Stanford Impact Labs:** https://impact.stanford.edu/

---

**Last Updated:** January 19, 2026
**Deployment Target:** GitHub Pages
**Production URL:** https://michael-149.github.io/big-wins-microsite/
