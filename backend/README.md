# Glow AI Backend

Backend API server for Glow AI skin analysis app.

## Features

- ✅ Gemini AI integration for skin analysis
- ✅ Rate limiting (5 scans/day for free users)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Usage tracking

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Run Locally

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 4. Test

```bash
# Health check
curl http://localhost:3000/health

# Analyze skin (example)
curl -X POST http://localhost:3000/api/analyze-skin \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "imageBase64": "base64_encoded_image_here"
  }'
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Railway

1. Go to https://railway.app/
2. Connect GitHub repo
3. Deploy `backend` folder
4. Add environment variables

### Render

1. Go to https://render.com/
2. Create new Web Service
3. Connect GitHub repo
4. Build command: `npm install`
5. Start command: `npm start`

## API Endpoints

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-30T10:00:00.000Z",
  "service": "Glow AI Backend"
}
```

### POST /api/analyze-skin

Analyze skin image.

**Request:**
```json
{
  "userId": "user-123",
  "imageBase64": "base64_encoded_image"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "issues": [...],
    "summary": "..."
  },
  "remaining": 4
}
```

### GET /api/scans-remaining/:userId

Get remaining scans for user.

**Response:**
```json
{
  "success": true,
  "remaining": 3,
  "limit": 5,
  "resetTime": 1706659200000
}
```

## Rate Limiting

- Free users: 5 scans per day
- Resets at midnight
- Returns 429 status when limit exceeded

## Environment Variables

- `GEMINI_API_KEY` - Your Gemini API key (required)
- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase URL (optional)
- `SUPABASE_SERVICE_KEY` - Supabase service key (optional)

## Security

- API keys stored on server (not in app)
- CORS enabled for your app domain
- Rate limiting to prevent abuse
- Input validation

## Cost Management

- Track usage per user
- Set daily limits
- Monitor API costs
- Premium users can have unlimited scans

## License

MIT
