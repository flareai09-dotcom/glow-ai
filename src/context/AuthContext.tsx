import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Alert } from 'react-native';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<boolean>;
    signInWithPhone: (phone: string, pass: string) => Promise<boolean>;
    signUp: (email: string, pass: string, fullName: string) => Promise<boolean>;
    signUpWithPhone: (phone: string, pass: string, fullName: string) => Promise<boolean>;
    signOut: () => void;
    session: Session | null;
    user: { id: string; email?: string; phone?: string } | null;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Hardcoded Admin Credentials (as requested)
    const ADMIN_CREDS = {
        phones: ['+91884760213', '+917527996150'],
        emails: ['2005shreyashjain@gmail.com', 'mishrakrishna893@gmail.com']
    };

    const checkAdmin = (currentSession: Session | null) => {
        if (!currentSession?.user) return false;
        const { email, phone } = currentSession.user;
        return ADMIN_CREDS.emails.includes(email || '') || ADMIN_CREDS.phones.includes(phone || '');
    };

    useEffect(() => {
        // Init session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsAdmin(checkAdmin(session));
            setIsLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsAdmin(checkAdmin(session));
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const MASTER_PASS = 'admin@123';

    const checkIsAdminCred = (identifier: string) => {
        return ADMIN_CREDS.emails.includes(identifier) || ADMIN_CREDS.phones.includes(identifier);
    };

    const signIn = async (email: string, pass: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });

            if (error) {
                // Smart Admin Setup: If it's a known admin and account doesn't exist, try signing them up
                if (checkIsAdminCred(email) && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed'))) {
                    console.log('Detected admin login attempt for non-existent account. Attempting auto-signup...');
                    const signupSuccess = await signUp(email, pass, 'Admin User');
                    if (signupSuccess) {
                        // Retry sign in
                        return await signIn(email, pass);
                    }
                }
                Alert.alert('Login Failed', error.message);
                return false;
            }
            return true;
        } catch (e: any) {
            Alert.alert('Error', e.message);
            return false;
        }
    };

    const signInWithPhone = async (phone: string, pass: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                phone,
                password: pass,
            });

            if (error) {
                // Smart Admin Setup for Phone
                if (checkIsAdminCred(phone) && error.message.includes('Invalid login credentials')) {
                    console.log('Detected admin phone login attempt for non-existent account. Attempting auto-signup...');
                    const signupSuccess = await signUpWithPhone(phone, pass, 'Admin User');
                    if (signupSuccess) {
                        // Retry sign in
                        return await signInWithPhone(phone, pass);
                    }
                }
                Alert.alert('Login Failed', error.message);
                return false;
            }
            return true;
        } catch (e: any) {
            Alert.alert('Error', e.message);
            return false;
        }
    };

    const signUp = async (email: string, pass: string, fullName: string) => {
        try {
            const cleanEmail = email.trim();
            console.log('Attempting Email Signup for:', cleanEmail);

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password: pass,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        avatar_url: '',
                        is_admin: checkIsAdminCred(cleanEmail)
                    }
                }
            });

            if (error) {
                console.error('Supabase Signup Error DETAILS:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                });
                Alert.alert('Signup Failed', error.message);
                return false;
            }

            console.log('Signup Successful for:', cleanEmail);
            return true;
        } catch (e: any) {
            console.error('CRITICAL Signup Exception:', e);
            // If it's a JSON parse error, it likely means the URL is wrong or hitting HTML
            const errorMsg = e.message || 'An unexpected error occurred during signup';
            Alert.alert('Signup Failed', errorMsg);
            return false;
        }
    };

    const signUpWithPhone = async (phone: string, pass: string, fullName: string) => {
        try {
            const cleanPhone = phone.trim();
            console.log('Attempting Phone Signup for:', cleanPhone);

            const { data, error } = await supabase.auth.signUp({
                phone: cleanPhone,
                password: pass,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        avatar_url: '',
                        is_admin: checkIsAdminCred(cleanPhone)
                    }
                }
            });

            if (error) {
                console.error('Supabase Phone Signup Error DETAILS:', {
                    message: error.message,
                    status: error.status,
                    name: error.name
                });
                Alert.alert('Signup Failed', error.message);
                return false;
            }

            console.log('Phone Signup Successful for:', cleanPhone);
            return true;
        } catch (e: any) {
            console.error('CRITICAL Phone Signup Exception:', e);
            const errorMsg = e.message || 'An unexpected error occurred during phone signup';
            Alert.alert('Signup Failed', errorMsg);
            return false;
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            userToken: session ? session.access_token : null,
            isLoading,
            signIn,
            signInWithPhone,
            signUp,
            signUpWithPhone,
            signOut,
            session,
            user: session?.user ? { id: session.user.id, email: session.user.email, phone: session.user.phone } : null,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
