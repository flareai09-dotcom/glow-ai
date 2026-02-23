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
    StatusBar,
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
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        iconBoxPrimary: { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}4D` },
        inputContainer: { borderTopColor: colors.border, backgroundColor: colors.card },
        aiAvatar: { backgroundColor: colors.card, borderColor: colors.primary },
        aiBubble: { backgroundColor: `${colors.primary}0D`, borderColor: `${colors.primary}4D` },
        userBubble: { backgroundColor: `${colors.secondary}4D`, borderColor: colors.secondary },
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
                    <View style={[styles.aiAvatar, themeStyles.aiAvatar]}>
                        <Sparkles size={16} color={colors.primary} />
                    </View>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isUser ? [styles.userBubble, themeStyles.userBubble] : [styles.aiBubble, themeStyles.aiBubble],
                    ]}
                >
                    <Text style={[styles.messageText, themeStyles.text]}>
                        {item.message}
                    </Text>
                </View>
            </Animatable.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
                <Sparkles size={48} color={colors.primary} />
            </Animatable.View>
            <Text style={[styles.emptyTitle, themeStyles.text]}>Hi! I'm Glowy 👋</Text>
            <Text style={[styles.emptySubtitle, themeStyles.subText]}>
                Your AI skincare assistant. Ask me anything about skincare, products, routines, or skin concerns!
            </Text>
            <View style={styles.suggestionsContainer}>
                <TouchableOpacity
                    style={[styles.suggestionChip, themeStyles.iconBoxPrimary]}
                    onPress={() => setInputText('What skincare routine should I follow?')}
                >
                    <Text style={[styles.suggestionText, { color: colors.primary }]}>Skincare routine tips</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.suggestionChip, themeStyles.iconBoxPrimary]}
                    onPress={() => setInputText('How to treat acne?')}
                >
                    <Text style={[styles.suggestionText, { color: colors.primary }]}>Acne treatment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.suggestionChip, themeStyles.iconBoxPrimary]}
                    onPress={() => setInputText('Best ingredients for dark spots?')}
                >
                    <Text style={[styles.suggestionText, { color: colors.primary }]}>Dark spots</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            {/* Header */}
            <View style={[styles.header, themeStyles.card]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={[styles.headerIcon, themeStyles.card, { borderColor: colors.primary }]}>
                        <Sparkles size={20} color={colors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.headerTitle, themeStyles.text]}>Glowy AI</Text>
                        <Text style={[styles.headerSubtitle, themeStyles.subText]}>Skincare Assistant</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
                    <Trash2 size={20} color={colors.subText} />
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
                        <ActivityIndicator size="large" color={colors.primary} />
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
                <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                    <TextInput
                        style={[styles.input, themeStyles.text]}
                        placeholder="Ask me anything about skincare..."
                        placeholderTextColor={colors.subText}
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
                                    ? [colors.border, colors.border]
                                    : [colors.primary, colors.secondary]
                            }
                            style={styles.sendGradient}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.background} />
                            ) : (
                                <Send size={20} color={colors.background} />
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
        borderBottomColor: 'rgba(0, 229, 255, 0.2)',
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
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#00E5FF',
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
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        borderBottomRightRadius: 4,
        borderWidth: 1,
        borderColor: '#007BFF',
    },
    aiBubble: {
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#E2E8F0',
    },
    aiText: {
        color: '#E2E8F0',
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
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    suggestionText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 229, 255, 0.2)',
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
