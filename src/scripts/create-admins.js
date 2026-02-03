const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://sdaozejlnkzrkidxjylf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW96ZWpsbmt6cmtpZHhqeWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTgxNDcsImV4cCI6MjA4NTI3NDE0N30.vZlvNpIFz-7D6gJnqRtGUvtFZNzpc8zqHZFTyfT3MSU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMINS = [
    { email: '2005shreyashjain@gmail.com', name: 'Shreyash Jain' },
    { email: 'mishrakrishna893@gmail.com', name: 'Ekansh Mishra' },
    { phone: '+91884760213', name: 'Admin 1' },
    { phone: '+917527996150', name: 'Admin 2' }
];

const DEFAULT_PASSWORD = 'admin@123';

async function setupAdmins() {
    console.log('🚀 Setting up Admin Accounts...');

    for (const admin of ADMINS) {
        try {
            const signupData = admin.email
                ? { email: admin.email, password: DEFAULT_PASSWORD }
                : { phone: admin.phone, password: DEFAULT_PASSWORD };

            signupData.options = {
                data: {
                    full_name: admin.name,
                    is_admin: true
                }
            };

            const { data, error } = await supabase.auth.signUp(signupData);

            if (error) {
                if (error.message.includes('already registered')) {
                    console.log(`✅ ${admin.email || admin.phone} already exists.`);
                } else {
                    console.error(`❌ Error creating ${admin.email || admin.phone}:`, error.message);
                }
            } else {
                console.log(`✨ Created admin account: ${admin.email || admin.phone}`);
            }
        } catch (e) {
            console.error(`❌ Unexpected error for ${admin.email || admin.phone}:`, e.message);
        }
    }

    console.log('\n--- SETUP COMPLETE ---');
    console.log('Default Password for all: ', DEFAULT_PASSWORD);
}

setupAdmins();
