'use client'

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Stethoscope, 
  Plus,
  AlertTriangle,
  Grid
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/hooks/useAuth';
import { ContactCard } from '@/components/contacts/ContactCard';
import { ContactForm } from '@/components/contacts/ContactForm';
import { Contact } from '@/lib/types/contact';
import { translations } from '@/lib/translations';

interface DirectoryViewProps {
  lang?: 'es' | 'en';
}

export function DirectoryView({ lang = 'es' }: DirectoryViewProps) {
  const { contacts, loading, error, updateContact, deleteContact, createContact } = useContacts();
  const { user } = useAuth();
  const isAdmin = user?.role === 'business';
  const t = translations[lang];
  
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const categories = Array.from(new Set(localContacts.map(c => c.service_type || 'Otros')));

  const getIcon = (type: string) => {
    const tr = type.toLowerCase();
    if (tr.includes('police') || tr.includes('policía')) return <ShieldCheck className="w-5 h-5" />;
    if (tr.includes('fire') || tr.includes('bomberos')) return <Flame className="w-5 h-5" />;
    if (tr.includes('medical') || tr.includes('salud')) return <Stethoscope className="w-5 h-5" />;
    return <Grid className="w-5 h-5" />;
  };

  const getColor = (type: string) => {
    const tr = type.toLowerCase();
    if (tr.includes('police') || tr.includes('policía')) return '#1976D2';
    if (tr.includes('fire') || tr.includes('bomberos')) return '#F57C00';
    if (tr.includes('medical') || tr.includes('salud')) return '#388E3C';
    return '#607D8B';
  };

  const handleSave = async (data: any) => {
    try {
      const payload = {
        ...data,
        icon: data.icon || 'shield',
        order_index: data.order_index ?? localContacts.length,
        created_by: user?.id
      };

      if (editingContact) {
        await updateContact(editingContact.id, payload);
      } else {
        await createContact(payload);
      }
      setIsFormOpen(false);
      setEditingContact(null);
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    }
  };

  const handleReorder = (newOrder: Contact[], category: string) => {
    const otherContacts = localContacts.filter(c => (c.service_type || 'Otros') !== category);
    setLocalContacts([...otherContacts, ...newOrder]);
  };

  if (loading && localContacts.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      <p className="mt-4 text-on-surface-variant font-black uppercase tracking-widest text-[10px]">{t.syncing}</p>
    </div>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-[1600px] mx-auto pb-20 px-4 relative"
    >
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <ContactForm
              initialData={editingContact || {}}
              onSave={handleSave}
              onCancel={() => { setIsFormOpen(false); setEditingContact(null); }}
            />
          </div>
        )}
      </AnimatePresence>

      {isAdmin && (
        <div className="flex justify-end sticky top-0 z-20 pt-2 pb-4 bg-surface">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all border-b-4 border-black/20"
          >
            <Plus className="w-5 h-5" />
            {t.add_new}
          </button>
        </div>
      )}

      {/* Categorías en columnas: cada categoría ocupa su propia celda en el grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start mt-4">
        {categories.map((cat) => {
          const catContacts = localContacts.filter(c => (c.service_type || 'Otros') === cat);
          const color = getColor(cat);

          return (
            <section key={cat} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
                <div style={{ color }} className="p-1.5 bg-surface-container-low rounded-xl shadow-sm shrink-0">
                  {getIcon(cat)}
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] truncate" style={{ color }}>{cat}</h3>
                <span className="text-[9px] font-black text-on-surface-variant/40 ml-auto uppercase tracking-widest shrink-0">
                  {catContacts.length}u
                </span>
              </div>

              {isAdmin ? (
                <Reorder.Group
                  axis="y"
                  values={catContacts}
                  onReorder={(newOrder) => handleReorder(newOrder, cat)}
                  className="space-y-4"
                >
                  {catContacts.map((contact) => (
                    <Reorder.Item key={contact.id} value={contact}>
                      <ContactCard
                        contact={contact}
                        isAdmin={true}
                        onEdit={(c) => { setEditingContact(c); setIsFormOpen(true); }}
                        onDelete={(id) => { if(confirm(t.confirm_delete)) deleteContact(id); }}
                      />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <div className="space-y-4">
                  {catContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} isAdmin={false} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {localContacts.length === 0 && !loading && (
        <div className="text-center py-32 bg-surface-container-low rounded-3xl border-4 border-dashed border-outline-variant">
          <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4 opacity-20" />
          <p className="text-on-surface-variant font-black uppercase tracking-tighter text-xl opacity-40">{t.no_contacts}</p>
        </div>
      )}
    </motion.div>
  );
}
