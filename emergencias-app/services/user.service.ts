import { User, UserWithEmergencyData, UserEmergencyData } from '@/lib/types/user'

// Servicio de usuarios - versión con datos mock
// Cuando Supabase esté configurado, reemplazar con llamadas reales a la API

export class UserService {
  private static mockUsers: UserWithEmergencyData[] = [
    {
      id: '1',
      email: 'juan@example.com',
      full_name: 'Juan Pérez',
      role: 'user',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      emergency_data: {
        id: '1',
        user_id: '1',
        address: 'Calle 123 #45-67, Colombia',
        blood_type: 'O+',
        emergency_contact_name: 'María Pérez',
        emergency_contact_phone: '310 123 4567',
        emergency_contact_relationship: 'Esposa',
        eps: 'EPS Sanitas',
        medical_conditions: 'Hipertensión',
        allergies: 'Penicilina',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    {
      id: '2',
      email: 'maria@example.com',
      full_name: 'María González',
      role: 'user',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      emergency_data: {
        id: '2',
        user_id: '2',
        address: 'Carrera 45 #67-89, Colombia',
        blood_type: 'A+',
        emergency_contact_name: 'Carlos González',
        emergency_contact_phone: '320 987 6543',
        emergency_contact_relationship: 'Hermano',
        eps: 'Sura EPS',
        medical_conditions: '',
        allergies: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  ]

  static async getAll(): Promise<UserWithEmergencyData[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.mockUsers]
  }

  static async getById(id: string): Promise<UserWithEmergencyData | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockUsers.find(u => u.id === id) || null
  }

  static async getByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockUsers.find(u => u.email === email) || null
  }

  static async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.mockUsers.push({
      ...newUser,
      emergency_data: undefined,
    })
    return newUser
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.mockUsers.findIndex(u => u.id === id)
    if (index === -1) return null
    
    this.mockUsers[index] = {
      ...this.mockUsers[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return this.mockUsers[index]
  }

  static async createEmergencyData(data: Omit<UserEmergencyData, 'id' | 'created_at' | 'updated_at'>): Promise<UserEmergencyData> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newEmergencyData: UserEmergencyData = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    const userIndex = this.mockUsers.findIndex(u => u.id === data.user_id)
    if (userIndex !== -1) {
      this.mockUsers[userIndex].emergency_data = newEmergencyData
    }
    
    return newEmergencyData
  }

  static async updateEmergencyData(id: string, updates: Partial<UserEmergencyData>): Promise<UserEmergencyData | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = this.mockUsers.find(u => u.emergency_data?.id === id)
    if (!user || !user.emergency_data) return null
    
    user.emergency_data = {
      ...user.emergency_data,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    
    return user.emergency_data
  }
}

export const userService = UserService
