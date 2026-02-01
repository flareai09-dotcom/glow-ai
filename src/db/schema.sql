-- Create a table for public profiles using Supabase managed auth.users
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for user scans
create table public.scans (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  skin_score integer not null,
  issues jsonb default '[]'::jsonb,
  image_url text,
  thumbnail_url text,
  analysis_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS for scans
alter table public.scans enable row level security;

create policy "Users can view own scans."
  on scans for select
  using ( auth.uid() = user_id );

create policy "Users can insert own scans."
  on scans for insert
  with check ( auth.uid() = user_id );

-- Create a table for premium status
create table public.premium_activity (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  is_premium boolean default false,
  plan_type text, -- 'monthly', 'yearly'
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS for premium_activity
alter table public.premium_activity enable row level security;

create policy "Users can view own premium status."
  on premium_activity for select
  using ( auth.uid() = user_id );

-- Trigger to auto-create profile on signup
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- REFERRAL SYSTEM SCHEMA (Add these via SQL Editor)

-- 1. Add referral columns to profiles
alter table public.profiles add column if not exists referral_code text unique;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id);
alter table public.profiles add column if not exists wallet_balance decimal(10, 2) default 0.00;
alter table public.profiles add column if not exists total_earnings decimal(10, 2) default 0.00;

-- 2. Create withdraw requests table
create table if not exists public.withdraw_requests (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount decimal(10, 2) not null,
  upi_id text not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  processed_at timestamp with time zone,
  admin_note text,
  primary key (id)
);

-- 3. Enable RLS for withdraw_requests
alter table public.withdraw_requests enable row level security;

create policy "Users can view own requests"
  on withdraw_requests for select
  using ( auth.uid() = user_id );

create policy "Users can create requests"
  on withdraw_requests for insert
  with check ( auth.uid() = user_id );

