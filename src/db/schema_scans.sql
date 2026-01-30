-- ============================================
-- MINIMAL SCHEMA FOR SKIN ANALYSIS FEATURES
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ============================================
-- SCANS TABLE - Store AI analysis results
-- ============================================
create table if not exists public.scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  
  -- Image URLs
  image_url text not null,
  thumbnail_url text,
  
  -- Analysis results
  skin_score integer not null check (skin_score >= 0 and skin_score <= 100),
  issues jsonb not null default '[]'::jsonb,
  -- Example: [{"name": "Acne & Breakouts", "severity": 68, "confidence": 0.92, "detected": true, "area": "forehead"}]
  
  analysis_summary text,
  
  -- Metadata
  created_at timestamptz default now() not null
);

-- Create indexes for performance
create index if not exists scans_user_id_idx on public.scans(user_id);
create index if not exists scans_created_at_idx on public.scans(created_at desc);
create index if not exists scans_user_created_idx on public.scans(user_id, created_at desc);

-- Enable Row Level Security
alter table public.scans enable row level security;

-- RLS Policies
create policy "Users can view own scans"
  on scans for select
  using ( auth.uid() = user_id );

create policy "Users can insert own scans"
  on scans for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own scans"
  on scans for update
  using ( auth.uid() = user_id );

create policy "Users can delete own scans"
  on scans for delete
  using ( auth.uid() = user_id );

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Note: Run this in Supabase Dashboard -> Storage -> Create Bucket
-- Bucket name: scan-images
-- Public: false (use signed URLs for security)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png

-- Storage policies (run after creating bucket)
-- These allow authenticated users to upload/read their own images

-- Policy: Users can upload to their own folder
create policy "Users can upload own images"
on storage.objects for insert
with check (
  bucket_id = 'scan-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can read their own images
create policy "Users can read own images"
on storage.objects for select
using (
  bucket_id = 'scan-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own images
create policy "Users can delete own images"
on storage.objects for delete
using (
  bucket_id = 'scan-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Get user's latest scan
create or replace view user_latest_scan as
select distinct on (user_id)
  id,
  user_id,
  skin_score,
  issues,
  created_at
from scans
order by user_id, created_at desc;

-- View: Get user's score history (last 30 days)
create or replace view user_score_history as
select 
  user_id,
  skin_score,
  created_at,
  date_trunc('day', created_at) as scan_date
from scans
where created_at >= now() - interval '30 days'
order by user_id, created_at desc;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if table was created successfully
select 
  table_name, 
  column_name, 
  data_type 
from information_schema.columns 
where table_name = 'scans' 
order by ordinal_position;

-- Check indexes
select 
  indexname, 
  indexdef 
from pg_indexes 
where tablename = 'scans';

-- Check RLS policies
select 
  policyname, 
  permissive, 
  roles, 
  cmd 
from pg_policies 
where tablename = 'scans';
