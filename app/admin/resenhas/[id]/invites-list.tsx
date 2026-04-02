"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { MoreHorizontal, Send, Copy, Trash2, ExternalLink } from "lucide-react"
import type { Guest, Invite } from "@/lib/types"

interface InviteWithGuest extends Invite {
  guest: Guest
}

interface InvitesListProps {
  invites: InviteWithGuest[]
  resenhaId: string
}

export function InvitesList({ invites, resenhaId }: InvitesListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const getStatusBadge = (status: Invite["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Confirmado</Badge>
      case "declined":
        return <Badge variant="secondary">Não vai</Badge>
      case "viewed":
        return <Badge variant="outline">Visualizado</Badge>
      case "sent":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Enviado</Badge>
      default:
        return <Badge variant="outline">Pendente</Badge>
    }
  }

  const copyInviteLink = async (guestCode: string) => {
    const link = `${window.location.origin}/convite/${guestCode}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copiado!")
  }

  const markAsSent = async (inviteId: string) => {
    setLoadingStates((prev) => ({ ...prev, [inviteId]: true }))
    
    try {
      const res = await fetch("/api/admin/invites/mark-sent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      })

      if (!res.ok) throw new Error("Failed to mark as sent")
      
      toast.success("Convite marcado como enviado")
      router.refresh()
    } catch (error) {
      console.error("Error marking invite as sent:", error)
      toast.error("Erro ao atualizar convite")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inviteId]: false }))
    }
  }

  const deleteInvite = async (inviteId: string) => {
    if (!confirm("Tem certeza que deseja remover este convite?")) return
    
    setLoadingStates((prev) => ({ ...prev, [inviteId]: true }))
    
    try {
      const res = await fetch(`/api/admin/invites/${inviteId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete invite")
      
      toast.success("Convite removido")
      router.refresh()
    } catch (error) {
      console.error("Error deleting invite:", error)
      toast.error("Erro ao remover convite")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inviteId]: false }))
    }
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum convidado adicionado ainda.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="font-medium">{invite.guest.name}</TableCell>
            <TableCell className="text-muted-foreground">{invite.guest.email}</TableCell>
            <TableCell>{getStatusBadge(invite.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={loadingStates[invite.id]}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyInviteLink(invite.guest.unique_code)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => window.open(`/convite/${invite.guest.unique_code}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Convite
                  </DropdownMenuItem>
                  {invite.status === "pending" && (
                    <DropdownMenuItem onClick={() => markAsSent(invite.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Marcar como Enviado
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => deleteInvite(invite.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
