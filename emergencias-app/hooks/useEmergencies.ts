'use client'

import { useState, useEffect } from 'react'
import { Emergency } from '@/services/emergency.service'
import { emergencyService } from '@/services/emergency.service'

export function useEmergencies() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmergencies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await emergencyService.getAll()
      setEmergencies(data)
    } catch (err) {
      setError('Error al cargar emergencias')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmergencies()
  }, [])

  const fetchActiveEmergencies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await emergencyService.getActiveEmergencies()
      setEmergencies(data)
    } catch (err) {
      setError('Error al cargar emergencias activas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createEmergency = async (emergency: Omit<Emergency, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newEmergency = await emergencyService.create(emergency)
      setEmergencies([newEmergency, ...emergencies])
      return newEmergency
    } catch (err) {
      setError('Error al crear emergencia')
      console.error(err)
      throw err
    }
  }

  const updateEmergency = async (id: string, updates: Partial<Emergency>) => {
    try {
      const updated = await emergencyService.update(id, updates)
      if (updated) {
        setEmergencies(emergencies.map(e => e.id === id ? updated : e))
      }
      return updated
    } catch (err) {
      setError('Error al actualizar emergencia')
      console.error(err)
      throw err
    }
  }

  const updateEmergencyStatus = async (id: string, status: Emergency['status']) => {
    try {
      const updated = await emergencyService.updateStatus(id, status)
      if (updated) {
        setEmergencies(emergencies.map(e => e.id === id ? updated : e))
      }
      return updated
    } catch (err) {
      setError('Error al actualizar estado de emergencia')
      console.error(err)
      throw err
    }
  }

  const deleteEmergency = async (id: string) => {
    try {
      await emergencyService.delete(id)
      setEmergencies(emergencies.filter(e => e.id !== id))
    } catch (err) {
      setError('Error al eliminar emergencia')
      console.error(err)
      throw err
    }
  }

  return {
    emergencies,
    loading,
    error,
    fetchEmergencies,
    fetchActiveEmergencies,
    createEmergency,
    updateEmergency,
    updateEmergencyStatus,
    deleteEmergency,
  }
}
