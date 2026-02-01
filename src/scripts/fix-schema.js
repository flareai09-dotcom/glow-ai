
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:vXnRN5Tb7T690CKB@db.sdaozejlnkzrkidxjylf.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase in some environments
    },
});

async function run() {
    try {
        console.log('Connecting to Supabase Database...');
        await client.connect();
        console.log('✅ Connected.');

        // 1. Ensure is_premium column exists
        console.log('🛠️  Checking/Adding is_premium column...');
        await client.query(`
        do $$
        begin
            if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_premium') then
                alter table public.profiles add column is_premium boolean default false;
                raise notice 'Added is_premium column';
            else
                raise notice 'is_premium column already exists';
            end if;
        end $$;
    `);
        console.log('✅ Schema check complete.');

        // 2. FORCE REFRESH SCHEMA CACHE
        // This is the critical step for "Could not find column in schema cache" error
        console.log('🔄 Reloading Supabase Schema Cache...');
        await client.query("NOTIFY pgrst, 'reload config'");
        console.log('✅ Schema Cache Reload Triggered.');

        console.log('\n---------------------------------------');
        console.log('🎉 SUCCESS! Database repaired.');
        console.log('Please restart your app (Expo) just to be safe.');
        console.log('---------------------------------------');

    } catch (err) {
        console.error('❌ Error executing fix:', err);
    } finally {
        await client.end();
    }
}

run();
