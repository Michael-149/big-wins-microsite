# Manual Deployment Instructions

## Quick Deploy (Recommended)

### Using the Deploy Script

**On Windows:**
```bash
cd big-wins-microsite
deploy.bat
```

**On Mac/Linux:**
```bash
cd big-wins-microsite
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Build the production site (`npm run build`)
2. Install gh-pages if needed
3. Deploy to GitHub Pages
4. Show deployment URL

---

## Manual Deployment Steps

If the automated script doesn't work, follow these steps:

### Step 1: Build the Site

```bash
cd big-wins-microsite
npm run build
```

**Verify build succeeded:**
```bash
ls out/
# Should show: index.html, lessons/, case-studies/, _next/, etc.
```

### Step 2: Install gh-pages (if not already installed)

```bash
npm install -g gh-pages
```

### Step 3: Deploy

```bash
gh-pages -d out
```

This command will:
- Create/update the `gh-pages` branch in your repository
- Push the contents of `out/` directory to that branch
- Your site will be live in 1-2 minutes

### Step 4: Configure GitHub Pages

1. Go to: https://github.com/Michael-149/big-wins-microsite/settings/pages
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **/ (root)**
3. Click **Save**
4. Wait 1-2 minutes for deployment

### Step 5: Verify Deployment

Visit: https://michael-149.github.io/big-wins-microsite/

---

## Alternative Method 1: Manual Git Push

```bash
# 1. Build
npm run build

# 2. Navigate to out directory
cd out

# 3. Initialize git
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# 4. Push to gh-pages branch
git remote add origin https://github.com/Michael-149/big-wins-microsite.git
git push -f origin HEAD:gh-pages

# 5. Go back to project root
cd ..
```

---

## Alternative Method 2: Git Subtree

```bash
# 1. Build
npm run build

# 2. Add out to git (temporarily)
git add out -f

# 3. Commit
git commit -m "Build for deployment"

# 4. Push out/ to gh-pages
git subtree push --prefix out origin gh-pages

# 5. Reset (remove out from tracking)
git reset HEAD~1
```

---

## Troubleshooting

### Build Not Creating out/ Directory

**Problem:** `npm run build` completes but no `out/` directory

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check for errors
npm run build 2>&1 | tee build-log.txt
cat build-log.txt
```

### gh-pages Command Not Found

**Problem:** `gh-pages: command not found`

**Solution:**
```bash
# Install globally
npm install -g gh-pages

# Or use npx
npx gh-pages -d out
```

### Permission Denied

**Problem:** `Error: spawn git EACCES` or permission errors

**Solution:**
```bash
# On Mac/Linux
chmod +x deploy.sh

# On Windows
# Run Command Prompt as Administrator
```

### GitHub Authentication

**Problem:** Git push asks for credentials

**Solution:**
```bash
# Configure git credentials
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Set up SSH or Personal Access Token
# See: https://docs.github.com/en/authentication
```

### Deployment Succeeds but Site Shows 404

**Checklist:**
1. Verify GitHub Pages is enabled in repository settings
2. Confirm source is set to `gh-pages` branch
3. Wait 2-3 minutes for GitHub Pages to update
4. Check repository is public (or GitHub Pro for private repos)
5. Verify `next.config.js` has correct `basePath`

---

## Post-Deployment Verification

### 1. Check Site Loads
- Visit: https://michael-149.github.io/big-wins-microsite/
- Should show home page with 8 lesson cards
- No blank page or errors

### 2. Check Styles
- Site should have colors (teal, black, red)
- Stanford Impact Labs logo visible in header
- Proper fonts (Inter)
- No Flash of Unstyled Content (FOUC)

### 3. Check Images
- Header logo loads
- Footer logo loads
- Any case study images load

### 4. Quick Navigation Test
- Click "Lessons" in header
- Click any lesson card
- Verify lesson page loads with content
- Click "Case Studies"
- Click any case study
- Verify tabs work (desktop) or accordion (mobile)

### 5. Check Console
- Open Browser DevTools (F12)
- Go to Console tab
- Should have no red errors
- Some warnings are OK

---

## GitHub Pages Configuration

### Repository Settings

**Location:** https://github.com/Michael-149/big-wins-microsite/settings/pages

**Required Settings:**
- **Source:** Deploy from a branch
- **Branch:** gh-pages
- **Directory:** / (root)
- **Custom domain:** (optional) Leave blank unless using custom domain

### Build Status

After deployment, GitHub will show:
- ✅ "Your site is live at https://michael-149.github.io/big-wins-microsite/"
- Last deployed timestamp
- Build duration

---

## Updating After Initial Deployment

### For Content Changes

```bash
# 1. Edit markdown files in content/
# 2. Test locally
npm run dev

# 3. Rebuild and redeploy
npm run build
gh-pages -d out
```

### For Code Changes

```bash
# 1. Make changes to components/app files
# 2. Test locally
npm run dev

# 3. Commit to main branch
git add .
git commit -m "Description of changes"
git push origin main

# 4. Rebuild and redeploy
npm run build
gh-pages -d out
```

---

## Automated Deployment (Future)

Consider setting up GitHub Actions for automatic deployment on push to main:

**.github/workflows/deploy.yml**
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

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install and Build
        run: |
          cd big-wins-microsite
          npm install
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./big-wins-microsite/out
```

---

## Support

If deployment fails after trying these methods:

1. Check build logs for specific errors
2. Verify `next.config.js` configuration
3. Ensure Node.js version is 18+
4. Try clearing cache: `rm -rf .next node_modules`
5. Reinstall: `npm install`
6. Rebuild: `npm run build`

For GitHub-specific issues:
- Check: https://docs.github.com/en/pages
- Verify repository is public or has GitHub Pro

---

**Quick Reference:**
- **Build:** `npm run build`
- **Deploy:** `gh-pages -d out`
- **URL:** https://michael-149.github.io/big-wins-microsite/
- **Settings:** https://github.com/Michael-149/big-wins-microsite/settings/pages
