import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { X, Check, Sparkles, TrendingUp, ShoppingBag, Shield, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

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
    const handlePurchase = () => {
        // Simulate purchase and navigate back
        setTimeout(() => {
            navigation.navigate('Home');
        }, 500);
    };

    return (
        <LinearGradient
            colors={['#FAF7F5', '#FEFEFE', '#F5D5CB']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ width: 40 }} />
                    <Text style={styles.headerTitle}>Upgrade to Premium</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <Animatable.View animation="fadeInUp" style={styles.heroSection}>
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.iconBox}
                        >
                            <Sparkles size={48} color="white" strokeWidth={2} />
                        </LinearGradient>

                        <Text style={styles.heroTitle}>Unlock Your Best Skin</Text>
                        <Text style={styles.heroSubtitle}>
                            Get lifetime access to personalized skincare insights and expert recommendations
                        </Text>
                    </Animatable.View>

                    {/* Pricing Card */}
                    <Animatable.View animation="fadeInUp" delay={100} style={styles.pricingCard}>
                        <View style={styles.priceRow}>
                            <Text style={styles.oldPrice}>₹999</Text>
                            <Text style={styles.newPrice}>₹99</Text>
                        </View>
                        <Text style={styles.pricingSubtext}>One-time payment, lifetime access</Text>

                        <View style={styles.offerBadge}>
                            <Text style={styles.offerText}>🎉 Limited Time: 90% OFF</Text>
                        </View>
                    </Animatable.View>

                    {/* Features */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.sectionTitle}>What's Included</Text>

                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Animatable.View
                                    key={feature.title}
                                    animation="fadeInLeft"
                                    delay={200 + index * 100}
                                    style={styles.featureCard}
                                >
                                    <View style={styles.featureIconBox}>
                                        <Icon size={24} color="#14B8A6" strokeWidth={2} />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>{feature.title}</Text>
                                        <Text style={styles.featureDescription}>{feature.description}</Text>
                                    </View>
                                    <Check size={20} color="#14B8A6" />
                                </Animatable.View>
                            );
                        })}
                    </View>

                    {/* Trust Badges */}
                    <Animatable.View animation="fadeInUp" delay={600} style={styles.trustSection}>
                        <View style={styles.trustBadge}>
                            <Shield size={24} color="#14B8A6" />
                            <Text style={styles.trustText}>Secure{'\n'}Payment</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.trustBadge}>
                            <Text style={styles.trustValue}>10k+</Text>
                            <Text style={styles.trustText}>Happy{'\n'}Users</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.trustBadge}>
                            <Text style={styles.trustValue}>4.8★</Text>
                            <Text style={styles.trustText}>App{'\n'}Rating</Text>
                        </View>
                    </Animatable.View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Sticky CTA */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity onPress={handlePurchase} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.ctaButton}
                        >
                            <Text style={styles.ctaText}>Get Lifetime Access for ₹99</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.ctaSubtext}>
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
        color: '#1F2937',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 24,
    },
    pricingCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#14B8A6',
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
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    newPrice: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    pricingSubtext: {
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 16,
    },
    offerBadge: {
        backgroundColor: '#F0FDFA',
        borderRadius: 16,
        padding: 12,
    },
    offerText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#14B8A6',
    },
    featuresSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    featureIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F0FDFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    trustSection: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    trustBadge: {
        alignItems: 'center',
    },
    trustValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    trustText: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 14,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    ctaButton: {
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ctaSubtext: {
        textAlign: 'center',
        fontSize: 12,
        color: '#6B7280',
        marginTop: 12,
    },
});
