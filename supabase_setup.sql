-- This script creates the missing tables for GLOW AI to replace AsyncStorage
-- Run this in your Supabase SQL Editor

-- 1. Routine Tasks
CREATE TABLE IF NOT EXISTS public.routine_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('morning', 'night')) NOT NULL,
    time TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Daily Routine Logs (to track completion)
CREATE TABLE IF NOT EXISTS public.routine_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    completion_rate INTEGER NOT NULL,
    completed_task_ids UUID[] DEFAULT '{}',
    UNIQUE(user_id, date)
);

-- 3. User Orders (Shop Purchases)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create Policies for secure access
CREATE POLICY "Users can manage their own routine tasks" ON public.routine_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own routine logs" ON public.routine_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their order items" ON public.order_items FOR ALL USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- Optional: Enable Realtime for these tables
alter publication supabase_realtime add table public.routine_tasks;
alter publication supabase_realtime add table public.routine_logs;
alter publication supabase_realtime add table public.orders;
