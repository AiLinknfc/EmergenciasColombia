'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, LogIn, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, actionLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await signIn(email, password)
    if (success) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity">
        <ArrowLeft className="w-5 h-5" />
        Volver al Dashboard
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.svg" alt="Logo" className="w-12 h-12 shadow-lg rounded-xl shrink-0" />
            <div className="flex items-center gap-1">
              <span className="font-black text-2xl tracking-tighter text-on-surface uppercase">EMERGENC</span>
              <span 
                className="font-black text-3xl tracking-tighter text-primary uppercase animate-pulse ml-1"
                style={{ textShadow: '0 0 15px rgba(175, 16, 26, 0.4)' }}
              >
                IA
              </span>
            </div>
          </div>
          <h1 className="text-xl font-black text-on-surface tracking-widest uppercase mt-4">Iniciar Sesión</h1>
          <p className="text-on-surface-variant font-medium mt-2">Acceso restringido para personal autorizado</p>
        </div>

        <Card className="border-outline-variant bg-surface-container-lowest shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@emergencia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-surface-container-low border-outline-variant rounded-xl focus:ring-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="Contraseña" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-surface-container-low border-outline-variant rounded-xl focus:ring-primary/20"
                  required
                />
              </div>

              {error && (
                <div className="bg-error-container border border-outline-variant text-on-error-container px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-xl shadow-lg transition-all active:scale-[0.98]" 
                disabled={actionLoading}
              >
                {actionLoading ? 'AUTENTICANDO...' : 'ACCEDER AL SISTEMA'}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-outline-variant pt-6">
              <p className="text-sm text-on-surface-variant font-medium">
                ¿No tiene una cuenta activa?{' '}
                <Link href="/auth/register" className="text-secondary font-bold hover:underline">
                  Solicitar Registro
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
