"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  User
} from "lucide-react"
import Image from "next/image"
import type { Guest, Invite, Resenha } from "@/lib/types"

interface InviteWithResenha extends Invite {
  resenha: Resenha
}

interface InviteViewProps {
  guest: Guest
  invites: InviteWithResenha[]
  code: string
}

export function InviteView({ guest, invites, code }: InviteViewProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleResponse = async (inviteId: string, response: "confirmed" | "declined") => {
    setLoadingStates((prev) => ({ ...prev, [inviteId]: true }))

    try {
      const res = await fetch("/api/invites/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, response }),
      })

      if (!res.ok) {
        throw new Error("Erro ao enviar resposta")
      }

      toast.success(
        response === "confirmed" 
          ? "Presença confirmada! Nos vemos lá." 
          : "Resposta registrada. Sentiremos sua falta!"
      )
      
      router.refresh()
    } catch (error) {
      console.error("Error responding to invite:", error)
      toast.error("Erro ao enviar resposta. Tente novamente.")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inviteId]: false }))
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5)
  }

  const getStatusBadge = (status: Invite["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Confirmado</Badge>
      case "declined":
        return <Badge variant="secondary">Não vai</Badge>
      case "viewed":
        return <Badge variant="outline">Visualizado</Badge>
      case "sent":
        return <Badge variant="outline">Enviado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  if (invites.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Olá, {guest.name}!</CardTitle>
            <CardDescription>
              Você ainda não tem convites pendentes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="A Gente Tenta"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="font-serif text-lg font-bold text-foreground hidden sm:block">
              Resenhas
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{guest.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Olá, {guest.name}!
          </h1>
          <p className="text-muted-foreground">
            {invites.length === 1 
              ? "Você tem 1 convite" 
              : `Você tem ${invites.length} convites`
            }
          </p>
        </div>

        <div className="space-y-6">
          {invites.map((invite) => (
            <Card key={invite.id} className="overflow-hidden">
              {invite.resenha.cover_image_url && (
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${invite.resenha.cover_image_url})` }}
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-serif">
                      {invite.resenha.title}
                    </CardTitle>
                    {invite.resenha.description && (
                      <CardDescription className="mt-2">
                        {invite.resenha.description}
                      </CardDescription>
                    )}
                  </div>
                  {getStatusBadge(invite.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="capitalize">{formatDate(invite.resenha.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{formatTime(invite.resenha.time)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{invite.resenha.location}</span>
                  </div>
                </div>

                {invite.status !== "confirmed" && invite.status !== "declined" && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleResponse(invite.id, "confirmed")}
                      disabled={loadingStates[invite.id]}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirmar Presença
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleResponse(invite.id, "declined")}
                      disabled={loadingStates[invite.id]}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Não Vou
                    </Button>
                  </div>
                )}

                {invite.status === "confirmed" && (
                  <div className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Sua presença está confirmada!</span>
                  </div>
                )}

                {invite.status === "declined" && (
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg text-muted-foreground">
                    <span>Você indicou que não poderá comparecer.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Seu código de acesso: <code className="bg-muted px-2 py-1 rounded">{code}</code></p>
        </div>
      </footer>
    </div>
  )
}
