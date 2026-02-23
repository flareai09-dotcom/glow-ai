// @ts-ignore: Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore: Deno types
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { message, skinContext } = await req.json();

        // @ts-ignore: Deno types
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), { status: 500, headers: corsHeaders });
        }

        const systemPrompt = `You are Glowy, a friendly AI skincare assistant for Indian users. Advice short and professional.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }]
                }]
            })
        });

        if (response.status === 429) {
            return new Response(JSON.stringify({ reply: "I'm a bit busy bunny! 🐰 (Quota reached). Please wait 30 seconds." }), { status: 200, headers: corsHeaders });
        }

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, let’s try that again!';

        return new Response(JSON.stringify({ reply }), { status: 200, headers: corsHeaders });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});
