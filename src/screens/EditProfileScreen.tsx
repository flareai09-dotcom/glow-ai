import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ChevronLeft, Camera, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function EditProfileScreen({ navigation }: { navigation: any }) {
    const [name, setName] = useState('Priya Sharma');
    const [email, setEmail] = useState('priya.sharma@email.com');
    const [bio, setBio] = useState('Skincare enthusiast ✨');

    const handleSave = () => {
        // Implement save logic here
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarEmoji}>👩🏻</Text>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={handleSave}>
                    <LinearGradient
                        colors={['#14B8A6', '#10B981']}
                        style={styles.saveButton}
                    >
                        <Save size={20} color="white" style={styles.saveIcon} />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    content: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarEmoji: {
        fontSize: 50,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#14B8A6',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'white',
    },
    formSection: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 20,
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
