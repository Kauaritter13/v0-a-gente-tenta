"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Trash2, MessageSquare } from "lucide-react"
import type { Response } from "@/lib/types"

export function ResponsesList({ responses }: { responses: Response[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const deleteResponse = async (id: string) => {
    if (!confirm("Remover esta resposta?")) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/responses/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Resposta removida")
      router.refresh()
    } catch {
      toast.error("Erro ao remover")
    } finally {
      setLoadingId(null)
    }
  }

  if (responses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhuma resposta ainda. Compartilhe o link!</div>
  }

  const sorted = [...responses].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Comentario</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((resp) => (
          <TableRow key={resp.id}>
            <TableCell className="font-medium">{resp.name}</TableCell>
            <TableCell>
              {resp.status === "confirmed" ? (
                <Badge className="bg-green-500/10 text-green-600">Confirmado</Badge>
              ) : (
                <Badge variant="secondary">Nao vai</Badge>
              )}
            </TableCell>
            <TableCell className="max-w-[200px]">
              {resp.comment ? (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground truncate">{resp.comment}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(resp.created_at).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => deleteResponse(resp.id)} disabled={loadingId === resp.id}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
