import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Trash2, ShoppingBag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProduct, Product } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';

export function CartScreen({ navigation }: { navigation: any }) {
    const { cart, removeFromCart, clearCart } = useProduct();
    const { colors, isDark } = useTheme();

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.18; // 18% GST example
    const total = subtotal + tax;

    const handleCheckout = () => {
        Alert.alert(
            "Checkout Successfully",
            "Your order has been placed! (Mock)",
            [
                {
                    text: "OK", onPress: () => {
                        clearCart();
                        navigation.navigate('Home');
                    }
                }
            ]
        );
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        card: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.primary
        },
        subText: { color: colors.subText },
        divider: { backgroundColor: colors.border },
        primaryText: { color: colors.primary },
        checkoutText: { color: colors.background },
        emptyIconBg: { backgroundColor: colors.card, borderColor: colors.border },
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, themeStyles.text]}>My Cart</Text>
                <TouchableOpacity onPress={clearCart}>
                    <Text style={[styles.clearText, { color: colors.error }]}>Clear</Text>
                </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
                <View style={[styles.emptyContainer, themeStyles.container]}>
                    <View style={[styles.emptyIconBg, themeStyles.emptyIconBg]}>
                        <ShoppingBag size={48} color={colors.primary} />
                    </View>
                    <Text style={[styles.emptyTitle, themeStyles.text]}>Your Bag is Empty</Text>
                    <Text style={[styles.emptySubtitle, themeStyles.subText]}>Looks like you haven't added any skincare goodies yet.</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.shopNowButton, { backgroundColor: colors.card, borderColor: colors.primary }]}>
                        <Text style={[styles.shopNowText, { color: colors.primary }]}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.list}>
                        {cart.map((item, index) => (
                            <View key={`${item.id}-${index}`} style={[styles.cartItem, themeStyles.card]}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemBrand, themeStyles.subText]}>{item.brand}</Text>
                                    <Text style={[styles.itemName, themeStyles.text]}>{item.name}</Text>
                                    <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                                    <Trash2 size={18} color={colors.error} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={[styles.footer, themeStyles.card]}>
                        <View style={styles.summaryRow}>
                            <Text style={themeStyles.subText}>Subtotal</Text>
                            <Text style={[styles.summaryValue, themeStyles.text]}>₹{subtotal.toFixed(0)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={themeStyles.subText}>GST (18%)</Text>
                            <Text style={[styles.summaryValue, themeStyles.text]}>₹{tax.toFixed(0)}</Text>
                        </View>
                        <View style={[styles.divider, themeStyles.divider]} />
                        <View style={styles.summaryRow}>
                            <Text style={[styles.totalLabel, themeStyles.text]}>Total</Text>
                            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{total.toFixed(0)}</Text>
                        </View>

                        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButtonWrapper}>
                            <LinearGradient
                                colors={[colors.primary, colors.secondary]}
                                style={styles.checkoutButton}
                            >
                                <Text style={[styles.checkoutText, themeStyles.checkoutText]}>Checkout</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearText: {
        color: '#FF003C',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#12121A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 32,
    },
    shopNowButton: {
        backgroundColor: '#12121A',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    shopNowText: {
        color: '#00E5FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: 24,
        paddingBottom: 200,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#09090B',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
    },
    itemBrand: {
        fontSize: 12,
        marginBottom: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    deleteButton: {
        padding: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 34,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryValue: {
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    checkoutButtonWrapper: {
        marginTop: 24,
    },
    checkoutButton: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutText: {
        color: '#09090B',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
