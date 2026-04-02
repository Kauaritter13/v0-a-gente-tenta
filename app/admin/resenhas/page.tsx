import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, MapPin, CheckCircle } from "lucide-react"

export default async function ResenhasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resenhas } = await supabase
    .from("resenhas")
    .select("*, responses:responses(id, status)")
    .order("date", { ascending: false })

  const formatDate = (dateStr: string, endDate: string | null) => {
    const start = new Date(dateStr + "T00:00:00")
    const formatted = start.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
    if (endDate) {
      const end = new Date(endDate + "T00:00:00")
      return `${formatted} - ${end.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`
    }
    return formatted
  }

  const isPast = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dateStr + "T00:00:00") < today
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Resenhas</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus eventos</p>
        </div>
        <Button asChild>
          <Link href="/admin/resenhas/nova"><Plus className="h-4 w-4 mr-2" />Nova Resenha</Link>
        </Button>
      </div>

      {resenhas && resenhas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resenhas.map((resenha) => {
            const confirmed = resenha.responses?.filter((r: { status: string }) => r.status === "confirmed").length || 0
            const total = resenha.responses?.length || 0
            const past = isPast(resenha.end_date || resenha.date)

            return (
              <Link key={resenha.id} href={`/admin/resenhas/${resenha.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {resenha.cover_image_url && (
                    <div className="h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${resenha.cover_image_url})` }} />
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{resenha.title}</CardTitle>
                      {past && <Badge variant="secondary">Passado</Badge>}
                    </div>
                    {resenha.description && <CardDescription className="line-clamp-2">{resenha.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(resenha.date, resenha.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{resenha.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">{confirmed}</span>
                      <span className="text-muted-foreground">/ {total} respostas</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma resenha ainda</h3>
            <p className="text-muted-foreground mb-4">Crie sua primeira resenha para comecar</p>
            <Button asChild><Link href="/admin/resenhas/nova"><Plus className="h-4 w-4 mr-2" />Criar Resenha</Link></Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
