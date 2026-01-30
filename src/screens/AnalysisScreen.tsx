import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { ChevronLeft, Lock, TrendingUp, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useHistory } from '../context/HistoryContext';
import { scanService } from '../services/scan-service';
import { SkinIssue } from '../types/scan.types';
import { getScoreCategory } from '../utils/score-calculator';
import { useAuth } from '../context/AuthContext';

interface AnalysisScreenProps {
    navigation: any;
    route: any;
}

export function AnalysisScreen({ navigation, route }: AnalysisScreenProps) {
    const { addScanLog } = useHistory();
    const { user } = useAuth();
    const [skinScore, setSkinScore] = useState(0);
    const [skinIssues, setSkinIssues] = useState<SkinIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scoreCategory, setScoreCategory] = useState({ category: '', description: '', color: '' });

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

            // Create scan with AI analysis
            const scan = await scanService.createScan(imageUri, user.id);

            // Update state with results
            setSkinScore(scan.skin_score);
            setSkinIssues(scan.issues);
            setScoreCategory(getScoreCategory(scan.skin_score));

            // Log to history
            const detectedIssues = scan.issues
                .filter(issue => issue.detected)
                .map(issue => issue.name);
            addScanLog(scan.skin_score, detectedIssues);

        } catch (err: any) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze skin. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#14B8A6" />
                <Text style={styles.loadingText}>Analyzing your skin...</Text>
                <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.retryButton}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Analysis Results</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Skin Score Card */}
                    <Animatable.View animation="fadeInUp" duration={600}>
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.scoreCard}
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

                    {/* Free Preview Notice */}
                    <Animatable.View animation="fadeInUp" delay={100} style={styles.noticeCard}>
                        <Info size={20} color="#D97706" />
                        <View style={styles.noticeContent}>
                            <Text style={styles.noticeTitle}>Free Preview</Text>
                            <Text style={styles.noticeText}>
                                Upgrade to unlock detailed remedies, routines & product recommendations
                            </Text>
                        </View>
                    </Animatable.View>

                    {/* Detected Issues */}
                    <View style={styles.issuesSection}>
                        <Text style={styles.sectionTitle}>Detected Concerns</Text>

                        {skinIssues.map((issue, index) => (
                            <Animatable.View
                                key={issue.name}
                                animation="fadeInLeft"
                                delay={200 + index * 50}
                                style={styles.issueCard}
                            >
                                <View style={styles.issueHeader}>
                                    <View style={styles.issueInfo}>
                                        <View style={[
                                            styles.severityDot,
                                            { backgroundColor: issue.severity > 60 ? '#EF4444' : issue.severity > 40 ? '#F59E0B' : '#10B981' }
                                        ]} />
                                        <View>
                                            <Text style={styles.issueName}>{issue.name}</Text>
                                            <Text style={styles.severityText}>
                                                {issue.severity > 60 ? 'High' : issue.severity > 40 ? 'Moderate' : 'Mild'} severity
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.severityValue}>{issue.severity}%</Text>
                                </View>

                                {/* Progress bar with blur */}
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${issue.severity}%` }]} />
                                    </View>
                                    <View style={styles.blurOverlay}>
                                        <Lock size={16} color="#9CA3AF" />
                                    </View>
                                </View>

                                {/* Blurred remedy */}
                                <View style={styles.remedyContainer}>
                                    <Text style={styles.remedyText}>
                                        Use gentle cleansers with salicylic acid. Apply niacinamide serum...
                                    </Text>
                                    <View style={styles.remedyLock}>
                                        <Lock size={12} color="#9CA3AF" />
                                    </View>
                                </View>
                            </Animatable.View>
                        ))}
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Sticky CTA */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Paywall')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.ctaButton}
                        >
                            <Lock size={20} color="white" />
                            <Text style={styles.ctaText}>Unlock Full Analysis for ₹99</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.ctaSubtext}>
                        One-time payment • Lifetime access • Cancel anytime
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
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
        backgroundColor: '#FEF3C7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    noticeContent: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#92400E',
        marginBottom: 4,
    },
    noticeText: {
        fontSize: 12,
        color: '#78350F',
        lineHeight: 18,
    },
    issuesSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    issueCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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
        color: '#1F2937',
        marginBottom: 4,
    },
    severityText: {
        fontSize: 12,
        color: '#6B7280',
    },
    severityValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
    },
    progressContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#14B8A6',
        borderRadius: 4,
    },
    blurOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
        color: '#6B7280',
        marginTop: 12,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#14B8A6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
