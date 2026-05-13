# Guía de Implementación y Migración
## Emergencias Duitama - De HTML a Next.js + Supabase

## 1. Resumen Ejecutivo

Esta guía detalla el proceso de migración desde la implementación actual (HTML/JS vanilla con localStorage) a una arquitectura moderna basada en Next.js, Supabase y Google Maps.

**Estado Actual:**
- Frontend: HTML + JavaScript vanilla
- Datos: localStorage
- Autenticación: Código hardcodeado
- Mapas: Geolocalización básica del navegador

**Estado Objetivo:**
- Frontend: Next.js 14 (App Router)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Autenticación: Supabase Auth
- Mapas: Google Maps JavaScript API
- Hosting: Vercel

---

## 2. Roadmap de Implementación

### Fase 1: Preparación (Semana 1)
- [ ] Configurar repositorio Git
- [ ] Crear proyecto Next.js
- [ ] Configurar Supabase
- [ ] Configurar Google Maps API
- [ ] Configurar Vercel

### Fase 2: Infraestructura Base (Semana 2)
- [ ] Configurar Tailwind CSS
- [ ] Instalar dependencias
- [ ] Configurar TypeScript
- [ ] Crear estructura de directorios
- [ ] Configurar variables de entorno

### Fase 3: Base de Datos (Semana 3)
- [ ] Ejecutar script de schema en Supabase
- [ ] Configurar RLS policies
- [ ] Crear vistas
- [ ] Insertar datos iniciales
- [ ] Probar queries

### Fase 4: Autenticación (Semana 4)
- [ ] Implementar Supabase Auth
- [ ] Crear páginas de login/registro
- [ ] Implementar selector de roles
- [ ] Crear componente de upload de foto
- [ ] Implementar política de datos

### Fase 5: Migración de UI (Semana 5-6)
- [ ] Migrar componentes de contacto
- [ ] Migrar grid de contactos
- [ ] Migrar header y footer
- [ ] Implementar DNA visual actual
- [ ] Migrar animaciones (GSAP → Framer Motion)

### Fase 6: Funcionalidades de Usuario (Semana 7)
- [ ] Dashboard de usuario
- [ ] Perfil de usuario
- [ ] Datos de emergencia
- [ ] Mapa de usuario
- [ ] Geolocalización

### Fase 7: Funcionalidades de Admin (Semana 8)
- [ ] Dashboard de administrador
- [ ] Gestión de contactos
- [ ] Selector de usuarios
- [ ] Registro de usuarios
- [ ] Panel de emergencias

### Fase 8: Integración de Mapas (Semana 9)
- [ ] Implementar Google Maps
- [ ] Geocoding
- [ ] Marcadores de usuarios
- [ ] Mapa de emergencias
- [ ] Optimización de costos

### Fase 9: Testing (Semana 10)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Testing de seguridad
- [ ] Performance testing

### Fase 10: Despliegue (Semana 11)
- [ ] Configurar Vercel
- [ ] Migrar datos de localStorage
- [ ] Despliegue a staging
- [ ] Testing en staging
- [ ] Despliegue a producción

### Fase 11: Post-Despliegue (Semana 12)
- [ ] Monitoreo
- [ ] Optimización
- [ ] Documentación final
- [ ] Capacitación de usuarios
- [ ] Soporte inicial

---

## 3. Configuración Inicial

### 3.1 Crear Proyecto Next.js

```bash
# Crear proyecto
npx create-next-app@latest emergencias-duitama --typescript --tailwind --eslint

# Navegar al proyecto
cd emergencias-duitama

# Instalar dependencias adicionales
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install @react-google-maps/api
npm install zod clsx tailwind-merge
npm install framer-motion
npm install lucide-react
npm install class-variance-authority
```

### 3.2 Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a Settings → API
3. Copiar:
   - Project URL
   - anon public key
   - service_role key (para server-side)

4. Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3.3 Configurar Google Maps

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto o seleccionar existente
3. Habilitar APIs:
   - Maps JavaScript API
   - Geocoding API
4. Crear API Key
5. Restringir API Key:
   - HTTP referrers: `localhost:3000/*`, `*.vercel.app/*`

