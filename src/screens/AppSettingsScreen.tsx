import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ChevronLeft, Lock, Bell, Moon, Languages, Shield, LogOut, ChevronRight, UserCog } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProduct } from '../context/ProductContext'; // Import Product Context

import { useAuth } from '../context/AuthContext'; // Import Auth Context

export function AppSettingsScreen({ navigation }: { navigation: any }) {
    const { isDark, toggleTheme } = useTheme();
    const { isAdmin, toggleAdmin } = useProduct();
    const { signOut } = useAuth(); // Use Auth Context
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const themeStyles = {
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        header: { backgroundColor: isDark ? '#1F2937' : 'white', borderBottomColor: isDark ? '#374151' : '#F3F4F6' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white' },
        icon: { color: isDark ? '#F9FAFB' : '#1F2937' }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // In real app, call API to delete. Here just sign out.
                        signOut();
                    }
                }
            ]
        );
    };

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", onPress: signOut }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, label, value, type = 'arrow', onPress, onToggle, toggleValue }: any) => (
        <TouchableOpacity
            style={[styles.settingItem, themeStyles.card]}
            onPress={onPress}
            disabled={type === 'toggle'}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                    <Icon size={20} color={isDark ? '#E5E7EB' : '#4B5563'} />
                </View>
                <Text style={[styles.settingLabel, themeStyles.text]}>{label}</Text>
            </View>
            <View style={styles.settingRight}>
                {type === 'toggle' ? (
                    <Switch
                        value={toggleValue}
                        onValueChange={onToggle}
                        trackColor={{ false: '#D1D5DB', true: '#14B8A6' }}
                        thumbColor={'white'}
                    />
                ) : (
                    <>
                        <Text style={[styles.settingValue, themeStyles.subText]}>{value}</Text>
                        <ChevronRight size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={isDark ? "white" : "#1F2937"} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={[styles.sectionTitle, themeStyles.subText]}>General</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon={Moon}
                        label="Dark Mode"
                        type="toggle"
                        toggleValue={isDark}
                        onToggle={toggleTheme}
                    />
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        type="toggle"
                        toggleValue={notificationsEnabled}
                        onToggle={setNotificationsEnabled}
                    />
                    <SettingItem
                        icon={UserCog}
                        label="Admin Mode"
                        type="toggle"
                        toggleValue={isAdmin}
                        onToggle={toggleAdmin}
                    />
                    <SettingItem
                        icon={Languages}
                        label="Language"
                        value="English"
                        onPress={() => { }}
                    />
                </View>

                <Text style={[styles.sectionTitle, themeStyles.subText]}>Security & Privacy</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon={Lock}
                        label="Change Password"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() => { }}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6', marginBottom: 12 }]}
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color={isDark ? "#E5E7EB" : "#374151"} />
                    <Text style={[styles.deleteText, { color: isDark ? "#E5E7EB" : "#374151" }]}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2' }]}
                    onPress={handleDeleteAccount}
                >
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, themeStyles.subText]}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    section: {
        gap: 12,
        marginBottom: 32,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 14,
        color: '#6B7280',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    deleteText: {
        color: '#EF4444',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 40,
    },
});
