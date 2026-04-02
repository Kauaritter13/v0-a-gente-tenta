"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NovaResenhaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    end_date: "",
    time: "",
    location: "",
    cover_image_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("resenhas").insert({
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        end_date: formData.end_date || null,
        time: formData.time,
        location: formData.location,
        cover_image_url: formData.cover_image_url || null,
      })

      if (error) {
        console.error("Error creating resenha:", error)
        toast.error("Erro ao criar resenha")
        return
      }

      toast.success("Resenha criada!")
      router.push("/admin/resenhas")
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erro ao criar resenha")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/resenhas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground">Nova Resenha</h1>
        <p className="text-muted-foreground mt-1">Crie um novo evento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Evento</CardTitle>
          <CardDescription>Um link unico sera gerado automaticamente para compartilhar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Titulo *</FieldLabel>
                <Input id="title" placeholder="Ex: Churrasco de Aniversario" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Descricao</FieldLabel>
                <Textarea id="description" placeholder="Detalhes sobre o evento..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="date">Data Inicio *</FieldLabel>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="end_date">Data Fim</FieldLabel>
                  <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} min={formData.date} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="time">Horario *</FieldLabel>
                  <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="location">Local *</FieldLabel>
                  <Input id="location" placeholder="Ex: Casa do Joao" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="cover_image_url">URL da Imagem de Capa</FieldLabel>
                <Input id="cover_image_url" type="url" placeholder="https://exemplo.com/imagem.jpg" value={formData.cover_image_url} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} />
              </Field>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : <><Save className="h-4 w-4 mr-2" />Criar Resenha</>}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
