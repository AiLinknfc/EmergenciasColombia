'use client'

import React, { useState } from 'react';
import { Phone, MessageCircle, ChevronRight, ArrowLeft, Info, Edit, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact } from '@/lib/types/contact';

interface ContactCardProps {
  contact: Contact;
  isAdmin?: boolean;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

export function ContactCard({ contact, isAdmin, onEdit, onDelete }: ContactCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-[200px] w-full perspective-1000 group">
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Admin Controls Overlay */}
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit?.(contact); }}
                  className="p-1.5 bg-surface-container-high rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-on-surface-variant"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete?.(contact.id); }}
                  className="p-1.5 bg-surface-container-high rounded-md hover:bg-error/10 hover:text-error transition-colors text-on-surface-variant"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-1.5 cursor-grab active:cursor-grabbing text-on-surface-variant">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            <div
              className="p-4 flex gap-3 flex-1 min-w-0 cursor-pointer"
              onClick={() => setIsFlipped(true)}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high shrink-0 border border-outline-variant/30">
                {contact.image_url ? (
                  <img 
                    src={contact.image_url} 
                    alt={contact.organization} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                     <Info className="w-6 h-6 opacity-20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 
                  className="font-black text-sm leading-tight truncate uppercase tracking-tighter mb-1"
                  style={{ color: contact.color || 'var(--color-primary)' }}
                >
                  {contact.organization}
                </h4>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{contact.service_type}</p>
                
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {contact.phones?.slice(0, 3).map((phone, i) => (
                    <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 bg-surface-container-low rounded border border-outline-variant/20">
                      {phone.phone_type === 'whatsapp' ? <MessageCircle className="w-2.5 h-2.5 text-green-600" /> : <Phone className="w-2.5 h-2.5 text-primary" />}
                      <span className="text-[9px] font-black font-mono tracking-tighter opacity-80">{phone.phone_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFlipped(true)}
              style={{ backgroundColor: contact.color || '#af101a' }}
              className="w-full py-3 flex items-center justify-center gap-2 text-white font-black text-[10px] hover:brightness-110 transition-all uppercase tracking-[0.2em]"
            >
              <Phone className="w-3 h-3 fill-current" />
              CONECTAR
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-surface-container-low border border-primary/10 rounded-xl overflow-hidden flex flex-col shadow-xl"
          >
            <div className="p-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
               <button 
                onClick={() => setIsFlipped(false)}
                className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors text-primary"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Líneas Activas</span>
              <div className="w-7" />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {contact.phones?.map((phone, i) => (
                <a 
                  key={i}
                  href={phone.phone_type === 'whatsapp' 
                    ? `https://wa.me/57${phone.phone_number.replace(/\s/g, '')}` 
                    : `tel:${phone.phone_number.replace(/\s/g, '')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${phone.phone_type === 'whatsapp' ? 'text-green-600' : 'text-primary'}`}>
                      {phone.phone_type === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[11px] font-black font-mono tracking-tighter text-on-surface">{phone.phone_number}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-outline-variant group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
