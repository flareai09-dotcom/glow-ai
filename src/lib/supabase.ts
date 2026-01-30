import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdaozejlnkzrkidxjylf.supabase.co';
// Using legacy anon key for storage compatibility
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW96ZWpsbmt6cmtpZHhqeWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTgxNDcsImV4cCI6MjA4NTI3NDE0N30.vZlvNpIFz-7D6gJnqRtGUvtFZNzpc8zqHZFTyfT3MSU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
