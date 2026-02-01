
const { Client } = require('pg');

// Using the same working connection string
const connectionString = 'postgresql://postgres:vXnRN5Tb7T690CKB@db.sdaozejlnkzrkidxjylf.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function run() {
    try {
        console.log('Connecting to database...');
        await client.connect();

        console.log('🛠️ Adding remedies column to scans table...');

        // Add remedies field as JSONB
        await client.query(`
      do $$
      begin
        if not exists (select 1 from information_schema.columns where table_name = 'scans' and column_name = 'remedies') then
            alter table public.scans add column remedies jsonb default '[]'::jsonb;
            raise notice 'Added remedies column';
        else
            raise notice 'remedies column already exists';
        end if;
      end $$;
    `);

        // Reload cache
        console.log('🔄 Reloading schema cache...');
        await client.query("NOTIFY pgrst, 'reload config'");

        console.log('✅ Schema updated successfully!');

    } catch (err) {
        console.error('❌ Error updating schema:', err);
    } finally {
        await client.end();
    }
}

run();
