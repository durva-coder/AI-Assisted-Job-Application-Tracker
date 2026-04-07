@echo off
REM ============================================
REM AI Job Tracker - Deployment Setup Script (Windows)
REM ============================================

echo.
echo ============================================
echo AI Job Tracker - Deployment Setup
echo ============================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Git repository not found. Initializing...
    git init
    git add .
    git commit -m "Initial commit - AI Job Tracker"
    echo [OK] Git repository initialized
    echo.
)

REM Check if remote is set
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo [!] No GitHub remote found. Add one with:
    echo     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo.
)

REM Create .env files from examples if they don't exist
echo Checking environment files...

if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy backend\.env.example backend\.env
        echo [OK] Created backend\.env from example
        echo [!] Remember to update backend\.env with your actual values
    )
)

if not exist "frontend\.env" (
    echo VITE_API_URL=http://localhost:5000/api > frontend\.env
    echo [OK] Created frontend\.env
)

echo.
echo Docker Setup
echo ===============
echo.

where docker >nul 2>&1
if errorlevel 1 (
    echo [!] Docker not found. Install Docker to use docker-compose
    echo     Download from: https://www.docker.com/products/docker-desktop
) else (
    where docker-compose >nul 2>&1
    if errorlevel 1 (
        echo [!] Docker Compose not found
    ) else (
        echo [OK] Docker and Docker Compose are installed
        echo.
        echo To start with Docker, run:
        echo     docker-compose up -d
    )
)

echo.
echo Cloud Deployment Options
echo =============================
echo.
echo Quick Start (30 minutes):
echo   1. MongoDB Atlas (Free) - https://mongodb.com/cloud/atlas
echo   2. Render Backend (Free) - https://render.com
echo   3. Vercel Frontend (Free) - https://vercel.com
echo.
echo See QUICK-START.md for step-by-step guide
echo See DEPLOYMENT.md for detailed instructions
echo.

echo Security Checklist
echo =============================
echo.
echo Before deploying to production:
echo   [ ] Update JWT_SECRET with a strong random value
echo   [ ] Never commit .env files to Git
echo   [ ] Use MongoDB Atlas with authentication
echo   [ ] Set FRONTEND_URL to your actual domain
echo   [ ] Add OpenAI API key (optional)
echo.

echo Next Steps
echo ===============
echo.
echo 1. Update backend\.env with your MongoDB connection string
echo 2. Push your code to GitHub
echo 3. Follow QUICK-START.md for deployment
echo.
echo Need help? Check these files:
echo   - QUICK-START.md    (30-minute deployment guide)
echo   - DEPLOYMENT.md     (Comprehensive deployment guide)
echo   - README.md         (Project documentation)
echo.
echo Happy deploying!
echo.
