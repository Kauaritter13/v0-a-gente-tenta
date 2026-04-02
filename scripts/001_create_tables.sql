-- =============================================
-- A Gente Tenta Resenhas - Database Setup
-- Run this ONCE in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Resenhas (events)
create table if not exists public.resenhas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  end_date date,
  time time not null,
  location text not null,
  cover_image_url text,
  share_code text unique not null default encode(gen_random_bytes(4), 'hex'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Collections (groups of resenhas)
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  share_code text unique not null default encode(gen_random_bytes(4), 'hex'),
  created_at timestamptz default now()
);

-- 3. Collection <-> Resenha join
create table if not exists public.collection_resenhas (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  resenha_id uuid not null references public.resenhas(id) on delete cascade,
  unique(collection_id, resenha_id)
);

-- 4. Responses (RSVP + comments)
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  resenha_id uuid not null references public.resenhas(id) on delete cascade,
  name text not null,
  status text not null check (status in ('confirmed', 'declined')),
  comment text,
  created_at timestamptz default now()
);

-- 5. Enable RLS
alter table public.resenhas enable row level security;
alter table public.collections enable row level security;
alter table public.collection_resenhas enable row level security;
alter table public.responses enable row level security;

-- 6. RLS Policies
create policy "Admin full access to resenhas" on public.resenhas for all to authenticated using (true) with check (true);
create policy "Public can read resenhas" on public.resenhas for select to anon using (true);

create policy "Admin full access to collections" on public.collections for all to authenticated using (true) with check (true);
create policy "Public can read collections" on public.collections for select to anon using (true);

create policy "Admin full access to collection_resenhas" on public.collection_resenhas for all to authenticated using (true) with check (true);
create policy "Public can read collection_resenhas" on public.collection_resenhas for select to anon using (true);

create policy "Admin full access to responses" on public.responses for all to authenticated using (true) with check (true);
create policy "Public can read responses" on public.responses for select to anon using (true);
create policy "Public can create responses" on public.responses for insert to anon with check (true);

-- 7. Indexes
create index if not exists idx_resenhas_share_code on public.resenhas(share_code);
create index if not exists idx_resenhas_date on public.resenhas(date);
create index if not exists idx_collections_share_code on public.collections(share_code);
create index if not exists idx_collection_resenhas_collection on public.collection_resenhas(collection_id);
create index if not exists idx_collection_resenhas_resenha on public.collection_resenhas(resenha_id);
create index if not exists idx_responses_resenha on public.responses(resenha_id);
