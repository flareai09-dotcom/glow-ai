import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ChevronLeft, TrendingUp, Calendar, CheckCircle, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { scanService } from '../services/scan-service';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export function StatsScreen({ navigation }: { navigation: any }) {
    const { user } = useAuth();
    const { scanHistory, getWeeklyRoutineStats, refreshHistory } = useHistory();
    const { colors } = useTheme();

    const [skinWeeklyProgress, setSkinWeeklyProgress] = useState<{ day: string; score: number }[]>([]);
    const [globalHighestProgress, setGlobalHighestProgress] = useState<{ day: string; score: number }[]>([]);

    useFocusEffect(
        useCallback(() => {
            refreshHistory();
            loadTrends();
        }, [])
    );

    const loadTrends = async () => {
        if (!user?.id) return;
        try {
            const [userScores, globalScores] = await Promise.all([
                scanService.getWeeklyScores(user.id),
                scanService.getGlobalHighestScores()
            ]);
            setSkinWeeklyProgress(userScores);
            setGlobalHighestProgress(globalScores);
        } catch (error) {
            console.error('Error loading trends:', error);
        }
    };

    const weeklyStats = getWeeklyRoutineStats();

    // Calculate average score
    const avgScore = scanHistory.length > 0
        ? Math.round(scanHistory.reduce((acc, curr) => acc + curr.score, 0) / scanHistory.length)
        : 0;

    const latestScore = scanHistory.length > 0 ? scanHistory[0].score : 0;
    const improvement = scanHistory.length > 1
        ? latestScore - scanHistory[1].score
        : 0;

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        subText: { color: colors.subText },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        divider: { backgroundColor: colors.border },
    };

    const chartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        color: (opacity = 1) => `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${opacity})`,
        labelColor: (opacity = 1) => colors.subText,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.primary
        },
        fillShadowGradientFrom: colors.primary,
        fillShadowGradientTo: colors.primary,
        fillShadowGradientFromOpacity: 0.3,
        fillShadowGradientToOpacity: 0.05,
        decimalPlaces: 0,
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayNames[new Date().getDay()];

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, themeStyles.text]}>Your Progress</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Insights Card */}
                    <Animatable.View animation="fadeInDown" style={styles.insightCard}>
                        <LinearGradient
                            colors={['#0F0C29', '#302B63']}
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
                                        <TrendingUp size={24} color={colors.success} />
                                    ) : (
                                        <Activity size={24} color={colors.error} />
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

                    {/* Skin Score Trend */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Skin Score Trend</Text>
                        <View style={[styles.chartCard, themeStyles.card]}>
                            <LineChart
                                data={{
                                    labels: skinWeeklyProgress.map((stat: any) => stat.day),
                                    datasets: [
                                        {
                                            data: skinWeeklyProgress.length > 0 ? skinWeeklyProgress.map((stat: any) => stat.score) : [0, 0, 0, 0, 0, 0, 0],
                                            color: (opacity = 1) => colors.primary,
                                            strokeWidth: 3
                                        },
                                        {
                                            data: globalHighestProgress.length > 0 ? globalHighestProgress.map((stat: any) => stat.score) : [0, 0, 0, 0, 0, 0, 0],
                                            color: (opacity = 1) => `rgba(255, 255, 255, 0.4)`, // Dotted/Transparent line for benchmark
                                            strokeWidth: 1,
                                            withDots: false
                                        }
                                    ],
                                    legend: ["You", "Community Highest"]
                                }}
                                width={width - 48}
                                height={200}
                                chartConfig={{
                                    ...chartConfig,
                                    propsForVerticalLabels: { fontSize: 10 },
                                    propsForHorizontalLabels: { fontSize: 10 }
                                }}
                                bezier
                                style={{
                                    marginVertical: 16,
                                    borderRadius: 16,
                                    marginLeft: -16
                                }}
                                withInnerLines={false}
                                withOuterLines={false}
                            />
                            <Text style={[styles.chartCaption, themeStyles.subText]}>Comparison against global best</Text>
                        </View>
                    </View>

                    {/* Routine Consistency Chart */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Routine Tracking</Text>
                        <View style={[styles.chartCard, themeStyles.card]}>
                            <LineChart
                                data={{
                                    labels: weeklyStats.map((stat: any) => stat.day),
                                    datasets: [
                                        {
                                            data: weeklyStats.length > 0 ? weeklyStats.map((stat: any) => stat.score) : [0, 0, 0, 0, 0, 0, 0]
                                        }
                                    ]
                                }}
                                width={width - 88} // padding
                                height={160}
                                chartConfig={chartConfig}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                    marginLeft: -16 // To pull the labels closer
                                }}
                                withInnerLines={false}
                                withOuterLines={false}
                            />
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
                                    animation="fadeInUp"
                                    delay={index * 100}
                                    style={[styles.historyCard, themeStyles.card]}
                                >
                                    <View style={styles.historyCardHeader}>
                                        <View style={[styles.miniDateBox, { backgroundColor: `${colors.primary}1A` }]}>
                                            <Calendar size={14} color={colors.primary} />
                                            <Text style={[styles.miniDateText, { color: colors.primary }]}>
                                                {new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </Text>
                                        </View>
                                        <View style={styles.scoreBadgeMini}>
                                            <Text style={[styles.scoreLabelMini, themeStyles.subText]}>Score</Text>
                                            <Text style={[styles.scoreValueMini, themeStyles.text]}>{scan.score}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.historyDivider} />

                                    <View style={styles.historyCardFooter}>
                                        <Text style={[styles.issuesLabelMini, themeStyles.subText]}>Primary Concerns:</Text>
                                        <View style={styles.historyIssues}>
                                            {scan.issues.length > 0 ? scan.issues.slice(0, 2).map((issue, i) => (
                                                <View key={i} style={[styles.issueTag, { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}40` }]}>
                                                    <Text style={[styles.issueTagText, { color: colors.primary }]}>{issue}</Text>
                                                </View>
                                            )) : (
                                                <Text style={[styles.noIssuesText, themeStyles.subText]}>No issues detected</Text>
                                            )}
                                        </View>
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
        </View>
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
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
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
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#00E5FF',
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
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
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
        gap: 20,
        paddingBottom: 20,
    },
    historyCard: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    historyCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    miniDateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    miniDateText: {
        fontSize: 12,
        fontWeight: '600',
    },
    scoreBadgeMini: {
        alignItems: 'flex-end',
    },
    scoreLabelMini: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scoreValueMini: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    historyDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 12,
    },
    historyCardFooter: {
        gap: 8,
    },
    issuesLabelMini: {
        fontSize: 11,
        fontWeight: '500',
    },
    historyIssues: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    issueTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    issueTagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    noIssuesText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
});
