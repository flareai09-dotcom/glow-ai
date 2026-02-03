import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

export function SignupScreen({ navigation }: { navigation: any }) {
    const { signUp, signUpWithPhone } = useAuth();

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
            Alert.alert('Account Created', 'Your account has been created successfully!');
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

                        {/* Signup Type Toggle */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, signupType === 'email' && styles.toggleActive]}
                                onPress={() => { setSignupType('email'); setIdentifier(''); }}
                            >
                                <Text style={[styles.toggleText, signupType === 'email' && styles.toggleTextActive]}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, signupType === 'phone' && styles.toggleActive]}
                                onPress={() => { setSignupType('phone'); setIdentifier(''); }}
                            >
                                <Text style={[styles.toggleText, signupType === 'phone' && styles.toggleTextActive]}>Phone</Text>
                            </TouchableOpacity>
                        </View>

                        <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
                            {/* Name Input */}
                            <View style={styles.inputContainer}>
                                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#9CA3AF"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Identifier Input */}
                            <View style={styles.inputContainer}>
                                {signupType === 'email' ? (
                                    <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                                ) : (
                                    <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                                )}
                                <TextInput
                                    style={styles.input}
                                    placeholder={signupType === 'email' ? "Email Address" : "Phone Number (+91...)"}
                                    placeholderTextColor="#9CA3AF"
                                    value={identifier}
                                    onChangeText={setIdentifier}
                                    autoCapitalize="none"
                                    keyboardType={signupType === 'email' ? "email-address" : "phone-pad"}
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
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
    signupButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#14B8A6',
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
        color: '#6B7280',
        fontSize: 14,
    },
    loginLink: {
        color: '#14B8A6',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
