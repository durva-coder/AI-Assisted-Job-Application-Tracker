# ==========================================
# AI-Assisted Job Application Tracker
# Deployment Guide
# ==========================================

This guide covers multiple deployment options for your job tracker application.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Deploy to Render](#deploy-to-render)
5. [Deploy to Railway](#deploy-to-railway)
6. [Deploy to Vercel (Frontend)](#deploy-to-frontend-to-vercel)
7. [Deploy to Netlify (Frontend)](#deploy-to-frontend-to-netlify)
8. [Production Checklist](#production-checklist)

---

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-tracker

# Authentication
JWT_SECRET=your-super-secret-jwt-key-use-long-random-string
JWT_EXPIRES_IN=7d

# OpenAI API (Optional)
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS - Comma-separated list of allowed origins
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend
Create `.env` in the frontend directory:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional)

### Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Access the app at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Docker Deployment

### Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Docker Commands

```bash
# Build backend image
docker build -t job-tracker-backend ./backend

# Build frontend image
docker build -t job-tracker-frontend ./frontend

# Run backend
docker run -d \
  --name backend \
  -p 5000:5000 \
  --env-file ./backend/.env \
  job-tracker-backend

# Run frontend
docker run -d \
  --name frontend \
  -p 80:80 \
  -e VITE_API_URL=https://your-backend-domain.com/api \
  job-tracker-frontend
```

---

## Deploy to Render

### Backend Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a Web Service on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: job-tracker-api
     - **Region**: Choose closest to your users
     - **Branch**: main
     - **Root Directory**: backend
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free or Starter ($7/mo)

3. **Add Environment Variables**
   In Render dashboard → Environment:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   OPENAI_API_KEY=sk-...
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

4. **Add MongoDB Atlas**
   - Create free cluster at https://www.mongodb.com/cloud/atlas
   - Get connection string and add to `MONGODB_URI`

### Frontend Deployment

1. **Create Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect your repository
   - Configure:
     - **Name**: job-tracker-app
     - **Root Directory**: frontend
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: frontend/dist

2. **Add Environment Variable**
   ```
   VITE_API_URL=https://job-tracker-api.onrender.com/api
   ```

---

## Deploy to Railway

### One-Click Deployment

1. **Visit Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Services**
   Railway will auto-detect backend and frontend.

3. **Add Variables**
   In Railway dashboard → Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=sk-...
   FRONTEND_URL=https://your-frontend.railway.app
   ```

4. **Add MongoDB**
   - Click "New" → "Database" → "Add MongoDB"
   - Copy connection string to backend variables

---

## Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   In Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

4. **Rebuild**
   ```bash
   vercel --prod
   ```

---

## Deploy Frontend to Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

---

## Production Checklist

### Security
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS for all domains
- [ ] Configure CORS with specific origins (not *)
- [ ] Keep API keys secure (never commit to Git)
- [ ] Rate limit API endpoints
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets

### Performance
- [ ] Enable caching (Redis optional)
- [ ] Use CDN for static assets
- [ ] Optimize database indexes
- [ ] Enable compression (gzip/brotli)
- [ ] Monitor memory usage

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Monitor uptime (UptimeRobot, Pingdom)
- [ ] Track API response times
- [ ] Set up alerts for critical errors

### Database
- [ ] Create MongoDB Atlas cluster
- [ ] Set up automated backups
- [ ] Create database indexes
- [ ] Monitor connection pool
- [ ] Set up replication

### Backup Strategy
- [ ] Export database regularly
- [ ] Store backups in multiple regions
- [ ] Test restoration process
- [ ] Document recovery steps

---

## MongoDB Atlas Setup

1. **Create Cluster**
   - Visit https://www.mongodb.com/cloud/atlas/register
   - Create free account
   - Create M0 Free cluster

2. **Configure Security**
   - Create database user with read/write permissions
   - Add IP whitelist (0.0.0.0/0 for all IPs, or specific IPs)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Add to `.env`: `MONGODB_URI=mongodb+srv://...`

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` matches your actual frontend domain exactly
- Check browser console for specific CORS error messages
- Verify backend is sending proper CORS headers

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes your server IP
- Check connection string format (encode special characters in password)
- Ensure database user has correct permissions

### Build Failures
- Clear build cache: `rm -rf dist node_modules`
- Reinstall dependencies: `npm install`
- Check Node.js version matches requirements

### Environment Variables Not Working
- Restart your application after changing .env
- Verify variables are set in deployment platform
- Check for typos in variable names

---

## Support

For issues or questions:
- Check the README.md in the project root
- Review backend logs: `docker-compose logs backend` or platform logs
- Review frontend logs: `docker-compose logs frontend` or browser console
