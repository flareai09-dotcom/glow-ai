import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    description?: string; // Added description
}

interface ProductContextType {
    products: Product[];
    cart: Product[];
    isAdmin: boolean;
    toggleAdmin: () => void;
    addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
    deleteProduct: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const defaultProducts: Product[] = [
    {
        id: '1',
        name: 'Minimalist Niacinamide 10% Serum',
        brand: 'Minimalist',
        price: 349,
        rating: 4.5,
        reviews: 12500,
        category: 'Serum',
        benefits: ['Dark spots', 'Oil control'],
        image: 'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=200',
        affiliateLink: 'https://beminimalist.co',
        description: 'A soothing, lightweight serum that reduces acne marks and controls sebum production.',
    },
    {
        id: '2',
        name: 'Plum Green Tea Face Wash',
        brand: 'Plum',
        price: 225,
        rating: 4.3,
        reviews: 8900,
        category: 'Cleanser',
        benefits: ['Oil control', 'Gentle'],
        image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?q=80&w=200',
        affiliateLink: 'https://plumgoodness.com',
        description: 'Soap-free, SLS-free cleansing gel for oily & acne-prone skin.',
    },
    {
        id: '3',
        name: 'Dot & Key Watermelon Gel',
        brand: 'Dot & Key',
        price: 399,
        rating: 4.6,
        reviews: 6700,
        category: 'Moisturizer',
        benefits: ['Hydration', 'Oil-free'],
        image: 'https://images.unsplash.com/photo-1643379850623-7eb6442cd262?q=80&w=200',
        affiliateLink: 'https://dotandkey.com',
        description: 'Lightweight gel moisturizer with Vitamin C & watermelon for glowing skin.',
    },
    {
        id: '4',
        name: "Re'equil Sunscreen SPF 50",
        brand: "Re'equil",
        price: 495,
        rating: 4.7,
        reviews: 15200,
        category: 'Sunscreen',
        benefits: ['No white cast'],
        image: 'https://images.unsplash.com/photo-1620917669809-1af0497965de?q=80&w=200',
        affiliateLink: 'https://reequil.com',
        description: 'Ultra-matte dry touch sunscreen for oily, acne-prone skin.',
    },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(defaultProducts);
    const [cart, setCart] = useState<Product[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedProducts = await AsyncStorage.getItem('shop_products');
            const storedAdmin = await AsyncStorage.getItem('is_admin');
            const storedCart = await AsyncStorage.getItem('shop_cart');

            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
            if (storedAdmin) {
                setIsAdmin(JSON.parse(storedAdmin));
            }
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Failed to load shop data', error);
        }
    };

    const saveData = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save ${key}`, error);
        }
    };

    const toggleAdmin = () => {
        const newValue = !isAdmin;
        setIsAdmin(newValue);
        saveData('is_admin', newValue);
    };

    const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
        const newProduct: Product = {
            id: Date.now().toString(),
            rating: 0,
            reviews: 0,
            description: '',
            ...productData
        };
        const updated = [newProduct, ...products];
        setProducts(updated);
        saveData('shop_products', updated);
    };

    const deleteProduct = (id: string) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        saveData('shop_products', updated);
    };

    const addToCart = (product: Product) => {
        const updated = [...cart, product];
        setCart(updated);
        saveData('shop_cart', updated);
    };

    const removeFromCart = (productId: string) => {
        // Remove only the first instance if duplicates exist, or by unique logic?
        // Simple logic: remove element by ID (if unique enough) or filter out one instance.
        // For simplicity, let's filter out one occurrence using index
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) {
            const updated = [...cart];
            updated.splice(index, 1);
            setCart(updated);
            saveData('shop_cart', updated);
        }
    };

    const clearCart = () => {
        setCart([]);
        saveData('shop_cart', []);
    };

    return (
        <ProductContext.Provider value={{
            products,
            cart,
            isAdmin,
            toggleAdmin,
            addProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            clearCart
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
