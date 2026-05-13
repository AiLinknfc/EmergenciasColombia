import { supabase } from '../lib/supabase/client';
import { User } from '../lib/types/user';

export interface AuthResponse {
  user: User | null
  error: string | null
}

export class AuthService {
  static async signUp(email: string, password: string, fullName: string, role: 'user' | 'business'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          return {
            user: null,
            error: 'Este correo electrónico ya está registrado. Por favor inicia sesión.',
          }
        }
        throw error
      }

      if (data.user) {
        try {
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              role: role,
            })
        } catch (profileErr) {
          // Profile might already exist due to trigger
        }
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          role: role,
          avatar_url: '',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        } : null,
        error: null,
      }
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'Error al registrar usuario',
      }
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return {
            user: null,
            error: 'Credenciales inválidas. Verifica tu correo y contraseña.',
          }
        }
        throw error
      }

      let profile = null
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        profile = profileData;
      }

      return {
        user: profile ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          avatar_url: profile.avatar_url || '',
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        } : null,
        error: null,
      }
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'Error al iniciar sesión.',
      }
    }
  }

  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message || 'Error al cerrar sesión' }
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      // Check session first to avoid noisy AuthSessionMissingError
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) return null

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url || '',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    } catch (error) {
      // Return null silently for session issues
      return null
    }
  }

  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error: error.message || 'Error al actualizar perfil' }
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            callback({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              avatar_url: profile.avatar_url || '',
              created_at: profile.created_at,
              updated_at: profile.updated_at,
            })
          } else {
            callback(null)
          }
        } catch (error) {
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  }
}

export const authService = AuthService
