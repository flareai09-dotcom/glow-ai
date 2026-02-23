import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { X, Check, Sparkles, TrendingUp, ShoppingBag, Shield, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';

interface PaywallScreenProps {
    navigation: any;
}

const features = [
    {
        icon: Sparkles,
        title: 'Unlimited AI Scans',
        description: 'Track your skin progress weekly',
    },
    {
        icon: TrendingUp,
        title: 'Detailed Analysis',
        description: 'Complete breakdown of all skin concerns',
    },
    {
        icon: ShoppingBag,
        title: 'Product Recommendations',
        description: 'Budget-friendly Indian skincare products',
    },
    {
        icon: Zap,
        title: 'Free Original Remedies',
        description: 'Dermatologist-verified home treatments',
    },
];

export function PaywallScreen({ navigation }: PaywallScreenProps) {
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        iconBg: { backgroundColor: `${colors.primary}1A` },
        ctaBg: { backgroundColor: colors.background, borderTopColor: colors.border, shadowColor: colors.primary },
        badgeBg: { backgroundColor: `${colors.primary}33` },
        divider: { backgroundColor: colors.border },
    };

    const handlePurchase = () => {
        // Simulate purchase and navigate back
        setTimeout(() => {
            navigation.navigate('Home');
        }, 500);
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.background]}
            style={styles.container}
        >
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ width: 40 }} />
                    <Text style={[styles.headerTitle, themeStyles.text]}>Upgrade to Premium</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.closeButton, { backgroundColor: colors.card }]}>
                        <X size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <Animatable.View animation="fadeInUp" style={styles.heroSection}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.iconBox}
                        >
                            <Sparkles size={48} color="white" strokeWidth={2} />
                        </LinearGradient>

                        <Text style={[styles.heroTitle, themeStyles.text]}>Unlock Your Best Skin</Text>
                        <Text style={[styles.heroSubtitle, themeStyles.subText]}>
                            Get lifetime access to personalized skincare insights and expert recommendations
                        </Text>
                    </Animatable.View>

                    {/* Pricing Card */}
                    <Animatable.View animation="fadeInUp" delay={100} style={[styles.pricingCard, themeStyles.card]}>
                        <View style={styles.priceRow}>
                            <Text style={[styles.oldPrice, themeStyles.subText]}>₹999</Text>
                            <Text style={[styles.newPrice, themeStyles.text]}>₹99</Text>
                        </View>
                        <Text style={[styles.pricingSubtext, themeStyles.subText]}>One-time payment, lifetime access</Text>

                        <View style={[styles.offerBadge, themeStyles.badgeBg]}>
                            <Text style={[styles.offerText, themeStyles.primaryText]}>🎉 Limited Time: 90% OFF</Text>
                        </View>
                    </Animatable.View>

                    {/* Features */}
                    <View style={styles.featuresSection}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>What's Included</Text>

                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Animatable.View
                                    key={feature.title}
                                    animation="fadeInLeft"
                                    delay={200 + index * 100}
                                    style={[styles.featureCard, themeStyles.card]}
                                >
                                    <View style={[styles.featureIconBox, themeStyles.iconBg]}>
                                        <Icon size={24} color={colors.primary} strokeWidth={2} />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={[styles.featureTitle, themeStyles.text]}>{feature.title}</Text>
                                        <Text style={[styles.featureDescription, themeStyles.subText]}>{feature.description}</Text>
                                    </View>
                                    <Check size={20} color={colors.primary} />
                                </Animatable.View>
                            );
                        })}
                    </View>

                    {/* Trust Badges */}
                    <Animatable.View animation="fadeInUp" delay={600} style={[styles.trustSection, themeStyles.card]}>
                        <View style={styles.trustBadge}>
                            <Shield size={24} color={colors.primary} />
                            <Text style={[styles.trustText, themeStyles.subText]}>Secure{'\n'}Payment</Text>
                        </View>
                        <View style={[styles.divider, themeStyles.divider]} />
                        <View style={styles.trustBadge}>
                            <Text style={[styles.trustValue, themeStyles.text]}>10k+</Text>
                            <Text style={[styles.trustText, themeStyles.subText]}>Happy{'\n'}Users</Text>
                        </View>
                        <View style={[styles.divider, themeStyles.divider]} />
                        <View style={styles.trustBadge}>
                            <Text style={[styles.trustValue, themeStyles.text]}>4.8★</Text>
                            <Text style={[styles.trustText, themeStyles.subText]}>App{'\n'}Rating</Text>
                        </View>
                    </Animatable.View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Sticky CTA */}
                <View style={[styles.ctaContainer, themeStyles.ctaBg]}>
                    <TouchableOpacity onPress={handlePurchase} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.ctaButton}
                        >
                            <Text style={styles.ctaText}>Get Lifetime Access for ₹99</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.ctaSubtext, themeStyles.subText]}>
                        Safe & secure payment • No hidden charges
                    </Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    iconBox: {
        width: 96,
        height: 96,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 12,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 24,
    },
    pricingCard: {
        backgroundColor: '#12121A',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#00E5FF',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 12,
    },
    oldPrice: {
        fontSize: 20,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    newPrice: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    pricingSubtext: {
        textAlign: 'center',
        color: '#94A3B8',
        marginBottom: 16,
    },
    offerBadge: {
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        borderRadius: 16,
        padding: 12,
    },
    offerText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    featuresSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 16,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    featureIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#94A3B8',
        lineHeight: 20,
    },
    trustSection: {
        flexDirection: 'row',
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    trustBadge: {
        alignItems: 'center',
    },
    trustValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    trustText: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 14,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0F0F13',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 229, 255, 0.2)',
        padding: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    ctaButton: {
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    ctaText: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ctaSubtext: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 12,
    },
});
