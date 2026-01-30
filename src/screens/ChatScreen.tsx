import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { Send, Trash2, ArrowLeft, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { chatService } from '../services/chat-service';
import { ChatMessage } from '../types/chat.types';

interface ChatScreenProps {
    navigation: any;
}

export function ChatScreen({ navigation }: ChatScreenProps) {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    const themeStyles = {
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white' },
        subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        if (!user?.id) return;

        setLoadingHistory(true);
        try {
            const history = await chatService.getChatHistory(user.id);
            setMessages(history);

            // Scroll to bottom after loading
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 100);
        } catch (error) {
            console.error('Error loading chat history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !user?.id || loading) return;

        const userMessage = inputText.trim();
        setInputText('');
        setLoading(true);

        // Add user message to UI immediately
        const tempUserMessage: ChatMessage = {
            id: Date.now().toString(),
            user_id: user.id,
            message: userMessage,
            is_user: true,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempUserMessage]);

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            // Get AI response
            const aiResponse = await chatService.sendMessage(userMessage, user.id);

            // Add AI response to UI
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                user_id: user.id,
                message: aiResponse,
                is_user: false,
                created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
            // Show error message
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                user_id: user.id,
                message: 'Sorry, I encountered an error. Please try again.',
                is_user: false,
                created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (!user?.id) return;

        const success = await chatService.clearChatHistory(user.id);
        if (success) {
            setMessages([]);
        }
    };

    const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
        const isUser = item.is_user;

        return (
            <Animatable.View
                animation="fadeInUp"
                delay={index * 50}
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.aiMessageContainer,
                ]}
            >
                {!isUser && (
                    <View style={styles.aiAvatar}>
                        <Sparkles size={16} color="#14B8A6" />
                    </View>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.aiBubble,
                    ]}
                >
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                        {item.message}
                    </Text>
                </View>
            </Animatable.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
                <Sparkles size={48} color="#14B8A6" />
            </Animatable.View>
            <Text style={[styles.emptyTitle, themeStyles.text]}>Hi! I'm Glowy 👋</Text>
            <Text style={[styles.emptySubtitle, themeStyles.subText]}>
                Your AI skincare assistant. Ask me anything about skincare, products, routines, or skin concerns!
            </Text>
            <View style={styles.suggestionsContainer}>
                <TouchableOpacity
                    style={styles.suggestionChip}
                    onPress={() => setInputText('What skincare routine should I follow?')}
                >
                    <Text style={styles.suggestionText}>Skincare routine tips</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.suggestionChip}
                    onPress={() => setInputText('How to treat acne?')}
                >
                    <Text style={styles.suggestionText}>Acne treatment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.suggestionChip}
                    onPress={() => setInputText('Best ingredients for dark spots?')}
                >
                    <Text style={styles.suggestionText}>Dark spots</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={[styles.header, themeStyles.card]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.headerIcon}>
                        <Sparkles size={20} color="#14B8A6" />
                    </View>
                    <View>
                        <Text style={[styles.headerTitle, themeStyles.text]}>Glowy AI</Text>
                        <Text style={[styles.headerSubtitle, themeStyles.subText]}>Skincare Assistant</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
                    <Trash2 size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {loadingHistory ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#14B8A6" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messagesList}
                        ListEmptyComponent={renderEmptyState}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Input */}
                <View style={[styles.inputContainer, themeStyles.card]}>
                    <TextInput
                        style={[styles.input, themeStyles.text]}
                        placeholder="Ask me anything about skincare..."
                        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        editable={!loading}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!inputText.trim() || loading}
                        style={styles.sendButton}
                    >
                        <LinearGradient
                            colors={
                                !inputText.trim() || loading
                                    ? ['#9CA3AF', '#9CA3AF']
                                    : ['#14B8A6', '#10B981']
                            }
                            style={styles.sendGradient}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Send size={20} color="white" />
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex1: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
    },
    clearButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesList: {
        padding: 16,
        flexGrow: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '80%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
    },
    aiMessageContainer: {
        alignSelf: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: '#14B8A6',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#F3F4F6',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: 'white',
    },
    aiText: {
        color: '#1F2937',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    suggestionsContainer: {
        width: '100%',
        gap: 8,
    },
    suggestionChip: {
        backgroundColor: '#D1FAE5',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    suggestionText: {
        color: '#14B8A6',
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
    },
    sendButton: {
        marginLeft: 8,
    },
    sendGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
