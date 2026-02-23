import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Lock, Bell, Moon, Languages, Shield, LogOut, ChevronRight, UserCog } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useProduct } from '../context/ProductContext'; // Import Product Context

import { useAuth } from '../context/AuthContext'; // Import Auth Context

export function AppSettingsScreen({ navigation }: { navigation: any }) {
    const { isDark, theme, setTheme, colors } = useTheme();
    const { isAdmin, toggleAdmin } = useProduct();
    const { signOut } = useAuth(); // Use Auth Context
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const themeStyles = {
        container: { backgroundColor: colors.background },
        header: { backgroundColor: colors.background, borderBottomColor: colors.border },
        text: { color: colors.text },
        subText: { color: colors.subText },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        icon: { color: colors.primary },
        iconBg: { backgroundColor: colors.background, borderColor: colors.border },
    };

    const handleThemeChange = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('genz');
        } else {
            setTheme('light');
        }
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
                <View style={[styles.iconContainer, themeStyles.iconBg]}>
                    <Icon size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, themeStyles.text]}>{label}</Text>
            </View>
            <View style={styles.settingRight}>
                {type === 'toggle' ? (
                    <Switch
                        value={toggleValue}
                        onValueChange={onToggle}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={'white'}
                    />
                ) : (
                    <>
                        <Text style={[styles.settingValue, themeStyles.subText]}>{value}</Text>
                        <ChevronRight size={20} color={colors.subText} />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={[styles.sectionTitle, themeStyles.subText]}>General</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon={Moon}
                        label="Theme"
                        value={theme === 'genz' ? 'GenZ' : (theme === 'dark' ? 'Dark' : 'Light')}
                        onPress={handleThemeChange}
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
                    style={[styles.deleteButton, { backgroundColor: `${colors.error}1A`, marginBottom: 12, borderColor: `${colors.error}4D`, borderWidth: 1 }]}
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color={colors.error} />
                    <Text style={[styles.deleteText, { color: colors.error }]}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: `${colors.error}1A`, borderColor: `${colors.error}4D`, borderWidth: 1 }]}
                    onPress={handleDeleteAccount}
                >
                    <LogOut size={20} color={colors.error} />
                    <Text style={[styles.deleteText, { color: colors.error }]}>Delete Account</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, themeStyles.subText]}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
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
        backgroundColor: '#09090B',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 229, 255, 0.2)',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
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
        backgroundColor: '#12121A',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
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
        color: '#E2E8F0',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 14,
        color: '#94A3B8',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
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
        color: '#94A3B8',
        fontSize: 12,
        marginBottom: 40,
    },
});