6. Agregar a `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

### 3.4 Configurar Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Conectar repositorio Git
3. Configurar variables de entorno en Vercel
4. Desplegar automáticamente desde Git

---

## 4. Migración de Base de Datos

### 4.1 Ejecutar Schema en Supabase

1. Ir a Supabase → SQL Editor
2. Copiar contenido de `docs/SUPABASE_SCHEMA.sql`
3. Ejecutar el script
4. Verificar que todas las tablas se crearon correctamente

### 4.2 Migrar Datos de LocalStorage

```typescript
// scripts/migrate-localstorage.ts
// Ejecutar este script para migrar datos existentes

const OLD_DATA_KEY = 'probando_emg_data'

interface OldContact {
  id: number
  name: string
  sub: string
  icon: string
  color: string
  phones: Array<{ num: string; type: string }>
}

async function migrateContacts() {
  // Obtener datos de localStorage
  const oldData = localStorage.getItem(OLD_DATA_KEY)
  if (!oldData) {
    console.log('No hay datos para migrar')
    return
  }

  const contacts: OldContact[] = JSON.parse(oldData)
  
  // Migrar a Supabase
  for (const contact of contacts) {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        organization: contact.name,
        service_type: contact.sub,
        icon: contact.icon,
        color: contact.color,
        order_index: contact.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error migrando contacto:', contact.name, error)
      continue
    }

    // Migrar números de teléfono
    for (const phone of contact.phones) {
      await supabase.from('contact_phones').insert({
        contact_id: data.id,
        phone_number: phone.num,
        phone_type: phone.type,
      })
    }
  }

  console.log('Migración completada')
  // Opcional: limpiar localStorage
  // localStorage.removeItem(OLD_DATA_KEY)
}
```

---

## 5. Migración de Componentes

### 5.1 Migrar Header

**Antes (HTML):**
```html
<header class="header">
  <h1 id="headerTitle">Emergencias<br><em>Duitama</em></h1>
</header>
```

**Después (Next.js):**
```typescript
// components/shared/Header.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Emergencias Duitama
            </h1>
          </Link>
          {/* ... resto del header */}
        </div>
      </div>
    </header>
  )
}
```

### 5.2 Migrar ContactCard

**Antes (HTML + JS):**
```javascript
function renderCard(c) {
  const card = document.createElement('div')
  card.className = 'card'
  // ... lógica de renderizado
}
```

**Después (Next.js):**
```typescript
// components/contacts/ContactCard.tsx
'use client'

import { Contact } from '@/types/contact'
import { Card } from '@/components/ui/card'

interface ContactCardProps {
  contact: Contact
  editable?: boolean
}

export function ContactCard({ contact, editable = false }: ContactCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow"
      style={{ borderLeftColor: contact.color, borderLeftWidth: '4px' }}
    >
      <h3 className="font-bold text-lg">{contact.organization}</h3>
      <p className="text-sm text-gray-600">{contact.service_type}</p>
      {/* ... resto del card */}
    </Card>
  )
}
```

### 5.3 Migrar Animaciones

**Antes (GSAP):**
```javascript
gsap.from(cards, {
  opacity: 0,
  y: 32,
  duration: 0.45,
  stagger: 0.1
})
```

**Después (Framer Motion):**
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45 }}
>
  {/* contenido */}
</motion.div>
```

---

## 6. Implementación de Funcionalidades Clave

### 6.1 Selector de Usuarios en Emergencias

```typescript
// components/admin/UserSelector.tsx
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UserWithEmergencyData } from '@/lib/types/user'

interface UserSelectorProps {
  onUserSelect: (user: UserWithEmergencyData) => void
  onRegisterNew?: () => void
}

export function UserSelector({ onUserSelect, onRegisterNew }: UserSelectorProps) {
  const [users, setUsers] = useState<UserWithEmergencyData[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    setUsers(data)
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    const user = users.find(u => u.id === userId)
    if (user) onUserSelect(user)
  }

  return (
    <div className="flex gap-2 items-center">
      <Select value={selectedUserId || ''} onValueChange={handleUserSelect}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Seleccionar usuario" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                {user.avatar_url && (
                  <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                )}
                <span>{user.full_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {onRegisterNew && (
        <Button variant="outline" onClick={onRegisterNew}>
          Registrar nuevo
        </Button>
      )}
    </div>
  )
}
```

### 6.2 Registro de Usuario con Datos de Emergencia

