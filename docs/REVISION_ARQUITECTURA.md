# Revisión de Arquitectura: Emergencias Colombia (Director Inteligente)

## 1. Visión General del Proyecto
El proyecto es un sistema de gestión de contactos de emergencia interactivo desarrollado con Next.js 16 y React 19. Aprovecha Supabase para backend as a service (Auth, Database, Storage) y Google Maps para la geolocalización de incidentes y entidades.

## 2. Evaluación Arquitectónica y Escalabilidad

### 2.1 Frontend (Next.js App Router)
- **Estado Actual:** El uso de Next.js App Router (app/) y Server Components es una excelente decisión arquitectónica para SEO, rendimiento inicial y menor tamaño de bundle al cliente.
- **Escalabilidad:** Muy alta. Next.js junto con el despliegue en plataformas como Vercel o contenedores Docker permitirá auto-escalado según la demanda.
- **Recomendación:** Mantener la separación estricta entre Server Components y Client Components (`'use client'`). Los hooks personalizados ya están bien organizados en la capa de cliente.

### 2.2 Backend y Base de Datos (Supabase)
- **Estado Actual:** El modelo as a service reduce la carga operativa.
- **Seguridad (RLS):** Es CRÍTICO asegurar que Row Level Security (RLS) esté implementado y bien configurado en Supabase. Los usuarios anónimos solo deben poder leer, y solo los administradores o dueños de registros deben poder escribir.
- **Escalabilidad:** Moderada a Alta. Supabase escala bien verticalmente y permite connection pooling. Para escala nacional, se debe evaluar el uso de réplicas de lectura.

### 2.3 Estructura Agéntica (Preparación para IA)
Se ha creado un directorio `agentic_framework/` en la raíz para preparar la integración de módulos de Inteligencia Artificial:
- **Models:** Configuración de LLMs (OpenAI, Anthropic, Gemini).
- **Agents:** Definición de roles lógicos (Soporte, Triaje Automático, Análisis de Casos).
- **Skills:** Herramientas ejecutables por los agentes (ej. `fetchContact()`, `reportEmergency()`).
- **Ventaja:** Desacopla la lógica de IA del framework web de frontend, permitiendo integrarla mediante APIs (ej. Next.js Route Handlers) en el futuro.

## 3. Preparación para Nuevos Módulos
Mencionaste que a futuro integrarás módulos de otros proyectos. Para que la adaptación sea fluida:
1. **Empaquetado:** Los nuevos módulos deben encapsularse como features independientes dentro de `app/(features)/[modulo]` o en un monorepo si el tamaño justifica dividir la aplicación.
2. **Dependencias:** Asegurarse de que los módulos importados sean compatibles con React 19 (la versión actual). Si traen dependencias legadas (ej. React 17), será necesario refactorizar esos componentes o mantenerlos en iframes/micro-frontends (menos recomendado).
3. **Estilos:** Se utiliza Tailwind CSS 4. Evitar conflictos de especificidad usando prefijos si el nuevo módulo trae estilos globales.

## 4. Mejores Prácticas y Seguridad
- **Gestión de Secretos:** Nunca exponer las llaves de servicio (Service Role Key) de Supabase en el frontend. Usar únicamente la `ANON_KEY`.
- **Validación de Entradas:** Implementar `Zod` (ya presente en el `package.json`) en todos los formularios y API routes para prevenir inyecciones y datos corruptos.
- **Rate Limiting:** Implementar limitación de tasa (Rate Limiting) en las rutas de creación de reportes para evitar ataques de denegación de servicio (DDoS) que puedan agotar las cuotas gratuitas de Supabase o Google Maps.

---
**Documento generado por el Consultor/Arquitecto IA.**
