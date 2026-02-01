// TypeScript types for skin analysis features

export interface SkinIssue {
    name: string;
    severity: number; // 0-100
    confidence: number; // 0-1
    detected: boolean;
    area?: string; // Location on face
}

export interface Scan {
    id: string;
    user_id: string;
    image_url: string;
    thumbnail_url?: string;
    skin_score: number; // 0-100
    issues: SkinIssue[];
    remedies?: string[]; // New field
    recommendations?: string[]; // New field for products
    analysis_summary?: string;
    created_at: string;
}

export interface ScanCreateInput {
    user_id: string;
    image_url: string;
    thumbnail_url?: string;
    skin_score: number;
    issues: SkinIssue[];
    remedies?: string[];
    analysis_summary?: string;
}

export interface GeminiAnalysisResponse {
    issues: SkinIssue[];
    summary: string;
    remedies: string[];
    routine_suggestions: string[];
    product_ingredients?: string[];
}

export interface SkinScoreBreakdown {
    baseScore: number;
    deductions: {
        issue: string;
        amount: number;
    }[];
    finalScore: number;
}

export type IssueType =
    | 'Acne & Breakouts'
    | 'Dark Spots & Hyperpigmentation'
    | 'Fine Lines & Wrinkles'
    | 'Oiliness'
    | 'Redness & Inflammation'
    | 'Uneven Texture';

export type SeverityLevel = 'mild' | 'moderate' | 'severe';
