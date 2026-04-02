import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Link2 } from "lucide-react"
import { ResponsesList } from "./responses-list"
import { ShareLink } from "./share-link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ResenhaDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resenha, error } = await supabase
    .from("resenhas")
    .select("*, responses:responses(*)")
    .eq("id", id)
    .single()

  if (error || !resenha) {
    notFound()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  const confirmed = resenha.responses?.filter((r: { status: string }) => r.status === "confirmed").length || 0
  const declined = resenha.responses?.filter((r: { status: string }) => r.status === "declined").length || 0
  const total = resenha.responses?.length || 0

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/admin/resenhas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />Voltar
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{resenha.title}</h1>
            {resenha.description && <p className="text-muted-foreground mt-2 max-w-2xl">{resenha.description}</p>}
          </div>
          <Button variant="outline" asChild>
            <Link href={`/admin/resenhas/${id}/editar`}><Edit className="h-4 w-4 mr-2" />Editar</Link>
          </Button>
        </div>
      </div>

      {/* Share Link */}
      <ShareLink shareCode={resenha.share_code} />

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Detalhes do Evento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="capitalize">
                {formatDate(resenha.date)}
                {resenha.end_date && ` ate ${formatDate(resenha.end_date)}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>{resenha.time.slice(0, 5)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{resenha.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumo</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total de respostas</span>
              <span className="font-bold">{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Confirmados</span>
              <Badge className="bg-green-500/10 text-green-600">{confirmed}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nao vao</span>
              <Badge variant="secondary">{declined}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Respostas</CardTitle>
          <CardDescription>Pessoas que responderam ao convite</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsesList responses={resenha.responses || []} />
        </CardContent>
      </Card>
    </div>
  )
}
