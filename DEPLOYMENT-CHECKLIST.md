# 🖨️ Deployment Checklist (Print-Friendly)

## Pre-Deployment Preparation

### Database Setup
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create M0 Free cluster
- [ ] Create database user with username and password
- [ ] Save the database password
- [ ] Configure Network Access (add 0.0.0.0/0 or specific IPs)
- [ ] Copy connection string
- [ ] Test connection string format (URL-encode special characters)
- [ ] Connection string: `mongodb+srv://user:pass@cluster.mongodb.net/job-tracker`

### Backend Configuration
- [ ] Generate JWT_SECRET (minimum 32 characters, recommended 64+)
  - Linux/Mac: `openssl rand -base64 64`
  - Online: https://generate-secret.vercel.app/64
- [ ] Get OpenAI API key (optional) from https://platform.openai.com/api-keys
- [ ] Decide on deployment platform (Render recommended)
- [ ] Prepare backend environment variables

### Frontend Configuration
- [ ] Decide on frontend hosting (Vercel recommended)
- [ ] Prepare frontend environment variables
- [ ] Note backend API URL for configuration

---

## Backend Deployment (Render)

### Create Service
- [ ] Push code to GitHub
- [ ] Create Render account at https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - [ ] Name: job-tracker-api
  - [ ] Region: (choose closest to users)
  - [ ] Branch: main
  - [ ] Root Directory: backend
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: Free

### Environment Variables
- [ ] NODE_ENV = `production`
- [ ] PORT = `5000`
- [ ] MONGODB_URI = (your MongoDB connection string)
- [ ] JWT_SECRET = (your generated secret)
- [ ] JWT_EXPIRES_IN = `7d`
- [ ] OPENAI_API_KEY = (your OpenAI key, if using)
- [ ] FRONTEND_URL = `https://localhost` (update later)

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Copy backend URL: ___________________________________
- [ ] Test health endpoint: [backend-url]/api/health
- [ ] Verify response: `{"status":"ok"}`

---

## Frontend Deployment (Vercel)

### Setup
- [ ] Create Vercel account at https://vercel.com
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Navigate to frontend directory: `cd frontend`

### Deploy
- [ ] Run: `vercel`
- [ ] Answer prompts:
  - [ ] Set up and deploy? Yes
  - [ ] Which scope? (your account)
  - [ ] Link to existing project? No
  - [ ] Project name: job-tracker-app
  - [ ] Directory: ./frontend
  - [ ] Override settings? No

### Environment Variables
- [ ] Add VITE_API_URL = (backend URL)/api
  - Example: `https://job-tracker-api.onrender.com/api`
- [ ] Run: `vercel env add VITE_API_URL production`
- [ ] Enter backend API URL

### Production Deploy
- [ ] Run: `vercel --prod`
- [ ] Copy frontend URL: ___________________________________
- [ ] Test frontend loads correctly

---

## CORS Configuration

### Update Backend
- [ ] Go to Render Dashboard → Backend service → Environment
- [ ] Update FRONTEND_URL to frontend URL
  - Example: `https://job-tracker-app.vercel.app`
  - NO trailing slash
  - Include https://
- [ ] Click "Save Changes"
- [ ] Wait for redeployment

---

## Testing

### Basic Functionality
- [ ] Visit frontend URL
- [ ] Create new account (registration)
- [ ] Login with credentials
- [ ] Add new application
- [ ] Verify application appears on Kanban board
- [ ] Drag and drop application to different column
- [ ] Edit application details
- [ ] Delete application
- [ ] Logout and login again
- [ ] Verify data persists

### Dashboard
- [ ] Navigate to Dashboard page
- [ ] Verify statistics are correct
- [ ] Test Export CSV button
- [ ] Test Search functionality
- [ ] Test Filter functionality

### AI Features (if OpenAI key configured)
- [ ] Click "Parse JD" button
- [ ] Paste job description
- [ ] Click "Parse & Create Card"
- [ ] Verify fields are populated
- [ ] Open application
- [ ] Click "Generate Suggestions"
- [ ] Verify resume suggestions appear

### Browser Console
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Verify NO CORS errors
- [ ] Check Network tab for failed requests
- [ ] All API requests should return 200/201 status

---

## Security Verification

- [ ] JWT_SECRET is strong (64+ characters)
- [ ] .env files are NOT in Git repository
  - Check: `git ls-files | grep .env` (should return nothing)
- [ ] MongoDB has authentication enabled
- [ ] HTTPS is enabled on all domains
- [ ] CORS is configured with specific origins (not *)
- [ ] API keys are not exposed in frontend code

---

## Monitoring Setup (Recommended)

### Uptime Monitoring
- [ ] Create UptimeRobot account at https://uptimerobot.com
- [ ] Add monitor for frontend URL
- [ ] Add monitor for backend URL
- [ ] Set check interval to 5 minutes
- [ ] Configure email alerts

### Error Tracking (Optional)
- [ ] Create Sentry account at https://sentry.io
- [ ] Create new project
- [ ] Add Sentry SDK to frontend
- [ ] Add Sentry SDK to backend
- [ ] Test error capture

### Analytics (Optional)
- [ ] Set up Google Analytics or Plausible
- [ ] Add tracking code to frontend
- [ ] Verify tracking works

---

## Documentation

- [ ] Bookmark DEPLOYMENT.md for detailed reference
- [ ] Bookmark QUICK-START.md for quick help
- [ ] Save MongoDB connection string securely
- [ ] Save all environment variables securely
- [ ] Document custom domain DNS changes (if applicable)

---

## Post-Deployment

### Week 1
- [ ] Monitor error logs daily
- [ ] Check MongoDB storage usage
- [ ] Verify all features work correctly
- [ ] Gather user feedback

### Month 1
- [ ] Review MongoDB storage usage (keep under 512MB for free tier)
- [ ] Check bandwidth usage on Vercel (keep under 100GB for free tier)
- [ ] Review error logs
- [ ] Update dependencies if needed
- [ ] Delete test/dummy applications

### Ongoing
- [ ] Monitor storage usage weekly
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate JWT_SECRET every 3-6 months
- [ ] Backup MongoDB data monthly

---

## URLs & Credentials (Keep Secure!)

```
Frontend URL: ___________________________________
Backend URL: ___________________________________
MongoDB Cluster: ___________________________________
MongoDB Username: ___________________________________
MongoDB Password: ___________________________________
JWT Secret: ___________________________________
OpenAI API Key: ___________________________________
Render Dashboard: ___________________________________
Vercel Dashboard: ___________________________________
```

**⚠️ NEVER share these credentials publicly!**

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| CORS Error | Update FRONTEND_URL in Render, redeploy |
| MongoDB Connection Failed | Check connection string, verify Network Access |
| Backend Won't Start | Check Render logs, verify all env vars |
| Frontend Can't Connect | Verify VITE_API_URL, rebuild frontend |
| 401 Unauthorized | Check JWT_SECRET is correct |
| 500 Server Error | Check backend logs, verify MongoDB connection |

---

## Support Resources

- **Project Docs**: DEPLOYMENT.md, QUICK-START.md
- **MongoDB**: https://www.mongodb.com/docs/atlas/
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Community**: MongoDB Forums, Render Community

---

**Deployment Date**: ___________________________________

**Deployed By**: ___________________________________

**Status**: ⏳ In Progress | ✅ Complete | ❌ Issues Found

**Notes**: _________________________________________________

---

*Print this checklist and check off each item as you complete it.*
*Keep a copy for your records.*
