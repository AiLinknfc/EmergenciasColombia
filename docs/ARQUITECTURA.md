# Arquitectura del Sistema - Emergencias Duitama

## 1. Visión General

**Proyecto:** Directorio Inteligente de Emergencias Duitama  
**Stack Tecnológico:**
- **Frontend:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Hosting:** Vercel
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Mapas:** Google Maps JavaScript API
- **Animaciones:** GSAP + Framer Motion

## 2. Principios de Arquitectura

### 2.1 Principios SOLID
- **Single Responsibility:** Cada módulo tiene una responsabilidad única
- **Open/Closed:** Extensible sin modificar código existente
- **Liskov Substitution:** Componentes intercambiables
- **Interface Segregation:** Interfaces específicas y cohesivas
- **Dependency Inversion:** Depender de abstracciones, no implementaciones

### 2.2 Principios de Clean Architecture
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Next.js Pages + Components)     │
├─────────────────────────────────────┤
│         Application Layer           │
│      (Use Cases + Services)         │
├─────────────────────────────────────┤
│          Domain Layer              │
│     (Entities + Business Logic)     │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│  (Supabase + Google Maps + Storage)│
└─────────────────────────────────────┘
```

### 2.3 Principios de Diseño
- **Separation of Concerns:** Separación clara de responsabilidades
- **DRY (Don't Repeat Yourself):** Reutilización de componentes
- **KISS (Keep It Simple):** Simplicidad sobre complejidad
- **YAGNI (You Aren't Gonna Need It):** Solo implementar lo necesario
- **Composition over Inheritance:** Composición de componentes

## 3. Estructura Modular del Proyecto

```
emergencias-duitama/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── login/
│   │   │   └── page.tsx        # Login usuarios/empresas
│   │   ├── register/
│   │   │   ├── user/
│   │   │   │   └── page.tsx    # Registro usuario
│   │   │   └── business/
│   │   │       └── page.tsx    # Registro empresa
│   │   └── layout.tsx          # Layout de auth
│   ├── (dashboard)/            # Grupo de rutas protegidas
│   │   ├── admin/
│   │   │   ├── contacts/
│   │   │   │   ├── page.tsx    # Lista de contactos
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Editar contacto
│   │   │   ├── users/
│   │   │   │   ├── page.tsx    # Gestión de usuarios
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Ver usuario
│   │   │   ├── emergencies/
│   │   │   │   ├── page.tsx    # Panel de emergencias
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Detalle emergencia
│   │   │   └── layout.tsx      # Layout admin
│   │   └── user/
│   │       ├── page.tsx        # Dashboard usuario
│   │       ├── profile/
│   │       │   └── page.tsx    # Perfil usuario
│   │       └── layout.tsx      # Layout usuario
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # NextAuth configuration
│   │   ├── contacts/
│   │   │   └── route.ts        # CRUD contactos
│   │   ├── users/
│   │   │   └── route.ts        # CRUD usuarios
│   │   ├── emergencies/
│   │   │   └── route.ts        # CRUD emergencias
│   │   └── ├── location/
│   │       └── route.ts        # Geolocalización
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Estilos globales
├── components/                 # Componentes React
│   ├── ui/                     # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── auth/                   # Componentes de auth
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ProfileUpload.tsx
│   │   └── RoleSelector.tsx
│   ├── contacts/               # Componentes de contactos
│   │   ├── ContactCard.tsx
│   │   ├── ContactGrid.tsx
│   │   ├── ContactForm.tsx
│   │   └── PhoneRow.tsx
│   ├── map/                    # Componentes de mapa
│   │   ├── GoogleMap.tsx
│   │   ├── UserMarker.tsx
│   │   └── LocationPicker.tsx
│   ├── admin/                  # Componentes admin
│   │   ├── AdminDashboard.tsx
│   │   ├── UserSelector.tsx
│   │   ├── EmergencyPanel.tsx
│   │   └── UserRegistration.tsx
│   └── shared/                 # Componentes compartidos
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Badge.tsx
│       └── LoadingSpinner.tsx
├── lib/                        # Utilidades y configuración
│   ├── supabase/
│   │   ├── client.ts           # Cliente Supabase
│   │   ├── server.ts           # Cliente Supabase server
│   │   └── admin.ts            # Cliente Supabase admin
│   ├── auth/
│   │   ├── config.ts           # Configuración NextAuth
│   │   └── middleware.ts       # Middleware de autenticación
│   ├── db/
│   │   ├── queries.ts          # Queries de base de datos
│   │   └── mutations.ts        # Mutaciones de base de datos
│   ├── maps/
│   │   ├── config.ts           # Configuración Google Maps
│   │   └── utils.ts            # Utilidades de mapa
│   ├── utils/
│   │   ├── format.ts           # Formateo de datos
│   │   ├── validation.ts       # Validaciones
│   │   └── constants.ts        # Constantes
│   └── types/
│       ├── index.ts            # Tipos TypeScript
│       ├── user.ts             # Tipos de usuario
│       ├── contact.ts          # Tipos de contacto
│       └── emergency.ts        # Tipos de emergencia
├── hooks/                      # Custom hooks
│   ├── useAuth.ts              # Hook de autenticación
│   ├── useContacts.ts          # Hook de contactos
│   ├── useLocation.ts          # Hook de geolocalización
│   ├── useEmergencies.ts       # Hook de emergencias
│   └── useSupabase.ts          # Hook de Supabase
├── services/                   # Lógica de negocio
│   ├── auth.service.ts         # Servicio de autenticación
│   ├── contact.service.ts      # Servicio de contactos
│   ├── user.service.ts         # Servicio de usuarios
│   ├── emergency.service.ts    # Servicio de emergencias
│   ├── location.service.ts     # Servicio de ubicación
│   └── storage.service.ts      # Servicio de almacenamiento
├── middleware.ts               # Middleware Next.js
├── next.config.js              # Configuración Next.js
├── tailwind.config.ts          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
├── package.json                # Dependencias
└── .env.local                  # Variables de entorno
```

## 4. Esquema de Base de Datos (Supabase)

### 4.1 Tablas Principales

#### `profiles` (Perfiles de usuarios)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'business')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_emergency_data` (Datos de emergencia de usuarios)
```sql
CREATE TABLE user_emergency_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  eps TEXT NOT NULL,
  medical_conditions TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### `business_profiles` (Perfiles de empresas)
```sql
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  nit TEXT UNIQUE,
  logo_url TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  authorization_code TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### `contacts` (Contactos de emergencia)
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization TEXT NOT NULL,
  service_type TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `contact_phones` (Números de teléfono de contactos)
