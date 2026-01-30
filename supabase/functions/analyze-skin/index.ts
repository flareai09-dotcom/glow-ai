// Supabase Edge Function for AI Skin Analysis
// Deploy to: https://supabase.com/dashboard/project/sdaozejlnkzrkidxjylf/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get request body
        const { imageBase64 } = await req.json()

        if (!imageBase64) {
            return new Response(
                JSON.stringify({ error: 'Missing imageBase64' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get user from auth header
        const authHeader = req.headers.get('Authorization')!
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check rate limit (5 scans per day for free users)
        const today = new Date().toISOString().split('T')[0]
        const { count } = await supabaseClient
            .from('scans')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', `${today}T00:00:00`)

        if (count && count >= 5) {
            return new Response(
                JSON.stringify({
                    error: 'Daily limit reached',
                    message: 'You have reached your daily limit of 5 scans. Upgrade to premium for unlimited scans.',
                    remaining: 0
                }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Prepare Gemini API request
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

Return valid JSON only.`

        // Call Gemini API
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: imageBase64
                            }
                        }
                    ]
                }]
            })
        })

        if (!geminiResponse.ok) {
            throw new Error('Gemini API error')
        }

        const geminiData = await geminiResponse.json()
        const responseText = geminiData.candidates[0].content.parts[0].text

        // Clean and parse response
        let cleanedText = responseText.trim()
        cleanedText = cleanedText.replace(/```json\n?/g, '')
        cleanedText = cleanedText.replace(/```\n?/g, '')
        cleanedText = cleanedText.trim()

        const analysis = JSON.parse(cleanedText)

        // Return success
        return new Response(
            JSON.stringify({
                success: true,
                data: analysis,
                remaining: 4 - (count || 0)
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({
                error: 'Failed to analyze image',
                message: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
