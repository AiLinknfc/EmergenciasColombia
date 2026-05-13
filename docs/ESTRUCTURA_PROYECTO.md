# Estructura Modular del Proyecto Next.js

## Directorio Raíz

```
emergencias-duitama/
├── app/                          # Next.js App Router
├── components/                   # Componentes React
├── lib/                          # Utilidades y configuración
├── hooks/                        # Custom hooks
├── services/                     # Lógica de negocio
├── public/                       # Archivos estáticos
├── docs/                         # Documentación
├── .env.local                    # Variables de entorno
├── .env.example                  # Ejemplo de variables
├── next.config.js                # Configuración Next.js
├── tailwind.config.ts            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
├── package.json                  # Dependencias
└── README.md                     # Documentación del proyecto
```

## 1. Directorio `app/` (App Router)

### 1.1 Estructura de Rutas

```
app/
├── (auth)/                      # Grupo de rutas de autenticación
│   ├── layout.tsx              # Layout de auth (sin header/footer)
│   ├── login/
│   │   └── page.tsx            # Página de login
│   ├── register/
│   │   ├── user/
│   │   │   └── page.tsx        # Registro de usuario
│   │   └── business/
│   │       └── page.tsx        # Registro de empresa
│   └── forgot-password/
│       └── page.tsx            # Recuperación de contraseña
├── (dashboard)/                 # Grupo de rutas protegidas
│   ├── layout.tsx              # Layout de dashboard (con header/footer)
│   ├── user/
│   │   ├── layout.tsx          # Layout usuario
│   │   ├── page.tsx            # Dashboard usuario
│   │   ├── profile/
│   │   │   ├── page.tsx        # Perfil usuario
│   │   │   └── edit/
│   │   │       └── page.tsx    # Editar perfil
│   │   ├── emergency-data/
│   │   │   ├── page.tsx        # Datos de emergencia
│   │   │   └── edit/
│   │   │       └── page.tsx    # Editar datos de emergencia
│   │   └── map/
│   │       └── page.tsx        # Mapa con ubicación
│   └── admin/
│       ├── layout.tsx          # Layout administrador
│       ├── page.tsx            # Dashboard administrador
│       ├── contacts/
│       │   ├── page.tsx        # Lista de contactos
│       │   ├── new/
│       │   │   └── page.tsx    # Crear contacto
│       │   └── [id]/
│       │       ├── page.tsx    # Ver contacto
│       │       └── edit/
│       │           └── page.tsx # Editar contacto
│       ├── users/
│       │   ├── page.tsx        # Lista de usuarios
│       │   ├── new/
│       │   │   └── page.tsx    # Registrar usuario
│       │   └── [id]/
│       │       ├── page.tsx    # Ver usuario
│       │       └── edit/
│       │           └── page.tsx # Editar usuario
│       ├── emergencies/
│       │   ├── page.tsx        # Panel de emergencias
│       │   ├── new/
│       │   │   └── page.tsx    # Crear emergencia
│       │   └── [id]/
│       │       ├── page.tsx    # Ver emergencia
│       │       └── edit/
│       │           └── page.tsx # Editar emergencia
│       └── settings/
│           └── page.tsx        # Configuración admin
├── api/                         # API Routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts        # NextAuth configuration
│   ├── contacts/
│   │   └── route.ts            # CRUD contactos
│   ├── users/
│   │   └── route.ts            # CRUD usuarios
│   ├── emergencies/
│   │   └── route.ts            # CRUD emergencias
│   ├── location/
│   │   └── route.ts            # Geolocalización
│   └── upload/
│       └── route.ts            # Upload de archivos
├── layout.tsx                   # Root layout
├── page.tsx                     # Home page (landing)
├── globals.css                  # Estilos globales
└── not-found.tsx                # Página 404
```

### 1.2 Layouts

#### `app/layout.tsx` (Root Layout)
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emergencias Duitama - Directorio Inteligente',
  description: 'Directorio oficial de atención inmediata para ciudadanos, empresas y equipos de respuesta.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

#### `app/(auth)/layout.tsx` (Auth Layout)
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {children}
    </div>
  )
}
```

#### `app/(dashboard)/layout.tsx` (Dashboard Layout)
```typescript
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

## 2. Directorio `components/`

### 2.1 Componentes UI Base (`components/ui/`)
Usando shadcn/ui como base:

