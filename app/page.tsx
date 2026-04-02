"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Mail, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAccessInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    
    setIsLoading(true)
    router.push(`/convite/${code.trim()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="A Gente Tenta"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <span className="font-serif text-xl font-bold text-foreground hidden sm:block">
              Resenhas
            </span>
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

      {/* Hero Section */}
      <section className="py-10 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 md:mb-8">
              <Image
                src="/images/logo.png"
                alt="A Gente Tenta"
                width={180}
                height={180}
                className="mx-auto h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 object-contain"
              />
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
              Crie eventos exclusivos, envie convites personalizados e gerencie 
              confirmações de presença de forma simples e elegante.
            </p>

            {/* Code Input */}
            <Card className="max-w-md mx-auto bg-card shadow-xl border-primary/20">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Tem um convite?</CardTitle>
                <CardDescription className="text-sm">
                  Digite seu código único para acessar os detalhes
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleAccessInvite} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Digite seu código..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 h-12"
                  />
                  <Button type="submit" disabled={isLoading || !code.trim()} className="h-12 sm:w-auto">
                    {isLoading ? (
                      "..."
                    ) : (
                      <>
                        Acessar
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Gerencie seus eventos de forma profissional e descomplicada
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Crie Eventos</CardTitle>
                <CardDescription>
                  Configure seus eventos com data, horário, local e descrição personalizada.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Gerencie Convidados</CardTitle>
                <CardDescription>
                  Adicione convidados e acompanhe as confirmações em tempo real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Envie Convites</CardTitle>
                <CardDescription>
                  Links únicos para cada convidado com acesso exclusivo aos detalhes do evento.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Acesse o painel administrativo para criar seus eventos e gerenciar convidados.
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push("/admin/login")}
            className="font-semibold"
          >
            Acessar Painel Admin
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>A Gente Tenta... Resenhas - Organize seus eventos com estilo</p>
        </div>
      </footer>
    </div>
  )
}
