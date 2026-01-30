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
            // Get recent chat history for context
            const chatHistory = await this.getChatHistory(userId, 10);

            console.log('💬 Sending message to AI...');

            // Get current session for auth token
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('No active session');
            }

            // Call Edge Function with auth headers
            const { data, error } = await supabase.functions.invoke<ChatResponse>('chat-assistant', {
                body: {
                    message,
                    chatHistory
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (error) {
                console.error('❌ Chat error:', error);
                throw error;
            }

            if (!data || !data.success) {
                throw new Error('Failed to get AI response');
            }

            console.log('✅ AI response received');
            return data.response;

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