```
components/ui/
├── button.tsx                   # Botón con variantes
├── input.tsx                    # Input de texto
├── select.tsx                   # Select desplegable
├── textarea.tsx                 # Textarea
├── label.tsx                    # Label para inputs
├── card.tsx                     # Card container
├── modal.tsx                    # Modal/dialog
├── dropdown.tsx                 # Dropdown menu
├── avatar.tsx                   # Avatar con imagen
├── badge.tsx                    # Badge/tag
├── toast.tsx                    # Toast notifications
├── loading-spinner.tsx          # Spinner de carga
└── separator.tsx                # Separador visual
```

### 2.2 Componentes de Autenticación (`components/auth/`)
```
components/auth/
├── LoginForm.tsx                # Formulario de login
├── RegisterForm.tsx             # Formulario de registro
├── RoleSelector.tsx             # Selector de rol (usuario/empresa)
├── ProfileUpload.tsx            # Upload de foto de perfil
├── AuthLayout.tsx               # Layout de autenticación
├── PasswordReset.tsx            # Reset de contraseña
└── DataPolicyCheckbox.tsx       # Checkbox de política de datos
```

#### `components/auth/RoleSelector.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'business' | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card 
        className={`p-8 cursor-pointer transition-all ${selectedRole === 'user' ? 'ring-2 ring-purple-500' : ''}`}
        onClick={() => setSelectedRole('user')}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Soy Usuario</h3>
          <p className="text-gray-600">Visualiza teléfonos de emergencia y contacta de inmediato</p>
        </div>
      </Card>

      <Card 
        className={`p-8 cursor-pointer transition-all ${selectedRole === 'business' ? 'ring-2 ring-purple-500' : ''}`}
        onClick={() => setSelectedRole('business')}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Administrador</h3>
          <p className="text-gray-600">Acceso exclusivo con código de autorización previo</p>
        </div>
      </Card>
    </div>
  )
}
```

#### `components/auth/ProfileUpload.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { uploadProfileImage } from '@/services/storage.service'

interface ProfileUploadProps {
  currentAvatar?: string
  onAvatarChange: (url: string) => void
  userId: string
}

