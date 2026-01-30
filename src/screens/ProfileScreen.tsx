import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import {
    ChevronLeft,
    User,
    Bell,
    HelpCircle,
    Settings,
    LogOut,
    ChevronRight,
    Crown,
    Calendar,
    Moon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { profileService, UserProfile } from '../services/profile-service';

interface ProfileScreenProps {
    navigation: any;
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
    const { isDark, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState({ scanCount: 0, lastScore: 0, streak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            loadProfileData();
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const [profileData, statsData] = await Promise.all([
                profileService.getProfile(user!.id),
                profileService.getStats(user!.id)
            ]);

            if (profileData) setProfile(profileData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic styles based on theme
    const themeStyles = {
        container: {
            backgroundColor: isDark ? '#111827' : '#FAF7F5',
        },
        text: {
            color: isDark ? '#F9FAFB' : '#1F2937',
        },
        subText: {
            color: isDark ? '#9CA3AF' : '#9CA3AF',
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : 'white',
            borderColor: isDark ? '#374151' : '#F9FAFB',
        },
        itemBorder: {
            borderBottomColor: isDark ? '#374151' : '#F3F4F6',
        }
    };

    const joinedDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Jan 2025';

    interface MenuItem {
        icon: any;
        label: string;
        value: string;
        type?: 'switch' | 'link';
        onPress?: () => void;
        badge?: boolean;
        switchValue?: boolean;
        onToggle?: () => void;
    }

    interface Section {
        title: string;
        items: MenuItem[];
    }

    const sections: Section[] = [
        {
            title: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Edit Profile',
                    value: profile?.full_name || 'Guest User',
                    onPress: () => navigation.navigate('EditProfile')
                },
                {
                    icon: Crown,
                    label: 'Premium Status',
                    value: 'Free Plan',
                    badge: false, // Default to false for now
                    onPress: () => navigation.navigate('Premium')
                },
                {
                    icon: Calendar,
                    label: 'Joined',
                    value: joinedDate,
                    onPress: () => { }
                },
            ],
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: Bell,
                    label: 'Notifications',
                    value: notificationsEnabled ? 'On' : 'Off',
                    type: 'switch',
                    switchValue: notificationsEnabled,
                    onToggle: () => setNotificationsEnabled(!notificationsEnabled)
                },
                {
                    icon: Moon,
                    label: 'Dark Mode',
                    value: isDark ? 'On' : 'Off',
                    type: 'switch',
                    switchValue: isDark,
                    onToggle: toggleTheme
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help & FAQs',
                    value: '',
                    onPress: () => navigation.navigate('Help')
                },
                {
                    icon: Settings,
                    label: 'App Settings',
                    value: '',
                    onPress: () => navigation.navigate('AppSettings')
                },
            ],
        },
    ];

    if (loading) {
        return (
            <View style={[styles.container, themeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#14B8A6" />
            </View>
        );
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={isDark ? ['#0F766E', '#0D9488'] : ['#14B8A6', '#10B981']}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>

                    {/* Profile card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarEmoji}>👩🏻</Text>
                        </View>
                        <View style={styles.flex1}>
                            <Text style={styles.profileName}>{profile?.full_name || 'Guest User'}</Text>
                            <Text style={styles.profileEmail}>{profile?.email || user?.email}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        {[
                            { label: 'Skin Score', val: stats.lastScore || '--' },
                            { label: 'Scans Done', val: stats.scanCount },
                            { label: 'Day Streak', val: stats.streak },
                        ].map((stat, i) => (
                            <View key={i} style={styles.statItem}>
                                <Text style={styles.statValue}>{stat.val}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </LinearGradient>

                {/* Settings sections */}
                <View style={styles.settingsContent}>
                    {sections.map((section, sectionIndex) => (
                        <Animatable.View
                            key={sectionIndex}
                            animation="fadeInUp"
                            delay={sectionIndex * 100}
                            style={styles.section}
                        >
                            <Text style={styles.sectionTitle}>
                                {section.title}
                            </Text>

                            <View style={[styles.itemsCard, themeStyles.card]}>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={[
                                            styles.settingItem,
                                            itemIndex !== section.items.length - 1 && themeStyles.itemBorder,
                                            itemIndex !== section.items.length - 1 && styles.itemBorderBase
                                        ]}
                                        onPress={item.type === 'switch' ? item.onToggle : item.onPress}
                                        disabled={item.type === 'switch' && false} // TouchableOpacity handles the tap for the row
                                    >
                                        <View style={styles.itemIconBox}>
                                            <item.icon size={20} color="#14B8A6" />
                                        </View>

                                        <View style={styles.flex1}>
                                            <Text style={[styles.itemLabel, themeStyles.text]}>{item.label}</Text>
                                            {item.value && item.type !== 'switch' ? (
                                                <Text style={styles.itemValue}>{item.value}</Text>
                                            ) : null}
                                        </View>

                                        {item.badge ? (
                                            <LinearGradient
                                                colors={['#14B8A6', '#10B981']}
                                                style={styles.premiumBadge}
                                            >
                                                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                                            </LinearGradient>
                                        ) : null}

                                        {item.type === 'switch' ? (
                                            <Switch
                                                value={item.switchValue}
                                                onValueChange={item.onToggle}
                                                trackColor={{ false: "#E5E7EB", true: "#14B8A6" }}
                                                thumbColor={item.switchValue ? "white" : "#F3F4F6"}
                                            />
                                        ) : (
                                            <ChevronRight size={18} color="#D1D5DB" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animatable.View>
                    ))}

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                        <LogOut size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex1: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButton: {
        marginBottom: 24,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 40,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statItem: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    settingsContent: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 8,
    },
    itemsCard: {
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
    },
    itemBorderBase: {
        borderBottomWidth: 1,
    },
    itemIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemValue: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    premiumBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 100,
        marginRight: 8,
    },
    premiumBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginBottom: 80,
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: 'bold',
    },
});
