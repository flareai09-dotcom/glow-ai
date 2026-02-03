import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginScreen({ navigation }: { navigation: any }) {
    const { signIn, signInWithPhone } = useAuth();
    const { isDark } = useTheme();

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
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <Animatable.View animation="fadeInDown" style={styles.header}>
                        <LinearGradient
                            colors={['#14B8A6', '#0D9488']}
                            style={styles.logoCircle}
                        >
                            <Text style={styles.logoText}>G</Text>
                        </LinearGradient>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue your glow journey</Text>
                    </Animatable.View>

                    {/* Login Type Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, loginType === 'email' && styles.toggleActive]}
                            onPress={() => { setLoginType('email'); setIdentifier(''); }}
                        >
                            <Text style={[styles.toggleText, loginType === 'email' && styles.toggleTextActive]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, loginType === 'phone' && styles.toggleActive]}
                            onPress={() => { setLoginType('phone'); setIdentifier(''); }}
                        >
                            <Text style={[styles.toggleText, loginType === 'phone' && styles.toggleTextActive]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
                        {/* Identifier Input */}
                        <View style={styles.inputContainer}>
                            {loginType === 'email' ? (
                                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                            ) : (
                                <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                            )}
                            <TextInput
                                style={styles.input}
                                placeholder={loginType === 'email' ? "Email Address" : "Phone Number (+91...)"}
                                placeholderTextColor="#9CA3AF"
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                                keyboardType={loginType === 'email' ? "email-address" : "phone-pad"}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff size={20} color="#9CA3AF" />
                                ) : (
                                    <Eye size={20} color="#9CA3AF" />
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPass}>
                            <Text style={styles.forgotPassText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#14B8A6', '#10B981']}
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
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
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
        backgroundColor: '#FAF7F5',
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
        shadowColor: '#14B8A6',
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
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(20, 184, 166, 0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    toggleTextActive: {
        color: '#14B8A6',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1F2937',
    },
    forgotPass: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPassText: {
        color: '#14B8A6',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#14B8A6',
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
        color: '#6B7280',
        fontSize: 14,
    },
    signupLink: {
        color: '#14B8A6',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
