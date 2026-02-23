import { supabase } from '../lib/supabase';
import { aiService } from './ai-service';
import { storageService } from './storage-service';
import { calculateSkinScore } from '../utils/score-calculator';
import { compressImage } from '../utils/image-utils';
import { Scan, ScanCreateInput } from '../types/scan.types';

/**
 * Service for managing skin scans
 * Orchestrates AI analysis, storage, and database operations
 */

export class ScanService {
    /**
     * Create a new scan from image
     * Main entry point for skin analysis
     */
    async createScan(imageUri: string, userId: string): Promise<Scan> {
        try {
            // Step 0: Optimize image
            console.log('Compressing image...');
            const compressedUri = await compressImage(imageUri);

            // Step 1: Upload image to storage
            console.log('Uploading image...');
            const { imageUrl, thumbnailUrl } = await storageService.uploadScanImage(
                compressedUri,
                userId
            );

            // Step 2: Analyze skin with AI
            console.log('Analyzing skin with AI...');
            const analysis = await aiService.analyzeSkin(compressedUri);

            // Step 3: Calculate skin score
            console.log('Calculating skin score...');
            const scoreBreakdown = calculateSkinScore(analysis.issues);
            let finalScore = scoreBreakdown.finalScore;

            // Step 3.5: Stabilize score (compared to last scan)
            try {
                const latestScan = await this.getLatestScan(userId);
                if (latestScan && latestScan.skin_score > 0) {
                    const diff = Math.abs(finalScore - latestScan.skin_score);
                    if (diff > 8) {
                        console.log(`Stabilizing score: New(${finalScore}) vs Last(${latestScan.skin_score}). Diff is ${diff}pts.`);
                        finalScore = Math.round((finalScore + latestScan.skin_score) / 2);
                        console.log(`Averaged stabilized score: ${finalScore}`);
                    }
                }
            } catch (stabilizeError) {
                console.error('Score stabilization failed (non-critical):', stabilizeError);
            }

            // Step 4: Save to database
            console.log('Saving to database...');
            const scanData: ScanCreateInput = {
                user_id: userId,
                image_url: imageUrl,
                thumbnail_url: thumbnailUrl,
                skin_score: finalScore,
                issues: analysis.issues,
                remedies: analysis.remedies,
                routine_suggestions: analysis.routine_suggestions,
                product_ingredients: analysis.product_ingredients,
                analysis_summary: analysis.summary,
            };

            const { data, error } = await supabase
                .from('scans')
                .insert(scanData)
                .select()
                .single();

            if (error) {
                console.error('Database Insert Error:', error);
                throw new Error(`Database Error: ${error.message}`);
            }

            console.log('Scan created successfully:', data.id);
            return data as Scan;
        } catch (error: any) {
            console.error('Error creating scan step:', error);
            // Throw the actual error message to help debugging
            throw new Error(error.message || 'Failed to create scan');
        }
    }

    /**
     * Get user's total scan count
     */
    async getScanCount(userId: string): Promise<number> {
        try {
            const { count, error } = await supabase
                .from('scans')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error getting scan count:', error);
            return 0;
        }
    }

    /**
     * Get user's scan history
     */
    async getUserScans(userId: string, limit = 10): Promise<Scan[]> {
        try {
            const { data, error } = await supabase
                .from('scans')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return (data as Scan[]) || [];
        } catch (error) {
            console.error('Error fetching scans:', error);
            return [];
        }
    }

    /**
     * Get user's latest scan
     */
    async getLatestScan(userId: string): Promise<Scan | null> {
        try {
            const { data, error } = await supabase
                .from('scans')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows found
                    return null;
                }
                throw error;
            }

