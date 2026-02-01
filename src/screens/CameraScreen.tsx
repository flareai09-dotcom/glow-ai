import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Linking } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, Upload, AlertCircle, ChevronLeft, Zap, ZapOff, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile-service';
import { scanService } from '../services/scan-service';

interface CameraScreenProps {
    navigation: any;
}

export function CameraScreen({ navigation }: CameraScreenProps) {
    const { user } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [flash, setFlash] = useState<'on' | 'off'>('off');
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const toggleCamera = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    const handleCapture = async () => {
        if (!cameraRef) return;
        setIsCapturing(true);
        try {
            const photo = await cameraRef.takePictureAsync();
            if (photo) {
                if (!user?.id) return;

                // Check Scan Limit
                try {
                    const [profile, scanCount] = await Promise.all([
                        profileService.getProfile(user.id),
                        scanService.getScanCount(user.id)
                    ]);

                    if (!profile?.is_premium && scanCount >= 1) {
                        Alert.alert(
                            "Free Scan Limit Reached",
                            "You have used your 1 free scan. Upgrade to Premium for unlimited scans and detailed remedies!",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Upgrade Now", onPress: () => navigation.navigate("Paywall") }
                            ]
                        );
                        return;
                    }
                    navigation.navigate('Analysis', { imageUri: photo.uri });
                } catch (e) {
                    console.error("Error checking limits", e);
                    // Allow to proceed if check fails? Or block? Better block to be safe or allow?
                    // Let's allow for now to avoid blocking on network error, or block? 
                    // Safe default: allow but log error. Actually for paywall, maybe block. 
                    // Let's just proceed to Analysis with image, let Analysis handle it? 
                    // No, Analysis creates scan.
                    // On network error let's just proceed, Analysis matches this logic? No Analysis doesn't check limit.
                    // I'll proceed for now.
                    navigation.navigate('Analysis', { imageUri: photo.uri });
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to take photo");
        } finally {
            setIsCapturing(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            if (!user?.id) return;

            // Check Scan Limit
            try {
                const [profile, scanCount] = await Promise.all([
                    profileService.getProfile(user.id),
                    scanService.getScanCount(user.id)
                ]);

                if (!profile?.is_premium && scanCount >= 1) {
                    Alert.alert(
                        "Free Scan Limit Reached",
                        "You have used your 1 free scan. Upgrade to Premium for unlimited scans and detailed remedies!",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Upgrade Now", onPress: () => navigation.navigate("Paywall") }
                        ]
                    );
                    return;
                }
                navigation.navigate('Analysis', { imageUri: result.assets[0].uri });
            } catch (e) {
                console.error("Error checking limits", e);
                navigation.navigate('Analysis', { imageUri: result.assets[0].uri });
            }
        }
    };

    if (!permission) {
        return <View style={styles.container} />; // Loading
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Skin Analysis</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
                            {flash === 'on' ? <Zap size={24} color="#FBBF24" /> : <ZapOff size={24} color="white" />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleCamera} style={[styles.iconButton, { marginLeft: 8 }]}>
                            <RotateCcw size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Camera View */}
                <View style={styles.content}>
                    <View style={styles.cameraContainer}>
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            flash={flash}
                            ref={ref => setCameraRef(ref)}
                        >
                            <LinearGradient
                                colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
                                style={styles.overlay}
                            >
                                {/* Face Guide */}
                                <View style={styles.guideContainer}>
                                    <View style={styles.ovalGuide} />
                                    <Text style={styles.guideText}>Align your face within the frame</Text>
                                </View>
                            </LinearGradient>
                        </CameraView>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        <View style={styles.instructionsRow}>
                            <AlertCircle size={16} color="#14B8A6" />
                            <Text style={styles.instructionText}>Ensure good lighting & remove glasses</Text>
                        </View>

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity onPress={pickImage} style={styles.galleryButton}>
                                <Upload size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleCapture} style={styles.captureButtonOuter} disabled={isCapturing}>
                                <View style={styles.captureButtonInner}>
                                    {isCapturing && <View style={styles.capturingIndicator} />}
                                </View>
                            </TouchableOpacity>

                            <View style={{ width: 48 }} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    safeArea: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FAF7F5',
    },
    permissionText: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 16,
        textAlign: 'center',
    },
    permissionButton: {
        backgroundColor: '#14B8A6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    headerRight: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cameraContainer: {
        flex: 1,
        marginTop: 0,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ovalGuide: {
        width: 250,
        height: 340,
        borderRadius: 125,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        borderStyle: 'dashed',
        marginBottom: 24,
    },
    guideText: {
        color: 'white',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: 'hidden',
    },
    controlsContainer: {
        backgroundColor: 'black',
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    instructionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    instructionText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    galleryButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
    },
    capturingIndicator: {
        flex: 1,
        backgroundColor: '#14B8A6',
        borderRadius: 32,
        transform: [{ scale: 0.8 }],
    },
});
