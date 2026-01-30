# 🔐 GitHub Deployment Guide

## ⚠️ IMPORTANT: Protecting Your API Keys

### What Gets Uploaded to GitHub:

✅ **SAFE to upload:**
- `.env.example` - Template with placeholders
- All source code files
- Database schema files
- Documentation

❌ **NEVER upload:**
- `.env` - Contains your real API keys
- Any file with actual credentials

---

## 📋 Steps to Upload to GitHub

### 1. Verify `.gitignore` is Protecting `.env`

✅ I've already added `.env` to your `.gitignore` file.

Check it's there:
```bash
cat .gitignore | grep "^.env$"
```

### 2. Check What Will Be Committed

Before pushing to GitHub, verify `.env` is NOT in the list:

```bash
git status
```

**Expected:** You should NOT see `.env` in the list.

### 3. Commit and Push

```bash
git add .
git commit -m "Added AI skin analysis features with Gemini integration"
git push origin main
```

---

## 🔄 How Others Will Use Your Code

When someone clones your repository:

### Step 1: They clone the repo
```bash
git clone https://github.com/your-username/glow-ai.git
cd glow-ai
```

### Step 2: They copy `.env.example` to `.env`
```bash
cp .env.example .env
```

### Step 3: They add their own API keys
```bash
# Edit .env and replace placeholders:
EXPO_PUBLIC_GEMINI_API_KEY=their_actual_key_here
```

### Step 4: They run the app
```bash
npm install
npm start
```

---

## 🚀 For Production Deployment

If you deploy to a hosting service (like Vercel, Netlify, or Expo EAS):

### Option 1: Expo EAS (Recommended for React Native)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure secrets:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your_key_here
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your_url_here
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your_key_here
```

3. Build:
```bash
eas build --platform android
```

### Option 2: Environment Variables in CI/CD

Most platforms (GitHub Actions, etc.) allow you to set environment variables in their dashboard:

- Go to Settings → Secrets
- Add each variable:
  - `EXPO_PUBLIC_GEMINI_API_KEY`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ Security Checklist

Before pushing to GitHub:

- [x] `.env` is in `.gitignore`
- [x] `.env.example` exists with placeholders
- [x] Run `git status` to verify `.env` is NOT tracked
- [ ] Never share your actual `.env` file
- [ ] Rotate API keys if accidentally committed

---

## 🆘 If You Accidentally Committed `.env`

**Don't panic!** Here's how to fix it:

### Step 1: Remove from Git history
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

### Step 2: Rotate your API keys
1. Go to Google AI Studio: https://ai.google.dev/
2. Delete the old API key
3. Create a new API key
4. Update your local `.env` with the new key

### Step 3: Update Supabase keys (if exposed)
1. Go to Supabase Dashboard
2. Settings → API
3. Reset your anon key

---

## 📝 Summary

**Your workflow:**
1. ✅ `.env` stays on your local machine (protected by `.gitignore`)
2. ✅ `.env.example` goes to GitHub (safe template)
3. ✅ Others copy `.env.example` → `.env` and add their own keys
4. ✅ Production uses environment variables from hosting platform

**Your API keys are safe!** 🔐
