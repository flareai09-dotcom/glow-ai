import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for flexibility
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || 'https://sdaozejlnkzrkidxjylf.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW96ZWpsbmt6cmtpZHhqeWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTgxNDcsImV4cCI6MjA4NTI3NDE0N30.vZlvNpIFz-7D6gJnqRtGUvtFZNzpc8zqHZFTyfT3MSU';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
