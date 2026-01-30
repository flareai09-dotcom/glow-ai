-- ============================================
-- GLOW AI - EXTENDED DATABASE SCHEMA
-- Supabase PostgreSQL Schema for AI Features
-- ============================================

-- ============================================
-- 1. PROFILES TABLE (Already exists - enhanced)
-- ============================================
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  age integer,
  skin_type text, -- 'oily', 'dry', 'combination', 'normal', 'sensitive'
  skin_tone text, -- 'fair', 'medium', 'olive', 'brown', 'dark'
  gender text,
  location text, -- For climate-based recommendations
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- ============================================
-- 2. SCANS TABLE (Enhanced for AI Analysis)
-- ============================================
create table if not exists public.scans (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  
  -- Image data
  image_url text not null,
  image_thumbnail_url text,
  
  -- Overall analysis
  skin_score integer not null check (skin_score >= 0 and skin_score <= 100),
  analysis_status text default 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Detected issues (JSONB for flexibility)
  issues jsonb default '[]'::jsonb,
  -- Example structure:
  -- [
  --   {"name": "Acne & Breakouts", "severity": 68, "detected": true, "confidence": 0.92},
  --   {"name": "Dark Spots", "severity": 45, "detected": true, "confidence": 0.87}
  -- ]
  
  -- AI-generated insights
  summary text, -- Overall skin health summary
  recommendations text, -- General recommendations
  
  -- Metadata
  ai_model_version text, -- Track which AI model was used
  processing_time_ms integer, -- How long analysis took
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Index for faster queries
create index if not exists scans_user_id_idx on public.scans(user_id);
create index if not exists scans_created_at_idx on public.scans(created_at desc);

-- ============================================
-- 3. SCAN_ISSUES TABLE (Detailed issue tracking)
-- ============================================
create table if not exists public.scan_issues (
  id uuid not null default uuid_generate_v4(),
  scan_id uuid not null references public.scans on delete cascade,
  
  -- Issue details
  issue_type text not null, -- 'acne', 'dark_spots', 'fine_lines', 'wrinkles', 'oiliness', 'dryness', 'redness', 'pores'
  severity integer not null check (severity >= 0 and severity <= 100),
  confidence float check (confidence >= 0 and confidence <= 1),
  detected boolean default true,
  
  -- AI-generated remedy
  remedy_title text,
  remedy_description text,
  remedy_steps jsonb, -- Array of step-by-step instructions
  expected_improvement_days integer,
  
  -- Recommended ingredients
  recommended_ingredients text[],
  ingredients_to_avoid text[],
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create index if not exists scan_issues_scan_id_idx on public.scan_issues(scan_id);

-- ============================================
-- 4. ROUTINES TABLE (Personalized skincare routines)
-- ============================================
create table if not exists public.routines (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  scan_id uuid references public.scans on delete set null, -- Which scan generated this routine
  
  -- Routine details
  routine_type text not null, -- 'morning', 'evening', 'weekly'
  title text not null,
  description text,
  
  -- Steps (JSONB for flexibility)
  steps jsonb not null default '[]'::jsonb,
  -- Example structure:
  -- [
  --   {"order": 1, "step": "Cleanser", "product_type": "gentle cleanser", "ingredients": ["salicylic acid"], "duration": "30 seconds"},
  --   {"order": 2, "step": "Toner", "product_type": "hydrating toner", "ingredients": ["hyaluronic acid"], "duration": "10 seconds"}
  -- ]
  
  -- Metadata
  is_active boolean default true,
  season text, -- 'summer', 'winter', 'monsoon', 'all'
  difficulty text, -- 'beginner', 'intermediate', 'advanced'
  estimated_time_minutes integer,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create index if not exists routines_user_id_idx on public.routines(user_id);
create index if not exists routines_is_active_idx on public.routines(is_active);

-- ============================================
-- 5. PRODUCTS TABLE (Product catalog)
-- ============================================
create table if not exists public.products (
  id uuid not null default uuid_generate_v4(),
  
  -- Product details
  name text not null,
  brand text not null,
  category text not null, -- 'cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'mask', 'treatment'
  description text,
  
  -- Pricing
  price integer not null, -- In rupees
  currency text default 'INR',
  
  -- Images
  image_url text,
  thumbnail_url text,
  
  -- Ingredients
  ingredients text[], -- Array of ingredient names
  key_ingredients text[], -- Highlighted ingredients
  
  -- Skin concerns this product addresses
  concerns text[], -- ['acne', 'dark_spots', 'aging', 'dryness', 'oiliness']
  skin_types text[], -- ['oily', 'dry', 'combination', 'sensitive', 'normal']
  
  -- Ratings & Reviews
  rating float default 0 check (rating >= 0 and rating <= 5),
  reviews_count integer default 0,
  
  -- Affiliate & Purchase
  affiliate_link text,
  buy_link text,
  availability text default 'in_stock', -- 'in_stock', 'out_of_stock', 'discontinued'
  
  -- Metadata
  is_featured boolean default false,
  is_verified boolean default false, -- Dermatologist verified
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_concerns_idx on public.products using gin(concerns);
create index if not exists products_is_featured_idx on public.products(is_featured);

-- ============================================
-- 6. PRODUCT_RECOMMENDATIONS TABLE (AI-matched products)
-- ============================================
create table if not exists public.product_recommendations (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  scan_id uuid references public.scans on delete cascade,
  product_id uuid not null references public.products on delete cascade,
  
  -- Recommendation details
  relevance_score float check (relevance_score >= 0 and relevance_score <= 1), -- AI confidence
  reason text, -- Why this product was recommended
  matched_concerns text[], -- Which skin issues it addresses
  
  -- User interaction
  is_viewed boolean default false,
  is_clicked boolean default false,
  is_purchased boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create index if not exists product_recommendations_user_id_idx on public.product_recommendations(user_id);
create index if not exists product_recommendations_scan_id_idx on public.product_recommendations(scan_id);

-- ============================================
-- 7. CART TABLE (Shopping cart)
-- ============================================
create table if not exists public.cart (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  product_id uuid not null references public.products on delete cascade,
  
  quantity integer default 1 check (quantity > 0),
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id),
  unique(user_id, product_id) -- Prevent duplicate products in cart
);

-- ============================================
-- 8. PREMIUM_ACTIVITY TABLE (Already exists - enhanced)
-- ============================================
create table if not exists public.premium_activity (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  
  -- Premium status
  is_premium boolean default false,
  plan_type text, -- 'lifetime', 'monthly', 'yearly'
  
  -- Payment details
  payment_amount integer,
  payment_currency text default 'INR',
  payment_method text, -- 'razorpay', 'stripe', 'paytm'
  payment_id text, -- Transaction ID
  
  -- Dates
  start_date timestamp with time zone,
  end_date timestamp with time zone, -- NULL for lifetime
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- ============================================
-- 9. CHAT_HISTORY TABLE (AI assistant conversations)
-- ============================================
create table if not exists public.chat_history (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  
  -- Message details
  role text not null, -- 'user' or 'assistant'
  message text not null,
  
  -- Context (optional)
  scan_id uuid references public.scans on delete set null,
  context jsonb, -- Additional context for AI
  
  -- Metadata
  ai_model text, -- 'gpt-4', 'gemini-pro', etc.
  tokens_used integer,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create index if not exists chat_history_user_id_idx on public.chat_history(user_id);
create index if not exists chat_history_created_at_idx on public.chat_history(created_at desc);

-- ============================================
-- 10. PROGRESS_TRACKING TABLE (Weekly/monthly stats)
-- ============================================
create table if not exists public.progress_tracking (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  
  -- Time period
  period_type text not null, -- 'daily', 'weekly', 'monthly'
  period_start date not null,
  period_end date not null,
  
  -- Metrics
  average_skin_score integer,
  scans_count integer default 0,
  improvement_percentage float,
  
  -- Issue-specific tracking
  issue_trends jsonb, -- Track each issue over time
  -- Example: {"acne": {"start": 68, "end": 45, "change": -23}, "dark_spots": {...}}
  
  -- Routine adherence
  routines_completed integer default 0,
  routines_skipped integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create index if not exists progress_tracking_user_id_idx on public.progress_tracking(user_id);
create index if not exists progress_tracking_period_idx on public.progress_tracking(period_start, period_end);

-- ============================================
-- 11. ACHIEVEMENTS TABLE (Gamification)
-- ============================================
create table if not exists public.achievements (
  id uuid not null default uuid_generate_v4(),
  
  -- Achievement details
  name text not null,
  description text,
  icon text, -- Icon name or URL
  category text, -- 'scans', 'routine', 'improvement', 'social'
  
  -- Unlock criteria
  criteria jsonb, -- Conditions to unlock
  -- Example: {"scans_count": 10} or {"improvement_percentage": 20}
  
  points integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- ============================================
-- 12. USER_ACHIEVEMENTS TABLE (Unlocked achievements)
-- ============================================
create table if not exists public.user_achievements (
  id uuid not null default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  achievement_id uuid not null references public.achievements on delete cascade,
  
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id),
  unique(user_id, achievement_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Scans policies
alter table public.scans enable row level security;

create policy "Users can view own scans"
  on scans for select
  using ( auth.uid() = user_id );

create policy "Users can insert own scans"
  on scans for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own scans"
  on scans for update
  using ( auth.uid() = user_id );

-- Scan issues policies
alter table public.scan_issues enable row level security;

create policy "Users can view own scan issues"
  on scan_issues for select
  using ( 
    exists (
      select 1 from scans 
      where scans.id = scan_issues.scan_id 
      and scans.user_id = auth.uid()
    )
  );

-- Routines policies
alter table public.routines enable row level security;

create policy "Users can view own routines"
  on routines for select
  using ( auth.uid() = user_id );

create policy "Users can insert own routines"
  on routines for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own routines"
  on routines for update
  using ( auth.uid() = user_id );

-- Products policies (public read)
alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on products for select
  using ( true );

-- Product recommendations policies
alter table public.product_recommendations enable row level security;

create policy "Users can view own recommendations"
  on product_recommendations for select
  using ( auth.uid() = user_id );

-- Cart policies
alter table public.cart enable row level security;

create policy "Users can view own cart"
  on cart for select
  using ( auth.uid() = user_id );

create policy "Users can manage own cart"
  on cart for all
  using ( auth.uid() = user_id );

-- Chat history policies
alter table public.chat_history enable row level security;

create policy "Users can view own chat history"
  on chat_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert own messages"
  on chat_history for insert
  with check ( auth.uid() = user_id );

-- Progress tracking policies
alter table public.progress_tracking enable row level security;

create policy "Users can view own progress"
  on progress_tracking for select
  using ( auth.uid() = user_id );

-- Achievements policies (public read)
alter table public.achievements enable row level security;

create policy "Achievements are viewable by everyone"
  on achievements for select
  using ( true );

-- User achievements policies
alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on user_achievements for select
  using ( auth.uid() = user_id );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to tables with updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_routines_updated_at before update on routines
  for each row execute procedure update_updated_at_column();

create trigger update_products_updated_at before update on products
  for each row execute procedure update_updated_at_column();

-- ============================================
-- SEED DATA (Sample products for testing)
-- ============================================

-- Insert sample products (Indian brands)
insert into public.products (name, brand, category, description, price, image_url, ingredients, key_ingredients, concerns, skin_types, rating, reviews_count, affiliate_link, is_featured)
values
  (
    'Niacinamide 10% + Zinc 1% Serum',
    'Minimalist',
    'serum',
    'Reduces acne, controls oil, and minimizes pores',
    599,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    ARRAY['Niacinamide', 'Zinc PCA', 'Water'],
    ARRAY['Niacinamide 10%', 'Zinc 1%'],
    ARRAY['acne', 'oiliness', 'pores'],
    ARRAY['oily', 'combination'],
    4.5,
    2847,
    'https://www.amazon.in/dp/B08CXQVNP5',
    true
  ),
  (
    'Salicylic Acid 2% Face Wash',
    'Plum',
    'cleanser',
    'Deep cleanses pores and prevents acne',
    395,
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    ARRAY['Salicylic Acid', 'Glycolic Acid', 'Tea Tree Oil'],
    ARRAY['Salicylic Acid 2%'],
    ARRAY['acne', 'oiliness'],
    ARRAY['oily', 'combination'],
    4.3,
    1523,
    'https://www.nykaa.com/plum-green-tea-pore-cleansing-face-wash',
    true
  ),
  (
    'Vitamin C 10% Face Serum',
    'Dot & Key',
    'serum',
    'Brightens skin and reduces dark spots',
    899,
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    ARRAY['Vitamin C', 'Hyaluronic Acid', 'Vitamin E'],
    ARRAY['Vitamin C 10%', 'Hyaluronic Acid'],
    ARRAY['dark_spots', 'dullness', 'aging'],
    ARRAY['all'],
    4.4,
    3421,
    'https://www.nykaa.com/dot-key-vitamin-c-serum',
    true
  )
on conflict do nothing;

-- ============================================
-- VIEWS (Useful queries)
-- ============================================

-- View: User's latest scan with score
create or replace view user_latest_scan as
select 
  user_id,
  skin_score,
  created_at,
  issues
from scans
where created_at = (
  select max(created_at) 
  from scans s2 
  where s2.user_id = scans.user_id
);

-- View: User's skin score trend (last 7 scans)
create or replace view user_score_trend as
select 
  user_id,
  skin_score,
  created_at,
  row_number() over (partition by user_id order by created_at desc) as scan_number
from scans
where created_at >= now() - interval '30 days'
order by user_id, created_at desc;
