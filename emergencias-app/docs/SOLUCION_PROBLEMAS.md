# Solución de Problemas - Emergencias Duitama

## Problemas Comunes y Soluciones

### 1. Error al cargar contactos

**Síntoma:** Aparece "Error al cargar contactos" en la página principal.

**Causa:** Supabase no tiene datos o las credenciales son incorrectas.

**Solución:**
- El sistema ahora tiene un fallback automático a datos mock si Supabase falla
- Verifica que las credenciales en `.env.local` sean correctas
- Ejecuta el schema SQL en Supabase para crear las tablas y datos iniciales

### 2. Error al registrar usuario

**Síntoma:** El formulario de registro no avanza o muestra error.

**Causas posibles:**
- Credenciales de Supabase incorrectas
- El trigger automático no está funcionando
- Las políticas RLS están bloqueando la inserción

**Solución:**
1. Verifica las credenciales en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
   ```

2. Verifica que el proyecto en Supabase se llame "duitama" o actualiza las credenciales

3. Deshabilita temporalmente RLS para pruebas:
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
   ALTER TABLE contact_phones DISABLE ROW LEVEL SECURITY;
   ```

4. Revisa la consola del navegador para ver mensajes de error detallados

### 3. No se puede iniciar sesión

**Síntoma:** Error al intentar iniciar sesión después de registrarse.

**Causa:** El usuario no se registró correctamente o el perfil no se creó.

**Solución:**
1. Verifica en Supabase Dashboard → Authentication → Users que el usuario exista
2. Verifica en Supabase Dashboard → Table Editor → profiles que el perfil exista
3. Si el usuario existe pero no el perfil, créalo manualmente:
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   VALUES (
     '[user-id]',
     '[email]',
     '[nombre]',
     'user'
   );
   ```

### 4. El selector de roles no funciona

**Síntoma:** Al hacer clic en Usuario o Administrador no avanza al siguiente paso.

**Causa:** El componente RoleSelector no estaba conectado al estado del formulario.

**Solución:** Ya fue corregido. El selector de roles ahora está integrado directamente en la página de registro.

### 5. Error de conexión a Supabase

**Síntoma:** "Connection refused" o errores de red.

**Causa:** Proyecto de Supabase no activo o credenciales incorrectas.

**Solución:**
1. Verifica que el proyecto esté activo en Supabase Dashboard
2. Verifica que la URL sea correcta (debe terminar en .supabase.co)
3. Verifica que la anon key sea válida
4. Intenta hacer una petición de prueba desde el SQL Editor

### 6. Las políticas RLS bloquean operaciones

**Síntoma:** "RLS policy violation" al intentar insertar o actualizar datos.

**Causa:** Las políticas de seguridad están bloqueando la operación.

**Solución temporal (para desarrollo):**
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones DISABLE ROW LEVEL SECURITY;
```

**Solución permanente:**
Verifica que las políticas en el schema SQL se hayan ejecutado correctamente.

## Verificación de Configuración

### 1. Verificar credenciales

Abre `.env.local` y verifica:
```env
NEXT_PUBLIC_SUPABASE_URL=https://duitama.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Verificar tablas en Supabase

En Supabase Dashboard → Table Editor, verifica que existan:
- profiles
- user_emergency_data
- contacts
- contact_phones

### 3. Verificar datos iniciales

En Supabase Dashboard → Table Editor → contacts, verifica que haya contactos iniciales:
- Policía Nacional
- Bomberos Duitama
- Cruz Roja
- etc.

## Logs y Debugging

### Ver logs en el navegador

1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Busca mensajes que empiecen con:
   - "Iniciando registro:"
   - "Usuario creado en Auth:"
   - "Error en Supabase Auth:"
   - "Error al crear perfil:"

### Ver logs en Supabase

1. Ve a Supabase Dashboard
2. Database → Logs
3. Filtra por errores recientes

## Pasos para Recuperar el Sistema

Si nada funciona, sigue estos pasos:

1. **Eliminar usuario actual** (si existe)
   ```sql
   DELETE FROM profiles WHERE email = '[tu-email]';
   DELETE FROM auth.users WHERE email = '[tu-email]';
   ```

2. **Deshabilitar RLS temporalmente**
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
   ALTER TABLE contact_phones DISABLE ROW LEVEL SECURITY;
   ```

3. **Reiniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Intentar registrar nuevamente**

5. **Verificar que el usuario se creó** en Supabase Dashboard

6. **Rehabilitar RLS** cuando todo funcione
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE contact_phones ENABLE ROW LEVEL SECURITY;
   ```

## Contacto

Si los problemas persisten, revisa:
- La consola del navegador para errores específicos
- Los logs de Supabase en el Dashboard
- El archivo `.env.local` para verificar credenciales
