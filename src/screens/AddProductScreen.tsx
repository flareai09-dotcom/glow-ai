import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { ChevronLeft, Camera, Link, DollarSign, Tag, Briefcase } from 'lucide-react-native';
import { useProduct } from '../context/ProductContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export function AddProductScreen({ navigation }: { navigation: any }) {
    const { addProduct } = useProduct();
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Skincare');
    const [image, setImage] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    const handleSave = async () => {
        if (!name || !brand || !price || !affiliateLink) {
            Alert.alert('Missing Fields', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        const success = await addProduct({
            name,
            brand,
            price: Number(price),
            category,
            benefits: [], // Can be enhanced later
            image: image || 'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=200', // Default placeholder
            affiliateLink
        });
        setLoading(false);

        if (success) {
            Alert.alert('Success', 'Product added successfully');
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to add product. Please try again.');
        }
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        header: { backgroundColor: colors.card, borderBottomColor: colors.border },
        text: { color: colors.text },
        subText: { color: colors.subText },
        input: { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        footer: { backgroundColor: colors.card, borderTopColor: colors.border },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={[styles.header, themeStyles.header]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.background }]}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>Add New Product</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, themeStyles.text]}>Product Name</Text>
                        <TextInput
                            style={[styles.input, themeStyles.input]}
                            placeholder="e.g. Vitamin C Serum"
                            placeholderTextColor={colors.subText}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, themeStyles.text]}>Brand</Text>
                        <View style={styles.inputIconWrapper}>
                            <Briefcase size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon, themeStyles.input]}
                                placeholder="Brand Name"
                                placeholderTextColor={colors.subText}
                                value={brand}
                                onChangeText={setBrand}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={[styles.label, themeStyles.text]}>Price (₹)</Text>
                            <View style={styles.inputIconWrapper}>
                                <DollarSign size={20} color={colors.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithIcon, themeStyles.input]}
                                    placeholder="999"
                                    placeholderTextColor={colors.subText}
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={[styles.label, themeStyles.text]}>Category</Text>
                            <View style={styles.inputIconWrapper}>
                                <Tag size={20} color={colors.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithIcon, themeStyles.input]}
                                    placeholder="Serum"
                                    placeholderTextColor={colors.subText}
                                    value={category}
                                    onChangeText={setCategory}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, themeStyles.text]}>Affiliate Link</Text>
                        <View style={styles.inputIconWrapper}>
                            <Link size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon, themeStyles.input]}
                                placeholder="https://..."
                                placeholderTextColor={colors.subText}
                                value={affiliateLink}
                                onChangeText={setAffiliateLink}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, themeStyles.text]}>Image URL (Optional)</Text>
                        <View style={styles.inputIconWrapper}>
                            <Camera size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon, themeStyles.input]}
                                placeholder="https://image-url.com..."
                                placeholderTextColor={colors.subText}
                                value={image}
                                onChangeText={setImage}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                </ScrollView>

                <View style={[styles.footer, themeStyles.footer]}>
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.saveButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={[styles.saveButtonText, { color: colors.background }]}>Save Product</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },
    flex1: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#12121A',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 229, 255, 0.2)',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#12121A',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        color: '#E2E8F0',
    },
    inputIconWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    inputWithIcon: {
        paddingLeft: 48,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    footer: {
        padding: 24,
        backgroundColor: '#12121A',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 229, 255, 0.2)',
    },
    saveButton: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#09090B',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
