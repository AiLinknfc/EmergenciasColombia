import { Contact } from '@/lib/types/contact'

// Servicio de contactos - versión con datos mock
// Cuando Supabase esté configurado, reemplazar con llamadas reales a la API

export class ContactService {
  private static mockContacts: Contact[] = [
    {
      id: '1',
      organization: 'Policía Nacional',
      service_type: 'Police Services',
      icon: 'star',
      color: '#1976D2',
      order_index: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      phones: [
        { id: '1', contact_id: '1', phone_number: '123', phone_type: 'call', created_at: new Date().toISOString() },
        { id: '2', contact_id: '1', phone_number: '314 317 6387', phone_type: 'call', created_at: new Date().toISOString() },
      ],
    },
    {
      id: '2',
      organization: 'Bomberos Colombia',
      service_type: 'Fire & Rescue',
      icon: 'flame',
      color: '#F57C00',
      order_index: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      phones: [
        { id: '3', contact_id: '2', phone_number: '119', phone_type: 'call', created_at: new Date().toISOString() },
        { id: '4', contact_id: '2', phone_number: '760 2749', phone_type: 'call', created_at: new Date().toISOString() },
      ],
    },
    {
      id: '3',
      organization: 'Ambulancia',
      service_type: 'Medical Emergency',
      icon: 'ambulance',
      color: '#388E3C',
      order_index: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
      phones: [
        { id: '5', contact_id: '3', phone_number: '125', phone_type: 'call', created_at: new Date().toISOString() },
        { id: '6', contact_id: '3', phone_number: '760 6760', phone_type: 'call', created_at: new Date().toISOString() },
      ],
    },
    {
      id: '4',
      organization: 'Defensa Civil',
      service_type: 'Fire & Rescue',
      icon: 'shield',
      color: '#F57C00',
      order_index: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=150&q=80',
      phones: [
        { id: '7', contact_id: '4', phone_number: '126', phone_type: 'call', created_at: new Date().toISOString() },
        { id: '8', contact_id: '4', phone_number: '760 2766', phone_type: 'call', created_at: new Date().toISOString() },
      ],
    },
    {
      id: '5',
      organization: 'Asotraind Taxis',
      service_type: 'Other',
      icon: 'car',
      color: '#607D8B',
      order_index: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phones: [
        { id: '9', contact_id: '5', phone_number: '310 695 1743', phone_type: 'call', created_at: new Date().toISOString() },
        { id: '10', contact_id: '5', phone_number: '310 695 1743', phone_type: 'whatsapp', created_at: new Date().toISOString() },
      ],
    },
  ]

  static async getAll(): Promise<Contact[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.mockContacts]
  }

  static async getById(id: string): Promise<Contact | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockContacts.find(c => c.id === id) || null
  }

  static async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.mockContacts.push(newContact)
    return newContact
  }

  static async update(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.mockContacts.findIndex(c => c.id === id)
    if (index === -1) return null
    
    this.mockContacts[index] = {
      ...this.mockContacts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return this.mockContacts[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.mockContacts.findIndex(c => c.id === id)
    if (index === -1) return false
    
    this.mockContacts.splice(index, 1)
    return true
  }

  static async reorder(contacts: Contact[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    this.mockContacts.sort((a, b) => a.order_index - b.order_index)
  }
}

export const contactService = ContactService
