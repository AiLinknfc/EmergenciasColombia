# Cambios de Desarrollo vs Producción

## Cambios Realizados para Desarrollo

Los siguientes cambios se hicieron para facilitar el desarrollo y pruebas:

### 1. RLS (Row Level Security) Deshabilitado
**Estado actual:** Deshabilitado en tablas principales
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones DISABLE ROW LEVEL SECURITY;
```

**Para producción:** Reactivar RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones DISABLE ROW LEVEL SECURITY;
```

### 2. Trigger Automático Eliminado
**Estado actual:** Eliminado para evitar errores en registro
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
```

**Para producción:** Recrear trigger con mejor manejo de errores
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3. Confirmación de Email Deshabilitada
**Estado actual:** Deshabilitada en Supabase Dashboard → Authentication → Providers → Email

**Para producción:** Reactivar confirmación de email
- Ve a Supabase Dashboard → Authentication → Providers → Email
- Activa "Confirm email"
- Configura plantillas de email personalizadas

### 4. Fallback a Datos Mock
**Estado actual:** El hook `useContacts` usa datos mock si Supabase falla

**Para producción:** Eliminar fallback
```typescript
// En hooks/useContacts.ts
// Eliminar el bloque catch que usa contactService.getAll()
// Solo usar contactServiceSupabase.getAll()
```

## Script de Preparación para Producción

Ejecuta este script en Supabase SQL Editor antes de ir a producción:

```sql
-- 1. Reactivar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_policy_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_notes ENABLE ROW LEVEL SECURITY;

-- 2. Recrear trigger automático con manejo de errores
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Verificar políticas RLS
-- Las políticas ya están definidas en el schema SQL
-- Solo asegúrate de que estén activas
```

## Checklist para Producción

- [ ] Reactivar RLS en todas las tablas
- [ ] Recrear trigger automático
- [ ] Activar confirmación de email
- [ ] Eliminar fallback a datos mock en `useContacts.ts`
- [ ] Verificar que las políticas RLS funcionen correctamente
- [ ] Probar registro con confirmación de email
- [ ] Configurar plantillas de email personalizadas
- [ ] Verificar que Storage esté configurado correctamente
- [ ] Asegurar que el bucket "avatars" sea público
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar rate limits apropiados
- [ ] Revisar y ajustar políticas de seguridad
- [ ] Implementar logs y monitoreo
- [ ] Configurar backups automáticos

## Variables de Entorno para Producción

Asegúrate de tener estas variables en tu entorno de producción:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key-prod]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[tu-api-key]
```

**Importante:** Usa diferentes proyectos de Supabase para desarrollo y producción.
