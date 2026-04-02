import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ArrowRight, CheckCircle } from "lucide-react"

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function ColecaoPublicPage({ params }: PageProps) {
  const { code } = await params
  const supabase = await createClient()

  const { data: collection, error } = await supabase
    .from("collections")
    .select("*")
    .eq("share_code", code)
    .single()

  if (error || !collection) {
    notFound()
  }

  const { data: links } = await supabase
    .from("collection_resenhas")
    .select("resenha:resenhas(*, responses:responses(id, status))")
    .eq("collection_id", collection.id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resenhas = links?.map((l: any) => l.resenha).filter(Boolean) || []

  const formatDate = (dateStr: string, endDate: string | null) => {
    const start = new Date(dateStr + "T00:00:00")
    const formatted = start.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })
    if (endDate) {
      const end = new Date(endDate + "T00:00:00")
      return `${formatted} - ${end.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`
    }
    return formatted
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Image src="/images/logo.png" alt="A Gente Tenta" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="font-serif text-lg font-bold text-foreground">Resenhas</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{collection.title}</h1>
          {collection.description && <p className="text-muted-foreground">{collection.description}</p>}
          <p className="text-sm text-muted-foreground mt-2">{resenhas.length} resenhas</p>
        </div>

        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {resenhas.map((r: any) => {
            const confirmed = r.responses?.filter((resp: any) => resp.status === "confirmed").length || 0

            return (
              <Link key={r.id} href={`/convite/${r.share_code}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  {r.cover_image_url && (
                    <div className="h-32 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${r.cover_image_url})` }} />
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{r.title}</CardTitle>
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                    {r.description && <CardDescription>{r.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(r.date, r.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{r.time.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{r.location}</span>
                    </div>
                    {confirmed > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">{confirmed} confirmados</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>A Gente Tenta... Resenhas</p>
        </div>
      </footer>
    </div>
  )
}
