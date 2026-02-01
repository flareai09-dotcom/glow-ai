import { supabase } from '../lib/supabase';
import { aiService } from './ai-service';
import { storageService } from './storage-service-base64';
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

            // Step 4: Save to database
            console.log('Saving to database...');
            const scanData: ScanCreateInput = {
                user_id: userId,
                image_url: imageUrl,
                thumbnail_url: thumbnailUrl,
                skin_score: scoreBreakdown.finalScore,
                issues: analysis.issues,
                remedies: analysis.remedies,
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

            // Group by day and average scores
            const scoresByDay = new Map<string, number[]>();

            data.forEach((scan: any) => {
                const date = new Date(scan.created_at);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                if (!scoresByDay.has(dayName)) {
                    scoresByDay.set(dayName, []);
                }
                scoresByDay.get(dayName)!.push(scan.skin_score);
            });

            // Calculate averages
            const result = Array.from(scoresByDay.entries()).map(([day, scores]) => ({
                day,
                score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            }));

            return result;
        } catch (error) {
            console.error('Error fetching weekly scores:', error);
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
