import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function InviteNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Image src="/images/logo.png" alt="A Gente Tenta" width={80} height={80} className="h-20 w-20 object-contain mx-auto" />
        </div>
        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Resenha Nao Encontrada</CardTitle>
            <CardDescription>O link informado nao corresponde a nenhuma resenha valida.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full"><Link href="/">Voltar ao Inicio</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
