import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Alert } from 'react-native';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<boolean>;
    signUp: (email: string, pass: string) => Promise<boolean>;
    signOut: () => void;
    session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Init session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, pass: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
                return false;
            }
            return true;
        } catch (e: any) {
            Alert.alert('Error', e.message);
            return false;
        }
    };

    const signUp = async (email: string, pass: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password: pass,
                options: {
                    data: {
                        full_name: '', // Optional: can be passed if we modify UI
                        avatar_url: '',
                    }
                }
            });

            if (error) {
                Alert.alert('Signup Failed', error.message);
                return false;
            }

            // Note: If email confirmation is enabled in Supabase, session might be null here
            // Alert.alert('Success', 'Please check your email for confirmation link!');
            return true;
        } catch (e: any) {
            Alert.alert('Error', e.message);
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
            signUp,
            signOut,
            session
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
