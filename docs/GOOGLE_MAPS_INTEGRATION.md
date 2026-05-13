# Integración de Google Maps
## Emergencias Duitama

## 1. Visión General

La integración de Google Maps permite:
- **Geolocalización de usuarios** en tiempo real
- **Visualización de ubicaciones** en un mapa interactivo
- **Selección de ubicaciones** para emergencias
- **Geocoding inverso** (coordenadas → dirección)
- **Clustering de marcadores** para alta densidad

## 2. Configuración Inicial

### 2.1 Obtener API Key de Google Maps

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar las siguientes APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API** (opcional, para autocompletado de direcciones)
4. Crear credenciales (API Key)
5. Restringir la API Key:
   - **Referers HTTP:** `localhost:3000/*`, `*.vercel.app/*`
   - **IP addresses:** (opcional, para server-side)
6. Copiar la API Key

### 2.2 Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

```env
# .env.example
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 3. Instalación de Dependencias

```bash
npm install @react-google-maps/api
```

O con yarn:

```bash
yarn add @react-google-maps/api
```

## 4. Componentes de Mapa

### 4.1 Componente Principal: GoogleMap

```typescript
// components/map/GoogleMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { LoadScript, GoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api'

interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  info?: string
  icon?: string
  color?: string
}

interface GoogleMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (e: google.maps.MapMouseEvent) => void
  showUserLocation?: { lat: number; lng: number; accuracy?: number }
  height?: string
  className?: string
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 5.830, // Duitama, Boyacá
  lng: -73.547,
}

export function GoogleMap({
  center = defaultCenter,
  zoom = 14,
  markers = [],
  onMarkerClick,
  onMapClick,
  showUserLocation,
  height = '400px',
  className = '',
}: GoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        onLoad={() => setIsLoaded(true)}
      >
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            onLoad={setMap}
            onClick={onMapClick}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            }}
          >
            {/* Marcadores de usuarios/contactos */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => {
                  setSelectedMarker(marker)
                  onMarkerClick?.(marker)
                }}
                icon={
                  marker.color
                    ? {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: marker.color,
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                      }
                    : undefined
                }
              >
                {selectedMarker?.id === marker.id && (
                  <InfoWindow
                    onCloseClick={() => setSelectedMarker(null)}
                    position={marker.position}
                  >
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-sm">{marker.title}</h3>
                      {marker.info && (
                        <p className="text-xs text-gray-600 mt-1">{marker.info}</p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}

            {/* Ubicación del usuario actual */}
            {showUserLocation && (
              <>
                <Circle
                  center={{ lat: showUserLocation.lat, lng: showUserLocation.lng }}
                  radius={showUserLocation.accuracy || 50}
                  options={{
                    fillColor: '#4285F4',
                    fillOpacity: 0.15,
                    strokeColor: '#4285F4',
                    strokeWeight: 2,
                  }}
                />
                <Marker
                  position={{ lat: showUserLocation.lat, lng: showUserLocation.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3,
                  }}
                  title="Tu ubicación"
                />
              </>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  )
}
```

### 4.2 Componente: UserLocationButton

```typescript
// components/map/UserLocationButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocation } from '@/hooks/useLocation'

interface UserLocationButtonProps {
  onLocationFound: (location: { lat: number; lng: number }) => void
}

export function UserLocationButton({ onLocationFound }: UserLocationButtonProps) {
  const { location, loading, error, getCurrentLocation } = useLocation()

  const handleGetLocation = () => {
    getCurrentLocation()
    if (location) {
      onLocationFound({ lat: location.latitude, lng: location.longitude })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGetLocation}
        disabled={loading}
        variant={error ? 'destructive' : 'default'}
      >
        {loading ? (
          <>
            <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            Obteniendo ubicación...
          </>
        ) : (
          <>
            <MapPinIcon className="w-4 h-4 mr-2" />
            {location ? 'Actualizar ubicación' : 'Obtener mi ubicación'}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      
      {location && !loading && (
        <p className="text-xs text-green-600">
          Ubicación: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
      )}
    </div>
  )
}
```

### 4.3 Componente: LocationPicker

```typescript
// components/map/LocationPicker.tsx
'use client'

import { useState } from 'react'
import { GoogleMap } from './GoogleMap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat()
    const lng = e.latLng?.lng()
    
    if (lat && lng) {
      setSelectedLocation({ lat, lng })
      setLoading(true)
      
      // Geocoding inverso
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()
        
        if (data.results?.[0]) {
          setAddress(data.results[0].formatted_address)
        }
      } catch (error) {
        console.error('Error geocoding:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address,
      })
    }
  }

  return (
    <div className="space-y-4">
      <GoogleMap
        center={initialLocation || { lat: 5.830, lng: -73.547 }}
        zoom={15}
        onMapClick={handleMapClick}
        height="400px"
        markers={
          selectedLocation
            ? [
                {
                  id: 'selected',
                  position: selectedLocation,
                  title: 'Ubicación seleccionada',
                  info: address,
                  color: '#B14FFF',
                },
              ]
            : []
        }
      />
      
      {selectedLocation && (
        <div className="space-y-2">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dirección (se llenará automáticamente)"
            disabled={loading}
          />
          <Button onClick={handleConfirm} className="w-full">
            Confirmar ubicación
          </Button>
        </div>
      )}
    </div>
  )
}
```

### 4.4 Componente: UserMap (Modo Usuario)

```typescript
// components/map/UserMap.tsx
'use client'

import { useEffect, useState } from 'react'
import { GoogleMap } from './GoogleMap'
import { UserLocationButton } from './UserLocationButton'
import { useLocation } from '@/hooks/useLocation'
import { Card } from '@/components/ui/card'

export function UserMap() {
  const { location, loading, getCurrentLocation } = useLocation()
  const [mapCenter, setMapCenter] = useState({ lat: 5.830, lng: -73.547 })

  useEffect(() => {
    // Obtener ubicación automáticamente al cargar
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (location) {
      setMapCenter({ lat: location.latitude, lng: location.longitude })
    }
  }, [location])

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Tu Ubicación</h2>
        <p className="text-sm text-gray-600">
          Tu ubicación se compartirá con servicios de emergencia cuando lo solicites.
        </p>
      </div>

      <UserLocationButton
        onLocationFound={(loc) => setMapCenter(loc)}
      />

      <div className="mt-4">
        <GoogleMap
          center={mapCenter}
          zoom={16}
          showUserLocation={
            location
              ? {
                  lat: location.latitude,
                  lng: location.longitude,
                  accuracy: location.accuracy,
                }
              : undefined
          }
          height="400px"
        />
      </div>

      {location && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm">
            <strong>Coordenadas:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
          <p className="text-sm">
            <strong>Precisión:</strong> ±{location.accuracy?.toFixed(0)} metros
          </p>
        </div>
      )}
    </Card>
  )
}
```

### 4.5 Componente: EmergencyMap (Modo Admin)

```typescript
// components/map/EmergencyMap.tsx
'use client'

