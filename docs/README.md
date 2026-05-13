# Documentación de Arquitectura - Emergencias Duitama

## 📋 Visión General

Esta documentación contiene el plan completo de arquitectura, implementación y migración para el proyecto **Emergencias Duitama**, desde su implementación actual (HTML/JS vanilla) hasta una arquitectura moderna basada en Next.js, Supabase y Google Maps.

## 🚀 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Hosting:** Vercel
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Mapas:** Google Maps JavaScript API
- **Animaciones:** Framer Motion (migrando desde GSAP)

## 📚 Documentación

### 1. [Arquitectura del Sistema](./ARQUITECTURA.md)
Documento principal que define:
- Principios de arquitectura (SOLID, Clean Architecture)
- Estructura modular del proyecto
- Esquema de base de datos
- Integración con servicios externos
- Flujo de autenticación
- Funcionalidades principales
- Consideraciones de performance y seguridad
- Roadmap de implementación (13 semanas)
- Costos del stack free

### 2. [Esquema de Base de Datos Supabase](./SUPABASE_SCHEMA.sql)
Script SQL completo que incluye:
- 9 tablas principales (profiles, user_emergency_data, business_profiles, contacts, contact_phones, user_locations, emergencies, data_policy_acceptances, emergency_notes)
- Índices optimizados
- Triggers y funciones automáticas
- Row Level Security (RLS) policies
- Datos iniciales (seed data)
- Vistas útiles para consultas

### 3. [Estructura del Proyecto Next.js](./ESTRUCTURA_PROYECTO.md)
Guía detallada de la estructura modular:
- Directorio `app/` (App Router)
- Directorio `components/` (UI, auth, contacts, map, admin, shared)
- Directorio `lib/` (supabase, types, utils)
- Directorio `hooks/` (custom hooks)
- Directorio `services/` (lógica de negocio)
- Ejemplos de código para cada componente
- Configuración de archivos (package.json, tailwind.config.ts, etc.)

### 4. [Política de Tratamiento de Datos](./POLITICA_DATOS.md)
Política completa de protección de datos personales:
- Identificación del responsable (AiLink)
- Marco legal (Ley 1581 de 2012)
- Datos personales recopilados (usuarios, empresas, metadatos)
- Finalidades del tratamiento
- Derechos de los titulares
- Medidas de seguridad
- Transferencia internacional de datos
- Retención de datos
- Política para menores de edad
- Datos sensibles
- Cookies y tecnologías similares
- Componente de aceptación técnica
- Anexos con formatos

### 5. [Integración de Google Maps](./GOOGLE_MAPS_INTEGRATION.md)
Guía completa de integración:
- Configuración inicial (API Key)
- Instalación de dependencias
- Componentes de mapa (GoogleMap, UserLocationButton, LocationPicker, UserMap, EmergencyMap)
- Hook de geolocalización
- Servicio de geocoding
- API routes para ubicación
- Páginas de mapa para usuarios y admin
- Configuración de estilos
- Consideraciones de costos
- Consideraciones de privacidad
- Testing y troubleshooting

### 6. [Guía de Implementación y Migración](./IMPLEMENTACION.md)
Guía paso a paso para migrar desde HTML a Next.js:
- Roadmap de 12 semanas
- Configuración inicial (Next.js, Supabase, Google Maps, Vercel)
- Migración de base de datos
- Migración de componentes
- Implementación de funcionalidades clave:
  - Selector de usuarios en emergencias
  - Registro de usuario con datos de emergencia
  - Título "Emergencias Duitama" en negro
  - Foto de perfil para empresas en cards
- Configuración de despliegue
- Estrategia de migración de datos
- Testing y validación
- Monitoreo y mantenimiento
- Costos y escalabilidad
- Seguridad
- Documentación de usuario
- Soporte y mantenimiento

## 🎯 Características Principales

### Modo Usuario
- ✅ Visualización de contactos de emergencia
- ✅ Geolocalización en tiempo real con Google Maps
- ✅ Perfil con foto
- ✅ Datos de emergencia (dirección, tipo de sangre, contacto, EPS)
- ✅ Llamada directa y WhatsApp

### Modo Administrador
- ✅ Gestión completa de contactos (CRUD)
- ✅ Selector desplegable de usuarios
- ✅ Registro de usuarios con datos de emergencia
- ✅ Panel de emergencias con mapa
- ✅ Perfiles institucionales con logo para empresas
- ✅ Autorización con código AiLink

