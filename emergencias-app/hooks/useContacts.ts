'use client'

import { useState, useEffect } from 'react'
import { Contact } from '@/lib/types/contact'
import { contactServiceSupabase } from '@/services/contact.service.supabase'
import { contactService } from '@/services/contact.service'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactServiceSupabase.getAll()
      setContacts(data)
    } catch (err) {
      console.log('Error al cargar desde Supabase, usando datos mock:', err)
      // Fallback a datos mock si Supabase falla
      try {
        const mockData = await contactService.getAll()
        setContacts(mockData)
        setError(null)
      } catch (mockErr) {
        setError('Error al cargar contactos')
        console.error(mockErr)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContacts()
  }, [])

  const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newContact = await contactServiceSupabase.create(contact)
      setContacts(prev => [...prev, newContact])
      return newContact
    } catch (err) {
      setError('Error al crear contacto')
      console.error(err)
      throw err
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updated = await contactServiceSupabase.update(id, updates)
      if (updated) {
        setContacts(prev => prev.map(c => c.id === id ? updated : c))
      }
      return updated
    } catch (err) {
      setError('Error al actualizar contacto')
      console.error(err)
      throw err
    }
  }

  const deleteContact = async (id: string) => {
    try {
      await contactServiceSupabase.delete(id)
      setContacts(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError('Error al eliminar contacto')
      console.error(err)
      throw err
    }
  }

  const reorderContacts = async (newOrder: Contact[]) => {
    try {
      await contactServiceSupabase.reorder(newOrder)
      // For reorder, we might need a more complex update, but let's just use the passed newOrder and merge with others if needed, 
      // actually, let's just refetch or rely on the passed state. But since reorder is whole list or partial list...
      // Let's just fetch to be safe after reorder
      await fetchContacts()
    } catch (err) {
      setError('Error al reordenar contactos')
      console.error(err)
      throw err
    }
  }

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    reorderContacts,
  }
}
