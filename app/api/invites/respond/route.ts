import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { inviteId, response } = await request.json()

    if (!inviteId || !response) {
      return NextResponse.json(
        { error: "inviteId e response são obrigatórios" },
        { status: 400 }
      )
    }

    if (response !== "confirmed" && response !== "declined") {
      return NextResponse.json(
        { error: "response deve ser 'confirmed' ou 'declined'" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("invites")
      .update({
        status: response,
        confirmed_at: response === "confirmed" ? new Date().toISOString() : null,
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
    console.error("Error in invite response:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
