'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types/user'
import { authService } from '@/services/auth.service'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Obtener usuario actual al montar
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string, role: 'user' | 'business') => {
    try {
      setActionLoading(true)
      setError(null)
      const result = await authService.signUp(email, password, fullName, role)
      
      if (result.error) {
        setError(result.error)
        return false
      }
      
      setUser(result.user)
      setError(null)
      return true
    } catch (err: any) {
      setError(err.message || 'Error al registrar')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setActionLoading(true)
      setError(null)
      const result = await authService.signIn(email, password)
      
      if (result.error) {
        setError(result.error)
        return false
      }
      
      setUser(result.user)
      return true
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setActionLoading(true)
      setError(null)
      const result = await authService.signOut()
      
      if (result.error) {
        setError(result.error)
        return false
      }
      
      setUser(null)
      return true
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return false
    
    try {
      setActionLoading(true)
      setError(null)
      const result = await authService.updateProfile(user.id, updates)
      
      if (result.error) {
        setError(result.error)
        return false
      }
      
      setUser({ ...user, ...updates })
      return true
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return {
    user,
    loading,
    actionLoading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
}