```typescript
// app/(dashboard)/admin/users/new/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProfileUpload } from '@/components/auth/ProfileUpload'
import { DataPolicyCheckbox } from '@/components/auth/DataPolicyCheckbox'

export default function NewUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    address: '',
    blood_type: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    eps: '',
    medical_conditions: '',
    allergies: '',
  })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [policyAccepted, setPolicyAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!policyAccepted) {
      alert('Debes aceptar la política de datos')
      return
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          avatar_url: avatarUrl,
        },
      },
    })

    if (authError) {
      alert('Error creando usuario: ' + authError.message)
      return
    }

    // Crear datos de emergencia
    const { error: emergencyError } = await supabase
      .from('user_emergency_data')
      .insert({
        user_id: authData.user!.id,
        address: formData.address,
        blood_type: formData.blood_type,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relationship: formData.emergency_contact_relationship,
        eps: formData.eps,
        medical_conditions: formData.medical_conditions,
        allergies: formData.allergies,
      })

    if (emergencyError) {
      alert('Error guardando datos de emergencia: ' + emergencyError.message)
      return
    }

    // Registrar aceptación de política
    await recordPolicyAcceptance(authData.user!.id, '1.0')

    alert('Usuario creado exitosamente')
    window.location.href = '/admin/users'
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Usuario</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto de perfil */}
        <div>
          <Label>Foto de Perfil</Label>
          <ProfileUpload
            currentAvatar={avatarUrl}
            onAvatarChange={setAvatarUrl}
            userId="temp"
          />
        </div>

        {/* Datos básicos */}
        <div className="space-y-4">
          <div>
            <Label>Nombre Completo</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Correo Electrónico</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Datos de emergencia */}
        <div className="space-y-4 p-4 bg-red-50 rounded-lg">
          <h3 className="font-bold text-red-900">Datos de Emergencia</h3>
          
          <div>
            <Label>Dirección de Residencia</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Tipo de Sangre</Label>
            <Select
              value={formData.blood_type}
              onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="No especificado">No especificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Nombre del Contacto de Emergencia</Label>
            <Input
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Teléfono del Contacto de Emergencia</Label>
            <Input
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Parentesco</Label>
            <Input
              value={formData.emergency_contact_relationship}
              onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
            />
          </div>
          
          <div>
            <Label>EPS</Label>
            <Input
              value={formData.eps}
              onChange={(e) => setFormData({ ...formData, eps: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label>Condiciones Médicas (Opcional)</Label>
            <Input
              value={formData.medical_conditions}
              onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
            />
          </div>
          
          <div>
            <Label>Alergias (Opcional)</Label>
            <Input
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>
        </div>

        {/* Política de datos */}
        <DataPolicyCheckbox
          onAccept={() => setPolicyAccepted(true)}
          policyVersion="1.0"
        />

        <Button type="submit" className="w-full">
          Registrar Usuario
        </Button>
      </form>
    </div>
  )
}
```

### 6.3 Título "Emergencias Duitama" en Negro

```typescript
// components/shared/Header.tsx
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-black">
              Emergencias Duitama
            </h1>
          </Link>
          {/* ... */}
        </div>
      </div>
    </header>
  )
}
```

### 6.4 Foto de Perfil para Empresas en Cards

```typescript
// components/contacts/ContactCard.tsx
interface ContactCardProps {
  contact: Contact
  showBusinessLogo?: boolean
  businessLogo?: string
}

export function ContactCard({ contact, showBusinessLogo, businessLogo }: ContactCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {showBusinessLogo && businessLogo && (
          <img 
            src={businessLogo} 
            alt="Logo empresa" 
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-lg">{contact.organization}</h3>
          <p className="text-sm text-gray-600">{contact.service_type}</p>
        </div>
      </div>
      {/* ... */}
    </Card>
  )
}
```

---

## 7. Configuración de Despliegue

### 7.1 Configurar Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel
```

### 7.2 Variables de Entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
INVITE_CODE=AiLinkCol2025
```

### 7.3 Configurar Dominio Personalizado

1. En Vercel Dashboard → Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones de Vercel

---

## 8. Estrategia de Migración de Datos

### 8.1 Opción A: Migración Manual (Recomendado para MVP)

