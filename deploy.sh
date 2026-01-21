#!/bin/bash
# Deployment script for Big Wins Microsite to GitHub Pages

echo "🚀 Starting deployment to GitHub Pages..."
echo ""

# Step 1: Build the site
echo "📦 Step 1: Building production site..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

# Step 2: Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ Error: 'out' directory not found. Build may have failed."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 3: Deploy using gh-pages
echo "🌐 Step 2: Deploying to GitHub Pages..."
echo ""

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages package..."
    npm install -g gh-pages
fi

# Deploy
gh-pages -d out

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌍 Your site will be available at:"
    echo "   https://michael-149.github.io/big-wins-microsite/"
    echo ""
    echo "⏰ Note: It may take 1-2 minutes for GitHub Pages to update."
    echo ""
    echo "📋 Next steps:"
    echo "   1. Configure GitHub Pages in repository settings"
    echo "   2. Set source to 'gh-pages' branch"
    echo "   3. Visit your site to verify deployment"
else
    echo "❌ Deployment failed!"
    exit 1
fi
