export interface User {
  id: string
  email: string
  full_name: string
  role: 'user' | 'business'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserEmergencyData {
  id: string
  user_id: string
  address: string
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'No especificado'
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship?: string
  eps: string
  medical_conditions?: string
  allergies?: string
  created_at: string
  updated_at: string
}

export interface UserWithEmergencyData extends User {
  emergency_data?: UserEmergencyData
}
