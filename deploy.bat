@echo off
REM Deployment script for Big Wins Microsite to GitHub Pages

echo.
echo 🚀 Starting deployment to GitHub Pages...
echo.

REM Step 1: Build the site
echo 📦 Step 1: Building production site...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Please fix errors and try again.
    exit /b 1
)

REM Step 2: Check if out directory exists
if not exist "out\" (
    echo ❌ Error: 'out' directory not found. Build may have failed.
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Step 3: Deploy using gh-pages
echo 🌐 Step 2: Deploying to GitHub Pages...
echo.

REM Check if gh-pages is installed globally
where gh-pages >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing gh-pages package...
    call npm install -g gh-pages
)

REM Deploy
call gh-pages -d out

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌍 Your site will be available at:
    echo    https://michael-149.github.io/big-wins-microsite/
    echo.
    echo ⏰ Note: It may take 1-2 minutes for GitHub Pages to update.
    echo.
    echo 📋 Next steps:
    echo    1. Configure GitHub Pages in repository settings
    echo    2. Set source to 'gh-pages' branch
    echo    3. Visit your site to verify deployment
) else (
    echo ❌ Deployment failed!
    exit /b 1
)
