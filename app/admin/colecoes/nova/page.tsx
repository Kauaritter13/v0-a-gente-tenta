"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Resenha } from "@/lib/types"

export default function NovaColecaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [resenhas, setResenhas] = useState<Resenha[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from("resenhas").select("*").order("date", { ascending: false }).then(({ data }) => {
      if (data) setResenhas(data)
    })
  }, [])

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { toast.error("Titulo obrigatorio"); return }
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, resenhaIds: selected }),
      })
      if (!res.ok) throw new Error()
      toast.success("Colecao criada!")
      router.push("/admin/colecoes")
      router.refresh()
    } catch { toast.error("Erro ao criar colecao") } finally { setIsLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/colecoes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />Voltar
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground">Nova Colecao</h1>
        <p className="text-muted-foreground mt-1">Agrupe resenhas para compartilhar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Colecao</CardTitle>
          <CardDescription>Um link unico sera gerado para compartilhar todas as resenhas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Titulo *</FieldLabel>
                <Input id="title" placeholder="Ex: Resenhas de Dezembro" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descricao</FieldLabel>
                <Textarea id="description" placeholder="Descricao da colecao..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </Field>

              {resenhas.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Selecione as resenhas</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                    {resenhas.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer" onClick={() => toggle(r.id)}>
                        <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")} - {r.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{selected.length} selecionadas</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : <><Save className="h-4 w-4 mr-2" />Criar Colecao</>}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
