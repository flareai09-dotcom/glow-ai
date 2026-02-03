import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Camera, Link, DollarSign, Tag, Briefcase } from 'lucide-react-native';
import { useProduct } from '../context/ProductContext';
import { LinearGradient } from 'expo-linear-gradient';

export function AddProductScreen({ navigation }: { navigation: any }) {
    const { addProduct } = useProduct();
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Skincare');
    const [image, setImage] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [loading, setLoading] = useState(false);

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Product</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex1}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Product Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Vitamin C Serum"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Brand</Text>
                        <View style={styles.inputIconWrapper}>
                            <Briefcase size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="Brand Name"
                                value={brand}
                                onChangeText={setBrand}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Price (₹)</Text>
                            <View style={styles.inputIconWrapper}>
                                <DollarSign size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithIcon]}
                                    placeholder="999"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.inputIconWrapper}>
                                <Tag size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.inputWithIcon]}
                                    placeholder="Serum"
                                    value={category}
                                    onChangeText={setCategory}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Affiliate Link</Text>
                        <View style={styles.inputIconWrapper}>
                            <Link size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="https://..."
                                value={affiliateLink}
                                onChangeText={setAffiliateLink}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Image URL (Optional)</Text>
                        <View style={styles.inputIconWrapper}>
                            <Camera size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="https://image-url.com..."
                                value={image}
                                onChangeText={setImage}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleSave} disabled={loading}>
                        <LinearGradient
                            colors={['#14B8A6', '#10B981']}
                            style={styles.saveButton}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Product</Text>
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
        backgroundColor: '#FAF7F5',
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
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
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
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#1F2937',
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
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
