#!/bin/bash

# ============================================
# AI Job Tracker - Deployment Setup Script
# ============================================

echo "🚀 AI Job Tracker - Deployment Setup"
echo "====================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 Git repository not found. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit - AI Job Tracker"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

# Check if remote is set
if ! git remote | grep -q "origin"; then
    echo ""
    echo -e "${YELLOW}🔗 No GitHub remote found. Add one with:${NC}"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
fi

# Create .env files from examples if they don't exist
echo "📝 Checking environment files..."

if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env from example${NC}"
        echo -e "${YELLOW}⚠️  Remember to update backend/.env with your actual values${NC}"
    fi
fi

if [ ! -f "frontend/.env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
fi

echo ""
echo "🐳 Docker Setup"
echo "==============="
echo ""

if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
    echo ""
    echo "To start with Docker, run:"
    echo "  docker-compose up -d"
    echo ""
else
    echo -e "${YELLOW}⚠️  Docker not found. Install Docker to use docker-compose${NC}"
    echo "Download from: https://www.docker.com/products/docker-desktop"
    echo ""
fi

echo "☁️  Cloud Deployment Options"
echo "============================="
echo ""
echo "Quick Start (30 minutes):"
echo "  1. MongoDB Atlas (Free) - https://mongodb.com/cloud/atlas"
echo "  2. Render Backend (Free) - https://render.com"
echo "  3. Vercel Frontend (Free) - https://vercel.com"
echo ""
echo "See QUICK-START.md for step-by-step guide"
echo "See DEPLOYMENT.md for detailed instructions"
echo ""

echo "🔒 Security Checklist"
echo "====================="
echo ""
echo "Before deploying to production:"
echo "  ☐ Update JWT_SECRET with a strong random value"
echo "  ☐ Never commit .env files to Git"
echo "  ☐ Use MongoDB Atlas with authentication"
echo "  ☐ Set FRONTEND_URL to your actual domain"
echo "  ☐ Add OpenAI API key (optional)"
echo ""

# Generate a secure JWT secret
if command -v openssl &> /dev/null; then
    echo -e "${GREEN}💡 Generate a secure JWT secret:${NC}"
    echo "openssl rand -base64 64"
    echo ""
fi

echo "📚 Next Steps"
echo "============="
echo ""
echo "1. Update backend/.env with your MongoDB connection string"
echo "2. Push your code to GitHub"
echo "3. Follow QUICK-START.md for deployment"
echo ""
echo "Need help? Check these files:"
echo "  - QUICK-START.md    (30-minute deployment guide)"
echo "  - DEPLOYMENT.md     (Comprehensive deployment guide)"
echo "  - README.md         (Project documentation)"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
