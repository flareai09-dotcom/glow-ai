import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginScreen({ navigation }: { navigation: any }) {
    const { signIn, signInWithPhone } = useAuth();
    const { isDark, colors } = useTheme();

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
        iconContainer: { shadowColor: colors.primary },
    };

    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const [identifier, setIdentifier] = useState(''); // email or phone
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert('Error', `Please enter both ${loginType} and password.`);
            return;
        }

        setLoading(true);
        const success = loginType === 'email'
            ? await signIn(identifier, password)
            : await signInWithPhone(identifier, password);
        setLoading(false);
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 24 : 0 }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <Animatable.View animation="fadeInDown" style={styles.header}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={[styles.logoCircle, themeStyles.iconContainer]}
                        >
                            <Text style={styles.logoText}>G</Text>
                        </LinearGradient>
                        <Text style={[styles.title, themeStyles.text]}>Welcome Back!</Text>
                        <Text style={[styles.subtitle, themeStyles.subText]}>Sign in to continue your glow journey</Text>
                    </Animatable.View>

                    {/* Login Type Toggle */}
                    <View style={[styles.toggleContainer, themeStyles.toggleContainer]}>
                        <TouchableOpacity
                            style={[styles.toggleButton, loginType === 'email' && [styles.toggleActive, themeStyles.toggleActive]]}
                            onPress={() => { setLoginType('email'); setIdentifier(''); }}
                        >
                            <Text style={[styles.toggleText, themeStyles.subText, loginType === 'email' && [styles.toggleTextActive, themeStyles.toggleTextActive]]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, loginType === 'phone' && [styles.toggleActive, themeStyles.toggleActive]]}
                            onPress={() => { setLoginType('phone'); setIdentifier(''); }}
                        >
                            <Text style={[styles.toggleText, themeStyles.subText, loginType === 'phone' && [styles.toggleTextActive, themeStyles.toggleTextActive]]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
                        {/* Identifier Input */}
                        <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                            {loginType === 'email' ? (
                                <Mail size={20} color={colors.subText} style={styles.inputIcon} />
                            ) : (
                                <Phone size={20} color={colors.subText} style={styles.inputIcon} />
                            )}
                            <TextInput
                                style={[styles.input, themeStyles.text]}
                                placeholder={loginType === 'email' ? "Email Address" : "Phone Number (+91...)"}
                                placeholderTextColor={colors.subText}
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                                keyboardType={loginType === 'email' ? "email-address" : "phone-pad"}
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

                        <TouchableOpacity style={styles.forgotPass}>
                            <Text style={[styles.forgotPassText, themeStyles.link]}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, { shadowColor: colors.primary }]}
                            onPress={handleLogin}
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
                                    <View style={styles.btnContent}>
                                        <Text style={styles.loginButtonText}>Sign In</Text>
                                        <ArrowRight size={20} color="white" />
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, themeStyles.subText]}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={[styles.signupLink, themeStyles.link]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
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
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
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
    forgotPass: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPassText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 24,
    },
    gradientButton: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loginButtonText: {
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
    signupLink: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