import { useState } from 'react'
import { GoogleMap } from './GoogleMap'
import { UserSelector } from '@/components/admin/UserSelector'
import { Card } from '@/components/ui/card'
import { UserWithEmergencyData } from '@/lib/types/user'

interface EmergencyMapProps {
  onUserSelect: (user: UserWithEmergencyData) => void
}

export function EmergencyMap({ onUserSelect }: EmergencyMapProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithEmergencyData | null>(null)
  const [userLocations, setUserLocations] = useState<Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
    info: string
    color: string
  }>>([])

  const handleUserSelect = (user: UserWithEmergencyData) => {
    setSelectedUser(user)
    onUserSelect(user)
    
    // Simular ubicación del usuario (en producción, obtener de la base de datos)
    if (user.emergency_data?.address) {
      // Aquí se haría geocoding de la dirección
      setUserLocations([
        {
          id: user.id,
          position: { lat: 5.830 + Math.random() * 0.01, lng: -73.547 + Math.random() * 0.01 },
          title: user.full_name,
          info: user.emergency_data.address,
          color: '#B14FFF',
        },
      ])
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Mapa de Emergencias</h2>
        <p className="text-sm text-gray-600">
          Selecciona un usuario para ver su ubicación y datos de emergencia.
        </p>
      </div>

      <UserSelector onUserSelect={handleUserSelect} />

      {selectedUser && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-bold">{selectedUser.full_name}</h3>
          <p className="text-sm text-gray-600">{selectedUser.email}</p>
          {selectedUser.emergency_data && (
            <div className="mt-2 text-sm">
              <p><strong>Tipo de sangre:</strong> {selectedUser.emergency_data.blood_type}</p>
              <p><strong>Dirección:</strong> {selectedUser.emergency_data.address}</p>
              <p><strong>EPS:</strong> {selectedUser.emergency_data.eps}</p>
              <p><strong>Contacto:</strong> {selectedUser.emergency_data.emergency_contact_name} - {selectedUser.emergency_data.emergency_contact_phone}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <GoogleMap
          center={{ lat: 5.830, lng: -73.547 }}
          zoom={14}
          markers={userLocations}
          height="400px"
        />
      </div>
    </Card>
  )
}
```

## 5. Hook de Geolocalización

```typescript
// hooks/useLocation.ts
'use client'

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
      setError('Geolocalización no soportada en este navegador')
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
        let errorMessage = 'Error al obtener ubicación'
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible'
            break
          case err.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
        }
        
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (err) => {
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }

  return { location, loading, error, getCurrentLocation, watchLocation }
}
```

## 6. Servicio de Geocoding

```typescript
// services/geocoding.service.ts
interface GeocodeResult {
  lat: number
  lng: number
  address: string
  city?: string
  country?: string
}

export class GeocodingService {
  private apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  async geocode(address: string): Promise<GeocodeResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results?.[0]) {
        const result = data.results[0]
        const location = result.geometry.location
        
        return {
          lat: location.lat,
          lng: location.lng,
          address: result.formatted_address,
          city: this.extractCity(result.address_components),
          country: this.extractCountry(result.address_components),
        }
      }

      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.results?.[0]) {
        return data.results[0].formatted_address
      }

      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  private extractCity(components: any[]): string | undefined {
    const city = components.find((c) =>
      c.types.includes('locality') || c.types.includes('administrative_area_level_2')
    )
    return city?.long_name
  }

  private extractCountry(components: any[]): string | undefined {
    const country = components.find((c) => c.types.includes('country'))
    return country?.long_name
  }
}

