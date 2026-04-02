import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { resenhaId, guestIds } = await request.json()

    if (!resenhaId || !guestIds || !Array.isArray(guestIds)) {
      return NextResponse.json(
        { error: "resenhaId e guestIds são obrigatórios" },
        { status: 400 }
      )
    }

    const invites = guestIds.map((guestId: string) => ({
      resenha_id: resenhaId,
      guest_id: guestId,
      status: "pending",
    }))

    const { error } = await supabase
      .from("invites")
      .insert(invites)

    if (error) {
      console.error("Error creating invites:", error)
      return NextResponse.json(
        { error: "Erro ao criar convites" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in create invites:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
