import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, TrendingUp, FolderOpen } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resenhas } = await supabase.from("resenhas").select("id")
  const { data: collections } = await supabase.from("collections").select("id")
  const { data: responses } = await supabase.from("responses").select("status")

  const totalResenhas = resenhas?.length || 0
  const totalCollections = collections?.length || 0
  const totalResponses = responses?.length || 0
  const confirmed = responses?.filter(r => r.status === "confirmed").length || 0
  const declined = responses?.filter(r => r.status === "declined").length || 0

  const { data: upcomingResenhas } = await supabase
    .from("resenhas")
    .select("*")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .limit(5)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visao geral dos seus eventos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resenhas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResenhas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Colecoes</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmed}</div>
            <p className="text-xs text-muted-foreground mt-1">de {totalResponses} respostas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nao Vao</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{declined}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Proximas Resenhas
            </CardTitle>
            <CardDescription>Eventos que acontecerao em breve</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingResenhas && upcomingResenhas.length > 0 ? (
              <div className="space-y-4">
                {upcomingResenhas.map((resenha) => (
                  <Link
                    key={resenha.id}
                    href={`/admin/resenhas/${resenha.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resenha.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(resenha.date)} - {resenha.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nenhuma resenha agendada</p>
            )}
            <Link href="/admin/resenhas/nova" className="block mt-4 text-center text-sm text-primary hover:underline">
              Criar nova resenha
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acoes Rapidas</CardTitle>
            <CardDescription>Gerencie seus eventos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/resenhas/nova" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Criar Nova Resenha</p>
                <p className="text-sm text-muted-foreground">Adicione um novo evento</p>
              </div>
            </Link>
            <Link href="/admin/colecoes/nova" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Criar Colecao</p>
                <p className="text-sm text-muted-foreground">Agrupe resenhas em uma pasta</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