export const geocodingService = new GeocodingService()
```

## 7. API Route para Ubicación

```typescript
// app/api/location/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geocodingService } from '@/services/geocoding.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, latitude, longitude, address } = body

    const supabase = createClient()

    // Guardar ubicación en la base de datos
    const { data, error } = await supabase
      .from('user_locations')
      .insert({
        user_id: userId,
        latitude,
        longitude,
        address,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error saving location' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const supabase = createClient()

    // Obtener última ubicación del usuario
    const { data, error } = await supabase
      .from('user_locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching location' }, { status: 500 })
  }
}
```

## 8. Página de Mapa para Usuarios

```typescript
// app/(dashboard)/user/map/page.tsx
import { UserMap } from '@/components/map/UserMap'

export default function UserMapPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <UserMap />
    </div>
  )
}
```

## 9. Página de Mapa para Admin

```typescript
// app/(dashboard)/admin/emergencies/map/page.tsx
import { EmergencyMap } from '@/components/map/EmergencyMap'

export default function AdminMapPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <EmergencyMap onUserSelect={(user) => console.log('Selected:', user)} />
    </div>
  )
}
```

## 10. Configuración de Estilos del Mapa

```typescript
// lib/maps/config.ts
export const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
]

export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: mapStyles,
}
```

## 11. Consideraciones de Costos

### 11.1 Precios Estimados (Google Maps Free Tier)

- **Crédito mensual:** $200 USD
- **Maps JavaScript API:** ~$7 por 1,000 cargas
- **Geocoding API:** ~$5 por 1,000 requests
- **Estimación para 1,000 usuarios activos:**
  - 10 cargas de mapa por usuario/mes = 10,000 cargas = ~$70
  - 5 geocodings por usuario/mes = 5,000 requests = ~$25
  - **Total:** ~$95/mes (dentro del free tier)

### 11.2 Optimización de Costos

- **Caching:** Guardar resultados de geocoding en base de datos
- **Debouncing:** Limitar requests de geocoding
- **Lazy loading:** Cargar mapa solo cuando sea necesario
- **Limitar zoom:** Reducir cantidad de tiles cargados

## 12. Consideraciones de Privacidad

### 12.1 Permisos de Ubicación

- Solicitar permiso explícito del usuario
- Explicar por qué se necesita la ubicación
- Permitir revocar el permiso en cualquier momento
- No compartir ubicación sin consentimiento

### 12.2 Almacenamiento de Ubicación

- Guardar solo ubicaciones necesarias
- Eliminar ubicaciones antiguas (30 días)
- Encriptar datos de ubicación sensibles
- Restringir acceso a ubicaciones

### 12.3 Visualización en Mapa

- No mostrar ubicaciones de otros usuarios sin permiso
- Permitir ocultar ubicación del mapa
- Usar marcadores genéricos (no fotos de perfil)
- Limitar precisión de ubicación mostrada

## 13. Testing

### 13.1 Tests Unitarios

```typescript
// __tests__/hooks/useLocation.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocation } from '@/hooks/useLocation'

describe('useLocation', () => {
  it('should get current location', async () => {
    const { result } = renderHook(() => useLocation())
    
    await act(async () => {
      result.current.getCurrentLocation()
    })
    
    expect(result.current.location).not.toBeNull()
  })
})
```

### 13.2 Tests de Integración

```typescript
// __tests__/components/map/GoogleMap.test.tsx
import { render, screen } from '@testing-library/react'
import { GoogleMap } from '@/components/map/GoogleMap'

describe('GoogleMap', () => {
  it('should render map with markers', () => {
    const markers = [
      {
        id: '1',
        position: { lat: 5.830, lng: -73.547 },
        title: 'Test Marker',
      },
    ]
    
    render(<GoogleMap markers={markers} />)
    
    // Verificar que el mapa se renderiza
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

## 14. Troubleshooting

### 14.1 Problemas Comunes

**Error: "RefererNotAllowedMapError"**
- Solución: Agregar dominio a restricciones de API Key en Google Cloud Console

**Error: "ApiNotActivatedMapError"**
- Solución: Habilitar Maps JavaScript API en Google Cloud Console

**Ubicación no se actualiza**
- Solución: Verificar permisos del navegador
- Solución: Usar HTTPS (requerido para geolocalización)

**Mapa no se carga**
- Solución: Verificar que API Key sea válida
- Solución: Verificar conexión a internet

### 14.2 Debug Mode

```typescript
// Para debug, agregar logging
const handleMapClick = (e: google.maps.MapMouseEvent) => {
  console.log('Map clicked:', e.latLng?.lat(), e.latLng?.lng())
  // ...
}
```

## 15. Recursos Adicionales

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api Documentation](https://react-google-maps-api-docs.vercel.app/)
- [Google Maps Pricing](https://developers.google.com/maps/pricing)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
