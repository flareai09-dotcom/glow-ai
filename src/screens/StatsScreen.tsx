import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { ChevronLeft, TrendingUp, Calendar, CheckCircle, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export function StatsScreen({ navigation }: { navigation: any }) {
    const { scanHistory, getWeeklyRoutineStats } = useHistory();
    const { isDark } = useTheme();

    const weeklyStats = getWeeklyRoutineStats();

    // Calculate average score
    const avgScore = scanHistory.length > 0
        ? Math.round(scanHistory.reduce((acc, curr) => acc + curr.score, 0) / scanHistory.length)
        : 0;

    const latestScore = scanHistory.length > 0 ? scanHistory[0].score : 0;
    const improvement = scanHistory.length > 1
        ? latestScore - scanHistory[scanHistory.length - 1].score
        : 0;

    const themeStyles = {
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white' },
        chartBarBg: { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
        divider: { backgroundColor: isDark ? '#374151' : '#E5E7EB' },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <View style={styles.header}>
                <View style={{ width: 40 }} />
                <Text style={[styles.headerTitle, themeStyles.text]}>Your Progress</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Insights Card */}
                <Animatable.View animation="fadeInDown" style={styles.insightCard}>
                    <LinearGradient
                        colors={['#14B8A6', '#0D9488']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.insightGradient}
                    >
                        <View style={styles.insightRow}>
                            <View>
                                <Text style={styles.insightLabel}>Current Skin Score</Text>
                                <Text style={styles.insightValue}>{latestScore}</Text>
                            </View>
                            <View style={styles.trendContainer}>
                                {improvement >= 0 ? (
                                    <TrendingUp size={24} color="#D1FAE5" />
                                ) : (
                                    <Activity size={24} color="#FECACA" />
                                )}
                                <Text style={styles.trendText}>
                                    {improvement > 0 ? `+${improvement}` : improvement} pts total change
                                </Text>
                            </View>
                        </View>
                        <View style={styles.insightFooter}>
                            <Text style={styles.insightSubtext}>
                                You're doing great! Keep up the consistency.
                            </Text>
                        </View>
                    </LinearGradient>
                </Animatable.View>

                {/* Routine Consistency Chart */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Routine Consistency</Text>
                    <View style={[styles.chartCard, themeStyles.card]}>
                        <View style={styles.barChartContainer}>
                            {weeklyStats.map((stat, index) => (
                                <View key={index} style={styles.barColumn}>
                                    <View style={[styles.barBg, themeStyles.chartBarBg]}>
                                        <Animatable.View
                                            animation="fadeInUp"
                                            delay={index * 100}
                                            style={[
                                                styles.barFill,
                                                { height: `${stat.score}%`, backgroundColor: stat.score >= 80 ? '#10B981' : stat.score >= 50 ? '#F59E0B' : '#EF4444' }
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.barLabel, themeStyles.subText]}>{stat.day}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={[styles.chartCaption, themeStyles.subText]}>Last 7 Days Activity</Text>
                    </View>
                </View>

                {/* Recent Scans List */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>Recent Analysis</Text>
                    <View style={styles.historyList}>
                        {scanHistory.slice(0, 5).map((scan, index) => (
                            <Animatable.View
                                key={scan.id}
                                animation="fadeInRight"
                                delay={index * 100}
                                style={[styles.historyItem, themeStyles.card]}
                            >
                                <View style={styles.historyDateBox}>
                                    <Calendar size={18} color="#14B8A6" />
                                    <Text style={styles.historyDateText}>
                                        {new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>
                                <View style={styles.historyInfo}>
                                    <Text style={[styles.historyScoreLabel, themeStyles.subText]}>Score</Text>
                                    <Text style={[styles.historyScoreValue, themeStyles.text]}>{scan.score}</Text>
                                </View>
                                <View style={styles.historyIssues}>
                                    {scan.issues.slice(0, 2).map((issue, i) => (
                                        <View key={i} style={styles.issueTag}>
                                            <Text style={styles.issueTagText}>{issue}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Animatable.View>
                        ))}
                        {scanHistory.length === 0 && (
                            <Text style={[styles.emptyText, themeStyles.subText]}>No scans recorded yet.</Text>
                        )}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    insightCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    insightGradient: {
        padding: 24,
    },
    insightRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    insightLabel: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginBottom: 4,
    },
    insightValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    trendContainer: {
        alignItems: 'flex-end',
    },
    trendText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 4,
    },
    insightFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        paddingTop: 12,
    },
    insightSubtext: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartCard: {
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    barChartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 150,
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    barColumn: {
        alignItems: 'center',
        flex: 1,
    },
    barBg: {
        width: 12, // slightly wider bars
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    barFill: {
        borderRadius: 6,
        width: '100%',
    },
    barLabel: {
        fontSize: 12,
        marginTop: 8,
    },
    chartCaption: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 8,
    },
    historyList: {
        gap: 12,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    historyDateBox: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    historyDateText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0D9488',
        marginTop: 4,
    },
    historyInfo: {
        flex: 1,
    },
    historyScoreLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    historyScoreValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    historyIssues: {
        flexDirection: 'row',
        gap: 8,
    },
    issueTag: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    issueTagText: {
        fontSize: 10,
        color: '#6B7280',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
});
