import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function SignupScreen({ navigation }: { navigation: any }) {
    const { signUp, signUpWithPhone } = useAuth();
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        toggleContainer: { backgroundColor: `${colors.primary}0D`, borderColor: `${colors.primary}33` },
        toggleActive: { backgroundColor: colors.card, borderColor: `${colors.primary}4D`, shadowColor: colors.primary },
        toggleTextActive: { color: colors.primary },
        inputContainer: { backgroundColor: colors.card, borderColor: `${colors.primary}33` },
        link: { color: colors.primary },
        headerIconBtn: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
    };

    const [signupType, setSignupType] = useState<'email' | 'phone'>('email');
    const [fullName, setFullName] = useState('');
    const [identifier, setIdentifier] = useState(''); // email or phone
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!identifier || !password || !confirmPassword || !fullName) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters long.');
            return;
        }

        setLoading(true);
        const success = signupType === 'email'
            ? await signUp(identifier, password, fullName)
            : await signUpWithPhone(identifier, password, fullName);
        setLoading(false);

        if (success) {
            Alert.alert(
                'Account Created',
                'Your account has been created successfully! Welcome to Glow AI.',
                [{ text: 'Great!', onPress: () => { } }]
            );
        }
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 24 : 0 }]}>
                <View style={styles.headerNav}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, themeStyles.headerIconBtn]}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Animatable.View animation="fadeInLeft" style={styles.header}>
                            <Text style={[styles.title, themeStyles.text]}>Create Account</Text>
                            <Text style={[styles.subtitle, themeStyles.subText]}>Start your skincare journey today</Text>
                        </Animatable.View>

                        {/* Signup Type Toggle */}
                        <View style={[styles.toggleContainer, themeStyles.toggleContainer]}>
                            <TouchableOpacity
                                style={[styles.toggleButton, signupType === 'email' && [styles.toggleActive, themeStyles.toggleActive]]}
                                onPress={() => { setSignupType('email'); setIdentifier(''); }}
                            >
                                <Text style={[styles.toggleText, themeStyles.subText, signupType === 'email' && [styles.toggleTextActive, themeStyles.toggleTextActive]]}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, signupType === 'phone' && [styles.toggleActive, themeStyles.toggleActive]]}
                                onPress={() => { setSignupType('phone'); setIdentifier(''); }}
                            >
                                <Text style={[styles.toggleText, themeStyles.subText, signupType === 'phone' && [styles.toggleTextActive, themeStyles.toggleTextActive]]}>Phone</Text>
                            </TouchableOpacity>
                        </View>

                        <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
                            {/* Name Input */}
                            <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                                <User size={20} color={colors.subText} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, themeStyles.text]}
                                    placeholder="Full Name"
                                    placeholderTextColor={colors.subText}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Identifier Input */}
                            <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                                {signupType === 'email' ? (
                                    <Mail size={20} color={colors.subText} style={styles.inputIcon} />
                                ) : (
                                    <Phone size={20} color={colors.subText} style={styles.inputIcon} />
                                )}
                                <TextInput
                                    style={[styles.input, themeStyles.text]}
                                    placeholder={signupType === 'email' ? "Email Address" : "Phone Number (+91...)"}
                                    placeholderTextColor={colors.subText}
                                    value={identifier}
                                    onChangeText={setIdentifier}
                                    autoCapitalize="none"
                                    keyboardType={signupType === 'email' ? "email-address" : "phone-pad"}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                                <Lock size={20} color={colors.subText} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, themeStyles.text]}
                                    placeholder="Password"
                                    placeholderTextColor={colors.subText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={colors.subText} />
                                    ) : (
                                        <Eye size={20} color={colors.subText} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                                <Lock size={20} color={colors.subText} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, themeStyles.text]}
                                    placeholder="Confirm Password"
                                    placeholderTextColor={colors.subText}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.signupButton, { shadowColor: colors.primary }]}
                                onPress={handleSignup}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.secondary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.signupButtonText}>Sign Up</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={[styles.footerText, themeStyles.subText]}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.loginLink, themeStyles.link]}>Log In</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    safeArea: {
        flex: 1,
    },
    headerNav: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleActive: {
        backgroundColor: '#12121A',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    toggleTextActive: {
        color: '#00E5FF',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12121A',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#E2E8F0',
    },
    signupButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 24,
        marginTop: 16,
    },
    gradientButton: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    loginLink: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
