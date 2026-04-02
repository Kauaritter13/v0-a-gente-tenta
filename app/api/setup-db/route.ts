import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Criar tabela guests
    await supabase.rpc("exec_sql", {
      sql: `
        create table if not exists public.guests (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          email text unique not null,
          unique_code text unique not null default encode(gen_random_bytes(8), 'hex'),
          created_at timestamp with time zone default now()
        );
      `
    })

    // Criar tabela resenhas
    await supabase.rpc("exec_sql", {
      sql: `
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
      `
    })

    // Criar tabela invites
    await supabase.rpc("exec_sql", {
      sql: `
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
      `
    })

    return NextResponse.json({ 
      success: true,
      message: "Tabelas criadas com sucesso. Execute o script SQL manualmente no Supabase Dashboard para habilitar RLS e criar políticas."
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Erro ao configurar banco de dados. Execute o script SQL manualmente." },
      { status: 500 }
    )
  }
}
