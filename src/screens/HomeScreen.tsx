import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Sun, Moon, TrendingUp, Calendar, Droplet, Flame, Camera, ShoppingBag, User, Edit2, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRoutine } from '../context/RoutineContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { scanService } from '../services/scan-service';
import { getScoreCategory } from '../utils/score-calculator';
import { profileService } from '../services/profile-service';
const { width } = Dimensions.get('window');

interface HomeScreenProps {
    navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const { morningTasks, nightTasks, toggleTask } = useRoutine();
    const currentHour = new Date().getHours();
    const [activeTab, setActiveTab] = React.useState<'morning' | 'night'>(
        currentHour >= 18 ? 'night' : 'morning'
    );

    // Real skin score data from database
    // Real skin score data from database
    const [skinScore, setSkinScore] = useState(0);
    const [userName, setUserName] = useState('Guest');
    const [weeklyProgress, setWeeklyProgress] = useState<{ day: string; score: number }[]>([]);
    const [currentDayName, setCurrentDayName] = useState('');
    const [premiumCount, setPremiumCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [user])
    );

    const loadData = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Load profile for name
            const profile = await profileService.getProfile(user.id);
            if (profile?.full_name) {
                setUserName(profile.full_name.split(' ')[0]); // Get first name
            } else {
                setUserName(user.email?.split('@')[0] || 'Guest');
            }

            // Load latest skin score
            const latestScan = await scanService.getLatestScan(user.id);
            if (latestScan) {
                setSkinScore(latestScan.skin_score);
            }

            // Load weekly progress
            const weeklyScores = await scanService.getWeeklyScores(user.id, 7);
            setWeeklyProgress(weeklyScores);

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            setCurrentDayName(dayNames[new Date().getDay()]);

            // Load premium count
            const count = await profileService.getPremiumUserCount();
            setPremiumCount(count);
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tasks = activeTab === 'morning' ? morningTasks : nightTasks;

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border
        },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        iconBoxPrimary: { backgroundColor: `${colors.primary}1A` },
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={styles.flex1} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <LinearGradient
                        colors={['#0F0C29', '#302B63', '#24243E']}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.welcomeText}>Welcome,</Text>
                                <Text style={styles.userName}>{userName} ⚡</Text>
                                <View style={styles.premiumBadgeContainer}>
                                    <Crown size={14} color="#FF003C" fill="#FF003C" />
                                    <Text style={styles.premiumCountText}>{premiumCount.toLocaleString()} Premium Members</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Premium')}
                                style={styles.premiumButton}
                            >
                                <LinearGradient
                                    colors={['#FF003C', '#FF007F', '#7928CA']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.premiumGradient}
                                >
                                    <Crown size={24} color="white" fill="white" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Skin Score Card */}
                        <Animatable.View
                            animation="fadeInUp"
                            duration={800}
                            style={styles.scoreCard}
                        >
                            <View style={styles.scoreHeader}>
                                <View>
                                    <Text style={styles.scoreLabel}>Current Skin Score</Text>
                                    <View style={styles.scoreValueRow}>
                                        <Text style={styles.scoreValue}>{skinScore || '--'}</Text>
                                        {skinScore > 0 && (
                                            <View style={styles.scoreTrend}>
                                                <TrendingUp size={16} color="#AEF3E1" />
                                                <Text style={styles.trendText}>{getScoreCategory(skinScore).category}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.congratsBadge}>
                                    <Text style={styles.congratsEmoji}>🎉</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${skinScore || 0}%` }]} />
                            </View>
                        </Animatable.View>
                    </LinearGradient>
                </View>

                <View style={styles.mainContent}>
                    {/* Quick Actions */}
                    <Animatable.View
                        animation="zoomIn"
                        style={[styles.quickActions, themeStyles.card]}
                    >
                        {[
                            { icon: Camera, label: 'New Scan', target: 'Camera', color: `${colors.primary}1A`, iconColor: colors.primary },
                            { icon: ShoppingBag, label: 'Products', target: 'Products', color: `${colors.error}1A`, iconColor: colors.error },
                            { icon: Calendar, label: 'History', target: 'History', color: `${colors.success}1A`, iconColor: colors.success },
                        ].map((action, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => action.target && navigation.navigate(action.target)}
                                style={styles.actionItem}
                            >
                                <View style={[styles.actionIconContainer, { backgroundColor: action.color, borderWidth: 1, borderColor: action.iconColor }]}>
                                    <action.icon size={24} color={action.iconColor} />
                                </View>
                                <Text style={[styles.actionLabel, themeStyles.text]}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animatable.View>

                    {/* Today's Routine */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, themeStyles.text]}>Today's Routine</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('EditRoutine')}>
                                <Edit2 size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.routineTabs}>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'morning' && [styles.activeTab, { borderColor: `${colors.primary}50` }], activeTab === 'morning' && { backgroundColor: `${colors.primary}1A` }]}
                                onPress={() => setActiveTab('morning')}
                            >
                                <Sun size={20} color={activeTab === 'morning' ? colors.primary : colors.subText} />
                                <Text style={[styles.tabText, activeTab === 'morning' ? { color: colors.primary } : { color: colors.subText }]}>Morning</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'night' && [styles.activeTab, { borderColor: `${colors.primary}50` }], activeTab === 'night' && { backgroundColor: `${colors.primary}1A` }]}
                                onPress={() => setActiveTab('night')}
                            >
                                <Moon size={20} color={activeTab === 'night' ? colors.primary : colors.subText} />
                                <Text style={[styles.tabText, activeTab === 'night' ? { color: colors.primary } : { color: colors.subText }]}>Evening</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tasksContainer}>
                            {tasks.map((task, index) => (
                                <TouchableOpacity
                                    key={task.id}
                                    onPress={() => toggleTask(task.id, activeTab)}
                                    activeOpacity={0.7}
                                >
                                    <Animatable.View
                                        animation="fadeInLeft"
                                        delay={index * 100}
                                        style={[styles.taskCard, themeStyles.card]}
                                    >
                                        <View style={[styles.taskCheck, { borderColor: colors.border }, task.completed ? [styles.taskDone, { backgroundColor: `${colors.success}1A`, borderColor: colors.success }] : styles.taskPending]}>
                                            {task.completed ? <Text style={styles.checkMark}>✓</Text> : <View style={styles.pendingDot} />}
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={[styles.taskName, themeStyles.text, task.completed && styles.taskNameDone]}>{task.name}</Text>
                                            <Text style={[styles.taskTime, themeStyles.subText]}>
                                                {task.completed ? `Completed` : task.time}
                                            </Text>
                                        </View>
                                    </Animatable.View>
                                </TouchableOpacity>
                            ))}
                            {tasks.length === 0 && (
                                <Text style={[styles.emptyText, themeStyles.subText]}>No tasks for this routine. Tap edit to add some!</Text>
                            )}
                        </View>
                    </View>

                    {/* Weekly Progress */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Weekly Progress</Text>
                        <View style={[styles.chartCard, themeStyles.card]}>
                            <View style={styles.chartContainer}>
                                {weeklyProgress.map((day, i) => (
                                    <View key={i} style={styles.chartBarContainer}>
                                        <View
                                            style={[
                                                styles.chartBar,
                                                { height: `${day.score}%` },
                                                day.day === currentDayName ? [styles.chartBarActive, { backgroundColor: colors.primary, shadowColor: colors.primary }] : [styles.chartBarInactive, { backgroundColor: colors.border }]
                                            ]}
                                        >
                                            {day.score > 0 && (
                                                <Text style={styles.barPercentageText}>{day.score}%</Text>
                                            )}
                                        </View>
                                        <Text style={styles.chartLabel}>{day.day}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Tip Card */}
                    <View style={styles.tipCardContainer}>
                        <LinearGradient
                            colors={['#1A002C', '#300018']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.tipGradient, { borderWidth: 1, borderColor: '#FF003C', borderRadius: 12 }]}
                        >
                            <View style={styles.tipRow}>
                                <View style={[styles.tipIconContainer, { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}4D` }]}>
                                    <Droplet size={24} color={colors.primary} />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={[styles.tipTitle, { color: colors.primary }]}>System Update</Text>
                                    <Text style={[styles.tipText, { color: '#E2E8F0' }]}>Hydration levels optimal. Maintain daily water intake for peak performance.</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, themeStyles.card]}>
                <TouchableOpacity style={styles.navItem}>
                    <Flame size={24} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.navTextActive, { color: colors.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Products')} style={styles.navItem}>
                    <ShoppingBag size={24} color={colors.subText} />
                    <Text style={[styles.navText, { color: colors.subText }]}>Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Camera')}
                    style={styles.fab}
                >
                    <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.fabGradient}>
                        <Camera size={28} color={colors.background} />
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Stats')}
                    style={styles.navItem}
                >
                    <TrendingUp size={24} color={colors.subText} />
                    <Text style={[styles.navText, { color: colors.subText }]}>Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navItem}>
                    <User size={24} color={colors.subText} />
                    <Text style={[styles.navText, { color: colors.subText }]}>Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
    },
    flex1: {
        flex: 1,
    },
    headerContainer: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 229, 255, 0.3)',
    },
    headerGradient: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    welcomeText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    premiumGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 60, 0.5)',
    },
    premiumCountText: {
        color: '#FF003C',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    scoreCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    scoreLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    scoreValueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    scoreValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    scoreTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        marginBottom: 4,
    },
    trendText: {
        color: '#AEF3E1',
        fontSize: 12,
        marginLeft: 4,
    },
    congratsBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    congratsEmoji: {
        fontSize: 24,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 4,
    },
    mainContent: {
        paddingHorizontal: 24,
        marginTop: -24,
    },
    quickActions: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionItem: {
        alignItems: 'center',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    routineTabs: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeTab: {
        borderWidth: 1,
    },
    tabText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 12,
    },
    activeTabText: {
        color: '#00E5FF',
    },
    inactiveTabText: {
        color: '#475569',
    },
    tasksContainer: {
        gap: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        padding: 20,
    },
    taskCard: {
        backgroundColor: '#12121A',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    taskCheck: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    taskDone: {
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        borderColor: '#00FF9D',
    },
    taskPending: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    checkMark: {
        color: 'white',
        fontWeight: 'bold',
    },
    pendingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#475569',
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    taskNameDone: {
        color: '#475569',
        textDecorationLine: 'line-through',
    },
    taskTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    chartCard: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 128,
        gap: 8,
    },
    chartBarContainer: {
        flex: 1,
        alignItems: 'center',
    },
    chartBar: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    chartBarActive: {
        backgroundColor: '#00E5FF',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    chartBarInactive: {
        backgroundColor: '#1E293B',
    },
    chartLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
    },
    barPercentageText: {
        fontSize: 9,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 2,
    },
    tipCardContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 96,
    },
    tipGradient: {
        padding: 24,
    },
    tipRow: {
        flexDirection: 'row',
        gap: 16,
    },
    tipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    tipTitle: {
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        color: '#374151',
        lineHeight: 20,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        backgroundColor: '#0F0F13',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 15,
        borderRadius: 32,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
    },
    navTextActive: {
        fontSize: 10,
        color: '#00E5FF',
        fontWeight: 'bold',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -55,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
