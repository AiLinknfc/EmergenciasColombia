import { supabase } from '@/lib/supabase/client'
import { Contact } from '@/lib/types/contact'

// Servicio de contactos - versión con Supabase
export class ContactServiceSupabase {
  static async getAll(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        phones:contact_phones(*)
      `)
      .order('order_index')

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
    return data || []
  }

  static async getById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        phones:contact_phones(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
    return data
  }

  static async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    // 1. Insert the contact
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        organization: contact.organization,
        service_type: contact.service_type,
        icon: contact.icon || 'shield',
        color: contact.color || '#af101a',
        order_index: contact.order_index || 0,
        created_by: contact.created_by,
        image_url: contact.image_url,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error.message, error.details, error.hint, error);
      throw new Error(error.message || 'Error al crear contacto en la base de datos');
    }

    if (!data) throw new Error('No se pudo crear el contacto (Data is null)');

    // 2. Insert phones if any
    if (contact.phones && contact.phones.length > 0) {
      // Clean up phones before insert
      const validPhones = contact.phones.filter(p => p.phone_number && p.phone_number.trim() !== '');
      if (validPhones.length > 0) {
        const phonesToInsert = validPhones.map(phone => ({
          contact_id: data.id,
          phone_number: phone.phone_number.trim(),
          phone_type: phone.phone_type || 'call',
        }));

        const { error: phonesError } = await supabase
          .from('contact_phones')
          .insert(phonesToInsert);

        if (phonesError) {
          console.error('Error creating contact phones:', phonesError);
          // We might want to delete the contact here to avoid partial records, 
          // but for now we just log it.
          throw phonesError;
        }
      }
    }

    // 3. Return the complete contact with phones
    const completeContact = await this.getById(data.id);
    if (!completeContact) throw new Error('Error al recuperar el contacto creado');
    
    return completeContact;
  }

  static async update(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    const { error } = await supabase
      .from('contacts')
      .update({
        organization: updates.organization,
        service_type: updates.service_type,
        icon: updates.icon,
        color: updates.color,
        order_index: updates.order_index,
        image_url: updates.image_url,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating contact:', error.message, error.details, error.hint, error);
      throw new Error(error.message || 'Error al actualizar contacto en la base de datos');
    }

    // Update phones if provided in updates
    if (updates.phones) {
      // Simplistic approach: delete all and re-insert
      await supabase.from('contact_phones').delete().eq('contact_id', id);
      
      const validPhones = updates.phones.filter(p => p.phone_number && p.phone_number.trim() !== '');
      if (validPhones.length > 0) {
        const phonesToInsert = validPhones.map(phone => ({
          contact_id: id,
          phone_number: phone.phone_number.trim(),
          phone_type: phone.phone_type || 'call',
        }));

        await supabase.from('contact_phones').insert(phonesToInsert);
      }
    }

    return this.getById(id)
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
    return true
  }

  static async reorder(contacts: Contact[]): Promise<void> {
    const updates = contacts.map((contact, index) => ({
      id: contact.id,
      order_index: index,
    }))

    for (const update of updates) {
      const { error } = await supabase
        .from('contacts')
        .update({ order_index: update.order_index })
        .eq('id', update.id)

      if (error) console.error(`Error reordering contact ${update.id}:`, error);
    }
  }
}

export const contactServiceSupabase = ContactServiceSupabase
