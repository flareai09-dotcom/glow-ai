import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, StyleSheet, Linking, Alert } from 'react-native';
import { ChevronLeft, Star, ShoppingCart, Filter, Heart, Plus, Trash2, X } from 'lucide-react-native';
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
    const { isDark } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPrice = priceFilter ? (p.price >= priceFilter.min && p.price <= priceFilter.max) : true;
        return matchesCategory && matchesPrice;
    });

    const handleBuy = (link: string) => {
        if (link) {
            Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
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
        container: { backgroundColor: isDark ? '#111827' : '#FAF7F5' },
        text: { color: isDark ? '#F9FAFB' : '#1F2937' },
        card: { backgroundColor: isDark ? '#1F2937' : 'white', borderColor: isDark ? '#374151' : '#F9FAFB' },
        subText: { color: isDark ? '#9CA3AF' : '#9CA3AF' },
        header: { backgroundColor: isDark ? '#111827' : 'white', borderBottomColor: isDark ? '#374151' : '#F3F4F6' },
        tabActive: { backgroundColor: '#14B8A6' },
        tabInactive: { backgroundColor: isDark ? '#1F2937' : 'white', borderColor: isDark ? '#374151' : '#F3F4F6' },
        infoBanner: { backgroundColor: isDark ? 'rgba(20, 184, 166, 0.1)' : '#F0FDFA' }
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={styles.flex1}>
                {/* Header */}
                <View style={[styles.header, themeStyles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color={isDark ? "white" : "#374151"} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, themeStyles.text]}>Shop Routine</Text>

                    <View style={styles.headerRight}>
                        {isAdmin ? (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('AddProduct')}
                            >
                                <Plus size={24} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setShowFilters(!showFilters)}
                                style={styles.filterButton}
                            >
                                <Filter size={20} color={isDark ? "white" : "#374151"} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <ShoppingCart size={24} color={isDark ? "white" : "#374151"} />
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
                                <X size={20} color={isDark ? "white" : "#374151"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.priceOptions}>
                            <TouchableOpacity
                                onPress={() => setPriceFilter(null)}
                                style={[styles.priceChip, !priceFilter && styles.priceChipActive]}
                            >
                                <Text style={[styles.priceChipText, !priceFilter && { color: 'white' }]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 0, max: 500 })}
                                style={[styles.priceChip, priceFilter?.max === 500 && styles.priceChipActive]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.max === 500 && { color: 'white' }]}>Under ₹500</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 500, max: 1000 })}
                                style={[styles.priceChip, priceFilter?.max === 1000 && styles.priceChipActive]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.max === 1000 && { color: 'white' }]}>₹500 - ₹1000</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPriceFilter({ min: 1000, max: 5000 })}
                                style={[styles.priceChip, priceFilter?.min === 1000 && styles.priceChipActive]}
                            >
                                <Text style={[styles.priceChipText, priceFilter?.min === 1000 && { color: 'white' }]}>Above ₹1000</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Category tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
                        {categories.map((cat, i) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                style={[
                                    styles.categoryTab,
                                    selectedCategory === cat ? styles.activeCategoryTab : themeStyles.tabInactive
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === cat ? styles.activeCategoryText : themeStyles.subText
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
                                    style={[styles.productCard, themeStyles.card]}
                                >
                                    {/* Product image */}
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: product.image }} style={styles.productImage} />
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
                                                        <View style={styles.cartIconCircle}>
                                                            <ShoppingCart size={16} color="#14B8A6" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleBuy(product.affiliateLink)}>
                                                        <View style={styles.addButtonWrapper}>
                                                            <LinearGradient
                                                                colors={['#14B8A6', '#10B981']}
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
        backgroundColor: '#FAF7F5',
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
        backgroundColor: '#10B981',
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
        backgroundColor: '#F3F4F6',
    },
    priceChipActive: {
        backgroundColor: '#14B8A6',
    },
    priceChipText: {
        fontSize: 12,
        color: '#374151',
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
        backgroundColor: '#14B8A6',
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeCategoryText: {
        color: 'white',
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
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
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
        backgroundColor: '#F0FDFA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#CCFBF1',
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
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
});
