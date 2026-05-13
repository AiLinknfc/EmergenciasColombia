'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SOSAlert {
  id: string
  timestamp: string
  transcript: string
  locationLabel: string
  location: { lat: number; lng: number } | null
  status: 'active' | 'closed'
  read: boolean
}

const STORAGE_KEY = 'sos_alerts_v1'

export function useSOSAlerts() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setAlerts(JSON.parse(stored))
    } catch {}
  }, [])

  const persist = (next: SOSAlert[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 100)))
    return next
  }

  const addAlert = useCallback((alert: SOSAlert) => {
    setAlerts(prev => persist([alert, ...prev]))
  }, [])

  const markAllRead = useCallback(() => {
    setAlerts(prev => persist(prev.map(a => ({ ...a, read: true }))))
  }, [])

  const closeAlert = useCallback((id: string) => {
    setAlerts(prev => persist(prev.map(a => a.id === id ? { ...a, status: 'closed' as const } : a)))
  }, [])

  const unreadCount = alerts.filter(a => !a.read).length

  // Alertas enviadas en las últimas 4 horas = activas
  const cutoff = Date.now() - 4 * 60 * 60 * 1000
  const activeAlerts = alerts.filter(a => a.status === 'active' && new Date(a.timestamp).getTime() > cutoff)
  const closedAlerts = alerts.filter(a => a.status === 'closed' || new Date(a.timestamp).getTime() <= cutoff)

  return { alerts, activeAlerts, closedAlerts, addAlert, markAllRead, closeAlert, unreadCount }
}
