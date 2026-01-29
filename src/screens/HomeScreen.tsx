import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Sun, Moon, TrendingUp, Calendar, Droplet, Flame, Camera, ShoppingBag, User, Edit2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRoutine } from '../context/RoutineContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    navigation: any;
}

const weeklyProgress = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 68 },
    { day: 'Wed', score: 64 },
    { day: 'Thu', score: 70 },
    { day: 'Fri', score: 72 },
    { day: 'Sat', score: 75 },
    { day: 'Sun', score: 78 },
];

export function HomeScreen({ navigation }: HomeScreenProps) {
    const { isDark } = useTheme();
    const { morningTasks, nightTasks, toggleTask } = useRoutine();
    const currentHour = new Date().getHours();
    const [activeTab, setActiveTab] = React.useState<'morning' | 'night'>(
        currentHour >= 18 ? 'night' : 'morning'
    );

    const tasks = activeTab === 'morning' ? morningTasks : nightTasks;

    const themeStyles = {
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white' },
        subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <LinearGradient
                        colors={isDark ? ['#0F766E', '#0D9488'] : ['#14B8A6', '#10B981']}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.welcomeText}>Welcome back,</Text>
                                <Text style={styles.userName}>Priya ✨</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Profile')}
                                style={styles.profileButton}
                            >
                                <User size={24} color="white" />
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
                                        <Text style={styles.scoreValue}>78</Text>
                                        <View style={styles.scoreTrend}>
                                            <TrendingUp size={16} color="#AEF3E1" />
                                            <Text style={styles.trendText}>+16 this week</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.congratsBadge}>
                                    <Text style={styles.congratsEmoji}>🎉</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: '78%' }]} />
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
                            { icon: Camera, label: 'New Scan', target: 'Camera', color: isDark ? '#111827' : '#F0FDFA', iconColor: '#14B8A6' },
                            { icon: ShoppingBag, label: 'Products', target: 'Products', color: isDark ? '#111827' : '#FFF7ED', iconColor: '#F97316' },
                            { icon: Calendar, label: 'History', target: 'History', color: isDark ? '#111827' : '#F0FDFA', iconColor: '#14B8A6' },
                        ].map((action, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => action.target && navigation.navigate(action.target)}
                                style={styles.actionItem}
                            >
                                <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
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
                                style={[styles.tabButton, activeTab === 'morning' && styles.activeTab, isDark && activeTab === 'morning' && { backgroundColor: '#374151' }]}
                                onPress={() => setActiveTab('morning')}
                            >
                                <Sun size={20} color={activeTab === 'morning' ? '#14B8A6' : '#9CA3AF'} />
                                <Text style={[styles.tabText, activeTab === 'morning' ? styles.activeTabText : styles.inactiveTabText]}>Morning</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, activeTab === 'night' && styles.activeTab, isDark && activeTab === 'night' && { backgroundColor: '#374151' }]}
                                onPress={() => setActiveTab('night')}
                            >
                                <Moon size={20} color={activeTab === 'night' ? '#14B8A6' : '#9CA3AF'} />
                                <Text style={[styles.tabText, activeTab === 'night' ? styles.activeTabText : styles.inactiveTabText]}>Evening</Text>
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
                                        <View style={[styles.taskCheck, task.completed ? styles.taskDone : styles.taskPending]}>
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
                                                i === 6 ? styles.chartBarActive : styles.chartBarInactive
                                            ]}
                                        />
                                        <Text style={styles.chartLabel}>{day.day}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Tip Card */}
                    <View style={styles.tipCardContainer}>
                        <LinearGradient
                            colors={['#F5D5CB', '#D1E3D1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.tipGradient}
                        >
                            <View style={styles.tipRow}>
                                <View style={styles.tipIconContainer}>
                                    <Droplet size={24} color="#14B8A6" />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.tipTitle}>Today's Tip</Text>
                                    <Text style={styles.tipText}>Drink at least 8 glasses of water daily to keep your skin hydrated and glowing from within.</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, themeStyles.card]}>
                <TouchableOpacity style={styles.navItem}>
                    <Flame size={24} color="#14B8A6" fill="#14B8A6" />
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Products')} style={styles.navItem}>
                    <ShoppingBag size={24} color="#9CA3AF" />
                    <Text style={styles.navText}>Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Camera')}
                    style={styles.fab}
                >
                    <Camera size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Stats')}
                    style={styles.navItem}
                >
                    <TrendingUp size={24} color="#9CA3AF" />
                    <Text style={styles.navText}>Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navItem}>
                    <User size={24} color="#9CA3AF" />
                    <Text style={styles.navText}>Me</Text>
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
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
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
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
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
        borderRadius: 16,
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
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontWeight: '500',
    },
    activeTabText: {
        color: '#111827',
    },
    inactiveTabText: {
        color: '#9CA3AF',
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
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    taskCheck: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskDone: {
        backgroundColor: '#10B981',
    },
    taskPending: {
        backgroundColor: '#F3F4F6',
    },
    checkMark: {
        color: 'white',
        fontWeight: 'bold',
    },
    pendingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    taskNameDone: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    taskTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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
        backgroundColor: '#10B981',
    },
    chartBarInactive: {
        backgroundColor: '#E5E7EB',
    },
    chartLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
    },
    tipCardContainer: {
        borderRadius: 24,
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
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        color: '#0D9488',
        fontWeight: 'bold',
        marginTop: 4,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
