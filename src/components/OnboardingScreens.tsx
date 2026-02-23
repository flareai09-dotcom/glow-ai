import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, Sparkles, IndianRupee, ChevronRight } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

interface OnboardingScreensProps {
    currentStep: number;
    onNext: () => void;
    onSkip: () => void;
}

const onboardingData = [
    {
        icon: Scan,
        title: "AI-Powered Skin Analysis",
        description: "Get instant insights into your skin health with our advanced AI technology. Detect acne, dark spots, and more.",
        colors: ['#00E5FF', '#007BFF'],
    },
    {
        icon: Sparkles,
        title: "Personalized Skincare Routine",
        description: "Receive customized routines tailored to your unique skin type and concerns. Science-backed recommendations.",
        colors: ['#FF003C', '#9D00FF'],
    },
    {
        icon: IndianRupee,
        title: "₹99 Lifetime Premium",
        description: "Unlock unlimited scans, detailed analysis, and expert product recommendations. One-time payment, lifetime access.",
        colors: ['#00FF9D', '#00E5FF'],
    },
] as const;

export function OnboardingScreens({ currentStep, onNext, onSkip }: OnboardingScreensProps) {
    const current = onboardingData[currentStep];
    const Icon = current.icon;

    return (
        <View style={styles.container}>
            {/* Skip button */}
            <View style={styles.skipContainer}>
                <TouchableOpacity onPress={onSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Main content */}
            <View style={styles.content}>
                <Animatable.View
                    key={currentStep}
                    animation="fadeInRight"
                    duration={400}
                    style={styles.centerContent}
                >
                    {/* Icon */}
                    <LinearGradient
                        colors={current.colors}
                        style={styles.iconContainer}
                    >
                        <Icon size={64} color="white" strokeWidth={1.5} />
                    </LinearGradient>

                    {/* Title */}
                    <Text style={styles.title}>{current.title}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{current.description}</Text>
                </Animatable.View>
            </View>

            {/* Bottom navigation */}
            <View style={styles.bottomContainer}>
                {/* Dots indicator */}
                <View style={styles.dotsContainer}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentStep ? styles.dotActive : styles.dotInactive
                            ]}
                        />
                    ))}
                </View>

                {/* Next button */}
                <TouchableOpacity onPress={onNext} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#00E5FF', '#007BFF']}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentStep === 2 ? 'Get Started' : 'Continue'}
                        </Text>
                        <ChevronRight size={20} color="#09090B" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    skipContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    skipText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    centerContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 128,
        height: 128,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 16,
        textAlign: 'center',
        maxWidth: 320,
    },
    description: {
        fontSize: 16,
        color: '#94A3B8',
        lineHeight: 24,
        textAlign: 'center',
        maxWidth: 340,
    },
    bottomContainer: {
        paddingHorizontal: 32,
        paddingBottom: 32,
        gap: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 32,
        backgroundColor: '#00E5FF',
    },
    dotInactive: {
        width: 8,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
    },
    nextButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        color: '#09090B',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
