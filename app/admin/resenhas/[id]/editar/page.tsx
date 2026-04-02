import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EditResenhaForm } from "./edit-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarResenhaPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resenha, error } = await supabase
    .from("resenhas")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !resenha) {
    notFound()
  }

  return <EditResenhaForm resenha={resenha} />
}
