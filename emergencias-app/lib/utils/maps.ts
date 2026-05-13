// Verificar si Google Maps API key está configurada
export const isGoogleMapsConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}

// Obtener la API key
export const getGoogleMapsApiKey = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
}

// Cargar Google Maps Script dinámicamente con cola de callbacks para evitar sobreescritura
export const loadGoogleMapsScript = (callback: () => void): void => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key no configurada')
    return
  }

  // Ya está completamente cargado
  if ((window as any).google?.maps) {
    callback()
    return
  }

  // El script ya existe (está cargando) — encolar el callback
  const existingScript = document.getElementById('google-maps-script')
  if (existingScript) {
    ;(window as any)._gmapsCallbacks = [...((window as any)._gmapsCallbacks || []), callback]
    return
  }

  // Primera carga: inicializar la cola y el handler global
  ;(window as any)._gmapsCallbacks = [callback]
  ;(window as any).onGoogleMapsLoaded = () => {
    const queue: (() => void)[] = (window as any)._gmapsCallbacks || []
    ;(window as any)._gmapsCallbacks = []
    queue.forEach(cb => cb())
  }

  const script = document.createElement('script')
  script.id = 'google-maps-script'
  script.src = `https://maps.googleapis.com/maps/api/js?key=${getGoogleMapsApiKey()}&libraries=places&callback=onGoogleMapsLoaded`
  script.async = true
  script.defer = true

  document.head.appendChild(script)
}

// Geocoding: Convertir dirección a coordenadas
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key no configurada')
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${getGoogleMapsApiKey()}`
    )
    const data = await response.json()
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return { lat: location.lat, lng: location.lng }
    }
    
    return null
  } catch (error) {
    console.error('Error en geocoding:', error)
    return null
  }
}

// Reverse Geocoding: Convertir coordenadas a dirección
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key no configurada')
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${getGoogleMapsApiKey()}`
    )
    const data = await response.json()
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address
    }
    
    return null
  } catch (error) {
    console.error('Error en reverse geocoding:', error)
    return null
  }
}
