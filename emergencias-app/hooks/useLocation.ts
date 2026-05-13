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
