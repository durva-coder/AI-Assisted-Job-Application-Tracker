# Quick Start Deployment Guide

Get your AI Job Tracker deployed to production in under 30 minutes using free tiers.

## 🎯 Recommended Stack (All Free)

- **Database**: MongoDB Atlas (512MB free)
- **Backend**: Render Free Tier
- **Frontend**: Vercel Free Tier
- **Total Cost**: $0/month

---

## Step 1: Set Up MongoDB Atlas (5 minutes)

### Create Account & Cluster
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Click "Build a Database"
4. Choose **M0 FREE** (Shared, 512MB)
5. Click "Create"

### Configure Security
1. **Create Database User**:
   - Click "Database Access" in left sidebar
   - Click "+ ADD NEW DATABASE USER"
   - Choose "Password" authentication
   - Set username: `jobtracker`
   - Click "Autogenerate Secure Password" and **copy it**
   - Set permissions: "Read and write to any database"
   - Click "Add User"

2. **Allow Access from Anywhere**:
   - Click "Network Access" in left sidebar
   - Click "+ ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - Click "Confirm"

### Get Connection String
1. Click "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://jobtracker:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Replace `<password>` with the password you copied
5. Add database name: `/job-tracker`
   
   Final format:
   ```
   mongodb+srv://jobtracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/job-tracker?retryWrites=true&w=majority&appName=Cluster0
   ```

**✅ Save this connection string - you'll need it next!**

---

## Step 2: Deploy Backend to Render (10 minutes)

### Prepare Your Code
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Create Render Account
1. Go to https://render.com
2. Click "Get Started" → Sign up with GitHub

### Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `job-tracker-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

4. Click "Advanced" and add these environment variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | Generate a random 64-character string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `OPENAI_API_KEY` | Your OpenAI key (optional) |
   | `FRONTEND_URL` | `https://localhost` (we'll update this later) |

   **Generate JWT Secret**:
   ```bash
   # On Linux/Mac
   openssl rand -base64 64
   
   # Or use: https://generate-secret.vercel.app/64
   ```

5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. Copy your backend URL (e.g., `https://job-tracker-api.onrender.com`)

**✅ Backend is now live!**

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Answer prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Choose your account**
   - Link to existing project? **No**
   - Project name: `job-tracker-app`
   - Directory: `./frontend`
   - Override settings? **No**

5. Add environment variable:
   ```bash
   vercel env add VITE_API_URL production
   ```
   Enter your backend URL from Step 2: `https://your-backend.onrender.com/api`

6. Deploy to production:
   ```bash
   vercel --prod
   ```

7. Copy your frontend URL (e.g., `https://job-tracker-app.vercel.app`)

**✅ Frontend is now live!**

---

## Step 4: Update CORS (2 minutes)

1. Go to Render Dashboard → Your backend service
2. Click "Environment" tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   https://job-tracker-app.vercel.app
   ```
4. Click "Save Changes"
5. Render will automatically redeploy

**✅ CORS is configured!**

---

## Step 5: Test Your App (3 minutes)

1. Visit your frontend URL
2. Create a new account
3. Add a test application
4. Verify it appears on the Kanban board
5. Test drag-and-drop
6. Test the dashboard stats

**🎉 Congratulations! Your app is live!**

---

## 📊 What You Just Deployed

| Component | URL | Cost |
|-----------|-----|------|
| Frontend | https://your-app.vercel.app | Free |
| Backend API | https://your-api.onrender.com | Free |
| Database | MongoDB Atlas Cluster | Free (512MB) |
| **Total** | | **$0/month** |

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend URL ends with `/api`
- Check browser console for CORS errors

### Backend won't start
- Check Render logs for error messages
- Verify `MONGODB_URI` is correct (test it locally first)
- Ensure all environment variables are set

### MongoDB connection fails
- Verify password doesn't contain special characters (or URL-encode them)
- Check Network Access allows 0.0.0.0/0
- Test connection string locally: `mongosh "your-connection-string"`

### CORS errors
- `FRONTEND_URL` must exactly match your frontend domain
- No trailing slash: `https://example.com` NOT `https://example.com/`
- Redeploy backend after changing CORS settings

---

## 🚀 Next Steps

### Scale When Ready
- **Render**: Upgrade to Starter ($7/mo) for always-on service
- **MongoDB**: Upgrade to M10 ($57/mo) for more storage
- **Vercel**: Free tier handles 100GB bandwidth

### Add Custom Domain
1. Buy domain from Namecheap (~$10/year)
2. In Vercel: Settings → Domains → Add your domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Render to your custom domain

### Monitor Your App
- **Uptime**: Set up UptimeRobot (free) to monitor both frontend and backend
- **Errors**: Add Sentry.io (free tier) for error tracking
- **Analytics**: Add Google Analytics or Plausible

### Backup Strategy
- Export MongoDB data weekly
- Keep GitHub repository up to date
- Document your deployment process

---

## 📚 Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Full Deployment Guide](./DEPLOYMENT.md) - More detailed options and configurations

---

## 💡 Pro Tips

1. **Free Tier Limitations**:
   - Render free tier spins down after 15 min of inactivity (first request takes ~30s)
   - MongoDB Atlas free tier has 512MB storage limit
   - Vercel free tier has 100GB bandwidth limit

2. **Keep It Free**:
   - Monitor MongoDB storage usage
   - Delete old test applications
   - Use Render's free tier for hobby projects

3. **Security Best Practices**:
   - Never commit `.env` files to Git
   - Rotate JWT_SECRET every few months
   - Enable MongoDB Atlas backup
   - Use HTTPS everywhere (automatic on Vercel/Render)

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more deployment options and troubleshooting.
