-- =============================================
-- A Gente Tenta Resenhas - Database Setup
-- Run this ONCE in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Create tables
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  unique_code text unique not null default encode(gen_random_bytes(8), 'hex'),
  created_at timestamp with time zone default now()
);

create table if not exists public.resenhas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  time time not null,
  location text not null,
  cover_image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  resenha_id uuid not null references public.resenhas(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sent', 'viewed', 'confirmed', 'declined')),
  sent_at timestamp with time zone,
  viewed_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(guest_id, resenha_id)
);

-- 2. Enable Row Level Security
alter table public.guests enable row level security;
alter table public.resenhas enable row level security;
alter table public.invites enable row level security;

-- 3. RLS Policies for GUESTS table
-- Authenticated users (admin) can do everything
create policy "Admin full access to guests"
  on public.guests for all
  to authenticated
  using (true)
  with check (true);

-- Public can read guests (needed for invite page lookup by code)
create policy "Public can read guests"
  on public.guests for select
  to anon
  using (true);

-- 4. RLS Policies for RESENHAS table
-- Authenticated users (admin) can do everything
create policy "Admin full access to resenhas"
  on public.resenhas for all
  to authenticated
  using (true)
  with check (true);

-- Public can read resenhas (needed for invite page)
create policy "Public can read resenhas"
  on public.resenhas for select
  to anon
  using (true);

-- 5. RLS Policies for INVITES table
-- Authenticated users (admin) can do everything
create policy "Admin full access to invites"
  on public.invites for all
  to authenticated
  using (true)
  with check (true);

-- Public can read invites (needed for invite page)
create policy "Public can read invites"
  on public.invites for select
  to anon
  using (true);

-- Public can update invites (needed for RSVP confirm/decline)
create policy "Public can update invite status"
  on public.invites for update
  to anon
  using (true)
  with check (true);

-- 6. Indexes for performance
create index if not exists idx_guests_unique_code on public.guests(unique_code);
create index if not exists idx_invites_guest_id on public.invites(guest_id);
create index if not exists idx_invites_resenha_id on public.invites(resenha_id);
create index if not exists idx_invites_status on public.invites(status);
create index if not exists idx_resenhas_date on public.resenhas(date);
