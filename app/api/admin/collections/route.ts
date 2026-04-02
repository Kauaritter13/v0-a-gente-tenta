import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const { title, description, resenhaIds } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: "Titulo obrigatorio" }, { status: 400 })
    }

    const { data: collection, error } = await supabase
      .from("collections")
      .insert({ title: title.trim(), description: description?.trim() || null })
      .select()
      .single()

    if (error) {
      console.error("Error creating collection:", error)
      return NextResponse.json({ error: "Erro ao criar colecao" }, { status: 500 })
    }

    if (resenhaIds?.length > 0) {
      const links = resenhaIds.map((rid: string) => ({
        collection_id: collection.id,
        resenha_id: rid,
      }))
      await supabase.from("collection_resenhas").insert(links)
    }

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
