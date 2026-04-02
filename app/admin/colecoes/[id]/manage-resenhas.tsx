"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Settings2 } from "lucide-react"

interface ResenhaItem {
  id: string
  title: string
  date: string
  location: string
}

interface ManageResenhasProps {
  collectionId: string
  allResenhas: ResenhaItem[]
  currentResenhaIds: string[]
}

export function ManageResenhas({ collectionId, allResenhas, currentResenhaIds }: ManageResenhasProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(currentResenhaIds)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resenhaIds: selected }),
      })

      if (!res.ok) throw new Error()

      toast.success("Colecao atualizada!")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar")
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges =
    selected.length !== currentResenhaIds.length ||
    selected.some((id) => !currentResenhaIds.includes(id))

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setSelected(currentResenhaIds) }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />Gerenciar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Resenhas</DialogTitle>
          <DialogDescription>Selecione quais resenhas fazem parte desta colecao</DialogDescription>
        </DialogHeader>

        {allResenhas.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Nenhuma resenha criada ainda.</p>
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {allResenhas.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => toggle(r.id)}
                >
                  <Checkbox
                    checked={selected.includes(r.id)}
                    onCheckedChange={() => toggle(r.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")} - {r.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">{selected.length} selecionadas</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading || !hasChanges}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
