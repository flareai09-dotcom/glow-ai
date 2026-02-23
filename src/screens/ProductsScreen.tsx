import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, StyleSheet, Linking, Alert, Platform, StatusBar, TextInput } from 'react-native';
import { ChevronLeft, Star, ShoppingCart, Filter, Heart, Plus, Trash2, X, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useProduct, Product } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ProductRecommendationScreenProps {
    navigation: any;
}

export function ProductRecommendationScreen({ navigation }: ProductRecommendationScreenProps) {
    const { products, deleteProduct, cart, addToCart } = useProduct();
    const { isAdmin } = useAuth();
    const { isDark, colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPrice = priceFilter ? (p.price >= priceFilter.min && p.price <= priceFilter.max) : true;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
    });

    const handleBuy = (link: string) => {
        if (link) {
            // Enhanced Deep Linking: Try to force app if it's an amazon/flipkart link
            let finalLink = link;
            if (link.includes('amazon.in') && !link.includes('tag=')) {
                finalLink = `${link}${link.includes('?') ? '&' : '?'}tag=glowai03-21`;
            }

            Linking.openURL(finalLink).catch(err => {
                console.error("Couldn't load page", err);
                Alert.alert("Link error", "Could not open the store link. Please check your internet connection.");
            });
        } else {
            Alert.alert("Error", "No affiliate link found for this product.");
        }
    };

    const handleDelete = (product: Product) => {
        Alert.alert(
            "Delete Product",
            `Are you sure you want to delete ${product.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteProduct(product.id);
                        if (success) {
                            Alert.alert("Success", "Product deleted");
                        } else {
                            Alert.alert("Error", "Failed to delete product");
                        }
                    }
                }
            ]
        );
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: { backgroundColor: colors.card, borderColor: colors.border },
        subText: { color: colors.subText },
        header: { backgroundColor: colors.background, borderBottomColor: colors.border },
        tabActive: { backgroundColor: colors.primary },
        tabInactive: { backgroundColor: colors.card, borderColor: colors.border },
        infoBanner: { backgroundColor: `${colors.primary}1A` }
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.flex1, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                {/* Header */}
                <View style={[styles.header, themeStyles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, themeStyles.text]}>Shop Routine</Text>

                    <View style={styles.headerRight}>
                        {isAdmin ? (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('AddProduct')}
                            >
                                <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.addButtonGradient}>
                                    <Plus size={24} color="white" />
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setShowFilters(!showFilters)}
                                style={styles.filterButton}
                            >
                                <Filter size={20} color={colors.text} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <ShoppingCart size={24} color={colors.text} />
                            {cart.length > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cart.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filters View */}
                {showFilters && (
                    <View style={[styles.filtersContainer, themeStyles.card]}>
                        <View style={styles.filtersHeader}>
                            <Text style={[styles.filtersTitle, themeStyles.text]}>Filter by Price</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={20} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.priceOptions}>
                            <TouchableOpacity
                                onPress={() => setPriceFilter(null)}
                                style={[styles.priceChip, !priceFilter && styles.priceChipActive]}
                            >
                                <Text style={[styles.priceChipText, !priceFilter && { color: colors.background }]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 0, max: 500 })}
                                style={[styles.priceChip, { borderColor: colors.border }, priceFilter?.max === 500 && [styles.priceChipActive, { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: colors.primary }]]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.max === 500 && { color: colors.background }]}>Under ₹500</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 500, max: 1000 })}
                                style={[styles.priceChip, { borderColor: colors.border }, priceFilter?.max === 1000 && [styles.priceChipActive, { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: colors.primary }]]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.max === 1000 && { color: colors.background }]}>₹500 - ₹1000</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 1000, max: 5000 })}
                                style={[styles.priceChip, { borderColor: colors.border }, priceFilter?.min === 1000 && [styles.priceChipActive, { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: colors.primary }]]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.min === 1000 && { color: colors.background }]}>Above ₹1000</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                    {/* Search Bar */}
                    <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Search size={20} color={colors.subText} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Search products or brands..."
                            placeholderTextColor={colors.subText}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={20} color={colors.subText} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Category tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
                        {categories.map((cat, i) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                style={[
                                    styles.categoryTab,
                                    selectedCategory === cat ? themeStyles.tabActive : themeStyles.tabInactive,
                                    selectedCategory !== cat && { borderWidth: 1 }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === cat ? [styles.activeCategoryText, { color: colors.background }] : themeStyles.subText
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Products grid */}
                    <View style={styles.productsGrid}>
                        {filteredProducts.map((product, index) => (
                            <TouchableOpacity
                                key={product.id}
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('ProductDetails', { product })}
                            >
                                <Animatable.View
                                    animation="fadeInUp"
                                    delay={index * 100}
                                    style={[styles.productCard, themeStyles.card, { shadowColor: colors.primary }]}
                                >
                                    {/* Product image */}
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{
                                                uri: product.image && product.image.trim() !== '' ? product.image : 'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=400',
                                                headers: {
                                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                                                }
                                            }}
                                            style={styles.productImage}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* Product details */}
                                    <View style={styles.productDetails}>
                                        <View style={styles.brandRow}>
                                            <Text style={styles.brandName}>{product.brand}</Text>
                                            <TouchableOpacity>
                                                <Heart size={16} color={isDark ? "#4B5563" : "#D1D5DB"} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[styles.productName, themeStyles.text]} numberOfLines={2}>
                                            {product.name}
                                        </Text>

                                        {/* Rating */}
                                        {product.rating > 0 && (
                                            <View style={styles.ratingRow}>
                                                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                                <Text style={[styles.ratingValue, themeStyles.text]}>{product.rating}</Text>
                                                <Text style={styles.reviewsCount}>({product.reviews})</Text>
                                            </View>
                                        )}

                                        {/* Price and CTA */}
                                        <View style={styles.priceActionRow}>
                                            <Text style={[styles.priceText, themeStyles.text]}>₹{product.price}</Text>

                                            {isAdmin ? (
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => handleDelete(product)}
                                                >
                                                    <Trash2 size={20} color="#EF4444" />
                                                </TouchableOpacity>
                                            ) : (
                                                <View style={styles.actionButtons}>
                                                    <TouchableOpacity onPress={() => {
                                                        addToCart(product);
                                                        Alert.alert("Added", "Added to cart!");
                                                    }}>
                                                        <View style={[styles.cartIconCircle, { backgroundColor: `${colors.primary}1A`, borderColor: `${colors.primary}4D` }]}>
                                                            <ShoppingCart size={16} color={colors.primary} />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleBuy(product.affiliateLink)}>
                                                        <View style={styles.addButtonWrapper}>
                                                            <LinearGradient
                                                                colors={[colors.primary, colors.secondary]}
                                                                style={styles.buyButton}
                                                            >
                                                                <Text style={styles.addButtonText}>Buy</Text>
                                                            </LinearGradient>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </Animatable.View>
                            </TouchableOpacity>
                        ))}
                        {filteredProducts.length === 0 && (
                            <Text style={[styles.emptyText, themeStyles.subText]}>No products found matching filters.</Text>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'white',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    addButtonGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filtersContainer: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 16,
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    filtersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    filtersTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    priceOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    priceChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    priceChipActive: {
        backgroundColor: '#00E5FF',
        borderColor: '#00E5FF',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    priceChipText: {
        fontSize: 12,
        color: '#E2E8F0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        gap: 12,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        padding: 0, // Remove default padding on Android
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    categoriesRow: {
        flexDirection: 'row',
        marginBottom: 16,
        maxHeight: 40,
    },
    categoryTab: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 100,
        marginRight: 8,
        height: 38,
    },
    activeCategoryTab: {
        backgroundColor: '#00E5FF',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeCategoryText: {
        color: '#09090B',
    },
    productsGrid: {
        paddingBottom: 40,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    productCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 16,
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productDetails: {
        flex: 1,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    brandName: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    ratingValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewsCount: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    priceActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cartIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    addButtonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    buyButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 60, 0.3)',
    },
});
