import * as ImageManipulator from 'expo-image-manipulator';
import { readAsStringAsync, getInfoAsync } from 'expo-file-system/legacy';

/**
 * Compress and resize image for upload
 * Target: Max 1MB, 1024x1024 resolution
 */
export async function compressImage(uri: string): Promise<string> {
    try {
        // Resize to max 1024x1024 while maintaining aspect ratio
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        return manipResult.uri;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to compress image');
    }
}

/**
 * Create thumbnail from image
 * Target: 200x200 resolution
 */
export async function createThumbnail(uri: string): Promise<string> {
    try {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 200 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        return manipResult.uri;
    } catch (error) {
        console.error('Error creating thumbnail:', error);
        throw new Error('Failed to create thumbnail');
    }
}

/**
 * Convert image URI to base64 string for Gemini API
 */
export async function imageToBase64(uri: string): Promise<string> {
    try {
        const base64 = await readAsStringAsync(uri, {
            encoding: 'base64',
        });
        return base64;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw new Error('Failed to convert image to base64');
    }
}

/**
 * Get image file size in bytes
 */
export async function getImageSize(uri: string): Promise<number> {
    try {
        const info = await getInfoAsync(uri);
        return info.exists && 'size' in info ? info.size : 0;
    } catch (error) {
        console.error('Error getting image size:', error);
        return 0;
    }
}

/**
 * Validate image before upload
 */
export async function validateImage(uri: string): Promise<{
    valid: boolean;
    error?: string;
}> {
    try {
        const info = await getInfoAsync(uri);

        if (!info.exists) {
            return { valid: false, error: 'Image file not found' };
        }

        if ('size' in info && info.size > 5 * 1024 * 1024) {
            return { valid: false, error: 'Image size exceeds 5MB limit' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Failed to validate image' };
    }
}
