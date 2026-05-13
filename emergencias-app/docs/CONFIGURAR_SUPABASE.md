# Guía de Configuración de Supabase

## Paso 1: Crear Cuenta en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Hacer clic en "Start your project"
3. Registrarse con GitHub, Google o email
4. Crear organización (opcional, puede usar la personal)

## Paso 2: Crear Proyecto

1. Hacer clic en "New Project"
2. Llenar el formulario:
   - **Name:** `emergencias-duitama`
   - **Database Password:** (guardar esta contraseña)
   - **Region:** South America (São Paulo) o la más cercana
   - **Pricing Plan:** Free
3. Hacer clic en "Create new project"
4. Esperar 2-3 minutos mientras se crea el proyecto

## Paso 3: Obtener Credenciales

1. Ir a Settings → API (en el menú lateral izquierdo)
2. Copiar las siguientes credenciales:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (solo para server-side)

## Paso 4: Configurar Variables de Entorno

1. En el directorio `emergencias-duitama-app/`, crear archivo `.env.local`
2. Copiar el contenido de `env.example`
3. Llenar con las credenciales obtenidas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
INVITE_CODE=AiLinkCol2025
DATA_POLICY_VERSION=1.0
```

## Paso 5: Ejecutar Schema SQL

1. Ir a SQL Editor (en el menú lateral izquierdo)
2. Hacer clic en "New query"
3. Copiar el contenido de `../docs/SUPABASE_SCHEMA.sql`
4. Pegar en el editor SQL
5. Hacer clic en "Run" (botón de play)
6. Verificar que no haya errores

## Paso 6: Verificar Tablas Creadas

1. Ir a Table Editor (en el menú lateral izquierdo)
2. Verificar que se crearon las siguientes tablas:
   - `profiles`
   - `user_emergency_data`
   - `business_profiles`
   - `contacts`
   - `contact_phones`
   - `user_locations`
   - `emergencies`
   - `data_policy_acceptances`
   - `emergency_notes`

## Paso 7: Configurar Storage (Opcional para Fotos)

1. Ir a Storage (en el menú lateral izquierdo)
2. Crear bucket llamado `avatars`
3. Configurar como público (o privado con RLS)
4. Habilitar RLS policies

## Paso 8: Probar Conexión

1. Reiniciar el servidor de desarrollo:
```bash
npm run dev
```

2. Verificar que no haya errores de conexión en la consola

## Solución de Problemas

### Error: "Connection refused"
- Verificar que el proyecto de Supabase esté activo
- Verificar que las credenciales sean correctas
- Esperar unos minutos si el proyecto se acaba de crear

### Error: "Table does not exist"
- Verificar que el schema SQL se ejecutó correctamente
- Ir a SQL Editor y ejecutar el schema nuevamente

### Error: "RLS policy violation"
- Verificar que las RLS policies estén configuradas correctamente
- Revisar el schema SQL para las políticas

## Próximos Pasos

Una vez configurado Supabase:
1. Implementar autenticación con Supabase Auth
2. Crear páginas de login/registro
3. Implementar las funcionalidades de CRUD
4. Integrar con los componentes UI ya creados
