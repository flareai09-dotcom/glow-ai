import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Send, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'glowy';
};

export const GlowyAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hi! I'm Glowy 🐰. How can I help you with your skin today?", sender: 'glowy' }
    ]);

    // Animation values
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const toggleOpen = () => {
        if (isOpen) {
            // Close
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start(() => setIsOpen(false));
        } else {
            // Open
            setIsOpen(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400, // Slower for smooth slide
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const glowyMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm just a demo right now, but I think you look great! ✨",
                sender: 'glowy'
            };
            setMessages(prev => [...prev, glowyMsg]);
        }, 1000);
    };

    return (
        <>
            {/* Overlay Backdrop */}
            {isOpen && (
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.backdropTouch} onPress={toggleOpen} />
                </Animated.View>
            )}

            {/* Chat Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateY: slideAnim }] }
                ]}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#14B8A6', '#0D9488']}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('../../assets/glowy_rabbit.png')}
                                style={styles.headerAvatar}
                            />
                            <View style={styles.onlineBadge} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Glowy AI</Text>
                            <Text style={styles.headerStatus}>Always here to help</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={toggleOpen} style={styles.closeButton}>
                        <X color="white" size={24} />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Messages */}
                <ScrollView
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                >
                    {messages.map(msg => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : styles.glowyBubble
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                msg.sender === 'user' ? styles.userText : styles.glowyText
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                >
                    <View style={styles.inputArea}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask Glowy..."
                            value={input}
                            onChangeText={setInput}
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <LinearGradient
                                colors={['#14B8A6', '#0D9488']}
                                style={styles.sendGradient}
                            >
                                <Send color="white" size={20} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>

            {/* Floating Action Button (Always visible) */}
            {!isOpen && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={toggleOpen}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#ffffff', '#f0fdfa']}
                        style={styles.fabGradient}
                    >
                        <Image
                            source={require('../../assets/glowy_rabbit.png')}
                            style={styles.fabImage}
                        />
                        <View style={styles.sparkleBadge}>
                            <Sparkles size={12} color="white" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 90, // Just above tab bar
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 999,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderWidth: 2,
        borderColor: '#14B8A6',
    },
    fabImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        resizeMode: 'cover',
    },
    sparkleBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#F59E0B',
        borderRadius: 12,
        padding: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    backdropTouch: {
        flex: 1,
    },
    drawer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.7,
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 1001,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#14B8A6',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerStatus: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
    },
    closeButton: {
        padding: 4,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 24,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    userBubble: {
        backgroundColor: '#14B8A6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    glowyBubble: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userText: {
        color: 'white',
    },
    glowyText: {
        color: '#1F2937',
    },
    inputArea: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    sendGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
