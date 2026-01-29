import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react-native';

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

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & FAQs</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqItem}
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.questionRow}>
                                <Text style={styles.question}>{faq.question}</Text>
                                {expandedIndex === index ?
                                    <ChevronUp size={20} color="#6B7280" /> :
                                    <ChevronDown size={20} color="#6B7280" />
                                }
                            </View>
                            {expandedIndex === index && (
                                <Text style={styles.answer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.contactCard}>
                    <View style={styles.iconBox}>
                        <MessageCircle size={24} color="#14B8A6" />
                    </View>
                    <View style={styles.flex1}>
                        <Text style={styles.contactTitle}>Still have questions?</Text>
                        <Text style={styles.contactSubtitle}>Our team is happy to help.</Text>
                    </View>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>Contact Us</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
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
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
    },
    faqContainer: {
        gap: 16,
        marginBottom: 32,
    },
    faqItem: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
        paddingRight: 16,
    },
    answer: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    contactSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    contactButton: {
        backgroundColor: '#14B8A6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
