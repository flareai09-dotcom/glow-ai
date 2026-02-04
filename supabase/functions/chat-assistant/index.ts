import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { message, chatHistory } = await req.json()

        if (!message) {
            return new Response(
                JSON.stringify({ error: 'Missing message' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase Client
        const authHeader = req.headers.get('Authorization')
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: authHeader ? { Authorization: authHeader } : {} }
        })

        // Get User
        let activeUser = null
        if (authHeader) {
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
            if (authError) {
                console.error('Auth error:', authError)
            } else {
                activeUser = user
            }
        }

        if (!activeUser) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized', message: 'No valid user session found' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set in environment variables')
            return new Response(
                JSON.stringify({ error: 'Server Configuration Error', message: 'Gemini API key is missing' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Format conversation history for Gemini
        // Ensure roles alternate: user, model, user, model...
        let conversationHistory = []
        if (chatHistory && Array.isArray(chatHistory)) {
            let lastRole = ''
            for (const msg of chatHistory) {
                const currentRole = msg.is_user ? 'user' : 'model'
                // Only add if it alternates
                if (currentRole !== lastRole) {
                    conversationHistory.push({
                        role: currentRole,
                        parts: [{ text: msg.message }]
                    })
                    lastRole = currentRole
                }
            }
        }

        // The system prompt defines Glowy's personality
        const systemPrompt = `You are Glowy, a professional and friendly AI Skincare Assistant for the "Glow AI" app.
Your goals:
1. Provide expert skincare advice based on dermatology principles.
2. Focus on Indian skin types (Fitzpatrick IV-VI) and common concerns like hyperpigmentation, acne, and sun damage in tropical climates.
3. Be encouraging, empathetic, and clear.
4. Keep responses concise and easy to read (max 3-4 short paragraphs).
5. Use emojis to be engaging (✨, 🌿, 🧴, 💧).
6. IMPORTANT: Always recommend consulting a dermatologist for severe or persistent issues.
7. Suggest ingredients like Niacinamide, Salicylic Acid, Vitamin C, etc., but don't prescribe specific medications.
8. If the user asks about the app, explain that Glow AI uses advanced computer vision to analyze skin health and tracks progress over time.

User Query: ${message}`

        // Prepare contents for Gemini
        if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'user') {
            conversationHistory.pop()
        }

        const payload = {
            contents: [
                ...conversationHistory,
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        }

        // Call Gemini API
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.text()
            console.error('Gemini API error details:', errorData)
            return new Response(
                JSON.stringify({ error: 'Gemini API Error', details: errorData }),
                { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const geminiData = await geminiResponse.json()

        if (!geminiData.candidates || geminiData.candidates.length === 0) {
            console.error('No candidates returned from Gemini:', JSON.stringify(geminiData))
            return new Response(
                JSON.stringify({ error: 'No response from AI assistant' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const aiResponse = geminiData.candidates[0].content.parts[0].text

        // Save to database
        const saveTasks = [
            supabaseClient.from('chat_history').insert({
                user_id: activeUser.id,
                message: message,
                is_user: true
            }),
            supabaseClient.from('chat_history').insert({
                user_id: activeUser.id,
                message: aiResponse,
                is_user: false
            })
        ]

        try {
            await Promise.all(saveTasks)
        } catch (saveError) {
            console.error('Error saving to chat_history:', saveError)
        }

        return new Response(
            JSON.stringify({
                success: true,
                response: aiResponse
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error: any) {
        console.error('Unhandled Edge Function Error:', error)
        return new Response(
            JSON.stringify({
                error: 'Assistant Error',
                message: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
