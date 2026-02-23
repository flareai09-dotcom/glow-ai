-- MASTER SQL FIX FOR GLOW AI
-- Run this ALL at once in the Supabase SQL Editor

-- 1. Create missing tables
CREATE TABLE IF NOT EXISTS public.routine_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('morning', 'night')) NOT NULL,
    time TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.routine_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    completion_rate INTEGER NOT NULL,
    completed_task_ids UUID[] DEFAULT '{}',
    UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  message text not null,
  is_user boolean default true not null,
  created_at timestamptz default now() not null
);

-- 2. Update scans table with clinical fields if missing
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE public.scans ADD COLUMN routine_suggestions JSONB DEFAULT '[]';
    EXCEPTION WHEN duplicate_column THEN 
        RAISE NOTICE 'column routine_suggestions already exists in scans table';
    END;
    
    BEGIN
        ALTER TABLE public.scans ADD COLUMN product_ingredients JSONB DEFAULT '[]';
    EXCEPTION WHEN duplicate_column THEN 
        RAISE NOTICE 'column product_ingredients already exists in scans table';
    END;
END $$;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for secure access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own routine tasks') THEN
        CREATE POLICY "Users can manage their own routine tasks" ON public.routine_tasks FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own routine logs') THEN
        CREATE POLICY "Users can manage their own routine logs" ON public.routine_logs FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own chat history') THEN
        CREATE POLICY "Users can view own chat history" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own chat history') THEN
        CREATE POLICY "Users can insert own chat history" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Enable Realtime for these tables
-- We wrap in a block to ignore errors if it's already added
DO $$ 
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_tasks;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_logs;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_history;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;
