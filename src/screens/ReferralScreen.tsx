import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2, Wallet, Users, ArrowUpRight, Copy, Gift } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile-service';
import { supabase } from '../lib/supabase';

export function ReferralScreen({ navigation }: any) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [referralCode, setReferralCode] = useState<string>('');
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReferralData();
    }, []);

    const loadReferralData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const profile = await profileService.getProfile(user.id);
            if (profile) {
                // Generate a code if none exists (just a fallback, ideally done on signup)
                if (!profile.referral_code) {
                    const newCode = (profile.full_name?.substring(0, 4) || 'USER').toUpperCase() + Math.floor(1000 + Math.random() * 9000);
                    await profileService.updateProfile(user.id, { referral_code: newCode });
                    setReferralCode(newCode);
                } else {
                    setReferralCode(profile.referral_code);
                }
                setWalletBalance(profile.wallet_balance || 0);
                setTotalEarnings(profile.total_earnings || 0);
            }
        } catch (error) {
            console.error('Error loading referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Hey! I'm using Glow AI to analyze my skin and find the best products. Use my code ${referralCode} to get a free comprehensive scan! Download now: [App Link]`,
            });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !upiId) {
            Alert.alert('Error', 'Please enter amount and UPI ID');
            return;
        }

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount < 50) { // Min withdrawal 50
            Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹50');
            return;
        }

        if (amount > walletBalance) {
            Alert.alert('Insufficient Balance', 'You cannot withdraw more than your wallet balance.');
            return;
        }

        try {
            setSubmitting(true);
            const { error } = await supabase.from('withdraw_requests').insert({
                user_id: user?.id,
                amount: amount,
                upi_id: upiId,
                status: 'pending'
            });

            if (error) throw error;

            // Optimistic Update (Optional, better to wait for admin but showing deduction visually helps)
            // Ideally we deduct balance via trigger or admin action. For now, we just notify.

            Alert.alert('Request Sent', 'Your withdrawal request has been submitted successfully. It will be processed within 24-48 hours.');
            setIsWithdrawModalVisible(false);
            setWithdrawAmount('');
            setUpiId('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    // Render logic...
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#14B8A6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#F0FDFA', '#fff']} style={styles.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <Animatable.View animation="fadeInDown" style={styles.heroCard}>
                    <LinearGradient colors={['#14B8A6', '#0D9488']} style={styles.gradientCard}>
                        <View style={styles.balanceContainer}>
                            <Text style={styles.balanceLabel}>Wallet Balance</Text>
                            <Text style={styles.balanceValue}>₹{walletBalance.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.withdrawButton}
                            onPress={() => setIsWithdrawModalVisible(true)}
                        >
                            <Text style={styles.withdrawText}>Withdraw</Text>
                            <ArrowUpRight size={16} color="#0D9488" />
                        </TouchableOpacity>
                    </LinearGradient>
                </Animatable.View>

                {/* Main Action - Share Code */}
                <Animatable.View animation="fadeInUp" delay={100} style={styles.shareSection}>
                    <Text style={styles.sectionTitle}>Your Referral Code</Text>
                    <View style={styles.codeContainer}>
                        <Text style={styles.referralCode}>{referralCode}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={() => {
                            // Clipboard logic here (need expo-clipboard, omitted for brevity, fallback to Share)
                            handleShare();
                        }}>
                            <Copy size={20} color="#14B8A6" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Share2 size={20} color="white" />
                        <Text style={styles.shareText}>Share & Earn ₹20</Text>
                    </TouchableOpacity>
                    <Text style={styles.termsText}>
                        * Earn ₹20 real cash for every friend who upgrades to Premium.
                    </Text>
                </Animatable.View>

                {/* How it Works */}
                <View style={styles.stepsSection}>
                    <Text style={styles.sectionTitle}>How it Works</Text>
                    {[
                        { icon: Share2, title: 'Share Link', desc: 'Send your unique code to friends' },
                        { icon: Users, title: 'Friend Joins', desc: 'They sign up using your code' },
                        { icon: Gift, title: 'You Earn', desc: 'Get ₹20 when they buy Premium' },
                    ].map((step, i) => (
                        <View key={i} style={styles.stepRow}>
                            <View style={styles.stepIconBox}>
                                <step.icon size={20} color="#14B8A6" />
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                <Text style={styles.stepDesc}>{step.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Withdrawal Modal */}
            <Modal
                transparent
                visible={isWithdrawModalVisible}
                animationType="slide"
                onRequestClose={() => setIsWithdrawModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Withdraw Funds</Text>
                        <Text style={styles.modalSubtitle}>Balance: ₹{walletBalance.toFixed(2)}</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Amount (Min ₹50)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter amount"
                                value={withdrawAmount}
                                onChangeText={setWithdrawAmount}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>UPI ID</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. user@okhdfcbank"
                                value={upiId}
                                onChangeText={setUpiId}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsWithdrawModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleWithdraw}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.submitText}>Submit Request</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { position: 'absolute', width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, marginTop: 40 },
    backButton: { padding: 8, backgroundColor: 'white', borderRadius: 12, elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
    scrollContent: { padding: 24 },
    heroCard: { marginBottom: 32, borderRadius: 24, overflow: 'hidden', elevation: 8 },
    gradientCard: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    balanceContainer: {},
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
    balanceValue: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    withdrawButton: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8 },
    withdrawText: { color: '#0D9488', fontWeight: 'bold', fontSize: 14 },
    shareSection: { backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
    codeContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
    referralCode: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', letterSpacing: 2 },
    copyButton: { padding: 8 },
    shareButton: { backgroundColor: '#14B8A6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8, marginBottom: 12 },
    shareText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    termsText: { color: '#6B7280', fontSize: 12, textAlign: 'center' },
    stepsSection: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
    stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 16 },
    stepIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0FDFA', justifyContent: 'center', alignItems: 'center' },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    stepDesc: { fontSize: 14, color: '#6B7280' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    modalSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
    modalButton: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
    cancelButton: { backgroundColor: '#F3F4F6' },
    submitButton: { backgroundColor: '#14B8A6' },
    cancelText: { color: '#374151', fontWeight: 'bold' },
    submitText: { color: 'white', fontWeight: 'bold' },
});
