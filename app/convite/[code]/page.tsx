import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { InviteView } from "./invite-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function ConvitePage({ params }: PageProps) {
  const { code } = await params
  const supabase = await createClient()

  // Buscar o convidado pelo código único
  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("*")
    .eq("unique_code", code)
    .single()

  if (guestError || !guest) {
    notFound()
  }

  // Buscar convites do convidado com detalhes da resenha
  const { data: invites, error: invitesError } = await supabase
    .from("invites")
    .select(`
      *,
      resenha:resenhas(*)
    `)
    .eq("guest_id", guest.id)
    .order("created_at", { ascending: false })

  if (invitesError) {
    console.error("Error fetching invites:", invitesError)
  }

  // Atualizar status do convite para "viewed" se ainda estiver "sent"
  if (invites && invites.length > 0) {
    for (const invite of invites) {
      if (invite.status === "sent") {
        await supabase
          .from("invites")
          .update({ status: "viewed", viewed_at: new Date().toISOString() })
          .eq("id", invite.id)
      }
    }
  }

  return (
    <InviteView 
      guest={guest} 
      invites={invites || []} 
      code={code}
    />
  )
}
