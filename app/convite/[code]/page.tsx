import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ResenhaPublicView } from "./resenha-view"

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function ConvitePage({ params }: PageProps) {
  const { code } = await params
  const supabase = await createClient()

  const { data: resenha, error } = await supabase
    .from("resenhas")
    .select("*, responses:responses(*)")
    .eq("share_code", code)
    .single()

  if (error || !resenha) {
    notFound()
  }

  return <ResenhaPublicView resenha={resenha} responses={resenha.responses || []} />
}
