export interface Contact {
  id: string
  organization: string
  service_type: string
  icon: string
  color: string
  order_index: number
  created_by?: string
  created_at: string
  updated_at: string
  image_url?: string
  phones: ContactPhone[]
}

export interface ContactPhone {
  id: string
  contact_id: string
  phone_number: string
  phone_type: 'call' | 'whatsapp'
  created_at: string
}
