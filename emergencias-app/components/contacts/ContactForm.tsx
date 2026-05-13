'use client'

import React, { useState } from 'react';
import { X, Plus, Trash2, Phone, MessageCircle, Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Contact } from '@/lib/types/contact';
import { Button } from '@/components/ui/button';

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSave: (data: Partial<Contact>) => void;
  onCancel: () => void;
}

export function ContactForm({ initialData, onSave, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    organization: initialData?.organization || '',
    service_type: initialData?.service_type || 'Police Services',
    color: initialData?.color || '#af101a',
    image_url: initialData?.image_url || '',
    phones: initialData?.phones || [
      { id: 'temp-1', phone_number: '', phone_type: 'call' }
    ] as any[]
  });

  const handleAddPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, { id: `temp-${Date.now()}`, phone_number: '', phone_type: 'call' }]
    });
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = [...formData.phones];
    newPhones.splice(index, 1);
    setFormData({ ...formData, phones: newPhones });
  };

  const handlePhoneChange = (index: number, field: string, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = { ...newPhones[index], [field]: value };
    setFormData({ ...formData, phones: newPhones });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.image_url && formData.image_url.startsWith('data:image')) {
      alert('Por favor, ingresa una URL de imagen válida (ej. https://...), no una imagen pegada (Base64), ya que es demasiado grande para guardar.');
      return;
    }
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden z-[110]"
    >
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
           <div className="w-2 h-8 bg-primary rounded-full" />
           <h2 className="text-xl font-black uppercase tracking-tight text-on-surface">
            {initialData?.id ? 'Configurar Unidad' : 'Nueva Unidad Operativa'}
          </h2>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-surface">
        {/* Section 1: Identity */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Identidad Visual</span>
            <div className="h-px flex-1 bg-outline-variant/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Nombre de la Institución</label>
              <input 
                required
                type="text" 
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Ej. Bomberos Estación Central"
                className="w-full h-14 px-4 rounded-xl bg-surface-container-low border border-outline-variant font-bold text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Categoría Operativa</label>
              <select 
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full h-14 px-4 rounded-xl bg-surface-container-low border border-outline-variant font-bold text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
              >
                <option value="Police Services">Policía</option>
                <option value="Fire & Rescue">Bomberos / Rescate</option>
                <option value="Medical Emergency">Salud / Médico</option>
                <option value="Other">Otro Servicio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">URL del Escudo/Logo</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input 
                  type="url" 
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-surface-container-low border border-outline-variant font-bold text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Color de Referencia</label>
              <div className="flex gap-4 items-center h-14 px-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <input 
                  type="color" 
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono font-black uppercase tracking-tighter">{formData.color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Communication */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Líneas de Respuesta</span>
            <button 
              type="button" 
              onClick={handleAddPhone}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-primary/20 transition-all"
            >
              <Plus className="w-3 h-3" /> Añadir Nueva Línea
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.phones.map((phone, index) => (
              <div key={phone.id || index} className="flex gap-3 items-center p-3 bg-surface-container-low/30 border border-outline-variant/30 rounded-2xl animate-in fade-in slide-in-from-right-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <select 
                      value={phone.phone_type}
                      onChange={(e) => handlePhoneChange(index, 'phone_type', e.target.value)}
                      className="w-full h-12 px-3 rounded-xl bg-surface-container-low border border-outline-variant font-black text-[10px] uppercase tracking-widest outline-none focus:border-primary transition-all"
                    >
                      <option value="call">📞 Llamada Voz</option>
                      <option value="whatsapp">💬 WhatsApp</option>
                    </select>
                  </div>
                  <div className="sm:col-span-8">
                    <input 
                      required
                      type="text" 
                      value={phone.phone_number}
                      onChange={(e) => handlePhoneChange(index, 'phone_number', e.target.value)}
                      placeholder="Número de contacto"
                      className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant font-black text-sm tracking-tighter outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                {formData.phones.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemovePhone(index)}
                    className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </form>

      <div className="p-6 md:p-8 border-t border-outline-variant bg-surface-container-low/50 backdrop-blur-sm flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          CANCELAR
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-[2] bg-primary text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          GUARDAR UNIDAD
        </Button>
      </div>
    </motion.div>
  );
}
