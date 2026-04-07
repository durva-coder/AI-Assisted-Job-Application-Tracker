# 🌟 Switch from OpenAI to Gemini API - Quick Guide

## Why Switch to Gemini?

| Feature | OpenAI | Gemini (Google AI Studio) |
|---------|--------|---------------------------|
| **Free Tier** | Limited quota, requires billing | ✅ 15 RPM, 1M TPM per day |
| **Credit Card** | ❌ Required | ✅ Not required |
| **Daily Limit** | Very limited on free tier | ✅ Generous free quota |
| **Setup Time** | 10+ minutes | ✅ 2 minutes |
| **Models Available** | GPT-4, GPT-3.5 | Gemini 2.0 Flash, Pro |
| **Performance** | Good | ✅ Excellent (comparable) |

## 🚀 Get Your Free Gemini API Key (2 minutes)

### Step 1: Go to Google AI Studio
Visit: **https://aistudio.google.com**

### Step 2: Sign In
- Sign in with your Google account
- Accept the terms of service

### Step 3: Create API Key
1. Click on **"Get API Key"** or go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key"** from the dialog
4. **Copy your API key** (starts with `AIza...`)

### Step 4: Add to Your Project
1. Open `backend/.env` file
2. Add or update this line:
   ```env
   GEMINI_API_KEY=AIza-your-actual-key-here
   ```
3. Save the file

### Step 5: Restart Backend
```bash
cd backend
npm run dev
```

**That's it! Your app is now using Gemini instead of OpenAI! 🎉**

---

## 📋 Available Gemini Models

The app uses **`gemini-2.0-flash`** by default (configured in `backend/src/services/openai.ts`).

### Model Options

| Model | Best For | Speed | Capability |
|-------|----------|-------|------------|
| **gemini-2.0-flash** | ✅ General use (Recommended) | Fast | Good |
| gemini-2.0-flash-lite | Cost optimization | Fastest | Standard |
| gemini-1.5-pro | Complex reasoning | Medium | Best |

### Change the Model (Optional)

Edit `backend/src/services/openai.ts`:

```typescript
// Change this line to use a different model
const GEMINI_MODEL = 'gemini-2.0-flash'; // or 'gemini-1.5-pro'
```

---

## 🔑 Gemini API Free Tier Limits

### Rate Limits (Free Tier)
- **Requests Per Minute (RPM)**: 15
- **Tokens Per Minute (TPM)**: 1,000,000
- **Requests Per Day**: Generous (varies)

### Pricing (After Free Tier)
- **Input**: $0.10 / 1M tokens
- **Output**: $0.40 / 1M tokens
- **Much cheaper than OpenAI!**

---

## ✅ Verify It's Working

### Test Job Description Parsing
1. Start your app: `npm run dev` (both frontend & backend)
2. Click **"Parse JD"** button
3. Paste any job description
4. Click **"Parse & Create Card"**
5. If it works → Gemini is configured correctly! ✅

### Test Resume Suggestions
1. Open any application
2. Click **"Generate"** or **"Regenerate"** in Resume Suggestions section
3. If suggestions appear → Gemini is working! ✅

---

## 🔧 Troubleshooting

### Error: "Invalid Gemini API key"
**Solution:**
1. Double-check your API key in `.env`
2. Make sure there are no extra spaces
3. Key should start with `AIza...`
4. Restart backend after changing `.env`

### Error: "429 Rate limit exceeded"
**Solution:**
- You've hit the rate limit (15 requests/minute)
- Wait a minute and try again
- Consider upgrading to paid tier if needed

### Error: "No response from Gemini API"
**Solution:**
1. Check your internet connection
2. Verify API key is correct
3. Check backend console for errors
4. Test API key at: https://aistudio.google.com/app/apikey

---

## 📊 Compare: OpenAI vs Gemini

### OpenAI Setup (Old)
```env
OPENAI_API_KEY=sk-very-long-key-here
```
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Model: gpt-4o-mini
```

### Gemini Setup (New) ✅
```env
GEMINI_API_KEY=AIza-your-key-here
```
```typescript
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});
// Model: gemini-2.0-flash
```

---

## 💡 Pro Tips

### 1. Keep Both API Keys (Optional)
You can have both keys in your `.env` file:
```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza-...
```

The app currently uses Gemini, but you can switch back by changing the code.

### 2. Monitor Your Usage
Check your API usage at: https://aistudio.google.com/app/apikey

### 3. Secure Your API Key
- ✅ Never commit `.env` to Git
- ✅ Use environment variables in production
- ✅ Rotate keys periodically

### 4. Upgrade When Ready
If you need higher limits:
- Visit: https://aistudio.google.com
- Upgrade to paid tier
- Get increased rate limits

---

## 🎓 Learn More About Gemini

- **Documentation**: https://ai.google.dev/docs
- **API Reference**: https://ai.google.dev/api
- **Pricing**: https://ai.google.dev/pricing
- **Get API Key**: https://aistudio.google.com/app/apikey

---

## 🚀 Quick Start Summary

1. ✅ Get API key from Google AI Studio (2 min)
2. ✅ Add to `backend/.env` as `GEMINI_API_KEY`
3. ✅ Restart backend server
4. ✅ Test by parsing a job description
5. ✅ Done! You're using Gemini! 🎉

**Total Time**: Less than 5 minutes!

---

## 📝 Migration Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Add `GEMINI_API_KEY` to `backend/.env`
- [ ] Verify code uses Gemini (already done ✅)
- [ ] Restart backend server
- [ ] Test job description parsing
- [ ] Test resume suggestions
- [ ] Remove OpenAI key (optional)
- [ ] Update deployment environment variables

---

**Need help?** Check the troubleshooting section above or review the error messages in the backend console.

**Status**: ✅ Ready to use - Just add your Gemini API key!
