import { aiService } from './ai-service';
import { supabase } from '../lib/supabase';
import { ChatMessage, ChatRequest, ChatResponse } from '../types/chat.types';

/**
 * Service for AI Chat Assistant
 * Uses Gemini 1.5 Flash for cheap, high-quality responses
 */

export class ChatService {
    /**
     * Send message to AI assistant
     */
    async sendMessage(message: string, userId: string): Promise<string> {
        try {
            console.log('💬 Sending message to AI (Client-Side)...');

            // Use the robust Client-Side AI Service
            // This ensures we use the same working keys and models as the scanner
            return await aiService.chat(message);

        } catch (error: any) {
            console.error('❌ Error sending message:', error);
            throw new Error('Failed to send message. Please try again.');
        }
    }

    /**
     * Get chat history for user
     */
    async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
        try {
            const { data, error } = await supabase
                .from('chat_history')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true })
                .limit(limit);

            if (error) throw error;

            return (data as ChatMessage[]) || [];
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }
    }

    /**
     * Clear chat history for user
     */
    async clearChatHistory(userId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('chat_history')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Error clearing chat history:', error);
            return false;
        }
    }

    /**
     * Delete specific message
     */
    async deleteMessage(messageId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('chat_history')
                .delete()
                .eq('id', messageId);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    }
}

export const chatService = new ChatService();
