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

// In-memory rate limiting (use Redis in production)
const userScans = new Map();

// Helper: Check rate limit
function checkRateLimit(userId) {
    const today = new Date().toDateString();
    const key = `${userId}-${today}`;
    const scanCount = userScans.get(key) || 0;

    // Free users: 5 scans per day
    const DAILY_LIMIT = 5;

    if (scanCount >= DAILY_LIMIT) {
        return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: DAILY_LIMIT - scanCount - 1 };
}

// Helper: Increment scan count
function incrementScanCount(userId) {
    const today = new Date().toDateString();
    const key = `${userId}-${today}`;
    const scanCount = userScans.get(key) || 0;
    userScans.set(key, scanCount + 1);
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Glow AI Backend'
    });
});

// Analyze skin endpoint
app.post('/api/analyze-skin', async (req, res) => {
    try {
        const { imageBase64, userId } = req.body;

        // Validate request
        if (!imageBase64 || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: imageBase64 and userId'
            });
        }

        // Check rate limit
        const rateLimit = checkRateLimit(userId);
        if (!rateLimit.allowed) {
            return res.status(429).json({
                success: false,
                error: 'Daily scan limit reached',
                message: 'You have reached your daily limit of 5 scans. Upgrade to premium for unlimited scans.',
                remaining: 0
            });
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
  "summary": "brief overall assessment in 1-2 sentences"
}

Detect these issues (analyze all 6):
1. Acne & Breakouts - pimples, blackheads, whiteheads
2. Dark Spots & Hyperpigmentation - uneven pigmentation, dark patches
3. Fine Lines & Wrinkles - aging signs, expression lines
4. Oiliness - shiny skin, enlarged pores
5. Redness & Inflammation - irritation, rosacea
6. Uneven Texture - rough patches, bumps

Guidelines:
- Use Indian skin tones as reference
- Be accurate and clinical
- Severity: 0 (none) to 100 (severe)
- Confidence: 0.0 (uncertain) to 1.0 (very confident)
- Only set detected=true if clearly visible
- Area: specify location (forehead, cheeks, chin, nose, etc.)
- Summary: professional, encouraging tone

Return valid JSON only.`;

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
        cleanedText = cleanedText.trim();

        const analysis = JSON.parse(cleanedText);

        // Increment scan count
        incrementScanCount(userId);

        // Log usage for tracking
        console.log(`✅ Analysis completed for user: ${userId}, Remaining: ${rateLimit.remaining}`);

        res.json({
            success: true,
            data: analysis,
            remaining: rateLimit.remaining
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze image',
            message: 'An error occurred while processing your image. Please try again.'
        });
    }
});

// Get user's remaining scans
app.get('/api/scans-remaining/:userId', (req, res) => {
    const { userId } = req.params;
    const rateLimit = checkRateLimit(userId);

    res.json({
        success: true,
        remaining: rateLimit.allowed ? rateLimit.remaining + 1 : 0,
        limit: 5,
        resetTime: new Date().setHours(24, 0, 0, 0) // Midnight
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Glow AI Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
