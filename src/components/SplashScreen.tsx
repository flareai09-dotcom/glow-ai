import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <LinearGradient
            colors={['#FAF7F5', '#F5D5CB', '#D1E3D1']}
            style={styles.container}
        >
            {/* Decorative circles */}
            <Animatable.View
                animation={{
                    0: { transform: [{ scale: 1 }], opacity: 0.3 },
                    0.5: { transform: [{ scale: 1.2 }], opacity: 0.5 },
                    1: { transform: [{ scale: 1 }], opacity: 0.3 },
                }}
                iterationCount="infinite"
                duration={4000}
                style={[styles.decorCircle, styles.decorCircle1]}
            />
            <Animatable.View
                animation={{
                    0: { transform: [{ scale: 1 }], opacity: 0.2 },
                    0.5: { transform: [{ scale: 1.3 }], opacity: 0.4 },
                    1: { transform: [{ scale: 1 }], opacity: 0.2 },
                }}
                iterationCount="infinite"
                duration={5000}
                style={[styles.decorCircle, styles.decorCircle2]}
            />

            {/* Logo and branding */}
            <Animatable.View
                animation="fadeInUp"
                delay={200}
                duration={600}
                style={styles.logoContainer}
            >
                <View style={styles.logoBox}>
                    <Sparkles size={40} color="white" strokeWidth={2} />
                </View>

                <Text style={styles.appName}>GlowAI</Text>
                <Text style={styles.tagline}>Your AI-powered skincare companion</Text>
            </Animatable.View>

            {/* Loading indicator */}
            <Animatable.View
                animation="fadeIn"
                delay={1000}
                style={styles.loadingContainer}
            >
                <View style={styles.dotsContainer}>
                    {[0, 1, 2].map((i) => (
                        <Animatable.View
                            key={i}
                            animation={{
                                0: { transform: [{ scale: 1 }], opacity: 0.5 },
                                0.5: { transform: [{ scale: 1.5 }], opacity: 1 },
                                1: { transform: [{ scale: 1 }], opacity: 0.5 },
                            }}
                            iterationCount="infinite"
                            delay={i * 200}
                            duration={1000}
                            style={styles.dot}
                        />
                    ))}
                </View>
            </Animatable.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 1000,
    },
    decorCircle1: {
        top: 80,
        right: 40,
        width: 128,
        height: 128,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    decorCircle2: {
        bottom: 128,
        left: 32,
        width: 160,
        height: 160,
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#14B8A6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 300,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 48,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#14B8A6',
    },
});
