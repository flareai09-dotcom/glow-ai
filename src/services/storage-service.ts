import { supabase } from '../lib/supabase';
import { compressImage, createThumbnail } from '../utils/image-utils';

/**
 * Service for uploading and managing images in Supabase Storage
 */

const BUCKET_NAME = 'scan-images';

export class StorageService {
    /**
     * Upload scan image to Supabase Storage
     * Returns public URL of uploaded image
     */
    async uploadScanImage(
        imageUri: string,
        userId: string
    ): Promise<{ imageUrl: string; thumbnailUrl: string }> {
        try {
            console.log('📤 Starting image upload...');
            console.log('Image URI:', imageUri);
            console.log('User ID:', userId);

            // Compress main image
            const compressedUri = await compressImage(imageUri);
            console.log('✅ Image compressed');

            // Create thumbnail
            const thumbnailUri = await createThumbnail(imageUri);
            console.log('✅ Thumbnail created');

            // Generate unique filenames
            const timestamp = Date.now();
            const imagePath = `${userId}/${timestamp}.jpg`;
            const thumbnailPath = `${userId}/${timestamp}_thumb.jpg`;

            console.log('📁 Upload paths:', { imagePath, thumbnailPath });

            // For React Native, we need to use FormData or ArrayBuffer
            // Let's try using the file directly with fetch
            const imageFile = await fetch(compressedUri);
            const imageBlob = await imageFile.blob();
            const imageArrayBuffer = await imageBlob.arrayBuffer();

            console.log('📦 Image blob size:', imageBlob.size);

            // Upload main image
            const { data: uploadData, error: imageError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(imagePath, imageArrayBuffer, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false,
                });

            if (imageError) {
                console.error('❌ Image upload error:', imageError);
                throw imageError;
            }

            console.log('✅ Main image uploaded:', uploadData);

            // Upload thumbnail
            const thumbnailFile = await fetch(thumbnailUri);
            const thumbnailBlob = await thumbnailFile.blob();
            const thumbnailArrayBuffer = await thumbnailBlob.arrayBuffer();

            const { data: thumbData, error: thumbnailError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(thumbnailPath, thumbnailArrayBuffer, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false,
                });

            if (thumbnailError) {
                console.error('❌ Thumbnail upload error:', thumbnailError);
                throw thumbnailError;
            }

            console.log('✅ Thumbnail uploaded:', thumbData);

            // Get public URLs
            const { data: imageData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(imagePath);

            const { data: thumbnailData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(thumbnailPath);

            console.log('✅ Upload complete!');
            console.log('Image URL:', imageData.publicUrl);
            console.log('Thumbnail URL:', thumbnailData.publicUrl);

            return {
                imageUrl: imageData.publicUrl,
                thumbnailUrl: thumbnailData.publicUrl,
            };
        } catch (error: any) {
            console.error('❌ Error uploading image:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to upload image to storage: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Delete scan image from storage
     */
    async deleteScanImage(imageUrl: string): Promise<void> {
        try {
            // Extract path from URL
            const path = this.extractPathFromUrl(imageUrl);
            if (!path) return;

            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([path]);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting image:', error);
            // Don't throw - deletion is not critical
        }
    }

    /**
     * Convert URI to Blob for upload
     */
    private async uriToBlob(uri: string): Promise<Blob> {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    }

    /**
     * Extract file path from Supabase public URL
     */
    private extractPathFromUrl(url: string): string | null {
        try {
            const match = url.match(/\/object\/public\/scan-images\/(.+)$/);
            return match ? match[1] : null;
        } catch {
            return null;
        }
    }
}

export const storageService = new StorageService();