1. Exportar datos de localStorage a JSON
2. Convertir formato al nuevo schema
3. Importar a Supabase via SQL Editor
4. Verificar integridad de datos

### 8.2 Opción B: Migración Automática

Crear script de migración que:
- Lee localStorage
- Transforma datos
- Inserta en Supabase
- Valida resultados

```typescript
// scripts/migrate.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrate() {
  // Leer localStorage (simulado)
  const oldData = JSON.parse(localStorage.getItem('probando_emg_data') || '[]')
  
  // Migrar contactos
  for (const contact of oldData) {
    const { data } = await supabase
      .from('contacts')
      .insert({
        organization: contact.name,
        service_type: contact.sub,
        icon: contact.icon,
        color: contact.color,
      })
      .select()
      .single()
    
    // Migrar teléfonos
    for (const phone of contact.phones) {
      await supabase.from('contact_phones').insert({
        contact_id: data.id,
        phone_number: phone.num,
        phone_type: phone.type,
      })
    }
  }
  
  console.log('Migración completada')
}

migrate()
```

---

## 9. Testing y Validación

### 9.1 Checklist de Validación

**Autenticación:**
- [ ] Login de usuarios funciona
- [ ] Login de empresas funciona
- [ ] Registro de usuarios funciona
- [ ] Registro de empresas funciona
- [ ] Logout funciona
- [ ] Sesión persiste

**Contactos:**
- [ ] Grid de contactos se muestra
- [ ] Llamadas funcionan
- [ ] WhatsApp funciona
- [ ] Admin puede crear contactos
- [ ] Admin puede editar contactos
- [ ] Admin puede eliminar contactos
- [ ] Reordenamiento funciona

**Usuarios:**
- [ ] Perfil de usuario se muestra
- [ ] Datos de emergencia se guardan
- [ ] Foto de perfil se sube
- [ ] Admin puede ver usuarios
- [ ] Admin puede registrar usuarios
- [ ] Selector de usuarios funciona

**Mapas:**
- [ ] Mapa se carga
- [ ] Geolocalización funciona
- [ ] Marcadores se muestran
- [ ] Geocoding funciona
- [ ] Mapa de emergencias funciona

**Política de Datos:**
- [ ] Checkbox de aceptación funciona
- [ ] Aceptación se registra
- [ ] Política se muestra
- [ ] Versión se controla

