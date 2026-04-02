"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function CollectionActions({ collectionId }: { collectionId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Excluir esta colecao?")) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/collections/${collectionId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Colecao excluida!")
      router.push("/admin/colecoes")
      router.refresh()
    } catch { toast.error("Erro ao excluir") } finally { setIsDeleting(false) }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4 mr-2" />{isDeleting ? "Excluindo..." : "Excluir"}
    </Button>
  )
}
