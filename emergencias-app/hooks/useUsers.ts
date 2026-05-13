'use client'

import { useState, useEffect } from 'react'
import { UserWithEmergencyData } from '@/lib/types/user'
import { userServiceSupabase } from '@/services/user.service.supabase'

export function useUsers() {
  const [users, setUsers] = useState<UserWithEmergencyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userServiceSupabase.getAll()
      setUsers(data)
    } catch (err) {
      setError('Error al cargar usuarios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const createUser = async (user: Omit<UserWithEmergencyData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newUser = await userServiceSupabase.create(user)
      setUsers([...users, { ...newUser, emergency_data: user.emergency_data }])
      return newUser
    } catch (err) {
      setError('Error al crear usuario')
      console.error(err)
      throw err
    }
  }

  const updateUser = async (id: string, updates: Partial<UserWithEmergencyData>) => {
    try {
      const updated = await userServiceSupabase.update(id, updates)
      if (updated) {
        setUsers(users.map(u => u.id === id ? { ...u, ...updated } : u))
      }
      return updated
    } catch (err) {
      setError('Error al actualizar usuario')
      console.error(err)
      throw err
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
  }
}
