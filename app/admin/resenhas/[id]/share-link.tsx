"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Copy, Link2 } from "lucide-react"

export function ShareLink({ shareCode }: { shareCode: string }) {
  const link = typeof window !== "undefined"
    ? `${window.location.origin}/convite/${shareCode}`
    : `/convite/${shareCode}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/convite/${shareCode}`
    )
    toast.success("Link copiado!")
  }

  return (
    <Card className="mb-8 border-primary/30 bg-primary/5">
      <CardContent className="flex items-center gap-4 py-4">
        <Link2 className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">Link de compartilhamento</p>
          <code className="text-xs text-muted-foreground break-all">{link}</code>
        </div>
        <Button size="sm" onClick={copyLink}>
          <Copy className="h-4 w-4 mr-2" />Copiar
        </Button>
      </CardContent>
    </Card>
  )
}
