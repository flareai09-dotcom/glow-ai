import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Lock, TrendingUp, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useHistory } from '../context/HistoryContext';
import { scanService } from '../services/scan-service';
import { profileService } from '../services/profile-service';
import { SkinIssue } from '../types/scan.types';
import { getScoreCategory } from '../utils/score-calculator';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AnalysisScreenProps {
    navigation: any;
    route: any;
}

export function AnalysisScreen({ navigation, route }: AnalysisScreenProps) {
    const { addScanLog, refreshHistory } = useHistory();
    const { user } = useAuth();
    const [scan, setScan] = useState<any>(null);
    const [skinScore, setSkinScore] = useState(0);
    const [skinIssues, setSkinIssues] = useState<SkinIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scoreCategory, setScoreCategory] = useState({ category: '', description: '', color: '' });
    const [isPremium, setIsPremium] = useState(false);
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        header: { backgroundColor: colors.background, borderBottomColor: colors.border },
        lockBlur: { backgroundColor: `${colors.background}CC` }, // 80% opacity
    };

    useEffect(() => {
        analyzeSkin();
    }, []);

    const analyzeSkin = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get image URI from route params
            const { imageUri } = route.params || {};

            if (!imageUri) {
                throw new Error('No image provided');
            }

            if (!user?.id) {
                throw new Error('User not authenticated');
            }

            // Fetch Profile (for Premium Status) & Create Scan in parallel
            const [profile, scan] = await Promise.all([
                profileService.getProfile(user.id),
                scanService.createScan(imageUri, user.id)
            ]);

            setIsPremium(!!profile?.is_premium);

            // Update state with results
            setScan(scan);
            setSkinScore(scan.skin_score);
            setSkinIssues(scan.issues);
            setScoreCategory(getScoreCategory(scan.skin_score));

            // Log to history
            const detectedIssues = scan.issues
                .filter(issue => issue.detected)
                .map(issue => issue.name);
            addScanLog(scan.skin_score, detectedIssues);
            refreshHistory();

        } catch (err: any) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze skin. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, themeStyles.container]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, themeStyles.text]}>Analyzing your skin...</Text>
                <Text style={[styles.loadingSubtext, themeStyles.subText]}>This may take a few seconds</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent, themeStyles.container]}>
                <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {error}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                >
                    <Text style={[styles.retryButtonText, { color: colors.background }]}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                {/* Header */}
                <View style={[styles.header, themeStyles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, themeStyles.text]}>Analysis Results</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
                    {/* Skin Score Card */}
                    <Animatable.View animation="fadeInUp" duration={600}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={[styles.scoreCard, { shadowColor: colors.primary }]}
                        >
                            <View style={styles.scoreHeader}>
                                <View>
                                    <Text style={styles.scoreLabel}>Your Skin Score</Text>
                                    <Text style={styles.scoreValue}>{skinScore}</Text>
                                </View>
                                <View style={styles.scoreBadge}>
                                    <TrendingUp size={40} color="white" />
                                </View>
                            </View>
                            <Text style={styles.scoreDescription}>
                                {scoreCategory.description}
                            </Text>
                        </LinearGradient>
                    </Animatable.View>

                    {/* AI Analysis Summary */}
                    {scan.analysis_summary && (
                        <Animatable.View animation="fadeInUp" delay={200} style={[styles.summaryCard, themeStyles.card]}>
                            <Text style={[styles.summaryTitle, themeStyles.text]}>Expert Analysis</Text>
                            <Text style={[styles.summaryText, themeStyles.subText]}>{scan.analysis_summary}</Text>
                        </Animatable.View>
                    )}

                    {/* Free Preview Notice */}
                    <Animatable.View animation="fadeInUp" delay={100} style={styles.noticeCard}>
                        <Info size={20} color="#F59E0B" />
                        <View style={styles.noticeContent}>
                            <Text style={styles.noticeTitle}>Free Preview</Text>
                            <Text style={styles.noticeText}>
                                Upgrade to unlock detailed remedies, routines & product recommendations
                            </Text>
                        </View>
                    </Animatable.View>

                    {/* Actionable Remedies Section (Premium Locked) */}
                    <View style={styles.issuesSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, themeStyles.text]}>Actionable Remedies</Text>
                            {!isPremium && <Lock size={16} color="#F59E0B" />}
                        </View>

                        {/* If Premium: Show Real Remedies */}
                        {isPremium ? (
                            <View style={styles.remediesList}>
                                {scan.remedies && scan.remedies.length > 0 ? (
                                    scan.remedies.map((remedy: string, index: number) => (
                                        <View key={index} style={[styles.remedyCard, themeStyles.card, { borderLeftColor: colors.primary, shadowColor: colors.primary }]}>
                                            <View style={[styles.remedyNumber, { backgroundColor: `${colors.primary}1A` }]}>
                                                <Text style={[styles.remedyNumberText, { color: colors.primary }]}>{index + 1}</Text>
                                            </View>
                                            <Text style={[styles.remedyTextActive, themeStyles.text]}>{remedy}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={[styles.noRemediesText, themeStyles.subText]}>No specific remedies found for this scan.</Text>
                                )}
                            </View>
                        ) : (
                            /* If Free: Show Blurred Placeholders */
                            <View style={styles.blurredContainer}>
                                <View style={[styles.remedyCardBlurred, themeStyles.card]}>
                                    <Text style={[styles.remedyTextBlurred, themeStyles.subText]}>Use a gentle cleanser with Salicylic Acid to unclog pores...</Text>
                                </View>
                                <View style={[styles.remedyCardBlurred, themeStyles.card]}>
                                    <Text style={[styles.remedyTextBlurred, themeStyles.subText]}>Apply Niacinamide serum to reduce inflammation...</Text>
                                </View>

                                <View style={[styles.blurOverlay, themeStyles.lockBlur]}>
                                    <View style={styles.lockCircle}>
                                        <Lock size={24} color="white" />
                                    </View>
                                    <Text style={[styles.unlockText, themeStyles.text]}>Unlock Personalized Remedies</Text>
                                    <Text style={[styles.unlockSubtext, themeStyles.subText]}>Get dermatologist-grade advice for YOUR skin</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Routine & Ingredients (Deep Analysis) */}
                    {isPremium && (
                        <Animatable.View animation="fadeInUp" delay={400}>
                            {scan.routine_suggestions && scan.routine_suggestions.length > 0 && (
                                <View style={styles.issuesSection}>
                                    <Text style={[styles.sectionTitle, themeStyles.text]}>Personalized Routine</Text>
                                    <View style={styles.remediesList}>
                                        {scan.routine_suggestions.map((step: string, index: number) => (
                                            <View key={index} style={[styles.remedyCard, themeStyles.card, { borderLeftColor: colors.secondary }]}>
                                                <Text style={[styles.remedyTextActive, themeStyles.text]}>{step}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {scan.product_ingredients && scan.product_ingredients.length > 0 && (
                                <View style={styles.issuesSection}>
                                    <Text style={[styles.sectionTitle, themeStyles.text]}>Key Ingredients for You</Text>
                                    <View style={styles.benefitsContainer}>
                                        {scan.product_ingredients.map((ingredient: string, index: number) => (
                                            <View key={index} style={[styles.benefitTag, { backgroundColor: `${colors.primary}1A`, borderColor: colors.primary, marginRight: 8, marginBottom: 8 }]}>
                                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{ingredient}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </Animatable.View>
                    )}

                    {/* Detected Issues */}
                    <View style={styles.issuesSection}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Detected Concerns</Text>

                        {skinIssues.map((issue, index) => (
                            <Animatable.View
                                key={issue.name}
                                animation="fadeInLeft"
                                delay={200 + index * 50}
                                style={[styles.issueCard, themeStyles.card, { shadowColor: colors.primary }]}
                            >
                                <View style={styles.issueHeader}>
                                    <View style={styles.issueInfo}>
                                        <View style={[
                                            styles.severityDot,
                                            { backgroundColor: issue.severity > 60 ? colors.error : issue.severity > 40 ? '#F59E0B' : colors.success }
                                        ]} />
                                        <View>
                                            <Text style={[styles.issueName, themeStyles.text]}>{issue.name}</Text>
                                            <Text style={[styles.severityText, themeStyles.subText]}>
                                                {issue.severity > 60 ? 'High' : issue.severity > 40 ? 'Moderate' : 'Mild'} severity
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.severityValue, themeStyles.text]}>{issue.severity}%</Text>
                                </View>

                                <View style={styles.progressContainer}>
                                    <View style={[styles.progressBar, { backgroundColor: `${colors.text}1A` }]}>
                                        <View style={[styles.progressFill, { width: `${issue.severity}%`, backgroundColor: issue.severity > 60 ? colors.error : issue.severity > 40 ? '#F59E0B' : colors.success }]} />
                                    </View>
                                </View>
                            </Animatable.View>
                        ))}
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Sticky CTA */}
                <View style={[styles.ctaContainer, themeStyles.header, { shadowColor: colors.primary }]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Paywall')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.ctaButton}
                        >
                            <Lock size={20} color="white" />
                            <Text style={styles.ctaText}>Unlock Full Analysis for ₹99</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.ctaSubtext, themeStyles.subText]}>
                        One-time payment • Lifetime access • Cancel anytime
                    </Text>
                </View>
            </SafeAreaView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
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
        backgroundColor: '#09090B',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 229, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    scoreCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    scoreBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    scoreDescription: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        lineHeight: 20,
    },
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(245, 158, 11, 0.1)', // Amber with low opacity
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    noticeContent: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FCD34D',
        marginBottom: 4,
    },
    noticeText: {
        fontSize: 12,
        color: '#FDE68A',
        lineHeight: 18,
    },
    issuesSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 16,
    },
    issueCard: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    issueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    issueInfo: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    issueName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    severityText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    severityValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    progressContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#1E293B',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00E5FF',
        borderRadius: 4,
    },
    blurOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(9, 9, 11, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remedyContainer: {
        position: 'relative',
    },
    remedyText: {
        fontSize: 12,
        color: '#6B7280',
        opacity: 0.3,
    },
    remedyLock: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ctaSubtext: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 12,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#09090B',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#09090B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Remedies Styles
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 8,
    },
    remediesList: {
        gap: 12,
        marginBottom: 24,
    },
    remedyCard: {
        backgroundColor: '#12121A',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: '#00E5FF',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    remedyNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remedyNumberText: {
        color: '#00E5FF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    remedyTextActive: {
        flex: 1,
        fontSize: 14,
        color: '#E2E8F0',
        lineHeight: 20,
    },
    noRemediesText: {
        fontStyle: 'italic',
        color: '#94A3B8',
        textAlign: 'center',
    },
    blurredContainer: {
        position: 'relative',
        gap: 12,
        marginBottom: 24,
    },
    remedyCardBlurred: {
        backgroundColor: '#12121A',
        padding: 16,
        borderRadius: 16,
        opacity: 0.5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    remedyTextBlurred: {
        color: '#94A3B8',
        fontSize: 14,
        filter: 'blur(4px)', // Note: React Native needs prop extraction for real blur, but opacity helps simulation
    },
    lockCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    unlockText: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    unlockSubtext: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 4,
    },
    // AI Summary Styles
    summaryCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        backgroundColor: '#12121A',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.1)',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    // Benefits Tags
    benefitsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    benefitTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
});
