import { SkinIssue, SkinScoreBreakdown } from '../types/scan.types';

/**
 * Industry-standard skin score calculation algorithm
 * Base score: 100
 * Deductions based on severity and issue type
 */

// Deduction weights for each issue type
const ISSUE_WEIGHTS = {
    'Acne & Breakouts': { severe: 30, moderate: 20, mild: 10 },
    'Dark Spots & Hyperpigmentation': { severe: 25, moderate: 15, mild: 8 },
    'Fine Lines & Wrinkles': { severe: 20, moderate: 12, mild: 6 },
    'Oiliness': { severe: 15, moderate: 10, mild: 5 },
    'Redness & Inflammation': { severe: 15, moderate: 10, mild: 5 },
    'Uneven Texture': { severe: 10, moderate: 6, mild: 3 },
};

/**
 * Determine severity level based on numeric severity (0-100)
 */
function getSeverityLevel(severity: number): 'mild' | 'moderate' | 'severe' {
    if (severity >= 70) return 'severe';
    if (severity >= 40) return 'moderate';
    return 'mild';
}

/**
 * Calculate skin score from detected issues
 * Returns score (0-100) and breakdown of deductions
 */
export function calculateSkinScore(issues: SkinIssue[]): SkinScoreBreakdown {
    const baseScore = 100;
    const deductions: { issue: string; amount: number }[] = [];

    // Calculate deductions for each detected issue
    for (const issue of issues) {
        if (!issue.detected || issue.severity === 0) continue;

        const severityLevel = getSeverityLevel(issue.severity);
        const weights = ISSUE_WEIGHTS[issue.name as keyof typeof ISSUE_WEIGHTS];

        if (weights) {
            const deduction = weights[severityLevel];
            deductions.push({
                issue: issue.name,
                amount: deduction,
            });
        }
    }

    // Calculate total deductions
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

    // Final score (minimum 0)
    const finalScore = Math.max(0, baseScore - totalDeductions);

    return {
        baseScore,
        deductions,
        finalScore,
    };
}

/**
 * Get score category and description
 */
export function getScoreCategory(score: number): {
    category: string;
    description: string;
    color: string;
} {
    if (score >= 85) {
        return {
            category: 'Excellent',
            description: 'Your skin is in great condition! Keep up your routine.',
            color: '#10B981', // Green
        };
    } else if (score >= 70) {
        return {
            category: 'Good',
            description: 'Your skin is healthy with minor concerns to address.',
            color: '#14B8A6', // Teal
        };
    } else if (score >= 55) {
        return {
            category: 'Fair',
            description: 'Improvement possible with consistent skincare.',
            color: '#F59E0B', // Amber
        };
    } else if (score >= 40) {
        return {
            category: 'Needs Attention',
            description: 'Focus on addressing key skin concerns.',
            color: '#F97316', // Orange
        };
    } else {
        return {
            category: 'Needs Improvement',
            description: 'Consult a dermatologist for personalized care.',
            color: '#EF4444', // Red
        };
    }
}

/**
 * Calculate improvement percentage between two scans
 */
export function calculateImprovement(
    previousScore: number,
    currentScore: number
): {
    percentage: number;
    improved: boolean;
    message: string;
} {
    const difference = currentScore - previousScore;
    const percentage = previousScore > 0
        ? Math.round((difference / previousScore) * 100)
        : 0;

    const improved = difference > 0;

    let message = '';
    if (Math.abs(difference) < 3) {
        message = 'Your skin score is stable';
    } else if (improved) {
        message = `Your skin improved by ${Math.abs(percentage)}%!`;
    } else {
        message = `Your skin score decreased by ${Math.abs(percentage)}%`;
    }

    return {
        percentage: Math.abs(percentage),
        improved,
        message,
    };
}