### Seguridad y Cumplimiento
- ✅ Política de tratamiento de datos (Ley 1581)
- ✅ Aceptación explícita de política
- ✅ Protección de datos sensibles
- ✅ Row Level Security en Supabase
- ✅ Encriptación de datos

## 📊 Estructura de Datos

### Usuarios
- Datos básicos: nombre, email, foto de perfil
- Datos de emergencia: dirección, tipo de sangre, contacto familiar, EPS, condiciones médicas, alergias
- Ubicación: coordenadas GPS en tiempo real

### Empresas
- Datos de empresa: nombre, NIT, logo, descripción
- Código de autorización AiLink
- Verificación de identidad

### Contactos
- Organización, tipo de servicio
- Iconos y colores personalizados
- Múltiples números (llamada y WhatsApp)
- Reordenamiento

### Emergencias
- Tipo y descripción
- Ubicación GPS
- Usuario asignado
- Estado (active, in_progress, resolved, cancelled)
- Notas y seguimiento

## 💰 Costos (Stack Free)

| Servicio | Plan | Costo Mensual | Límites |
|----------|------|---------------|---------|
| Vercel | Hobby | $0 | 100GB bandwidth, 6GB builds |
| Supabase | Free | $0 | 500MB DB, 50K MAU, 1GB Storage |
| Google Maps | Free Tier | $0 | $200 crédito (~28K cargas) |
| **Total** | | **$0** | |

**Punto de quiebre para upgrade:** >1,000 usuarios activos

## 🗓️ Roadmap de Implementación

### Fase 1: Preparación (Semana 1)
- Configurar repositorio Git
- Crear proyecto Next.js
- Configurar Supabase y Google Maps

### Fase 2-4: Infraestructura y Base de Datos (Semanas 2-4)
- Configurar Tailwind y TypeScript
- Ejecutar schema de Supabase
- Implementar autenticación

### Fase 5-7: Migración de UI y Funcionalidades (Semanas 5-7)
- Migrar componentes
- Implementar dashboard de usuario
- Implementar dashboard de admin

### Fase 8-9: Mapas y Emergencias (Semanas 8-9)
- Integrar Google Maps
- Implementar panel de emergencias

### Fase 10-12: Testing y Despliegue (Semanas 10-12)
- Unit tests, integration tests, E2E tests
- Despliegue a Vercel
- Monitoreo y soporte

## 🔐 Seguridad

- **RLS Policies:** Acceso restringido por usuario y rol
- **API Keys:** Restringidas por dominio
- **HTTPS:** Forzado en Vercel
- **Input Validation:** Zod schemas
- **XSS/CSRF Protection:** Next.js built-in
- **Encriptación:** Datos sensibles encriptados
- **Auditoría:** Logs de actividad

## 📞 Contacto

**AiLink - Duitama, Boyacá**
- Email: soporte@ailink.com.co
- Teléfono: 316 497 6104
- PQRS: 310 695 1743

## 🔄 Próximos Pasos

1. **Revisar documentación:** Leer todos los documentos
2. **Configurar entorno:** Seguir guía de IMPLEMENTACION.md
3. **Ejecutar schema:** Ejecutar SUPABASE_SCHEMA.sql en Supabase
4. **Implementar componentes:** Usar ESTRUCTURA_PROYECTO.md como referencia
5. **Integrar mapas:** Seguir GOOGLE_MAPS_INTEGRATION.md
6. **Implementar política:** Usar componentes de POLITICA_DATOS.md
7. **Testing y despliegue:** Seguir checklist en IMPLEMENTACION.md

## 📝 Notas Importantes

- **Título "Emergencias Duitama":** Se deja en negro según requerimiento
- **Foto de perfil:** Implementada para usuarios y empresas
- **Logos en cards:** Se visualizan para perfiles institucionales
- **Selector de usuarios:** Dropdown en panel de emergencias del admin
- **Datos de emergencia:** Dirección, tipo de sangre, contacto familiar, EPS
- **Política de datos:** Aceptación obligatoria durante registro
- **Google Maps:** Integración completa con geolocalización

## 🎨 DNA Visual

Se mantiene la identidad visual actual:
- Colores: Púrpura (#B14FFF) como primario
- Tipografía: Bricolage Grotesque + IBM Plex Mono
- Animaciones: Migración de GSAP a Framer Motion
- Estilo: Minimalista, profesional, accesible

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Maps API Documentation](https://developers.google.com/maps)
- [Vercel Documentation](https://vercel.com/docs)

---

**Versión de documentación:** 1.0  
**Fecha:** Enero 2025  
**Autor:** AiLink - Duitama, Boyacá