export function ProfileUpload({ currentAvatar, onAvatarChange, userId }: ProfileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadProfileImage(file, userId)
      onAvatarChange(url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-32 h-32">
        {currentAvatar ? (
          <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </Avatar>
      <div>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor="avatar-upload">
          <Button asChild disabled={uploading}>
            <span>
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  )
}
```

### 2.3 Componentes de Contactos (`components/contacts/`)
```
components/contacts/
├── ContactCard.tsx              # Card individual de contacto
├── ContactGrid.tsx              # Grid de contactos
├── ContactForm.tsx              # Formulario de contacto
├── PhoneRow.tsx                 # Fila de número de teléfono
├── ContactIcon.tsx              # Icono de contacto
└── ContactColorPicker.tsx       # Selector de color
```

#### `components/contacts/ContactCard.tsx`
```typescript
'use client'

import { Contact } from '@/types/contact'
import { PhoneRow } from './PhoneRow'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ContactCardProps {
  contact: Contact
  editable?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function ContactCard({ contact, editable = false, onEdit, onDelete }: ContactCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow" style={{ borderLeftColor: contact.color, borderLeftWidth: '4px' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${contact.color}20` }}>
            <ContactIcon name={contact.icon} color={contact.color} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{contact.organization}</h3>
            <p className="text-sm text-gray-600">{contact.service_type}</p>
          </div>
        </div>
        {editable && (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {contact.phones.map((phone, index) => (
          <PhoneRow key={index} phone={phone} />
        ))}
      </div>
    </Card>
  )
}
```

### 2.4 Componentes de Mapa (`components/map/`)
```
components/map/
├── GoogleMap.tsx                # Contenedor de Google Maps
├── UserMarker.tsx               # Marcador de usuario
├── LocationPicker.tsx           # Selector de ubicación
├── MapControls.tsx              # Controles del mapa
└── UserLocationButton.tsx       # Botón de ubicación actual
```

#### `components/map/GoogleMap.tsx`
```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'

interface GoogleMapProps {
  center?: { lat: number; lng: number }
  markers?: Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
    info?: string
  }>
  onMarkerClick?: (marker: any) => void
  onMapClick?: (e: google.maps.MapMouseEvent) => void
  height?: string
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

export function GoogleMap({ 
  center = { lat: 5.830, lng: -73.547 }, // Duitama, Boyacá
  markers = [],
  onMarkerClick,
  onMapClick,
  height = '400px'
}: GoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<any>(null)

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={center}
        zoom={14}
        onLoad={setMap}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => {
              setSelectedMarker(marker)
              onMarkerClick?.(marker)
            }}
          >
            {selectedMarker?.id === marker.id && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div className="p-2">
                  <h3 className="font-bold">{marker.title}</h3>
                  {marker.info && <p className="text-sm">{marker.info}</p>}
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
```

### 2.5 Componentes de Admin (`components/admin/`)
```
components/admin/
├── AdminDashboard.tsx           # Dashboard principal
├── UserSelector.tsx             # Selector desplegable de usuarios
├── EmergencyPanel.tsx           # Panel de emergencias
├── UserRegistration.tsx         # Formulario de registro de usuario
├── EmergencyForm.tsx            # Formulario de emergencia
└── StatsCard.tsx                # Card de estadísticas
```

#### `components/admin/UserSelector.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { User } from '@/types/user'

interface UserSelectorProps {
  onUserSelect: (user: User) => void
  onRegisterNew?: () => void
  selectedUserId?: string
}

export function UserSelector({ onUserSelect, onRegisterNew, selectedUserId }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find(u => u.id === selectedUserId)

  return (
    <div className="flex gap-2 items-center">
      <Select 
        value={selectedUserId} 
        onValueChange={(value) => {
          const user = users.find(u => u.id === value)
          if (user) onUserSelect(user)
        }}
      >
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
                <span className="text-xs text-gray-500">({user.email})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {onRegisterNew && (
        <Button variant="outline" onClick={onRegisterNew}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Registrar nuevo
        </Button>
      )}
      
      {selectedUser && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {selectedUser.avatar_url && (
            <img src={selectedUser.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          )}
          <div>
            <p className="font-medium">{selectedUser.full_name}</p>
            <p className="text-xs">{selectedUser.blood_type || 'Tipo de sangre no registrado'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 2.6 Componentes Compartidos (`components/shared/`)
```
components/shared/
├── Header.tsx                   # Header principal
├── Footer.tsx                   # Footer
├── Badge.tsx                    # Badge personalizado
├── LoadingSpinner.tsx           # Spinner de carga
├── ErrorBoundary.tsx            # Error boundary
└── PageTitle.tsx               # Título de página
```

#### `components/shared/Header.tsx`
```typescript
'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <ShieldIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Emergencias Duitama</h1>
              <p className="text-xs text-gray-600">Directorio Inteligente</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="success" className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Líneas activas 24/7
            </Badge>

            {user ? (
              <div className="flex items-center gap-3">
                {user.avatar_url && (
                  <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm font-medium">{user.full_name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
```

## 3. Directorio `lib/`

### 3.1 Configuración Supabase (`lib/supabase/`)
```
lib/supabase/
├── client.ts                    # Cliente Supabase (browser)
├── server.ts                    # Cliente Supabase (server)
└── admin.ts                     # Cliente Supabase (admin)
```

#### `lib/supabase/client.ts`
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  return createClientComponentClient()
}
```

#### `lib/supabase/server.ts`
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: cookieStore })
}
```

### 3.2 Tipos TypeScript (`lib/types/`)
```
lib/types/
├── index.ts                     # Exportaciones principales
├── user.ts                      # Tipos de usuario
├── contact.ts                   # Tipos de contacto
├── emergency.ts                 # Tipos de emergencia
└── location.ts                  # Tipos de ubicación
```

#### `lib/types/user.ts`
```typescript
export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'business'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserEmergencyData {
  id: string
  user_id: string
  address: string
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'No especificado'
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship?: string
  eps: string
  medical_conditions?: string
  allergies?: string
  created_at: string
  updated_at: string
}

export interface BusinessProfile {
  id: string
  user_id: string
  company_name: string
  nit?: string
  logo_url?: string
  description?: string
  address?: string
  phone?: string
  authorization_code: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface UserWithEmergencyData extends User {
  emergency_data?: UserEmergencyData
}
```

#### `lib/types/contact.ts`
```typescript
export interface Contact {
  id: string
  organization: string
  service_type: string
  icon: string
  color: string
  order_index: number
  created_by?: string
  created_at: string
  updated_at: string
  phones: ContactPhone[]
}

export interface ContactPhone {
  id: string
  contact_id: string
  phone_number: string
  phone_type: 'call' | 'whatsapp'
  created_at: string
}
```

#### `lib/types/emergency.ts`
```typescript
export interface Emergency {
  id: string
  user_id?: string
  reporter_id?: string
  type: string
  description?: string
  status: 'active' | 'in_progress' | 'resolved' | 'cancelled'
  location_lat?: number
  location_lng?: number
  location_address?: string
  assigned_to?: string
  resolved_at?: string
  created_at: string
  updated_at: string
  user?: User
  reporter?: User
  assigned_to_user?: User
}

export interface EmergencyNote {
  id: string
  emergency_id: string
  author_id?: string
  note: string
  created_at: string
  author?: User
}
```

### 3.3 Utilidades (`lib/utils/`)
```
lib/utils/
├── format.ts                    # Formateo de datos
├── validation.ts                # Validaciones con Zod
├── constants.ts                 # Constantes
└── helpers.ts                   # Helpers generales
```

#### `lib/utils/validation.ts`
```typescript
import { z } from 'zod'

// Validación de usuario
export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['user', 'business']),
})

// Validación de datos de emergencia
export const emergencyDataSchema = z.object({
  address: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No especificado']),
  emergency_contact_name: z.string().min(3, 'Nombre de contacto es requerido'),
  emergency_contact_phone: z.string().min(10, 'Teléfono debe tener al menos 10 caracteres'),
  emergency_contact_relationship: z.string().optional(),
  eps: z.string().min(3, 'EPS es requerida'),
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
})

// Validación de contacto
export const contactSchema = z.object({
  organization: z.string().min(3, 'Organización es requerida'),
  service_type: z.string().min(3, 'Tipo de servicio es requerido'),
  icon: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color inválido'),
  phones: z.array(z.object({
    phone_number: z.string().min(10, 'Teléfono debe tener al menos 10 caracteres'),
    phone_type: z.enum(['call', 'whatsapp']),
  })).min(1, 'Al menos un teléfono es requerido'),
})

// Validación de emergencia
export const emergencySchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  type: z.string().min(3, 'Tipo de emergencia es requerido'),
  description: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  location_address: z.string().optional(),
})
```

## 4. Directorio `hooks/`

```
hooks/
├── useAuth.ts                   # Hook de autenticación
├── useContacts.ts               # Hook de contactos
├── useUsers.ts                  # Hook de usuarios
├── useEmergencies.ts            # Hook de emergencias
├── useLocation.ts               # Hook de geolocalización
└── useSupabase.ts               # Hook de Supabase
```

#### `hooks/useAuth.ts`
```typescript
import { useState, useEffect } from 'react'
import { User } from '@/lib/types/user'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser(profile)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          getUser()
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, logout }
}
```

#### `hooks/useLocation.ts`
```typescript
import { useState, useEffect } from 'react'

interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  address?: string
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  return { location, loading, error, getCurrentLocation }
}
```

## 5. Directorio `services/`

```
services/
├── auth.service.ts              # Servicio de autenticación
├── contact.service.ts           # Servicio de contactos
├── user.service.ts              # Servicio de usuarios
├── emergency.service.ts         # Servicio de emergencias
├── location.service.ts          # Servicio de ubicación
└── storage.service.ts           # Servicio de almacenamiento
```

#### `services/user.service.ts`
```typescript
import { createClient } from '@/lib/supabase/client'
import { User, UserEmergencyData, UserWithEmergencyData } from '@/lib/types/user'

export class UserService {
  private supabase = createClient()

  async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getEmergencyData(userId: string): Promise<UserEmergencyData | null> {
    const { data, error } = await this.supabase
      .from('user_emergency_data')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async upsertEmergencyData(data: Partial<UserEmergencyData>): Promise<UserEmergencyData> {
    const { data: result, error } = await this.supabase
      .from('user_emergency_data')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  async getUserWithEmergencyData(userId: string): Promise<UserWithEmergencyData | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        user_emergency_data(*)
      `)
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as UserWithEmergencyData
  }

  async getAllUsers(): Promise<UserWithEmergencyData[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        user_emergency_data(*)
      `)
      .eq('role', 'user')
    
    if (error) throw error
    return data as UserWithEmergencyData[]
  }
}

export const userService = new UserService()
```

## 6. Archivos de Configuración

### 6.1 `package.json`
```json
{
  "name": "emergencias-duitama",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/supabase-js": "^2.38.4",
    "@react-google-maps/api": "^2.19.2",
    "zod": "^3.22.4",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  }
}
```

### 6.2 `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
```

### 6.3 `.env.example`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Authorization Code (hardcoded for MVP)
INVITE_CODE=AiLinkCol2025
```

## 7. Consideraciones de DNA Visual

Para mantener la identidad visual del diseño actual:

### 7.1 Colores del Sistema
```typescript
// lib/utils/constants.ts
export const COLORS = {
  primary: '#B14FFF',
  primaryDark: '#542AAD',
  secondary: '#7c3aed',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#f97316',
  info: '#0ea5e9',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
}
```

### 7.2 Tipografía
```typescript
// next.config.js
module.exports = {
  // ...
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
}
```

### 7.3 Animaciones
Usar Framer Motion para animaciones suaves:
```bash
npm install framer-motion
```

```typescript
// components/shared/AnimatedCard.tsx
import { motion } from 'framer-motion'

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```
