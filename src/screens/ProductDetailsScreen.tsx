import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, Linking, Alert } from 'react-native';
import { ChevronLeft, ShoppingCart, Star, Heart, Share2, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProduct, Product } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';

export function ProductDetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { product } = route.params as { product: Product };
    const { addToCart } = useProduct();
    const { isDark } = useTheme();

    const handleBuyNow = () => {
        if (product.affiliateLink) {
            Linking.openURL(product.affiliateLink).catch(err => console.error("Couldn't load page", err));
        } else {
            Alert.alert("Available at stores", "Please check your local retailers.");
        }
    };

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert("Added to Cart", `${product.name} is now in your cart.`);
    };

    const themeStyles = {
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white' },
        subText: { color: isDark ? '#9CA3AF' : '#6B7280' },
        divider: { backgroundColor: isDark ? '#374151' : '#E5E7EB' },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconButton, themeStyles.card]}>
                    <ChevronLeft size={24} color={themeStyles.text.color} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={[styles.iconButton, themeStyles.card]}>
                        <Share2 size={20} color={themeStyles.text.color} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, themeStyles.card]}>
                        <Heart size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Image */}
                <View style={[styles.imageContainer, themeStyles.card]}>
                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.brand, themeStyles.subText]}>{product.brand}</Text>
                        <View style={styles.ratingBadge}>
                            <Star size={12} color="white" fill="white" />
                            <Text style={styles.ratingText}>{product.rating} ({product.reviews})</Text>
                        </View>
                    </View>

                    <Text style={[styles.name, themeStyles.text]}>{product.name}</Text>
                    <Text style={[styles.price, themeStyles.text]}>₹{product.price}</Text>

                    <View style={[styles.divider, themeStyles.divider]} />

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Description</Text>
                        <Text style={[styles.description, themeStyles.subText]}>
                            {product.description || "A powerful formula designed to target skin concerns and improve overall textured. Suitable for daily use."}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, themeStyles.text]}>Key Benefits</Text>
                        <View style={styles.benefitsContainer}>
                            {product.benefits && product.benefits.map((benefit, index) => (
                                <View key={index} style={[styles.benefitTag, { backgroundColor: isDark ? '#064E3B' : '#F0FDFA' }]}>
                                    <Check size={14} color="#14B8A6" />
                                    <Text style={styles.benefitText}>{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, themeStyles.card]}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <ShoppingCart size={20} color="#14B8A6" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <LinearGradient
                        colors={['#14B8A6', '#10B981']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buyNowText}>Buy Now</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
        zIndex: 10,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    imageContainer: {
        height: 300,
        marginHorizontal: 24,
        marginTop: 16,
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    brand: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        lineHeight: 32,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#14B8A6',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
    },
    benefitsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    benefitTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 100,
        gap: 6,
    },
    benefitText: {
        color: '#0D9488',
        fontWeight: '600',
        fontSize: 13,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 24,
        paddingBottom: 34,
        gap: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 20,
    },
    addToCartButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#14B8A6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addToCartText: {
        color: '#14B8A6',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buyNowButton: {
        flex: 1.5,
    },
    gradientButton: {
        flex: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyNowText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
