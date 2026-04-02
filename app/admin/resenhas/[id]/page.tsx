import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Edit } from "lucide-react"
import { InvitesList } from "./invites-list"
import { AddInviteDialog } from "./add-invite-dialog"

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
    .select(`
      *,
      invites:invites(
        *,
        guest:guests(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !resenha) {
    notFound()
  }

  // Buscar convidados que ainda não foram convidados para esta resenha
  const invitedGuestIds = resenha.invites?.map((i: { guest_id: string }) => i.guest_id) || []
  
  const { data: availableGuests } = await supabase
    .from("guests")
    .select("*")
    .order("name")

  const uninvitedGuests = availableGuests?.filter(g => !invitedGuestIds.includes(g.id)) || []

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

  const stats = {
    total: resenha.invites?.length || 0,
    confirmed: resenha.invites?.filter((i: { status: string }) => i.status === "confirmed").length || 0,
    declined: resenha.invites?.filter((i: { status: string }) => i.status === "declined").length || 0,
    pending: resenha.invites?.filter((i: { status: string }) => 
      i.status === "pending" || i.status === "sent" || i.status === "viewed"
    ).length || 0,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link 
          href="/admin/resenhas"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{resenha.title}</h1>
            {resenha.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{resenha.description}</p>
            )}
          </div>
          <Button variant="outline" asChild>
            <Link href={`/admin/resenhas/${id}/editar`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Event Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="capitalize">{formatDate(resenha.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>{formatTime(resenha.time)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{resenha.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total de convites</span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Confirmados</span>
              <Badge className="bg-green-500/10 text-green-600">{stats.confirmed}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Não vão</span>
              <Badge variant="secondary">{stats.declined}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pendentes</span>
              <Badge variant="outline">{stats.pending}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invites Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Convidados</CardTitle>
            <CardDescription>
              Gerencie os convites para este evento
            </CardDescription>
          </div>
          <AddInviteDialog resenhaId={resenha.id} guests={uninvitedGuests} />
        </CardHeader>
        <CardContent>
          <InvitesList invites={resenha.invites || []} resenhaId={resenha.id} />
        </CardContent>
      </Card>
    </div>
  )
}
