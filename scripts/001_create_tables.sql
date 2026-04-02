-- Tabela de usuários (convidados)
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  unique_code text unique not null default encode(gen_random_bytes(8), 'hex'),
  created_at timestamp with time zone default now()
);

-- Tabela de resenhas (eventos)
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

-- Tabela de convites (relação entre guests e resenhas)
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
