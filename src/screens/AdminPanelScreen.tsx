import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert, Platform, StatusBar } from 'react-native';
import { Plus, LayoutGrid, Package, LogOut, ChevronRight, Trash2, ExternalLink, History, Clock } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProduct, Product } from '../context/ProductContext';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export function AdminPanelScreen({ navigation }: { navigation: any }) {
    const { signOut } = useAuth();
    const { products, deleteProduct } = useProduct();
    const [activeTab, setActiveTab] = useState('products');
    const { colors } = useTheme();
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchLogs();
        }
    }, [activeTab]);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const { data, error } = await supabase
                .from('admin_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to exit Admin Panel?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: signOut }
        ]);
    };

    const handleDelete = (product: Product) => {
        Alert.alert("Confirm Delete", `Delete ${product.name}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    await deleteProduct(product.id);
                    if (activeTab === 'history') fetchLogs();
                }
            }
        ]);
    };

    const themeStyles = {
        container: { backgroundColor: colors.background },
        header: { backgroundColor: colors.card },
        text: { color: colors.text },
        subText: { color: colors.subText },
        card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.primary },
        iconBox: { backgroundColor: `${colors.primary}1A` },
        errorBox: { backgroundColor: `${colors.error}1A` },
        tab: { backgroundColor: colors.card, borderColor: colors.border },
        activeTab: { backgroundColor: `${colors.primary}1A`, borderColor: colors.primary },
        productImage: { backgroundColor: colors.background },
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
                {/* Admin Header */}
                <View style={[styles.header, themeStyles.header]}>
                    <View>
                        <Text style={[styles.headerTitle, themeStyles.text]}>Admin Panel</Text>
                        <Text style={[styles.headerSubtitle, themeStyles.subText]}>Manage your Glow AI inventory</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, themeStyles.errorBox]}>
                        <LogOut size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Stats */}
                <View style={styles.statsContainer}>
                    <LinearGradient
                        colors={['#12121A', '#12121A']}
                        style={styles.statsCard}
                    >
                        <View style={[styles.statsIcon, themeStyles.iconBox]}>
                            <Package size={24} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.statsValue, { color: colors.primary }]}>{products.length}</Text>
                            <Text style={[styles.statsLabel, themeStyles.subText]}>Total Products</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, themeStyles.tab, activeTab === 'products' && themeStyles.activeTab]}
                        onPress={() => setActiveTab('products')}
                    >
                        <LayoutGrid size={18} color={activeTab === 'products' ? colors.primary : colors.subText} />
                        <Text style={[styles.tabText, themeStyles.subText, activeTab === 'products' && { color: colors.primary }]}>Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, themeStyles.tab, activeTab === 'history' && themeStyles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <History size={18} color={activeTab === 'history' ? colors.primary : colors.subText} />
                        <Text style={[styles.tabText, themeStyles.subText, activeTab === 'history' && { color: colors.primary }]}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {activeTab === 'products' ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, themeStyles.text]}>Inventory</Text>
                                <TouchableOpacity
                                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                                    onPress={() => navigation.navigate('AddProduct')}
                                >
                                    <Plus size={20} color={colors.background} />
                                    <Text style={[styles.addButtonText, { color: colors.background }]}>Add Product</Text>
                                </TouchableOpacity>
                            </View>

                            {products.map((product, index) => (
                                <Animatable.View
                                    key={product.id}
                                    animation="fadeInUp"
                                    delay={index * 100}
                                    style={[styles.productCard, themeStyles.card]}
                                >
                                    <Image source={{ uri: product.image }} style={[styles.productImage, themeStyles.productImage]} />
                                    <View style={styles.productInfo}>
                                        <Text style={[styles.productBrand, themeStyles.subText]}>{product.brand}</Text>
                                        <Text style={[styles.productName, themeStyles.text]} numberOfLines={1}>{product.name}</Text>
                                        <View style={styles.productMeta}>
                                            <Text style={[styles.productPrice, { color: colors.primary }]}>₹{product.price}</Text>
                                            <View style={[styles.categoryBadge, themeStyles.iconBox]}>
                                                <Text style={[styles.categoryText, { color: colors.primary }]}>{product.category}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.productActions}>
                                        <TouchableOpacity
                                            style={styles.actionIcon}
                                            onPress={() => handleDelete(product)}
                                        >
                                            <Trash2 size={18} color={colors.error} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionIcon}
                                            onPress={() => Alert.alert("Affiliate Link", product.affiliateLink)}
                                        >
                                            <ExternalLink size={18} color={colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>
                            ))}

                            {products.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <Package size={48} color={colors.subText} />
                                    <Text style={[styles.emptyText, themeStyles.subText]}>No products added yet.</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, themeStyles.text]}>Activity Logs</Text>
                                <TouchableOpacity onPress={fetchLogs}>
                                    <Clock size={20} color={colors.primary} />
                                </TouchableOpacity>
                            </View>

                            {logs.map((log, index) => (
                                <Animatable.View
                                    key={log.id}
                                    animation="fadeInRight"
                                    delay={index * 50}
                                    style={[styles.logCard, themeStyles.card]}
                                >
                                    <View style={[styles.logIcon, log.action_type === 'DELETE_PRODUCT' ? themeStyles.errorBox : themeStyles.iconBox]}>
                                        {log.action_type === 'DELETE_PRODUCT' ? (
                                            <Trash2 size={16} color={colors.error} />
                                        ) : (
                                            <Plus size={16} color={colors.primary} />
                                        )}
                                    </View>
                                    <View style={styles.logInfo}>
                                        <Text style={[styles.logAction, themeStyles.text]}>{log.details}</Text>
                                        <Text style={[styles.logTime, themeStyles.subText]}>
                                            {new Date(log.created_at).toLocaleString()}
                                        </Text>
                                    </View>
                                </Animatable.View>
                            ))}

                            {logs.length === 0 && !loadingLogs && (
                                <View style={styles.emptyContainer}>
                                    <History size={48} color={colors.subText} />
                                    <Text style={[styles.emptyText, themeStyles.subText]}>No activity recorded yet.</Text>
                                </View>
                            )}
                        </View>
                    )}
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
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: '#12121A',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 2,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        paddingHorizontal: 24,
        marginTop: 16,
    },
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        gap: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    statsIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    statsLabel: {
        fontSize: 14,
        color: '#94A3B8',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 24,
        gap: 12,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#12121A',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        gap: 8,
    },
    activeTab: {
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    activeTabText: {
        color: '#00E5FF',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E2E8F0',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E5FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    addButtonText: {
        color: '#09090B',
        fontSize: 13,
        fontWeight: 'bold',
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#12121A',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#09090B',
    },
    productInfo: {
        flex: 1,
        marginLeft: 16,
    },
    productBrand: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginTop: 2,
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
    },
    categoryText: {
        fontSize: 10,
        color: '#00E5FF',
        fontWeight: '500',
    },
    productActions: {
        flexDirection: 'row',
        gap: 4,
    },
    actionIcon: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    logCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12121A',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    logIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    logInfo: {
        flex: 1,
    },
    logAction: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E2E8F0',
    },
    logTime: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    }
});
