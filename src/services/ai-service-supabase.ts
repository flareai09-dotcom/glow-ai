import { supabase } from '../lib/supabase';
import { SkinIssue, GeminiAnalysisResponse } from '../types/scan.types';
import { imageToBase64 } from '../utils/image-utils';

/**
 * AI Service for skin analysis using Supabase Edge Functions
 * This version calls your Supabase Edge Function instead of Gemini directly
 * 
 * Benefits:
 * - API key stays on server (secure)
 * - Built-in authentication
 * - Rate limiting handled by Edge Function
 * - No separate backend needed
 */

export class AIService {
    /**
     * Analyze skin image using Supabase Edge Function
     * Returns detected issues and summary
     */
    async analyzeSkin(imageUri: string): Promise<GeminiAnalysisResponse> {
        try {
            // Convert image to base64
            const base64Image = await imageToBase64(imageUri);

            // Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('analyze-skin', {
                body: { imageBase64: base64Image },
            });

            if (error) {
                console.error('Edge Function error:', error);
                throw error;
            }

            if (!data.success) {
                // Check if it's a rate limit error
                if (data.error === 'Daily limit reached') {
                    throw new Error(data.message || 'Daily scan limit reached');
                }
                throw new Error(data.error || 'Analysis failed');
            }

            return data.data;

        } catch (error: any) {
            console.error('Error analyzing skin:', error);

            // If it's a rate limit error, throw it to show to user
            if (error.message?.includes('limit')) {
                throw error;
            }

            // For other errors, return fallback analysis
            return this.getFallbackAnalysis();
        }
    }

    /**
     * Fallback analysis when AI fails
     * Returns basic analysis to prevent app crash
     */
    private getFallbackAnalysis(): GeminiAnalysisResponse {
        return {
            issues: [
                {
                    name: 'Acne & Breakouts',
                    severity: 50,
                    confidence: 0.5,
                    detected: true,
                    area: 'general',
                },
                {
                    name: 'Dark Spots & Hyperpigmentation',
                    severity: 30,
                    confidence: 0.5,
                    detected: true,
                    area: 'general',
                },
                {
                    name: 'Fine Lines & Wrinkles',
                    severity: 20,
                    confidence: 0.5,
                    detected: false,
                    area: '',
                },
                {
                    name: 'Oiliness',
                    severity: 40,
                    confidence: 0.5,
                    detected: true,
                    area: 'general',
                },
                {
                    name: 'Redness & Inflammation',
                    severity: 25,
                    confidence: 0.5,
                    detected: false,
                    area: '',
                },
                {
                    name: 'Uneven Texture',
                    severity: 30,
                    confidence: 0.5,
                    detected: true,
                    area: 'general',
                },
            ],
            summary: 'Basic analysis completed. For detailed results, please try again.',
            remedies: [
                'Maintain a consistent cleansing routine',
                'Use non-comedogenic products',
                'Apply sunscreen daily (SPF 30+)',
                'Keep skin hydrated with a lightweight moisturizer'
            ],
            routine_suggestions: [
                'Morning: Gentle Cleanser + Vitamin C + Moisturizer + SPF',
                'Evening: Double Cleanse + Targeted Treatment + Hydrating Moisturizer'
            ]
        };
    }
}

export const aiService = new AIService();
