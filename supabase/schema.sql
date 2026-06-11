-- ============================================================
-- VISUAL INTELLIGENCE PLATFORM — Schema unificado
-- VisualStats (dashboards + infografías) + Mizhar (Venture OS)
-- Ejecutar en el SQL Editor de Supabase (proyecto Mizhar restaurado)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- PERFILES / PLANES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  plan text not null default 'free' check (plan in ('free','pro')),
  plan_expires_at timestamptz,
  paypal_subscription_id text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

-- ---------- VISUALSTATS: DASHBOARDS ----------
create table if not exists dashboards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  slug text unique,
  prompt text not null,
  generation_mode text default 'prompt_only'
    check (generation_mode in ('prompt_only','prompt_file','prompt_image','prompt_dataset','prompt_multi')),
  executive_summary text,
  kpi_cards jsonb default '[]',      -- [{label,value,change,trend}]
  charts jsonb default '[]',         -- [{title,type,data,keys,x_key,colors}]
  ai_insight text,                   -- tarjeta firma de la plataforma
  key_conclusions jsonb default '[]',
  sources jsonb default '[]',        -- [{name,url,date}]
  category text,
  file_url text,
  thumbnail_url text,
  is_public boolean default false,
  is_featured boolean default false,
  is_dashboard_of_day boolean default false,
  view_count int default 0,
  status text default 'generating' check (status in ('generating','ready','failed')),
  created_at timestamptz default now()
);
create index if not exists idx_dashboards_slug on dashboards(slug);
create index if not exists idx_dashboards_public on dashboards(is_public) where is_public;

-- ---------- VISUALSTATS: INFOGRAFÍAS ----------
create table if not exists infographics (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique,
  cover_image_url text,
  category text not null,
  executive_summary text,
  key_insights jsonb default '[]',
  sources jsonb default '[]',
  tags text[] default '{}',
  is_premium boolean default false,
  is_published boolean default false,
  is_featured boolean default false,
  view_count int default 0,
  created_at timestamptz default now()
);

-- ---------- VISUALSTATS: LÍMITES DIARIOS ----------
create table if not exists user_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  dashboards_generated int default 0,
  files_uploaded int default 0,
  unique (user_id, usage_date)
);

-- ---------- VISUALSTATS: DATA SOURCE MANAGER (admin) ----------
create table if not exists data_sources (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  source_type text not null check (source_type in ('csv','xlsx','api','internal')),
  file_url text,
  api_endpoint text,
  category text,
  tags text[] default '{}',
  is_active boolean default true,
  record_count int,
  last_updated timestamptz default now()
);

-- ---------- MIZHAR: VENTURES ----------
create table if not exists ventures (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  industry text,
  business_model text,
  stage text check (stage in ('idea','pre_seed','seed','series_a','series_b','growth')),
  gtm_strategy text,
  strategic_priority text,
  target_market text,
  team_size int,
  funding_raised numeric default 0,
  monthly_revenue numeric default 0,
  interview_answers jsonb default '{}',
  -- score con explicación por dimensión (feedback #3 / #22)
  venture_score numeric,
  score_breakdown jsonb default '[]',  -- [{dimension, score, weight, rationale}]
  ai_analysis jsonb default '{}',
  status text default 'onboarding'
    check (status in ('onboarding','interview','processing','active','archived')),
  created_at timestamptz default now()
);

-- ---------- MIZHAR: DOCUMENTOS GENERADOS ----------
-- business_plan, marketing_plan, financials, market_intelligence,
-- valuation, fundraising, simulations, investor_deck, challenge
create table if not exists venture_documents (
  id uuid primary key default uuid_generate_v4(),
  venture_id uuid not null references ventures(id) on delete cascade,
  doc_type text not null check (doc_type in (
    'business_plan','marketing_plan','financials','market_intelligence',
    'swot','competitors','valuation','fundraising','simulation',
    'investor_deck','challenge_mode'
  )),
  version int default 1,
  content jsonb not null default '{}',   -- estructura tipada por doc_type
  -- overrides del usuario para simulación editable (feedback #5,#6,#7)
  user_overrides jsonb default '{}',
  theme jsonb default '{}',              -- colores, fuente, plantilla del export
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (venture_id, doc_type, version)
);

-- ---------- MIZHAR: CONVERSACIONES ----------
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  venture_id uuid not null references ventures(id) on delete cascade,
  context_type text default 'general' check (context_type in
    ('general','challenge_mode','valuation','fundraising','simulation','gtm')),
  messages jsonb default '[]',
  created_at timestamptz default now()
);

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table dashboards enable row level security;
alter table infographics enable row level security;
alter table user_usage enable row level security;
alter table data_sources enable row level security;
alter table ventures enable row level security;
alter table venture_documents enable row level security;
alter table conversations enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "public dashboards readable" on dashboards for select
  using (is_public or auth.uid() = user_id);
create policy "own dashboards writable" on dashboards for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "published infographics readable" on infographics for select
  using (is_published);
create policy "own usage" on user_usage for all using (auth.uid() = user_id);
create policy "own ventures" on ventures for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own venture docs" on venture_documents for all
  using (exists (select 1 from ventures v where v.id = venture_id and v.user_id = auth.uid()));
create policy "own conversations" on conversations for all
  using (exists (select 1 from ventures v where v.id = venture_id and v.user_id = auth.uid()));
