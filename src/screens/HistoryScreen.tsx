import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Calendar, TrendingUp } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { scanService } from '../services/scan-service';
import { Scan } from '../types/scan.types';
import { useTheme } from '../context/ThemeContext';

export function HistoryScreen({ navigation }: { navigation: any }) {
    const { user } = useAuth();
    const [scans, setScans] = useState<Scan[]>([]);
    const [weeklyProgress, setWeeklyProgress] = useState<{ day: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        backBtn: { backgroundColor: colors.card, borderColor: colors.border },
        dateBox: { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}33` },
        barInactive: { backgroundColor: colors.border },
        barActive: { backgroundColor: colors.primary },
    };

    useEffect(() => {
        loadHistoryData();
    }, [user]);

    const loadHistoryData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const fetchedScans = await scanService.getUserScans(user.id);
            setScans(fetchedScans);

            const scores = await scanService.getWeeklyScores(user.id);
            setWeeklyProgress(scores);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, themeStyles.backBtn]}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, themeStyles.text]}>Scan History</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={[styles.content, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };
    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, themeStyles.backBtn]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Scan History</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]}>
                <View style={[styles.chartCard, themeStyles.card]}>
                    <View style={styles.chartHeader}>
                        <TrendingUp size={20} color={colors.primary} />
                        <Text style={[styles.chartTitle, themeStyles.text]}>Progress Trend</Text>
                    </View>
                    <View style={styles.placeholderChart}>
                        {weeklyProgress.length > 0 ? weeklyProgress.map((dayData, index) => (
                            <View key={index} style={[styles.barContainer, { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', marginHorizontal: 2 }]}>
                                <View style={[styles.bar, {
                                    height: `${Math.max(10, dayData.score)}%`,
                                    width: '100%'
                                }, index === weeklyProgress.length - 1 ? themeStyles.barActive : themeStyles.barInactive]} />
                            </View>
                        )) : (
                            <Text style={[styles.chartLabel, themeStyles.subText]}>No recent data</Text>
                        )}
                    </View>
                    <View style={styles.chartLabels}>
                        {weeklyProgress.map((d, i) => (
                            <Text key={i} style={[styles.chartLabel, themeStyles.subText, { fontSize: 10 }]}>{d.day}</Text>
                        ))}
                    </View>
                </View>

                <Text style={[styles.sectionTitle, themeStyles.text]}>Recent Scans</Text>

                <View style={styles.list}>
                    {scans.length > 0 ? scans.map((item, index) => {
                        const { date, time } = formatDate(item.created_at);
                        const topIssues = item.issues.filter(i => i.detected).slice(0, 2).map(i => i.name);

                        return (
                            <TouchableOpacity key={item.id} style={[styles.historyItem, themeStyles.card]}>
                                <View style={[styles.dateBox, themeStyles.dateBox]}>
                                    <Text style={[styles.dateText, themeStyles.primaryText]}>{date.split(' ')[1]}</Text>
                                    <Text style={[styles.dateSub, themeStyles.primaryText]}>{date.split(' ')[0]}</Text>
                                </View>
                                <Image
                                    source={{ uri: item.thumbnail_url || item.image_url }}
                                    style={styles.scanThumbnail}
                                    resizeMode="cover"
                                />
                                <View style={styles.itemContent}>
                                    <View style={styles.scoreRow}>
                                        <Text style={[styles.scoreLabel, themeStyles.subText]}>Skin Score</Text>
                                        <Text style={[styles.scoreValue, { color: item.skin_score >= 75 ? colors.success : item.skin_score >= 50 ? '#F59E0B' : colors.error }]}>
                                            {item.skin_score}
                                        </Text>
                                    </View>
                                    {topIssues.length > 0 ? (
                                        <Text style={[styles.improvements, themeStyles.subText]}>
                                            Issues: {topIssues.join(', ')}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.improvements, themeStyles.subText]}>
                                            No major issues detected
                                        </Text>
                                    )}
                                </View>
                                <ChevronLeft size={20} color={colors.border} style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>
                        )
                    }) : (
                        <Text style={[{ textAlign: 'center', marginTop: 20 }, themeStyles.subText]}>No scans yet. Take a selfie to get started!</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView >
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
        backgroundColor: '#12121A',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    content: {
        padding: 24,
    },
    chartCard: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    placeholderChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
        paddingHorizontal: 16,
        gap: 16,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        marginHorizontal: 2,
    },
    bar: {
        width: '100%',
        backgroundColor: '#1E293B',
        borderRadius: 8,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    chartLabel: {
        fontSize: 12,
        color: '#94A3B8',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 16,
    },
    list: {
        gap: 12,
    },
    historyItem: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 16,
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
    dateBox: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderRadius: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    dateText: {
        fontWeight: 'bold',
        color: '#00E5FF',
        fontSize: 12,
    },
    dateSub: {
        fontSize: 10,
        color: '#00E5FF',
    },
    scanThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#1E293B',
    },
    itemContent: {
        flex: 1,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    scoreLabel: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    scoreValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    improvements: {
        fontSize: 12,
        color: '#94A3B8',
    },
});
