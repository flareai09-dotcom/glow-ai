import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, Linking, Alert, StatusBar, Platform } from 'react-native';
import { ChevronLeft, ShoppingCart, Star, Heart, Share2, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProduct, Product } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';

export function ProductDetailsScreen({ route, navigation }: { route: any, navigation: any }) {
    const { product } = route.params as { product: Product };
    const { addToCart } = useProduct();
    const { colors, isDark } = useTheme();

    const handleBuyNow = () => {
        if (product.affiliateLink) {
            let finalLink = product.affiliateLink;
            if (finalLink.includes('amazon.in') && !finalLink.includes('tag=')) {
                finalLink = `${finalLink}${finalLink.includes('?') ? '&' : '?'}tag=glowai03-21`;
            }
            Linking.openURL(finalLink).catch(err => {
                console.error("Couldn't load page", err);
                Alert.alert("Link error", "Could not open the store link. Please check your internet connection.");
            });
        } else {
            Alert.alert("Available at stores", "Please check your local retailers.");
        }
    };

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert("Added to Cart", `${product.name} is now in your cart.`);
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        subText: { color: colors.subText },
        primaryText: { color: colors.primary },
        divider: { backgroundColor: colors.border },
        imageContainer: { backgroundColor: colors.background, borderColor: colors.border },
        benefitTag: { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}4D` },
        ratingBadge: { backgroundColor: `${colors.primary}1A`, borderColor: colors.primary },
        footer: { backgroundColor: colors.card, borderTopColor: colors.border, shadowColor: colors.primary },
        buyNowText: { color: colors.background },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
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
                        <Heart size={20} color="#FF003C" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Image */}
                <View style={[styles.imageContainer, themeStyles.imageContainer]}>
                    <Image
                        source={{
                            uri: product.image && product.image.trim() !== '' ? product.image : 'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=400',
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                            }
                        }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.brand, themeStyles.subText]}>{product.brand}</Text>
                        <View style={[styles.ratingBadge, themeStyles.ratingBadge]}>
                            <Star size={12} color={colors.primary} fill={colors.primary} />
                            <Text style={[styles.ratingText, { color: colors.primary }]}>{product.rating} ({product.reviews})</Text>
                        </View>
                    </View>

                    <Text style={[styles.name, themeStyles.text]}>{product.name}</Text>
                    <Text style={[styles.price, { color: colors.primary }]}>₹{product.price}</Text>

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
                                <View key={index} style={[styles.benefitTag, themeStyles.benefitTag]}>
                                    <Check size={14} color={colors.primary} />
                                    <Text style={[styles.benefitText, { color: colors.primary }]}>{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View style={[styles.footer, themeStyles.footer]}>
                <TouchableOpacity style={[styles.addToCartButton, { borderColor: colors.primary }]} onPress={handleAddToCart}>
                    <ShoppingCart size={20} color={colors.primary} />
                    <Text style={[styles.addToCartText, { color: colors.primary }]}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <LinearGradient
                        colors={[colors.primary, colors.secondary]}
                        style={styles.gradientButton}
                    >
                        <Text style={[styles.buyNowText, themeStyles.buyNowText]}>Buy Now</Text>
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
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#00E5FF',
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
        backgroundColor: '#09090B',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
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
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    ratingText: {
        color: '#00E5FF',
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
        color: '#00E5FF',
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
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    benefitText: {
        color: '#00E5FF',
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
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 229, 255, 0.2)',
    },
    addToCartButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addToCartText: {
        color: '#00E5FF',
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
        color: '#09090B',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
