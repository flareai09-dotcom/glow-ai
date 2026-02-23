import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, LayoutAnimation, Platform, UIManager, StatusBar } from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const faqs = [
    {
        question: "How does the skin analysis work?",
        answer: "Our AI analyzes your selfie using advanced computer vision algorithms to detect skin conditions like acne, wrinkles, and dark circles. It then provides a personalized score and routine."
    },
    {
        question: "Is my data private?",
        answer: "Yes, your privacy is our top priority. All photos are processed locally on your device or securely on our encrypted servers and are never shared with third parties."
    },
    {
        question: "Can I use Glow AI for free?",
        answer: "Yes! The core features including basic skin analysis are free. Premium members get unlimited scans, detailed reports, and priority support."
    },
    {
        question: "How often should I scan my face?",
        answer: "We recommend scanning once a week to track your progress effectively. Our AI tracks changes over time to show you how your skin is improving."
    },
];

export function HelpScreen({ navigation }: { navigation: any }) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const { colors } = useTheme();

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        subText: { color: colors.subText },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        iconBox: { backgroundColor: `${colors.primary}1A` },
        button: { backgroundColor: colors.primary },
        buttonText: { color: colors.background },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.card }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Help & FAQs</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Frequently Asked Questions</Text>

                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqItem}
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.questionRow}>
                                <Text style={[styles.question, themeStyles.text]}>{faq.question}</Text>
                                {expandedIndex === index ?
                                    <ChevronUp size={20} color={colors.primary} /> :
                                    <ChevronDown size={20} color={colors.primary} />
                                }
                            </View>
                            {expandedIndex === index && (
                                <Text style={[styles.answer, themeStyles.subText]}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.contactCard, themeStyles.card]}>
                    <View style={[styles.iconBox, themeStyles.iconBox]}>
                        <MessageCircle size={24} color={colors.primary} />
                    </View>
                    <View style={styles.flex1}>
                        <Text style={[styles.contactTitle, themeStyles.text]}>Still have questions?</Text>
                        <Text style={[styles.contactSubtitle, themeStyles.subText]}>Our team is happy to help.</Text>
                    </View>
                    <TouchableOpacity style={[styles.contactButton, themeStyles.button]}>
                        <Text style={[styles.contactButtonText, themeStyles.buttonText]}>Contact Us</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        elevation: 0,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 24,
    },
    faqContainer: {
        gap: 16,
        marginBottom: 32,
    },
    faqItem: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E2E8F0',
        flex: 1,
        paddingRight: 16,
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: '#94A3B8',
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: '#12121A',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    contactSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
    },
    contactButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    contactButtonText: {
        color: '#09090B',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
