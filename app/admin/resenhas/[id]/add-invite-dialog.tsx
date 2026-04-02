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
import { UserPlus, Users } from "lucide-react"
import type { Guest } from "@/lib/types"
import Link from "next/link"

interface AddInviteDialogProps {
  resenhaId: string
  guests: Guest[]
}

export function AddInviteDialog({ resenhaId, guests }: AddInviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleGuest = (guestId: string) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    )
  }

  const selectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(guests.map((g) => g.id))
    }
  }

  const handleSubmit = async () => {
    if (selectedGuests.length === 0) {
      toast.error("Selecione pelo menos um convidado")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resenhaId,
          guestIds: selectedGuests,
        }),
      })

      if (!res.ok) throw new Error("Failed to create invites")

      toast.success(
        selectedGuests.length === 1
          ? "Convite criado!"
          : `${selectedGuests.length} convites criados!`
      )
      
      setOpen(false)
      setSelectedGuests([])
      router.refresh()
    } catch (error) {
      console.error("Error creating invites:", error)
      toast.error("Erro ao criar convites")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Convidados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Convidados</DialogTitle>
          <DialogDescription>
            Selecione os convidados para este evento
          </DialogDescription>
        </DialogHeader>

        {guests.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Não há convidados disponíveis.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/convidados/novo">Cadastrar Convidado</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-sm"
              >
                {selectedGuests.length === guests.length
                  ? "Desmarcar Todos"
                  : "Selecionar Todos"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedGuests.length} selecionados
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => toggleGuest(guest.id)}
                >
                  <Checkbox
                    checked={selectedGuests.includes(guest.id)}
                    onCheckedChange={() => toggleGuest(guest.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{guest.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {guest.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || selectedGuests.length === 0}
                className="flex-1"
              >
                {isLoading
                  ? "Adicionando..."
                  : `Adicionar ${selectedGuests.length > 0 ? `(${selectedGuests.length})` : ""}`}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
