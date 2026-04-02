"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Mail, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="A Gente Tenta" width={48} height={48} className="h-12 w-12 object-contain" />
            <span className="font-serif text-xl font-bold text-foreground hidden sm:block">Resenhas</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/login")}
            className="border-primary/50 text-foreground hover:bg-primary/10"
          >
            <span className="hidden sm:inline">Administrador</span>
            <span className="sm:hidden">Admin</span>
          </Button>
        </div>
      </header>

      <section className="py-10 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 md:mb-8">
              <Image src="/images/logo.png" alt="A Gente Tenta" width={180} height={180} className="mx-auto h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 object-contain" />
            </div>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary/30">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Organize suas resenhas com estilo
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight text-balance">
              A Gente Tenta...{" "}
              <span className="text-primary">Resenhas</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty px-2">
              Crie eventos, compartilhe o link e receba confirmacoes de presenca de forma simples e elegante.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/admin/login")}
              className="font-semibold"
            >
              Comecar Agora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Como funciona</h2>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">1. Crie a Resenha</CardTitle>
                <CardDescription>Configure seu evento com data, horario, local e descricao.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">2. Compartilhe o Link</CardTitle>
                <CardDescription>Envie o link unico para seus amigos pelo WhatsApp, Instagram ou onde quiser.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">3. Receba Respostas</CardTitle>
                <CardDescription>As pessoas confirmam presenca, deixam comentarios e voce acompanha tudo.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>A Gente Tenta... Resenhas - Organize seus eventos com estilo</p>
        </div>
      </footer>
    </div>
  )
}
