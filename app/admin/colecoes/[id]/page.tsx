import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar } from "lucide-react"
import { ShareLink } from "../../resenhas/[id]/share-link"
import { CollectionActions } from "./actions"
import { ManageResenhas } from "./manage-resenhas"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ColecaoDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: collection, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !collection) {
    notFound()
  }

  const { data: links } = await supabase
    .from("collection_resenhas")
    .select("resenha:resenhas(*)")
    .eq("collection_id", id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resenhas = links?.map((l: any) => l.resenha).filter(Boolean) || []
  const currentResenhaIds: string[] = resenhas.map((r: any) => r.id)

  const { data: allResenhas } = await supabase
    .from("resenhas")
    .select("id, title, date, location")
    .order("date", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/admin/colecoes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />Voltar
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{collection.title}</h1>
            {collection.description && <p className="text-muted-foreground mt-2">{collection.description}</p>}
          </div>
          <CollectionActions collectionId={collection.id} />
        </div>
      </div>

      <ShareLink shareCode={`colecao/${collection.share_code}`} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resenhas nesta colecao ({resenhas.length})</CardTitle>
            <CardDescription>Todas serao exibidas quando alguem acessar o link</CardDescription>
          </div>
          <ManageResenhas
            collectionId={collection.id}
            allResenhas={allResenhas || []}
            currentResenhaIds={currentResenhaIds}
          />
        </CardHeader>
        <CardContent>
          {resenhas.length > 0 ? (
            <div className="space-y-3">
              {resenhas.map((r: Record<string, string>) => (
                <Link key={r.id} href={`/admin/resenhas/${r.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")} - {r.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Nenhuma resenha adicionada. Clique em "Gerenciar" para adicionar.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
