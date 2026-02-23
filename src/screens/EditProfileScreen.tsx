import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { ChevronLeft, Camera, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export function EditProfileScreen({ navigation }: { navigation: any }) {
    const [name, setName] = useState('Priya Sharma');
    const [email, setEmail] = useState('priya.sharma@email.com');
    const [bio, setBio] = useState('Skincare enthusiast ✨');
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        headerBtn: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        avatarBg: { backgroundColor: colors.card, borderColor: `${colors.primary}80`, shadowColor: colors.primary },
        cameraOpt: { backgroundColor: colors.primary, borderColor: colors.background },
        input: { backgroundColor: colors.card, borderColor: `${colors.border}`, color: colors.text },
    };

    const handleSave = () => {
        // Implement save logic here
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, themeStyles.headerBtn]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarContainer, themeStyles.avatarBg]}>
                        <Text style={styles.avatarEmoji}>👩🏻</Text>
                        <TouchableOpacity style={[styles.cameraButton, themeStyles.cameraOpt]}>
                            <Camera size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, themeStyles.subText]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, themeStyles.input]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.subText}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, themeStyles.subText]}>Email Address</Text>
                        <TextInput
                            style={[styles.input, themeStyles.input]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.subText}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, themeStyles.subText]}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, themeStyles.input]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            placeholderTextColor={colors.subText}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={handleSave}>
                    <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={[styles.saveButton, { shadowColor: colors.primary }]}
                    >
                        <Save size={20} color="white" style={styles.saveIcon} />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#12121A',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 4,
        borderColor: 'rgba(0, 229, 255, 0.5)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarEmoji: {
        fontSize: 50,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#00E5FF',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#09090B',
    },
    formSection: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#E2E8F0',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 20,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    saveIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
