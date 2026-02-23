-- ============================================
-- CHAT HISTORY TABLE - Store AI Chat conversations
-- ============================================
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  
  -- Message details
  message text not null,
  is_user boolean default true not null,
  
  -- Metadata
  created_at timestamptz default now() not null
);

-- Create indexes for performance
create index if not exists chat_history_user_id_idx on public.chat_history(user_id);
create index if not exists chat_history_created_at_idx on public.chat_history(created_at asc);

-- Enable Row Level Security
alter table public.chat_history enable row level security;

-- RLS Policies
create policy "Users can view own chat history"
  on chat_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own chat history"
  on chat_history for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete own chat history"
  on chat_history for delete
  using ( auth.uid() = user_id );

-- Enable Realtime
alter publication supabase_realtime add table public.chat_history;
