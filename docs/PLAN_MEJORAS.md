# Plan de Mejoras — Emergencias App

> Versión base: 1.0 (producción)  
> Actualizado: 2026-05-13 (v1.1 en progreso)

---

## Fixes aplicados en esta sesión (v1.0.1)

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `DirectoryView.tsx` | Sombra transparente en botón "Nuevo Contacto": `bg-surface/80` → `bg-surface` (opaco) |
| 2 | `DirectoryView.tsx` | Layout de categorías en columnas (grid multi-col con `items-start`) — cada categoría ocupa su celda responsive |
| 3 | `ContactCard.tsx` | Click en área blanca del card activa el volteo (flip) hacia los números |
| 4 | `EmergencyMap.tsx` | Guard `instanceof Element` + `requestAnimationFrame` para el error de `IntersectionObserver` en tablets |
| 5 | `lib/utils/maps.ts` | Cola de callbacks (`_gmapsCallbacks`) evita sobreescritura del handler global de Google Maps |

### Sobre el error del mapa (producción vs local)
El error `TypeError: Argument 1 ('target') to IntersectionObserver.observe must be an instance of Element`
ocurre porque el script de Google Maps llama `initMap()` antes de que el ciclo de render de React garantice
que el `mapRef.current` esté pintado en el DOM del navegador.

**Se puede probar en local** con `npm run dev` (en `emergencias-app/`). Requiere `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en `.env.local`.
Para reproducir el bug en tablet se necesita el dispositivo físico o DevTools en modo tablet con throttling.

---

## Fixes v1.0.2 (esta sesión)

| # | Archivo | Cambio |
|---|---------|--------|
| 6 | `EmergencyMap.tsx` | Registrar `gm_authFailure` (hook oficial de Google Maps) antes de cargar el script — elimina el cascade de IntersectionObserver |
| 7 | `EmergencyMap.tsx` | `unhandledrejection` listener como segunda línea de defensa con cleanup correcto |
| 8 | `SOSView.tsx` | Reescrito completo: voz → texto en tiempo real, captura de GPS y metadatos de dispositivo, pantalla de preview, envío a n8n |
| 9 | `app/api/sos/route.ts` | API route nueva: recibe audio+transcript+location+metadata, reenvía a n8n o hace log en dev |

### Variable de entorno requerida para n8n
```
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/sos-emergencia
```
Sin esta variable el sistema funciona en modo "desarrollo" (logs en consola).

---

## Protocolo SOS Automatizado — Roadmap completo

### Arquitectura objetivo (n8n + Claude MCP)

```
[App móvil/tablet]
    │ POST /api/sos
    │ { transcript, audio, location, metadata }
    ▼
[Next.js API /api/sos]
    │ forward
    ▼
[n8n Webhook trigger]
    │
    ├──► [Claude API — Interpretar emergencia]
    │      · Clasificar tipo: incendio / médica / violencia / accidente
    │      · Evaluar severidad: 1-5
    │      · Extraer detalles clave del transcript
    │      · Generar resumen estructurado
    │
    ├──► [Guardar en Supabase — tabla incidents]
    │      · id, tipo, severidad, ubicación, transcript, metadata
    │
    ├──► [Notificar operadores] (Email / WhatsApp / Slack)
    │      · Resumen + mapa con ubicación
    │
    └──► [Respuesta de vuelta a la app]
           · ID de seguimiento
           · Tipo clasificado
           · ETA estimado (futuro)
