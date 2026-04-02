import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const { error } = await supabase.from("collections").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Erro ao excluir colecao" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const { resenhaIds } = await request.json()

    await supabase.from("collection_resenhas").delete().eq("collection_id", id)

    if (resenhaIds?.length > 0) {
      const links = resenhaIds.map((rid: string) => ({
        collection_id: id,
        resenha_id: rid,
      }))
      await supabase.from("collection_resenhas").insert(links)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
