# 🚀 Production Deployment Guide - Play Store

## 🎯 The Problem

When you publish to Play Store:
- ❌ You can't put API keys in the app (users will see them)
- ❌ Users shouldn't need their own Gemini API keys
- ✅ You need a backend server to handle AI requests

---

## 🏗️ Solution: Backend API Server

### Architecture

```
User's Phone → Your Backend Server → Gemini API
                    ↑
              (Your API key stored here)
```

---

## 📋 Step-by-Step Implementation

### Step 1: Create Backend Server

I'll create a simple Node.js backend for you:

**File: `backend/server.js`**

```javascript
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini with YOUR API key (stored on server)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Analyze skin endpoint
app.post('/api/analyze-skin', async (req, res) => {
  try {
    const { imageBase64, userId } = req.body;

    // Validate request
    if (!imageBase64 || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Analyze this facial skin image and detect skin concerns.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "issues": [
    {
      "name": "Acne & Breakouts",
      "severity": 0-100,
      "confidence": 0.0-1.0,
      "detected": true/false,
      "area": "location on face"
    }
  ],
  "summary": "brief overall assessment"
}

Detect these issues:
1. Acne & Breakouts
2. Dark Spots & Hyperpigmentation
3. Fine Lines & Wrinkles
4. Oiliness
5. Redness & Inflammation
6. Uneven Texture

Use Indian skin tones as reference. Be accurate and clinical.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const responseText = result.response.text();
    
    // Clean and parse response
    let cleanedText = responseText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    
    const analysis = JSON.parse(cleanedText);

    // Log usage for tracking
    console.log(`Analysis completed for user: ${userId}`);

    res.json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Step 2: Backend Dependencies

**File: `backend/package.json`**

```json
{
  "name": "glow-ai-backend",
  "version": "1.0.0",
  "description": "Backend API for Glow AI skin analysis",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@google/generative-ai": "^0.1.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

### Step 3: Backend Environment Variables

**File: `backend/.env`**

```env
# Your Gemini API Key (stored on server, not in app)
GEMINI_API_KEY=your_actual_gemini_key_here

# Server port
PORT=3000

# Supabase (for authentication & database)
SUPABASE_URL=https://sdaozejlnkzrkidxjylf.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```

---

### Step 4: Deploy Backend (Free Options)

#### Option A: Vercel (Recommended - Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd backend
vercel
```

3. Add environment variables in Vercel dashboard
4. You get a URL like: `https://glow-ai-backend.vercel.app`

#### Option B: Railway (Free tier)

1. Go to: https://railway.app/
2. Connect your GitHub repo
3. Deploy `backend` folder
4. Add environment variables
5. Get URL: `https://your-app.railway.app`

#### Option C: Render (Free tier)

1. Go to: https://render.com/
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `npm start`

---

### Step 5: Update React Native App

**File: `src/services/ai-service.ts`**

Replace the current implementation with:

```typescript
import { imageToBase64 } from '../utils/image-utils';
import { SkinIssue, GeminiAnalysisResponse } from '../types/scan.types';

// Your backend API URL (from deployment)
const BACKEND_API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export class AIService {
  /**
   * Analyze skin image using your backend API
   */
  async analyzeSkin(imageUri: string, userId: string): Promise<GeminiAnalysisResponse> {
    try {
      // Convert image to base64
      const base64Image = await imageToBase64(imageUri);

      // Call YOUR backend (not Gemini directly)
      const response = await fetch(`${BACKEND_API_URL}/api/analyze-skin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend API error');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      return result.data;

    } catch (error) {
      console.error('Error analyzing skin:', error);
      return this.getFallbackAnalysis();
    }
  }

  // ... rest of the code stays the same
}
```

---

### Step 6: Update App Environment Variables

**File: `.env`**

```env
# Supabase (stays the same)
EXPO_PUBLIC_SUPABASE_URL=https://sdaozejlnkzrkidxjylf.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-QPUnBiXj0c1hHACmVs8Dw_uOwaKJoy

# Your Backend API URL (after deployment)
EXPO_PUBLIC_BACKEND_API_URL=https://glow-ai-backend.vercel.app

# NOTE: No Gemini key here! It's on your backend server.
```

---

## 💰 Cost Management

### With Backend Server:

**You control everything:**
- Track usage per user
- Set rate limits (e.g., 5 scans/day for free users)
- Charge premium users for unlimited scans
- Monitor costs in real-time

**Example Rate Limiting:**

```javascript
// In backend/server.js
const userScans = new Map(); // In production, use Redis

app.post('/api/analyze-skin', async (req, res) => {
  const { userId } = req.body;
  
  // Check user's scan count today
  const today = new Date().toDateString();
  const key = `${userId}-${today}`;
  const scanCount = userScans.get(key) || 0;
  
  // Free users: 5 scans/day
  if (scanCount >= 5) {
    return res.status(429).json({
      error: 'Daily limit reached. Upgrade to premium for unlimited scans.',
    });
  }
  
  // Increment counter
  userScans.set(key, scanCount + 1);
  
  // Continue with analysis...
});
```

---

## 📊 Cost Breakdown (Production)

### Monthly Costs (1,000 active users):

| Service | Cost | Notes |
|---------|------|-------|
| **Backend Hosting** | $0-5 | Vercel/Railway free tier |
| **Gemini API** | ~$10 | 4,000 scans/month |
| **Supabase** | $0-25 | Free tier or Pro |
| **Total** | **$10-40/month** | Very affordable! |

### Revenue Model:

**Free Tier:**
- 5 scans per day
- Basic analysis

**Premium ($2.99/month):**
- Unlimited scans
- Detailed remedies
- Product recommendations
- AI chat

**Break-even:** ~10-15 premium users covers all costs!

---

## 🔐 Security Benefits

With backend server:

✅ **API keys hidden** - Users can't see them
✅ **Rate limiting** - Prevent abuse
✅ **Authentication** - Only logged-in users
✅ **Usage tracking** - Monitor costs
✅ **Fraud prevention** - Block suspicious activity

---

## 🚀 Deployment Checklist

### Backend:
- [ ] Create `backend/` folder with server code
- [ ] Install dependencies: `npm install`
- [ ] Test locally: `npm run dev`
- [ ] Deploy to Vercel/Railway/Render
- [ ] Add environment variables (Gemini API key)
- [ ] Test API endpoint

### Mobile App:
- [ ] Update `ai-service.ts` to use backend API
- [ ] Add `EXPO_PUBLIC_BACKEND_API_URL` to `.env`
- [ ] Test with backend
- [ ] Build production APK: `eas build --platform android`
- [ ] Upload to Play Store

---

## 📝 Summary

**For Play Store:**

1. ✅ Create backend server (Node.js + Express)
2. ✅ Store YOUR API key on backend
3. ✅ App calls YOUR backend (not Gemini directly)
4. ✅ Deploy backend to Vercel (free)
5. ✅ Update app to use backend URL
6. ✅ Build and publish to Play Store

**Your API key is safe, users get AI features, you control costs!** 🎉

---

## 🆘 Need Help?

I can create the complete backend code for you. Just let me know!
