import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { inviteId } = await request.json()

    if (!inviteId) {
      return NextResponse.json(
        { error: "inviteId é obrigatório" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("invites")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", inviteId)

    if (error) {
      console.error("Error updating invite:", error)
      return NextResponse.json(
        { error: "Erro ao atualizar convite" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in mark sent:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
