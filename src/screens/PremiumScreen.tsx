import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Dimensions, Alert, ActivityIndicator, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeft, Check, Crown, Star, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile-service';

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
                        "color": "#14B8A6"
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
        <View style={styles.container}>
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
                    colors={['#14B8A6', '#0D9488']}
                    style={styles.header}
                >
                    <SafeAreaView>
                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <ChevronLeft size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    <View style={styles.headerContent}>
                        <View style={styles.iconContainer}>
                            <Crown size={48} color="#FBBF24" fill="#FBBF24" />
                        </View>
                        <Text style={styles.title}>Glow AI Premium</Text>
                        <Text style={styles.subtitle}>Unlock your best skin ever</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.featuresCard}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.featureIcon}>
                                    <feature.icon size={20} color="#0D9488" />
                                </View>
                                <Text style={styles.featureText}>{feature.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.pricingContainer}>
                        <TouchableOpacity style={[styles.planCard, styles.activePlan]}>
                            <View style={styles.planHeader}>
                                <Text style={styles.planDuration}>Lifetime Access</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>BEST VALUE</Text>
                                </View>
                            </View>
                            <Text style={styles.price}>₹99<Text style={styles.perMonth}>/one-time</Text></Text>
                            <Text style={styles.trialText}>Unlock all premium features forever</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleSubscribe}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={['#FBBF24', '#D97706']}
                        style={styles.gradientButton}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Pay ₹99</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.footerText}>Cancel anytime. Terms apply.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    content: {
        padding: 24,
        marginTop: -30,
    },
    featuresCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
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
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    pricingContainer: {
        gap: 16,
    },
    planCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        borderColor: '#14B8A6',
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
        color: '#1F2937',
    },
    badge: {
        backgroundColor: '#14B8A6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    saveBadge: {
        backgroundColor: '#10B981',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        alignItems: 'flex-end',
    },
    perMonth: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: 'normal',
    },
    trialText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    footer: {
        padding: 24,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
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
        color: '#9CA3AF',
    },
    activePlan: {
        borderColor: '#14B8A6',
        backgroundColor: '#F0FDFA',
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    }
});
