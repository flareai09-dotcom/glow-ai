import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Plus, LayoutGrid, Package, LogOut, ChevronRight, Trash2, ExternalLink, History, Clock } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useProduct, Product } from '../context/ProductContext';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export function AdminPanelScreen({ navigation }: { navigation: any }) {
    const { signOut } = useAuth();
    const { products, deleteProduct } = useProduct();
    const [activeTab, setActiveTab] = useState('products');
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

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Admin Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Admin Panel</Text>
                        <Text style={styles.headerSubtitle}>Manage your Glow AI inventory</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <LogOut size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Stats */}
                <View style={styles.statsContainer}>
                    <LinearGradient
                        colors={['#14B8A6', '#0D9488']}
                        style={styles.statsCard}
                    >
                        <View style={styles.statsIcon}>
                            <Package size={24} color="white" />
                        </View>
                        <View>
                            <Text style={styles.statsValue}>{products.length}</Text>
                            <Text style={styles.statsLabel}>Total Products</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'products' && styles.activeTab]}
                        onPress={() => setActiveTab('products')}
                    >
                        <LayoutGrid size={18} color={activeTab === 'products' ? '#14B8A6' : '#9CA3AF'} />
                        <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <History size={18} color={activeTab === 'history' ? '#14B8A6' : '#9CA3AF'} />
                        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {activeTab === 'products' ? (
                        <>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Inventory</Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => navigation.navigate('AddProduct')}
                                >
                                    <Plus size={20} color="white" />
                                    <Text style={styles.addButtonText}>Add Product</Text>
                                </TouchableOpacity>
                            </View>

                            {products.map((product, index) => (
                                <Animatable.View
                                    key={product.id}
                                    animation="fadeInUp"
                                    delay={index * 100}
                                    style={styles.productCard}
                                >
                                    <Image source={{ uri: product.image }} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productBrand}>{product.brand}</Text>
                                        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                                        <View style={styles.productMeta}>
                                            <Text style={styles.productPrice}>₹{product.price}</Text>
                                            <View style={styles.categoryBadge}>
                                                <Text style={styles.categoryText}>{product.category}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.productActions}>
                                        <TouchableOpacity
                                            style={styles.actionIcon}
                                            onPress={() => handleDelete(product)}
                                        >
                                            <Trash2 size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionIcon}
                                            onPress={() => Alert.alert("Affiliate Link", product.affiliateLink)}
                                        >
                                            <ExternalLink size={18} color="#14B8A6" />
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>
                            ))}

                            {products.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <Package size={48} color="#E5E7EB" />
                                    <Text style={styles.emptyText}>No products added yet.</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Activity Logs</Text>
                                <TouchableOpacity onPress={fetchLogs}>
                                    <Clock size={20} color="#14B8A6" />
                                </TouchableOpacity>
                            </View>

                            {logs.map((log, index) => (
                                <Animatable.View
                                    key={log.id}
                                    animation="fadeInRight"
                                    delay={index * 50}
                                    style={styles.logCard}
                                >
                                    <View style={[styles.logIcon, { backgroundColor: log.action_type === 'DELETE_PRODUCT' ? '#FEF2F2' : '#F0FDFA' }]}>
                                        {log.action_type === 'DELETE_PRODUCT' ? (
                                            <Trash2 size={16} color="#EF4444" />
                                        ) : (
                                            <Plus size={16} color="#14B8A6" />
                                        )}
                                    </View>
                                    <View style={styles.logInfo}>
                                        <Text style={styles.logAction}>{log.details}</Text>
                                        <Text style={styles.logTime}>
                                            {new Date(log.created_at).toLocaleString()}
                                        </Text>
                                    </View>
                                </Animatable.View>
                            ))}

                            {logs.length === 0 && !loadingLogs && (
                                <View style={styles.emptyContainer}>
                                    <History size={48} color="#E5E7EB" />
                                    <Text style={styles.emptyText}>No activity recorded yet.</Text>
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
        backgroundColor: '#F9FAFB',
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
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
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
    },
    statsIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    statsLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
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
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    activeTab: {
        borderColor: '#14B8A6',
        backgroundColor: '#F0FDFA',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#14B8A6',
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
        color: '#111827',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#14B8A6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    addButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    productInfo: {
        flex: 1,
        marginLeft: 16,
    },
    productBrand: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1F2937',
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
        color: '#14B8A6',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
    },
    categoryText: {
        fontSize: 10,
        color: '#6B7280',
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
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        color: '#1F2937',
    },
    logTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    }
});
