"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { MoreHorizontal, Copy, ExternalLink, Edit, Trash2 } from "lucide-react"
import type { Guest } from "@/lib/types"
import Link from "next/link"

interface GuestActionsProps {
  guest: Guest
}

export function GuestActions({ guest }: GuestActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const copyLink = async () => {
    const link = `${window.location.origin}/convite/${guest.unique_code}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copiado!")
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(guest.unique_code)
    toast.success("Código copiado!")
  }

  const deleteGuest = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${guest.name}? Todos os convites serão removidos.`)) {
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete guest")

      toast.success("Convidado excluído")
      router.refresh()
    } catch (error) {
      console.error("Error deleting guest:", error)
      toast.error("Erro ao excluir convidado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyCode}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar Código
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`/convite/${guest.unique_code}`, "_blank")}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Página
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/convidados/${guest.id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteGuest} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
