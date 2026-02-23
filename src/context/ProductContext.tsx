import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    category: string;
    benefits: string[];
    image: string;
    affiliateLink: string;
    description?: string;
}

interface ProductContextType {
    products: Product[];
    cart: Product[];
    isLoading: boolean;
    addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<boolean>;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    refreshProducts: () => void;
    isAdmin: boolean;
    toggleAdmin: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCart();
        loadAdminStatus();

        // Real-Time Subscription: Listen for changes in the products table
        const productChannel = supabase
            .channel('public:products')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    console.log('Product change detected! Refreshing...');
                    loadProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productChannel);
        };
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Database selection error, using fallback:', error.message);
                throw error;
            }

            if (data) {
                const mappedProducts: Product[] = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    price: p.price,
                    rating: p.rating || 0,
                    reviews: p.reviews || 0,
                    category: p.category,
                    benefits: p.benefits || [],
                    image: p.image && p.image.trim() !== '' ? p.image : null,
                    affiliateLink: p.affiliate_link || '',
                    description: p.description || ''
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Failed to load products from Supabase', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('shop_cart');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Failed to load cart', error);
        }
    };

    const loadAdminStatus = async () => {
        try {
            const status = await AsyncStorage.getItem('is_admin');
            setIsAdmin(status === 'true');
        } catch (error) {
            console.error('Failed to load admin status', error);
        }
    };

    const toggleAdmin = async () => {
        const newStatus = !isAdmin;
        setIsAdmin(newStatus);
        try {
            await AsyncStorage.setItem('is_admin', String(newStatus));
        } catch (error) {
            console.error('Failed to save admin status', error);
        }
    };

    const saveCart = async (newCart: Product[]) => {
        try {
            await AsyncStorage.setItem('shop_cart', JSON.stringify(newCart));
        } catch (error) {
            console.error('Failed to save cart', error);
        }
    };

    const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
        try {
            const { data, error } = await supabase.functions.invoke('product-manager', {
                body: {
                    action: 'ADD_PRODUCT',
                    productData
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            if (data?.success) {
                await loadProducts(); // Refresh list
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Failed to add product securely', error.message);
            return false;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('product-manager', {
                body: {
                    action: 'DELETE_PRODUCT',
                    productId: id
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            if (data?.success) {
                setProducts(prev => prev.filter(p => p.id !== id));
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Failed to delete product securely', error.message);
            return false;
        }
    };

    const addToCart = (product: Product) => {
        const updated = [...cart, product];
        setCart(updated);
        saveCart(updated);
    };

    const removeFromCart = (productId: string) => {
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) {
            const updated = [...cart];
            updated.splice(index, 1);
            setCart(updated);
            saveCart(updated);
        }
    };

    const clearCart = () => {
        setCart([]);
        saveCart([]);
    };

    return (
        <ProductContext.Provider value={{
            products,
            cart,
            isLoading,
            addProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            clearCart,
            refreshProducts: loadProducts,
            isAdmin,
            toggleAdmin
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProduct must be used within ProductProvider');
    return context;
};
