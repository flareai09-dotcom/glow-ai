// @ts-ignore: Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno types
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Config
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { message, chatHistory } = await req.json()
        // @ts-ignore: Deno types
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

        if (!GEMINI_API_KEY) return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), { status: 500, headers: corsHeaders })

        const payload = {
            contents: [{ role: 'user', parts: [{ text: `You are Glowy, an expert AI Skincare Assistant. User: ${message}` }] }],
        }

        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (geminiResponse.status === 429) {
            return new Response(JSON.stringify({ success: true, response: "AI busy! 🐰 Quota reached. Try in 30 seconds." }), { status: 200, headers: corsHeaders })
        }

        const geminiData = await geminiResponse.json()
        const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Let's chat again in a moment!"

        return new Response(JSON.stringify({ success: true, response: aiResponse }), { status: 200, headers: corsHeaders })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
})