```sql
CREATE TABLE contact_phones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  phone_type TEXT NOT NULL CHECK (phone_type IN ('call', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_locations` (Ubicaciones de usuarios)
```sql
CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `emergencies` (Registros de emergencias)
```sql
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  assigned_to UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `data_policy_acceptances` (Aceptación de política de datos)
```sql
CREATE TABLE data_policy_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  policy_version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(user_id, policy_version)
);
```

### 4.2 Políticas de Seguridad (RLS)

```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_policy_acceptances ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
);

-- Políticas para user_emergency_data
CREATE POLICY "Users can view own emergency data" 
ON user_emergency_data FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own emergency data" 
ON user_emergency_data FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all emergency data" 
ON user_emergency_data FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
);

-- Políticas para contacts
CREATE POLICY "Everyone can view contacts" 
ON contacts FOR SELECT USING (true);

CREATE POLICY "Admins can create contacts" 
ON contacts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
);

CREATE POLICY "Admins can update contacts" 
ON contacts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
);

CREATE POLICY "Admins can delete contacts" 
ON contacts FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'business')
);

-- Políticas similares para otras tablas...
```

## 5. Integración con Servicios Externos

### 5.1 Google Maps API
- **Uso:** Visualización de ubicaciones de usuarios en tiempo real
- **Features:**
  - Mapa interactivo con marcadores de usuarios
  - Geocoding inverso (coordenadas → dirección)
  - Geolocalización del navegador
  - Clustering de marcadores para alta densidad
- **Configuración:**
  ```env
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
  ```

### 5.2 Supabase
- **Auth:** Autenticación de usuarios (email/password, OAuth)
- **Database:** PostgreSQL con RLS
- **Storage:** Almacenamiento de avatares y logos
- **Realtime:** Suscripciones a cambios en tiempo real
- **Edge Functions:** Lógica server-side cuando sea necesario

### 5.3 Vercel
- **Hosting:** Despliegue automático desde Git
- **Edge Network:** CDN global
- **Analytics:** Métricas de uso
- **Environment Variables:** Gestión segura de secrets

## 6. Flujo de Autenticación

### 6.1 Registro de Usuario
1. Usuario selecciona "Soy Usuario"
2. Completa formulario: nombre, email, contraseña
3. Sube foto de perfil (opcional)
4. Acepta política de tratamiento de datos
5. Completa datos de emergencia: dirección, tipo de sangre, contacto familiar, EPS
6. Redirección al dashboard de usuario

### 6.2 Registro de Empresa
1. Usuario selecciona "Administrador"
2. Completa formulario: nombre, empresa, código de autorización
3. Sube logo de empresa (opcional)
4. Acepta política de tratamiento de datos
5. Verificación del código con AiLink
6. Redirección al dashboard de administrador

### 6.3 Login
1. Usuario ingresa email y contraseña
2. Sistema verifica credenciales con Supabase Auth
3. Redirección según rol:
   - `user` → Dashboard de usuario
   - `business` → Dashboard de administrador

## 7. Funcionalidades Principales

### 7.1 Modo Usuario
- **Visualización:** Grid de contactos de emergencia
- **Geolocalización:** Mapa con ubicación actual
- **Perfil:** Gestión de datos personales y de emergencia
- **Contacto:** Llamada directa y WhatsApp

