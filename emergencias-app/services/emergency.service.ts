import { supabase } from '@/lib/supabase/client'

export interface Emergency {
  id?: string
  user_id?: string
  reporter_id?: string
  type: string
  description: string
  status: 'active' | 'in_progress' | 'resolved' | 'cancelled'
  location_lat?: number
  location_lng?: number
  location_address?: string
  assigned_to?: string
  resolved_at?: string
  created_at?: string
  updated_at?: string
}

export class EmergencyService {
  static async getAll(): Promise<Emergency[]> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getById(id: string): Promise<Emergency | null> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async getByUserId(userId: string): Promise<Emergency[]> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async create(emergency: Omit<Emergency, 'id' | 'created_at' | 'updated_at'>): Promise<Emergency> {
    const { data, error } = await supabase
      .from('emergencies')
      .insert(emergency)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async update(id: string, updates: Partial<Emergency>): Promise<Emergency | null> {
    const { data, error } = await supabase
      .from('emergencies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateStatus(id: string, status: Emergency['status']): Promise<Emergency | null> {
    const updates: Partial<Emergency> = { status }
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    }
    return this.update(id, updates)
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('emergencies')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async getActiveEmergencies(): Promise<Emergency[]> {
    const { data, error } = await supabase
      .from('emergencies')
      .select('*')
      .in('status', ['active', 'in_progress'])
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const emergencyService = EmergencyService
