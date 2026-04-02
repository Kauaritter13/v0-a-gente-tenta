import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Users } from "lucide-react"
import { GuestActions } from "./guest-actions"

export default async function ConvidadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: guests } = await supabase
    .from("guests")
    .select(`
      *,
      invites:invites(
        id,
        status,
        resenha:resenhas(title)
      )
    `)
    .order("name")

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Convidados</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua lista de convidados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/convidados/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Convidado
          </Link>
        </Button>
      </div>

      {guests && guests.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Convites</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell className="text-muted-foreground">{guest.email}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {guest.unique_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {guest.invites?.length || 0} convites
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <GuestActions guest={guest} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum convidado ainda</h3>
            <p className="text-muted-foreground mb-4">
              Adicione convidados para começar
            </p>
            <Button asChild>
              <Link href="/admin/convidados/novo">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Convidado
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
