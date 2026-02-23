import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Dimensions, Alert, ActivityIndicator, Modal, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeft, Check, Crown, Star, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile-service';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const features = [
    { icon: Star, text: 'Unlimited Skin Analysis' },
    { icon: Zap, text: 'Personalized Routine Generator' },
    { icon: Crown, text: 'Priority Dermatologist Support' },
    { icon: Check, text: 'Ad-free Experience' },
];

export function PremiumScreen({ navigation }: { navigation: any }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showGateway, setShowGateway] = useState(false);
    const { colors } = useTheme();

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        primaryLight: { backgroundColor: `${colors.primary}1A` },
        footer: { backgroundColor: colors.background, borderTopColor: colors.border },
        activePlan: { borderColor: colors.primary, backgroundColor: `${colors.primary}0D`, shadowColor: colors.primary },
        iconContainer: { backgroundColor: colors.card },
        badgeText: { color: colors.primary },
    };

    const confirmSubscription = async (paymentId: string) => {
        try {
            if (!user) {
                console.error("No user found during subscription confirmation");
                return;
            }
            const success = await profileService.updateProfile(user.id, { is_premium: true });

            if (success) {
                Alert.alert(
                    'Payment Successful! 🌟',
                    `You are now a Premium Member.\nReference: ${paymentId}`,
                    [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
                );
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error("Error confirming subscription:", error);
            Alert.alert('Error', 'Failed to update your premium status. Please contact support.');
        }
    };

    const handleSubscribe = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to subscribe.');
            return;
        }
        setShowGateway(true);
    };

    const onMessage = (event: any) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.status === 'success') {
            setShowGateway(false);
            confirmSubscription(data.data.razorpay_payment_id);
        } else if (data.status === 'failed') {
            setShowGateway(false);
            Alert.alert('Payment Failed', data.data.description || 'Transaction failed');
        } else if (data.status === 'closed') {
            setShowGateway(false);
        }
    };

    const RazorpayHTML = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #FAF7F5; }
            </style>
        </head>
        <body>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            <script>
                var options = {
                    "key": "rzp_live_SAtrBlIp6RH1XK", 
                    "amount": "9900", 
                    "currency": "INR",
                    "name": "Glow AI Premium",
                    "description": "Lifetime Access Plan",
                    "image": "https://i.imgur.com/7XqWt0G.png", 
                    "handler": function (response){
                        window.ReactNativeWebView.postMessage(JSON.stringify({status: 'success', data: response}));
                    },
                    "prefill": {
                        "email": "${user?.email || ''}",
                        "contact": ""
                    },
                    "theme": {
                        "color": "#FF003C"
                    },
                    "modal": {
                        "ondismiss": function(){
                            window.ReactNativeWebView.postMessage(JSON.stringify({status: 'closed'}));
                        }
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.on('payment.failed', function (response){
                    window.ReactNativeWebView.postMessage(JSON.stringify({status: 'failed', data: response.error}));
                });
                // Open automatically
                document.addEventListener("DOMContentLoaded", function() {
                    rzp1.open();
                });
            </script>
        </body>
        </html>
    `;

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Modal
                visible={showGateway}
                onRequestClose={() => setShowGateway(false)}
                animationType={"slide"}
                transparent={false}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowGateway(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Secure Payment</Text>
                    </View>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: RazorpayHTML }}
                        onMessage={onMessage}
                        style={{ flex: 1 }}
                    />
                </SafeAreaView>
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.header}
                >
                    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <ChevronLeft size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    <View style={styles.headerContent}>
                        <View style={[styles.iconContainer, themeStyles.iconContainer]}>
                            <Crown size={48} color="#FBBF24" fill="#FBBF24" />
                        </View>
                        <Text style={styles.title}>Glow AI Premium</Text>
                        <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>Unlock your best skin ever</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={[styles.featuresCard, themeStyles.card]}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={[styles.featureIcon, themeStyles.primaryLight]}>
                                    <feature.icon size={20} color={colors.primary} />
                                </View>
                                <Text style={[styles.featureText, themeStyles.text]}>{feature.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.pricingContainer}>
                        <TouchableOpacity style={[styles.planCard, themeStyles.card, themeStyles.activePlan]}>
                            <View style={styles.planHeader}>
                                <Text style={[styles.planDuration, themeStyles.text]}>Lifetime Access</Text>
                                <View style={[styles.badge, themeStyles.primaryLight]}>
                                    <Text style={[styles.badgeText, themeStyles.badgeText]}>BEST VALUE</Text>
                                </View>
                            </View>
                            <Text style={[styles.price, themeStyles.text]}>₹99<Text style={[styles.perMonth, themeStyles.subText]}>/one-time</Text></Text>
                            <Text style={[styles.trialText, themeStyles.subText]}>Unlock all premium features forever</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, themeStyles.footer]}>
                <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleSubscribe}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={styles.gradientButton}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Pay ₹99</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={[styles.footerText, themeStyles.subText]}>Cancel anytime. Terms apply.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        justifyContent: 'space-between'
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginRight: 40, // Balance the close button
    },
    header: {
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    navBar: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#FBBF24',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.4)',
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
    },
    content: {
        padding: 24,
        marginTop: -30,
    },
    featuresCard: {
        backgroundColor: '#12121A',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    featureIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 15,
        color: '#E2E8F0',
        fontWeight: '500',
    },
    pricingContainer: {
        gap: 16,
    },
    planCard: {
        backgroundColor: '#12121A',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        borderColor: '#00E5FF',
        position: 'relative',
    },
    yearlyPlan: {
        borderColor: '#E5E7EB',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    planDuration: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    badge: {
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    saveBadge: {
        backgroundColor: '#10B981',
    },
    badgeText: {
        color: '#00E5FF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        alignItems: 'flex-end',
    },
    perMonth: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: 'normal',
    },
    trialText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    footer: {
        padding: 24,
        backgroundColor: '#0F0F13',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 229, 255, 0.2)',
    },
    subscribeButton: {
        marginBottom: 12,
    },
    gradientButton: {
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94A3B8',
    },
    activePlan: {
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }
});
