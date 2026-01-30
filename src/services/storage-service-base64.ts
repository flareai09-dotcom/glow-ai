import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

/**
 * SIMPLIFIED Storage Service - No Supabase Storage
 * Saves images as base64 in database instead
 * This bypasses the network/CORS issues with Supabase Storage
 */

export class StorageService {
    /**
     * Upload scan image - saves as base64 in database
     * Returns base64 data URLs instead of storage URLs
     */
    async uploadScanImage(
        imageUri: string,
        userId: string
    ): Promise<{ imageUrl: string; thumbnailUrl: string }> {
        try {
            console.log('📤 Converting image to base64...');

            // Use Expo FileSystem to read as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: 'base64',
            });

            // Create data URL
            const dataUrl = `data:image/jpeg;base64,${base64}`;

            console.log('✅ Image converted to base64');
            console.log('Base64 size:', base64.length);

            // Return the same base64 for both image and thumbnail
            return {
                imageUrl: dataUrl,
                thumbnailUrl: dataUrl,
            };
        } catch (error: any) {
            console.error('❌ Error converting image:', error);
            throw new Error(`Failed to process image: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Delete scan image - no-op since we're not using storage
     */
    async deleteScanImage(imageUrl: string): Promise<void> {
        // No-op - images are in database, deleted with scan record
        console.log('Image stored in database, will be deleted with scan record');
    }
}

export const storageService = new StorageService();
