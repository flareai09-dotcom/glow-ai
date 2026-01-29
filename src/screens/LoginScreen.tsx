import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginScreen({ navigation }: { navigation: any }) {
    const { signIn } = useAuth();
    const { isDark } = useTheme(); // Even though Auth is outside MainStack, we can use Theme if Provider wraps it

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        // User requested STRICT exact match
        setLoading(true);
        const success = await signIn(email, password);
        setLoading(false);
        // Error handling is done inside context via Alerts for now

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

                    <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
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
                                autoCapitalize="none" // Important for strict password matching
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
        marginBottom: 40,
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