### 7.2 Modo Administrador
- **Gestión de Contactos:** CRUD completo de contactos
- **Gestión de Usuarios:** Ver y registrar usuarios
- **Panel de Emergencias:** Monitor de emergencias activas
- **Selector de Usuarios:** Dropdown para seleccionar usuario en emergencias
- **Registro de Emergencias:** Crear emergencias asignadas a usuarios

### 7.3 Sistema de Emergencias
- **Creación:** Administrador crea emergencia
- **Asignación:** Selecciona usuario del dropdown
- **Seguimiento:** Mapa con ubicación del usuario
- **Resolución:** Cambio de estado a resuelto

## 8. Politica de Tratamiento de Datos

Ver documento `docs/POLITICA_DATOS.md` para detalles completos.

## 9. Consideraciones de Performance

### 9.1 Optimizaciones
- **ISR (Incremental Static Regeneration):** Para páginas estáticas
- **SSR (Server-Side Rendering):** Para páginas dinámicas
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automático con Next.js
- **Lazy Loading:** Componentes pesados
- **Caching:** Supabase queries con cache

### 9.2 Monitoreo
- **Vercel Analytics:** Métricas de rendimiento
- **Supabase Dashboard:** Métricas de base de datos
- **Error Tracking:** Sentry (opcional)

## 10. Seguridad

### 10.1 Medidas de Seguridad
- **RLS (Row Level Security):** En Supabase
- **HTTPS:** Forzado en Vercel
- **Environment Variables:** Secrets en Vercel
- **Input Validation:** Zod schemas
- **XSS Protection:** React sanitization
- **CSRF Protection:** Next.js built-in
- **Rate Limiting:** En API routes

### 10.2 Autenticación
- **Supabase Auth:** JWT tokens
- **Session Management:** HttpOnly cookies
- **Password Hashing:** bcrypt (Supabase)
- **OAuth:** Google, GitHub (opcional)

## 11. Testing

### 11.1 Tipos de Tests
- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** Supabase test database
- **E2E Tests:** Playwright
- **Visual Tests:** Chromatic (opcional)

### 11.2 Cobertura Objetivo
- **Unit Tests:** 80%+
- **Integration Tests:** 60%+
- **E2E Tests:** Flujos críticos

## 12. Despliegue

### 12.1 Entornos
- **Development:** Local + Vercel Preview
- **Staging:** Vercel (branch staging)
- **Production:** Vercel (branch main)

### 12.2 CI/CD
- **GitHub Actions:** Tests automáticos
- **Vercel:** Despliegue automático
- **Supabase Migrations:** Version control de schema

## 13. Escalabilidad

### 13.1 Horizontal Scaling
- **Vercel:** Auto-scaling
- **Supabase:** Auto-scaling database
- **CDN:** Vercel Edge Network

### 13.2 Vertical Scaling
- **Database:** Supabase Pro tier cuando sea necesario
- **Storage:** Supabase Storage con límites configurables

## 14. Costos (Stack Free)

### 14.1 Vercel (Hobby)
- **Límites:** 100GB bandwidth, 6GB build
- **Costo:** $0/mes
- **Adecuado para:** MVP y tráfico moderado

### 14.2 Supabase (Free)
- **Database:** 500MB
- **Auth:** 50,000 MAU
- **Storage:** 1GB
- **Edge Functions:** 500,000 requests
- **Costo:** $0/mes
- **Adecuado para:** MVP y primeros usuarios

### 14.3 Google Maps (Free Tier)
- **$200 crédito mensual**
- **Maps JavaScript API:** ~$7 por 1,000 loads
- **Geocoding API:** ~$5 por 1,000 requests
- **Adecuado para:** Uso moderado

## 15. Roadmap de Implementación

### Fase 1: Fundamentos (Semanas 1-2)
- [ ] Configuración del proyecto Next.js
- [ ] Configuración de Supabase
- [ ] Sistema de autenticación básico
- [ ] Layout base y componentes UI

### Fase 2: Usuarios y Perfiles (Semanas 3-4)
- [ ] Registro de usuarios
- [ ] Registro de empresas
- [ ] Perfiles con foto
- [ ] Datos de emergencia
- [ ] Política de datos

### Fase 3: Contactos (Semanas 5-6)
- [ ] CRUD de contactos
- [ ] Grid de contactos
- [ ] Búsqueda y filtrado
- [ ] Llamadas y WhatsApp

### Fase 4: Mapas y Geolocalización (Semanas 7-8)
- [ ] Integración Google Maps
- [ ] Geolocalización de usuarios
- [ ] Marcadores en mapa
- [ ] Clustering

### Fase 5: Emergencias (Semanas 9-10)
- [ ] Panel de emergencias
- [ ] Selector de usuarios
- [ ] Registro de emergencias
- [ ] Seguimiento en mapa

### Fase 6: Testing y Optimización (Semanas 11-12)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization

### Fase 7: Despliegue (Semana 13)
- [ ] Configuración Vercel
- [ ] Migración de datos
- [ ] Monitoreo
- [ ] Documentación final
