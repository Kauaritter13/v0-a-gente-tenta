"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { LogIn, UserPlus } from "lucide-react"
import Image from "next/image"

type AuthMode = "login" | "signup"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<AuthMode>("login")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error("Credenciais inválidas")
        return
      }

      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (error) {
        toast.error(error.message || "Erro ao criar conta")
        return
      }

      toast.success("Conta criada! Verifique seu e-mail para confirmar ou faça login diretamente.")
      setMode("login")
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = mode === "login" ? handleLogin : handleSignUp

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mb-4">
            <Image
              src="/images/logo.png"
              alt="A Gente Tenta"
              width={100}
              height={100}
              className="h-20 w-20 sm:h-24 sm:w-24 object-contain mx-auto"
            />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
            A Gente Tenta... Resenhas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Painel Administrativo
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {mode === "login" ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {mode === "login" 
                ? "Faça login para gerenciar seus eventos" 
                : "Crie sua conta para começar a organizar resenhas"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "Sua senha"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </Field>
                {mode === "signup" && (
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </Field>
                )}
                <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                  {isLoading ? (
                    "Aguarde..."
                  ) : mode === "login" ? (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Entrar
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center">
              {mode === "login" ? (
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Criar conta
                  </button>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Fazer login
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            Voltar para o início
          </a>
        </p>
      </div>
    </div>
  )
}
