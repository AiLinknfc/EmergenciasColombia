'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Contact } from '@/lib/types/contact'
import { isGoogleMapsConfigured, loadGoogleMapsScript } from '@/lib/utils/maps'

// Declaración de tipo para window.google
declare global {
  interface Window {
    google: any
  }
}

interface EmergencyMapProps {
  contacts: Contact[]
  onContactClick?: (contact: Contact) => void
  className?: string
}

export function EmergencyMap({ contacts, onContactClick, className = '' }: EmergencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Coordenadas de Colombia
  const COLOMBIA_CENTER = { lat: 4.5709, lng: -74.2973 }

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: COLOMBIA_CENTER,
        zoom: 5,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Agregar marcadores para cada contacto
      contacts.forEach((contact, index) => {
        // Simular ubicaciones diferentes para cada contacto en Colombia
        const latOffset = (index % 3 - 1) * 2
        const lngOffset = (Math.floor(index / 3) - 1) * 2
        
        const marker = new window.google.maps.Marker({
          position: {
            lat: COLOMBIA_CENTER.lat + latOffset,
            lng: COLOMBIA_CENTER.lng + lngOffset
          },
          map,
          title: contact.organization,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: contact.color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${contact.organization}</h3>
              <p style="margin: 0; color: #666;">${contact.service_type}</p>
              ${contact.phones?.map(phone => `
                <div style="margin-top: 8px;">
                  <a href="${phone.phone_type === 'whatsapp' ? `https://wa.me/${phone.phone_number.replace(/\s/g, '')}` : `tel:${phone.phone_number}`}" 
                     style="color: #2563eb; text-decoration: none;"
                     target="_blank">
                    ${phone.phone_type === 'whatsapp' ? '📱 WhatsApp' : '📞 Llamar'}: ${phone.phone_number}
                  </a>
                </div>
              `).join('') || ''}
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
          onContactClick?.(contact)
        })
      })
    } catch (err) {
      console.error('Error al inicializar el mapa:', err)
      setError('Error al cargar el mapa')
    }
  }, [contacts, onContactClick]) // COLOMBIA_CENTER is local const inside component, could be moved outside or omitted

  useEffect(() => {
    if (!isGoogleMapsConfigured()) {
      // Avoid calling setState in effect directly if it causes render issues, but here it is fine if it only happens once.
      // Actually to fix 'set-state-in-effect', we can just let the render handle the missing key.
      return
    }

    let isMounted = true;
    loadGoogleMapsScript(() => {
      if (isMounted) {
        setMapLoaded(true)
        initMap()
      }
    })

    return () => { isMounted = false; }
  }, [initMap])

  if (!isGoogleMapsConfigured()) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-gray-600">Google Maps no configurado</p>
          <p className="text-sm text-gray-500 mt-2">Agrega NEXT_PUBLIC_GOOGLE_MAPS_API_KEY a .env.local</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}