### 9.2 Tests Automatizados

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar E2E tests
npm run test:e2e
```

---

## 10. Monitoreo y Mantenimiento

### 10.1 Monitoreo

**Vercel Analytics:**
- Métricas de rendimiento
- Datos de tráfico
- Errores de cliente

**Supabase Dashboard:**
- Métricas de base de datos
- Uso de almacenamiento
- Logs de autenticación

**Google Cloud Console:**
- Uso de Google Maps API
- Costos de API
- Errores de API

### 10.2 Backups

**Base de Datos:**
- Supabase realiza backups automáticos diarios
- Configurar backups manuales semanales

**Archivos:**
- Backups de Storage configurados en Supabase

### 10.3 Actualizaciones

**Dependencias:**
- `npm audit` semanalmente
- Actualizar dependencias mensualmente

**Schema:**
- Version control de migraciones
- Documentar cambios en schema

---

## 11. Costos y Escalabilidad

### 11.1 Costos Actuales (Stack Free)

| Servicio | Plan | Costo Mensual | Límites |
|----------|------|---------------|---------|
| Vercel | Hobby | $0 | 100GB bandwidth, 6GB builds |
| Supabase | Free | $0 | 500MB DB, 50K MAU, 1GB Storage |
| Google Maps | Free Tier | $0 | $200 crédito (~28K cargas) |
| **Total** | | **$0** | |

### 11.2 Escalabilidad (Cuando sea necesario)

**Vercel Pro:**
- $20/mes
- 1TB bandwidth
- Builds ilimitados

**Supabase Pro:**
- $25/mes
- 8GB DB
- 100K MAU
- 100GB Storage

**Google Maps:**
- $7 por 1,000 cargas de mapa
- $5 por 1,000 geocodings

### 11.3 Punto de Quiebre

Considerar upgrade cuando:
- > 1,000 usuarios activos
- > 10,000 cargas de mapa/mes
- > 500MB de almacenamiento usado

---

## 12. Seguridad

### 12.1 Checklist de Seguridad

- [ ] RLS policies configuradas en Supabase
- [ ] API keys restringidas
- [ ] HTTPS forzado
- [ ] Variables de entorno seguras
- [ ] Input validation implementado
- [ ] XSS protection activo
- [ ] CSRF protection activo
- [ ] Rate limiting configurado
- [ ] Logs de auditoría activos
- [ ] Backups encriptados

### 12.2 Auditoría de Seguridad

Realizar auditoría trimestral:
- Revisar logs de acceso
- Verificar políticas RLS
- Actualizar dependencias
- Revisar permisos de API keys
- Testing de penetración (opcional)

---

## 13. Documentación de Usuario

### 13.1 Guía para Usuarios Finales

Crear documentación simple:
- Cómo registrarse
- Cómo usar el mapa
- Cómo actualizar perfil
- Cómo contactar emergencias

### 13.2 Guía para Administradores

Crear documentación detallada:
- Cómo registrar usuarios
- Cómo gestionar contactos
- Cómo crear emergencias
- Cómo usar el mapa de emergencias

---

## 14. Soporte y Mantenimiento

### 14.1 Canales de Soporte

- Email: soporte@ailink.com.co
- Teléfono: 316 497 6104
- PQRS: 310 695 1743

### 14.2 SLA (Service Level Agreement)

**Tiempo de respuesta:**
- Crítico: 2 horas
- Alto: 4 horas
- Medio: 8 horas
- Bajo: 24 horas

**Tiempo de resolución:**
- Crítico: 24 horas
- Alto: 48 horas
- Medio: 72 horas
- Bajo: 5 días

---

## 15. Próximos Pasos

### 15.1 Mejoras Futuras

- [ ] Notificaciones push
- [ ] App móvil (React Native)
- [ ] Integración con servicios de emergencia reales
- [ ] Chat en tiempo real
- [ ] Historial de emergencias
- [ ] Reportes y analytics
- [ ] Multi-idioma
- [ ] Dark mode

### 15.2 Integraciones Futuras

- [ ] WhatsApp Business API
- [ ] Twilio para SMS
- [ ] Firebase para notificaciones
- [ ] Stripe para pagos (si aplica)

---

## 16. Recursos y Referencias

### 16.1 Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Maps API Documentation](https://developers.google.com/maps)
- [Vercel Documentation](https://vercel.com/docs)

### 16.2 Tutoriales y Guías

- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Google Maps with React](https://react-google-maps-api-docs.vercel.app/)
- [shadcn/ui Components](https://ui.shadcn.com/)

### 16.3 Comunidad

- [Next.js GitHub](https://github.com/vercel/next.js)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://supabase.com/discord)

---

## 17. Apéndice

### 17.1 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check

# Ejecutar tests
npm test

# Crear migración Supabase
supabase migration new nombre_migracion

# Aplicar migraciones
supabase db push

# Reset base de datos local
supabase db reset
```

### 17.2 Troubleshooting

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Supabase connection failed"**
- Verificar NEXT_PUBLIC_SUPABASE_URL
- Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY
- Verificar que el proyecto de Supabase esté activo

**Error: "Google Maps not loading"**
- Verificar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- Verificar que la API key tenga el referer correcto
- Verificar que las APIs estén habilitadas

**Error: "Build failed"**
- Verificar TypeScript errors: `npm run type-check`
- Verificar ESLint errors: `npm run lint`
- Limpiar cache: `rm -rf .next`

---

## 18. Conclusión

Esta guía proporciona un roadmap completo para migrar el proyecto actual a una arquitectura moderna y escalable. Siguiendo estos pasos, se podrá:

1. **Mantener la funcionalidad actual** con mejor performance
2. **Agregar nuevas funcionalidades** (mapas, perfiles, emergencias)
3. **Escalar** cuando sea necesario
4. **Mantener costos bajos** con el stack free
5. **Cumplir con regulaciones** de protección de datos

**Tiempo estimado de implementación:** 12 semanas  
**Costo total de implementación:** $0 (stack free)  
**Riesgo:** Bajo (migración incremental con testing)

---

**Documento versión:** 1.0  
**Fecha:** Enero 2025  
**Autor:** AiLink - Duitama, Boyacá
