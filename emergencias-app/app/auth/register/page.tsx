'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, ArrowLeft, Shield, Building2, MapPin } from 'lucide-react'
import { DataPolicyCheckbox } from '@/components/auth/DataPolicyCheckbox'
import { ProfileUpload } from '@/components/auth/ProfileUpload'
import { translations } from '@/lib/translations'
import { COLOMBIA_LOCATIONS } from '@/lib/locations'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, actionLoading, error } = useAuth()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'user' | 'business' | null>(null)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    city: '',
  })

  const t = translations.es;

  const handleRoleSelect = (selectedRole: 'user' | 'business') => {
    setRole(selectedRole)
    setStep(2)
  }

  const handlePolicyAccept = () => {
    setPolicyAccepted(true)
    setStep(3)
  }

  const cities = useMemo(() => {
    if (!formData.department) return []
    return COLOMBIA_LOCATIONS.find(loc => loc.department === formData.department)?.cities || []
  }, [formData.department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (!role) {
      alert('Debes seleccionar un rol')
      return
    }

    // Include location in the full name or a separate metadata if your auth service supports it.
    // For now, we'll keep the core signUp call as is but ensure data is captured.
    const success = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      role
    )

    if (success) {
      alert('Registro exitoso. Por favor inicia sesión.')
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 py-12 md:py-4 overflow-x-hidden">
      <div className="w-full max-w-xl mb-8 flex items-center justify-between px-2">
        <Link href="/" className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          {t.back_to_dashboard}
        </Link>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-md" />
          <div className="flex items-center gap-0.5">
            <span className="font-black text-sm tracking-tighter text-on-surface uppercase">EMERGENC</span>
            <span 
              className="font-black text-lg tracking-tighter text-primary uppercase animate-pulse ml-1"
              style={{ textShadow: '0 0 10px rgba(175, 16, 26, 0.4)' }}
            >
              IA
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tighter uppercase">{t.register}</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-black opacity-60">
            {step === 1 && 'Nivel de Acceso'}
            {step === 2 && 'Protocolos de Seguridad'}
            {step === 3 && 'Perfil Operativo'}
          </p>
        </div>

        <Card className="border-2 border-outline-variant bg-surface-container-lowest shadow-2xl rounded-3xl overflow-hidden border-b-8 border-primary">
          <CardContent className="p-8 md:p-12">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RoleCard 
                    active={role === 'user'} 
                    onClick={() => handleRoleSelect('user')}
                    icon={<Shield className="w-8 h-8" />}
                    title="Usuario Civil"
                    desc="Reportes ciudadanos y acceso al directorio."
                  />
                  <RoleCard 
                    active={role === 'business'} 
                    onClick={() => handleRoleSelect('business')}
                    icon={<Building2 className="w-8 h-8" />}
                    title="Administrador"
                    desc="Gestión de incidentes y control de mando."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <DataPolicyCheckbox onAccept={handlePolicyAccept} policyVersion="1.0" />
                <Button variant="ghost" onClick={() => setStep(1)} className="w-full h-14 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">
                  Cambiar Nivel de Acceso
                </Button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center mb-4">
                  <ProfileUpload currentAvatar={avatarUrl} onAvatarChange={setAvatarUrl} userId="temp" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Identificación del Personal</Label>
                    <Input
                      placeholder="Nombre Completo"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-14 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Departamento</Label>
                      <select 
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value, city: '' })}
                        className="w-full h-14 px-4 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        {COLOMBIA_LOCATIONS.map(loc => (
                          <option key={loc.department} value={loc.department}>{loc.department}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Ciudad / Municipio</Label>
                      <select 
                        required
                        disabled={!formData.department}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-14 px-4 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">Seleccionar...</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Credenciales de Acceso</Label>
                    <Input
                      type="email"
                      placeholder="correo@emergencia.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-14 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-14 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary transition-all"
                      required
                      minLength={6}
                    />
                    <Input
                      type="password"
                      placeholder="Confirmar"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-14 bg-surface-container-low border-2 border-outline-variant rounded-2xl text-sm font-bold focus:border-primary transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-error/10 border-2 border-error/20 text-error px-4 py-4 rounded-2xl text-xs font-black flex items-center gap-3 animate-pulse">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl font-black">
                    ATRÁS
                  </Button>
                  <Button type="submit" className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all border-b-4 border-black/20" disabled={actionLoading}>
                    {actionLoading ? 'PROCESANDO...' : 'CREAR CUENTA'}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-10 text-center border-t-2 border-outline-variant pt-8">
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">
                ¿Ya tiene una cuenta habilitada?{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RoleCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-8 border-2 rounded-3xl text-left transition-all group relative overflow-hidden ${active ? 'border-primary bg-primary/5 shadow-inner' : 'border-outline-variant hover:border-primary/50'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${active ? 'bg-primary text-white shadow-xl scale-110' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10'}`}>
        {icon}
      </div>
      <h3 className="font-black text-base text-on-surface uppercase tracking-tight">{title}</h3>
      <p className="text-[10px] text-on-surface-variant mt-2 font-bold leading-relaxed opacity-60 uppercase tracking-widest">{desc}</p>
      {active && <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-ping" />}
    </button>
  );
}
