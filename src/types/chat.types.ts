/**
 * Chat message type
 */
export interface ChatMessage {
    id: string;
    user_id: string;
    message: string;
    is_user: boolean;
    created_at: string;
}

/**
 * Chat request type
 */
export interface ChatRequest {
    message: string;
    chatHistory?: ChatMessage[];
}

/**
 * Chat response type
 */
export interface ChatResponse {
    success: boolean;
    response: string;
}