            return data as Scan;
        } catch (error) {
            console.error('Error fetching latest scan:', error);
            return null;
        }
    }

    /**
     * Get scan by ID
     */
    async getScanById(scanId: string): Promise<Scan | null> {
        try {
            const { data, error } = await supabase
                .from('scans')
                .select('*')
                .eq('id', scanId)
                .single();

            if (error) throw error;

            return data as Scan;
        } catch (error) {
            console.error('Error fetching scan:', error);
            return null;
        }
    }

    /**
     * Delete a scan
     */
    async deleteScan(scanId: string): Promise<boolean> {
        try {
            // Get scan to delete image from storage
            const scan = await this.getScanById(scanId);

            if (scan) {
                // Delete from storage
                await storageService.deleteScanImage(scan.image_url);
                if (scan.thumbnail_url) {
                    await storageService.deleteScanImage(scan.thumbnail_url);
                }
            }

            // Delete from database
            const { error } = await supabase
                .from('scans')
                .delete()
                .eq('id', scanId);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Error deleting scan:', error);
            return false;
        }
    }

    /**
     * Get weekly score history for charts
     */
    async getWeeklyScores(userId: string, days = 7): Promise<{
        day: string;
        score: number;
    }[]> {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const { data, error } = await supabase
                .from('scans')
                .select('skin_score, created_at')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                // Return mock data for empty state
                return this.getMockWeeklyData();
            }

            // Initialize Monday-to-Sunday order
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const scoresByDay = new Map<string, number[]>();

            // Get the current week's Monday
            const today = new Date();
            const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
            const diffToMonday = currentDay === 0 ? 6 : currentDay - 1; // Distance from Monday

            const monday = new Date(today);
            monday.setDate(today.getDate() - diffToMonday);
            monday.setHours(0, 0, 0, 0);

            const weekDayOrder: string[] = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                weekDayOrder.push(dayNames[d.getDay()]);
            }

            // Fill with real data
            data.forEach((scan: any) => {
                const date = new Date(scan.created_at);
                const dayName = dayNames[date.getDay()];
                if (!scoresByDay.has(dayName)) {
                    scoresByDay.set(dayName, []);
                }
                scoresByDay.get(dayName)!.push(scan.skin_score);
            });

            // Map in Monday-Sunday order
            return weekDayOrder.map(dayName => ({
                day: dayName,
                score: scoresByDay.has(dayName)
                    ? Math.max(...scoresByDay.get(dayName)!)
                    : 0
            }));
        } catch (error) {
            console.error('Error fetching weekly scores:', error);
            return this.getMockWeeklyData();
        }
    }

    /**
     * Get the highest skin score recorded by ANY user for each of the last 7 days
     */
    async getGlobalHighestScores(): Promise<{ day: string; score: number }[]> {
        try {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            const currentDay = today.getDay();
            const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

            const monday = new Date(today);
            monday.setDate(today.getDate() - diffToMonday);
            monday.setHours(0, 0, 0, 0);

            const { data, error } = await supabase
                .from('scans')
                .select('skin_score, created_at')
                .gte('created_at', monday.toISOString())
                .order('created_at', { ascending: true });

            if (error) throw error;

            const maxScoresByDay = new Map<string, number>();

            // Process data to find max per day
            data?.forEach((scan: any) => {
                const date = new Date(scan.created_at);
                const dayName = dayNames[date.getDay()];
                const currentMax = maxScoresByDay.get(dayName) || 0;
                if (scan.skin_score > currentMax) {
                    maxScoresByDay.set(dayName, scan.skin_score);
                }
            });

            // Construct Monday-Sunday result
            const result = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const dayName = dayNames[d.getDay()];
                result.push({
                    day: dayName,
                    score: maxScoresByDay.get(dayName) || 0
                });
            }

            // Ensure there's at least some benchmark data (simulated if db is empty)
            if (result.every(r => r.score === 0)) {
                return result.map((r, i) => ({ ...r, score: 85 + (i % 3) })); // Default benchmark
            }

            return result;
        } catch (error) {
            console.error('Error fetching global highest scores:', error);
            return this.getMockWeeklyData();
        }
    }

    /**
     * Get mock weekly data for empty state
     */
    private getMockWeeklyData() {
        return [
            { day: 'Mon', score: 0 },
            { day: 'Tue', score: 0 },
            { day: 'Wed', score: 0 },
            { day: 'Thu', score: 0 },
            { day: 'Fri', score: 0 },
            { day: 'Sat', score: 0 },
            { day: 'Sun', score: 0 },
        ];
    }
}

export const scanService = new ScanService();
