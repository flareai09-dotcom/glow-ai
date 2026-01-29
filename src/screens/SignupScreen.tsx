import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

export function SignupScreen({ navigation }: { navigation: any }) {
    const { signUp } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
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
        const success = await signUp(email, password);
        setLoading(false);

        if (success) {
            // Supabase allows auto-login if email confirmation is disabled.
            // If enabled, they need to check email.
            Alert.alert(
                'Account Created',
                'Your account has been created successfully! You can now log in.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerNav}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Animatable.View animation="fadeInLeft" style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Start your skincare journey today</Text>
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

                            {/* Confirm Password Input */}
                            <View style={styles.inputContainer}>
                                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.signupButton}
                                onPress={handleSignup}
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
                                        <Text style={styles.signupButtonText}>Sign Up</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLink}>Log In</Text>
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
        backgroundColor: '#FAF7F5',
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
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
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
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
    signupButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5, // Android shadow
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
        color: '#6B7280',
        fontSize: 14,
    },
    loginLink: {
        color: '#14B8A6',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
