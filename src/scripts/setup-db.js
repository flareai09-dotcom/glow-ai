const { Client } = require('pg');

const connectionString = 'postgresql://postgres:vXnRN5Tb7T690CKB@db.sdaozejlnkzrkidxjylf.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sql = `
-- Create uuid-ossp extension if not exists
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 2. Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Policies for profiles (drop existing to avoid errors on rerun)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- 3. Create Scans Table
create table if not exists public.scans (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  score integer not null,
  issues text[] default '{}',
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- RLS for scans
alter table public.scans enable row level security;

drop policy if exists "Users can view own scans." on public.scans;
create policy "Users can view own scans." on scans for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert own scans." on public.scans;
create policy "Users can insert own scans." on scans for insert with check ( auth.uid() = user_id );

-- 4. Create Premium Activity Table
create table if not exists public.premium_activity (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  is_premium boolean default false,
  plan_type text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- RLS for premium_activity
alter table public.premium_activity enable row level security;

drop policy if exists "Users can view own premium status." on public.premium_activity;
create policy "Users can view own premium status." on premium_activity for select using ( auth.uid() = user_id );

-- 5. Auto-create profile trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger logic (drop if exists first to be safe, though specific trigger drop syntax is needed)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres...');

    // Split commands by semicolon just in case, or run as single block. 
    // pg driver supports multiple statements in one query usually.
    await client.query(sql);

    // --- MIGRATION / REPAIR LOGIC ---
    console.log('Running migrations to ensure schema correctness...');

    await client.query(`
            do $$
            begin
                -- 1. Fix Profiles: Add is_premium if missing
                if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_premium') then
                    alter table public.profiles add column is_premium boolean default false;
                end if;

                -- 2. Fix Scans: Rename score to skin_score if needed
                if exists (select 1 from information_schema.columns where table_name = 'scans' and column_name = 'score') then
                    alter table public.scans rename column score to skin_score;
                end if;

                -- 3. Fix Scans: Add thumbnail_url
                if not exists (select 1 from information_schema.columns where table_name = 'scans' and column_name = 'thumbnail_url') then
                    alter table public.scans add column thumbnail_url text;
                end if;

                -- 4. Fix Scans: Add analysis_summary
                if not exists (select 1 from information_schema.columns where table_name = 'scans' and column_name = 'analysis_summary') then
                    alter table public.scans add column analysis_summary text;
                end if;
            end $$;
        `);

    // 5. Fix Scans: Change issues to jsonb
    // Done separately to handle type conversion or errors gracefully
    try {
      await client.query(`
                alter table public.scans alter column issues type jsonb using to_jsonb(issues);
            `);
    } catch (e) {
      console.log('Issues column might already be correct or empty, attempting safe add/drop if needed...');
      // Fallback: If it's text[] and empty, or if we just want to force it
      await client.query(`
                 do $$
                 begin
                    if exists (select 1 from information_schema.columns where table_name = 'scans' and column_name = 'issues' and data_type = 'ARRAY') then
                        alter table public.scans drop column issues;
                        alter table public.scans add column issues jsonb default '[]'::jsonb;
                    end if;
                 end $$;
            `);
    }

    console.log('Successfully created tables and policies!');
  } catch (err) {
    console.error('Error executing sql:', err);
  } finally {
    await client.end();
  }
}

run();
