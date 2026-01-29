import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdaozejlnkzrkidxjylf.supabase.co';
const supabaseAnonKey = 'sb_publishable_-QPUnBiXj0c1hHACmVs8Dw_uOwaKJoy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
