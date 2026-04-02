import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resenhaId, name, status, comment } = await request.json()

    if (!resenhaId || !name?.trim() || !status) {
      return NextResponse.json(
        { error: "resenhaId, name e status sao obrigatorios" },
        { status: 400 }
      )
    }

    if (status !== "confirmed" && status !== "declined") {
      return NextResponse.json(
        { error: "status deve ser 'confirmed' ou 'declined'" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.from("responses").insert({
      resenha_id: resenhaId,
      name: name.trim(),
      status,
      comment: comment?.trim() || null,
    })

    if (error) {
      console.error("Error creating response:", error)
      return NextResponse.json(
        { error: "Erro ao registrar resposta" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in response:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
