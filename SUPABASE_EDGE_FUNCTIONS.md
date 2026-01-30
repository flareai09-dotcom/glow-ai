# 🚀 Supabase Edge Functions - Production Deployment

## ✅ Why Supabase Edge Functions?

Instead of a separate backend server, use **Supabase Edge Functions**:

- ✅ **Already integrated** - You're using Supabase
- ✅ **Built-in auth** - Uses your existing authentication
- ✅ **Serverless** - No server to manage
- ✅ **Free tier** - 500K requests/month
- ✅ **Global CDN** - Fast worldwide
- ✅ **Easy deployment** - One command

---

## 📁 What I Created

### Supabase Edge Function:
- `supabase/functions/analyze-skin/index.ts`

This replaces the entire `backend/` folder!

---

## 🚀 Setup & Deployment

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link to Your Project

```bash
supabase link --project-ref sdaozejlnkzrkidxjylf
```

### Step 4: Set Environment Variables

```bash
supabase secrets set GEMINI_API_KEY=your_actual_gemini_key_here
```

### Step 5: Deploy the Function

```bash
supabase functions deploy analyze-skin
```

That's it! Your function is live! 🎉

---

## 🔗 Your Function URL

After deployment, you'll get a URL like:

```
https://sdaozejlnkzrkidxjylf.supabase.co/functions/v1/analyze-skin
```

---

## 📱 Update Mobile App

Update `src/services/ai-service.ts`:

```typescript
import { supabase } from '../lib/supabase';
import { imageToBase64 } from '../utils/image-utils';
import { SkinIssue, GeminiAnalysisResponse } from '../types/scan.types';

export class AIService {
  /**
   * Analyze skin image using Supabase Edge Function
   */
  async analyzeSkin(imageUri: string): Promise<GeminiAnalysisResponse> {
    try {
      // Convert image to base64
      const base64Image = await imageToBase64(imageUri);

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { imageBase64: base64Image }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      return data.data;

    } catch (error) {
      console.error('Error analyzing skin:', error);
      return this.getFallbackAnalysis();
    }
  }

  // ... rest of the code stays the same
}
```

---

## ✅ Benefits Over Separate Backend

### Supabase Edge Functions:

| Feature | Supabase Edge Functions | Separate Backend |
|---------|------------------------|------------------|
| **Setup** | ✅ Already integrated | ❌ New server needed |
| **Auth** | ✅ Built-in | ❌ Manual setup |
| **Deployment** | ✅ One command | ❌ Multiple steps |
| **Cost** | ✅ Free (500K req/month) | ❌ $5-25/month |
| **Scaling** | ✅ Automatic | ❌ Manual |
| **Maintenance** | ✅ None | ❌ Server updates |

---

## 💰 Cost Breakdown

### Supabase Free Tier:
- **Edge Functions:** 500,000 requests/month
- **Database:** 500 MB
- **Storage:** 1 GB
- **Auth:** Unlimited users
- **Cost:** **$0/month**

### For 1,000 Active Users:
- ~4,000 scans/month
- Well within free tier!
- **Total cost: $0** 🎉

### When to Upgrade (Supabase Pro - $25/month):
- 2,000,000 Edge Function requests
- 8 GB database
- 100 GB storage
- Still cheaper than separate backend!

---

## 🔐 Security Features

### Built-in:
- ✅ **Authentication** - Uses Supabase Auth
- ✅ **Rate Limiting** - 5 scans/day per user
- ✅ **User Isolation** - RLS policies
- ✅ **API Key Protection** - Stored as secret
- ✅ **CORS** - Configured automatically

---

## 📊 Rate Limiting

The Edge Function checks:
1. User is authenticated
2. Count scans today
3. If >= 5, return error
4. Otherwise, process request

**Premium users:** Modify the function to check premium status from database.

---

## 🧪 Testing

### Test Locally:

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve analyze-skin

# Test with curl
curl -X POST http://localhost:54321/functions/v1/analyze-skin \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "base64_image_here"}'
```

### Test Production:

```bash
curl -X POST https://sdaozejlnkzrkidxjylf.supabase.co/functions/v1/analyze-skin \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "base64_image_here"}'
```

---

## 📝 Deployment Checklist

- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref sdaozejlnkzrkidxjylf`
- [ ] Set Gemini API key: `supabase secrets set GEMINI_API_KEY=...`
- [ ] Deploy function: `supabase functions deploy analyze-skin`
- [ ] Update mobile app to use Edge Function
- [ ] Test with real device
- [ ] Build for Play Store

---

## 🔄 Update Workflow

### To update the function:

1. Edit `supabase/functions/analyze-skin/index.ts`
2. Run: `supabase functions deploy analyze-skin`
3. Done! Changes are live instantly.

---

## 📈 Monitoring

### View Logs:

```bash
supabase functions logs analyze-skin
```

### View in Dashboard:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "Edge Functions"
4. Click "analyze-skin"
5. View logs, metrics, and usage

---

## 🎉 Summary

**Using Supabase Edge Functions is BETTER because:**

1. ✅ **Simpler** - No separate backend
2. ✅ **Cheaper** - Free tier is generous
3. ✅ **Integrated** - Works with your existing Supabase
4. ✅ **Faster** - Global CDN
5. ✅ **Easier** - One command deployment

**You can delete the `backend/` folder - you don't need it!**

---

## 🚀 Next Steps

1. Deploy Edge Function (5 minutes)
2. Update mobile app (already shown above)
3. Test
4. Build for Play Store

**Your API key stays safe in Supabase secrets, users get AI features, everything is in one place!** 🎉
