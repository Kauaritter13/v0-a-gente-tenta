"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Calendar, Clock, MapPin, Check, X, MessageSquare, User } from "lucide-react"
import Image from "next/image"
import type { Resenha, Response } from "@/lib/types"

interface Props {
  resenha: Resenha
  responses: Response[]
}

export function ResenhaPublicView({ resenha, responses }: Props) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null)
  const router = useRouter()

  const handleRespond = async (status: "confirmed" | "declined") => {
    if (!name.trim()) {
      toast.error("Digite seu nome")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resenhaId: resenha.id,
          name: name.trim(),
          status,
          comment: comment.trim() || null,
        }),
      })

      if (!res.ok) throw new Error()

      setSubmitted(true)
      setSubmittedStatus(status)
      toast.success(status === "confirmed" ? "Presenca confirmada!" : "Resposta registrada!")
      router.refresh()
    } catch {
      toast.error("Erro ao enviar resposta")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    })
  }

  const confirmed = responses.filter(r => r.status === "confirmed")
  const declined = responses.filter(r => r.status === "declined")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Image src="/images/logo.png" alt="A Gente Tenta" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="font-serif text-lg font-bold text-foreground">Resenhas</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="overflow-hidden mb-8">
          {resenha.cover_image_url && (
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${resenha.cover_image_url})` }} />
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-serif">{resenha.title}</CardTitle>
            {resenha.description && <CardDescription className="mt-2 text-base">{resenha.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="capitalize">
                  {formatDate(resenha.date)}
                  {resenha.end_date && ` ate ${formatDate(resenha.end_date)}`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>{resenha.time.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{resenha.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {!submitted ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Confirmar Presenca</CardTitle>
              <CardDescription>Digite seu nome e confirme se voce vai</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input placeholder="Seu nome *" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
              </div>
              <div>
                <Textarea placeholder="Comentario (opcional) - ex: 'Pode ser aqui em casa', 'Vou levar bebida'" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleRespond("confirmed")} disabled={isLoading || !name.trim()} className="flex-1 h-12">
                  <Check className="h-4 w-4 mr-2" />Vou!
                </Button>
                <Button variant="outline" onClick={() => handleRespond("declined")} disabled={isLoading || !name.trim()} className="flex-1 h-12">
                  <X className="h-4 w-4 mr-2" />Nao Vou
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              {submittedStatus === "confirmed" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">Presenca confirmada!</p>
                  <p className="text-muted-foreground">Nos vemos la, {name}!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <X className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">Resposta registrada</p>
                  <p className="text-muted-foreground">Sentiremos sua falta, {name}!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {responses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Quem Vai ({confirmed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {confirmed.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5">
                  <Badge className="bg-green-500/10 text-green-600 mt-0.5">Vai</Badge>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    {r.comment && (
                      <p className="text-sm text-muted-foreground flex items-start gap-1 mt-1">
                        <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        {r.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {declined.length > 0 && (
                <>
                  <div className="border-t border-border pt-3 mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Nao vao ({declined.length})</p>
                  </div>
                  {declined.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="secondary" className="mt-0.5">Nao</Badge>
                      <div>
                        <p className="font-medium text-muted-foreground">{r.name}</p>
                        {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>A Gente Tenta... Resenhas</p>
        </div>
      </footer>
    </div>
  )
}
