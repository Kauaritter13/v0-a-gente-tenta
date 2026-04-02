import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FolderOpen, Calendar } from "lucide-react"

export default async function ColecoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: collections } = await supabase
    .from("collections")
    .select("*, collection_resenhas:collection_resenhas(resenha_id)")
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Colecoes</h1>
          <p className="text-muted-foreground mt-1">Agrupe resenhas para compartilhar com um unico link</p>
        </div>
        <Button asChild>
          <Link href="/admin/colecoes/nova"><Plus className="h-4 w-4 mr-2" />Nova Colecao</Link>
        </Button>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Link key={col.id} href={`/admin/colecoes/${col.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    {col.title}
                  </CardTitle>
                  {col.description && <CardDescription className="line-clamp-2">{col.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{col.collection_resenhas?.length || 0} resenhas</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma colecao</h3>
            <p className="text-muted-foreground mb-4">Crie uma colecao para agrupar resenhas</p>
            <Button asChild><Link href="/admin/colecoes/nova"><Plus className="h-4 w-4 mr-2" />Criar Colecao</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