```

### Fase 1 — MVP actual (implementado)
- [x] Grabación de audio con MediaRecorder API
- [x] Transcripción en tiempo real con Web Speech API (es-CO)
- [x] Captura de GPS (`navigator.geolocation`)
- [x] Metadatos: `userAgent`, `platform`, `language`, `timezone`, batería, tipo de red
- [x] Preview antes de enviar
- [x] POST a `/api/sos` → reenvío a n8n webhook
- [x] Fallback: texto manual si no hay micrófono
- [x] ID de seguimiento en pantalla de confirmación

### Fase 2 — Integración n8n + Claude (próximo)
- [ ] Configurar workflow en n8n:
  1. **Webhook trigger** recibe el payload
  2. **HTTP Request** → Claude API con el transcript + contexto
  3. **Code node** → parsear respuesta de Claude (tipo, severidad, detalles)
  4. **Supabase node** → insertar en tabla `incidents`
  5. **Send Email / WhatsApp** → notificar operadores con resumen
  6. **Respond to Webhook** → devolver clasificación a la app
- [ ] Mostrar en la app el tipo de emergencia clasificado por Claude
- [ ] Actualizar estado del SOS en tiempo real (Supabase Realtime)

### Fase 3 — Video e imagen
- [ ] Opción de capturar foto desde cámara (`MediaDevices.getUserMedia({ video: true })`)
- [ ] Enviar imagen como `File` en el FormData junto al audio
- [ ] n8n pasa la imagen a Claude vision para análisis adicional
- [ ] Opcional: grabación de video corto (15s máx)

### Fase 4 — Automatización completa
- [ ] Pre-despacho automático según clasificación de Claude (sin intervención humana para severidad 5)
- [ ] Integración con sistemas de CAD (Computer Aided Dispatch) vía webhook saliente
- [ ] Notificación push al dispositivo cuando el despacho es confirmado
- [ ] Panel de seguimiento en tiempo real en la sección Incidentes

---

## Modo Oscuro — Plan de implementación

> Decisión: **blanco por defecto**, modo oscuro opcional. Debe ser armónico con los tokens de Material You ya en uso.

### Estrategia
1. Usar `next-themes` para manejar el toggle (`dark` class en `<html>`)
2. Extender los tokens de Tailwind con variantes dark:
   ```
   dark:bg-surface → #1C1B1F (Material You surface dark)
   dark:text-on-surface → #E6E1E5
   dark:bg-primary → #D0BCFF (primary dark en Material You)
   ```
3. Toggle en el Header — ícono sol/luna, preferencia guardada en `localStorage`
4. Respetar `prefers-color-scheme` como valor inicial

### Tokens de color armónicos (Material You Dark)
| Token | Light | Dark |
|-------|-------|------|
| `surface` | #FFFBFE | #1C1B1F |
| `on-surface` | #1C1B1F | #E6E1E5 |
| `primary` | #6750A4 | #D0BCFF |
| `surface-container-low` | #F7F2FA | #1E1B27 |
| `outline-variant` | #CAC4D0 | #49454F |

**Criterio de validación:** probar en la misma tablet con ambos modos antes de mergear.

---

## Backlog de mejoras — corto plazo (v1.1)

### UX / Interfaz

- [ ] **Skeleton loaders** en lugar del spinner genérico al cargar contactos
- [ ] **Búsqueda / filtro** de contactos por nombre o categoría (input sticky en la parte superior del directorio)
- [ ] **Animación de entrada** para las tarjetas al cargar la vista (stagger por columna)
- [ ] **Modo oscuro** completo — revisar tokens de Material You que aún usan colores hardcoded
- [ ] **Indicador de categoría en el card** — una franja de color izquierda (colored left-border) para identificar visualmente la categoría sin leer el texto

### Mapa (Incidentes)

- [ ] **Geolocalización real del usuario** — usar `navigator.geolocation` con fallback a Colombia centro
- [ ] **Permisos de ubicación** — mostrar un banner explicativo antes de pedir permiso (mejor tasa de aceptación)
- [ ] **Marcadores con dirección real** — reemplazar las coordenadas simuladas por geocoding real de la dirección del contacto
- [ ] **Clustering de marcadores** — cuando hay muchos contactos cercanos, agruparlos con `MarkerClusterer`
- [ ] **Modo fallback** sin Google Maps — mostrar lista de contactos con sus direcciones si la API no está disponible

### Contactos

- [ ] **Foto / logo de organización** — completar el upload en `ContactForm` con validación de tamaño/tipo
- [ ] **Orden persistente** — guardar el `order_index` tras drag-and-drop (actualmente solo es local)
- [ ] **Contactos favoritos** — marcar contactos para acceso rápido desde el dashboard principal
- [ ] **Historial de llamadas** — registrar en Supabase cuándo se marcó un número (útil para reportes)

---

## Backlog — mediano plazo (v1.2)

### Framework de pruebas

Hoy el proyecto **no tiene ninguna configuración de testing**. Propuesta de setup:

```
emergencias-app/
├── __tests__/
│   ├── components/
│   │   ├── ContactCard.test.tsx
│   │   └── DirectoryView.test.tsx
│   ├── hooks/
│   │   └── useContacts.test.ts
│   └── services/
│       └── contact.service.test.ts
├── jest.config.ts
└── jest.setup.ts
```

**Stack recomendado:**
- **Vitest** (más rápido, compatible con Vite/Next.js, no necesita Babel)  
- **React Testing Library** (`@testing-library/react`)  
- **MSW (Mock Service Worker)** para mockear llamadas a Supabase sin tocar la DB real

**Casos críticos a cubrir primero:**
1. `ContactCard` — flip state al hacer click en área blanca
2. `DirectoryView` — renderiza categorías correctamente con datos mock
3. `useContacts` — CRUD con respuestas de Supabase mockeadas
4. `loadGoogleMapsScript` — cola de callbacks no se sobreescribe

### Notificaciones en tiempo real

- [ ] **Supabase Realtime** — suscripción a cambios en la tabla `contacts` para que todos los usuarios vean actualizaciones sin recargar
- [ ] **Push notifications** (Web Push API) para alertas de incidentes críticos
- [ ] **Toast system** — reemplazar `alert()` con un sistema de notificaciones in-app (e.g. `sonner` o `react-hot-toast`)

### Accesibilidad (a11y)

- [ ] **ARIA labels** en botones de icono (Edit, Delete, GripHandle)
- [ ] **Foco de teclado** en el card flip — `onKeyDown` (Enter/Space) además de `onClick`
- [ ] **Contraste de colores** — auditar tokens de Material You contra WCAG AA
- [ ] **Reducir movimiento** — respetar `prefers-reduced-motion` en animaciones Framer Motion

---

## Backlog — largo plazo (v2.0)

### Funcionalidades nuevas

- [ ] **Módulo de incidentes completo** — hoy los datos son mock; conectar a Supabase con tabla `incidents`
- [ ] **Roles granulares** — más allá de `business`/`user`: despacho, operador, supervisor
- [ ] **App móvil** — evaluar Capacitor (encapsula el Next.js) vs React Native separado
- [ ] **Integración con radio/despacho** — webhook que crea incidentes automáticamente desde sistemas de CAD
- [ ] **Reportes y analytics** — cuántas llamadas se hacen, a qué contactos, en qué horarios

### Infraestructura / DevOps

- [ ] **CI/CD pipeline** — GitHub Actions: lint → test → build → deploy en Vercel
- [ ] **Variables de entorno** — separar `.env.local` (dev), `.env.staging`, `.env.production`
- [ ] **Lighthouse CI** — auditar performance/accesibilidad en cada PR
- [ ] **Error monitoring** — integrar Sentry para capturar errores de producción (como el de `IntersectionObserver`)

---

## Organización de carpetas propuesta para testing

```
emergencias-app/
├── __tests__/              ← tests unitarios e integración
│   ├── components/
│   ├── hooks/
│   └── services/
├── e2e/                    ← tests end-to-end (Playwright)
│   ├── auth.spec.ts
│   ├── contacts.spec.ts
│   └── map.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## Comandos para arrancar el proyecto en local

```bash
# En la carpeta del app
cd emergencias-app

# Instalar dependencias
npm install

# Desarrollo
npm run dev          # http://localhost:3000

# Build de producción
npm run build
npm start

# (Cuando se configure testing)
npm test             # vitest
npx playwright test  # e2e
```

**Variables necesarias en `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```
