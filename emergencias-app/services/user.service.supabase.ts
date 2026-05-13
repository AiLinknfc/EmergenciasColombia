import { supabase } from '@/lib/supabase/client'
import { User, UserWithEmergencyData, UserEmergencyData } from '@/lib/types/user'

// Servicio de usuarios - versión con Supabase
export class UserServiceSupabase {
  static async getAll(): Promise<UserWithEmergencyData[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        emergency_data:user_emergency_data(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getById(id: string): Promise<UserWithEmergencyData | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        emergency_data:user_emergency_data(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  }

  static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
      })
      .eq('id', id)

    if (error) throw error
    return this.getById(id)
  }

  static async createEmergencyData(data: Omit<UserEmergencyData, 'id' | 'created_at' | 'updated_at'>): Promise<UserEmergencyData> {
    const { data: emergencyData, error } = await supabase
      .from('user_emergency_data')
      .insert({
        user_id: data.user_id,
        address: data.address,
        blood_type: data.blood_type,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        emergency_contact_relationship: data.emergency_contact_relationship,
        eps: data.eps,
        medical_conditions: data.medical_conditions,
        allergies: data.allergies,
      })
      .select()
      .single()

    if (error) throw error
    return emergencyData
  }

  static async updateEmergencyData(id: string, updates: Partial<UserEmergencyData>): Promise<UserEmergencyData | null> {
    const { error } = await supabase
      .from('user_emergency_data')
      .update({
        address: updates.address,
        blood_type: updates.blood_type,
        emergency_contact_name: updates.emergency_contact_name,
        emergency_contact_phone: updates.emergency_contact_phone,
        emergency_contact_relationship: updates.emergency_contact_relationship,
        eps: updates.eps,
        medical_conditions: updates.medical_conditions,
        allergies: updates.allergies,
      })
      .eq('id', id)

    if (error) throw error

    const { data } = await supabase
      .from('user_emergency_data')
      .select('*')
      .eq('id', id)
      .single()

    return data
  }
}

export const userServiceSupabase = UserServiceSupabase
