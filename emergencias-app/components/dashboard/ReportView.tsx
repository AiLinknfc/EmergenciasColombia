'use client'

import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Map as MapIcon, 
  Plus, 
  Minus, 
  Send,
  Upload,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useEmergencies } from '@/hooks/useEmergencies';
import { useLocation } from '@/hooks/useLocation';
import { reverseGeocode } from '@/lib/utils/maps';
import { EmergencyMap } from '@/components/maps/EmergencyMap';
import { translations, Language } from '@/lib/translations';

interface ReportViewProps {
  onBack: () => void;
  lang?: Language;
}

const SUBCATEGORIES = {
  'médica': ['Paro Cardíaco / Dolor de Pecho', 'Trauma Grave / Sangrado', 'Dificultad Respiratoria', 'Inconsciente / Desmayo', 'Otro'],
  'incendio': ['Incendio Estructural', 'Incendio de Cobertura Vegetal', 'Incendio Vehicular', 'Fuga de Gas / Derrame Químico', 'Otro'],
  'policía': ['Robo en Proceso', 'Agresión / Riña', 'Actividad Sospechosa', 'Violencia Intrafamiliar', 'Otro'],
  'otra': ['Accidente de Tránsito', 'Rescate de Animales', 'Inundación / Deslizamiento', 'Otro']
};

export function ReportView({ onBack, lang = 'es' }: ReportViewProps) {
  const { user } = useAuth();
  const { createEmergency } = useEmergencies();
  const { location, error: locationError, getCurrentLocation } = useLocation();
  const t = translations[lang];
  
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'médica',
    subCategory: SUBCATEGORIES['médica'][0],
    description: '',
    injuredCount: 0,
    priority: 'Critical'
  });

  // Sync subcategory when type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      subCategory: SUBCATEGORIES[prev.type as keyof typeof SUBCATEGORIES][0]
    }));
  }, [formData.type]);

  // Auto-fetch location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleGetLocation = async () => {
    setLoading(true);
    await getCurrentLocation();
    setLoading(false);
  };

  useEffect(() => {
    if (location) {
      reverseGeocode(location.latitude, location.longitude).then(addr => {
        setAddress(addr || 'Ubicación obtenida');
      });
    }
  }, [location]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.description) {
      alert('Por favor describe la situación');
      return;
    }

    if (!location) {
      alert('Por favor obtén tu ubicación antes de reportar');
      return;
    }

    if (!user) {
      alert('Debes iniciar sesión para reportar una emergencia');
      return;
    }

    setLoading(true);
    try {
      await createEmergency({
        user_id: user.id,
        reporter_id: user.id,
        type: formData.type,
        description: `${formData.subCategory}: ${formData.description}`,
        status: 'active',
        location_lat: location.latitude,
        location_lng: location.longitude,
        location_address: address || undefined,
      });

      alert('Emergencia reportada exitosamente');
      onBack();
    } catch (error) {
      alert('Error al reportar emergencia. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">{t.report_emergency}</h1>
        <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs opacity-60">{t.immediate_protocol}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <FormCard step="1" title={t.identity}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <TypeButton 
                icon={<Ambulance />} 
                label="Médica" 
                active={formData.type === 'médica'} 
                onClick={() => setFormData({ ...formData, type: 'médica' })}
              />
              <TypeButton 
                icon={<Flame />} 
                label="Incendio" 
                active={formData.type === 'incendio'} 
                onClick={() => setFormData({ ...formData, type: 'incendio' })}
              />
              <TypeButton 
                icon={<ShieldCheck />} 
                label="Policía" 
                active={formData.type === 'policía'} 
                onClick={() => setFormData({ ...formData, type: 'policía' })}
              />
              <TypeButton 
                icon={<AlertTriangle />} 
                label="Otro" 
                active={formData.type === 'otra'} 
                onClick={() => setFormData({ ...formData, type: 'otra' })}
              />
            </div>
            
            <div className="mt-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sub-Categoría Específica</label>
              <select 
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full h-14 px-4 rounded-xl border-2 border-outline-variant bg-surface-container-low font-bold text-on-surface outline-none focus:border-primary transition-all"
              >
                {SUBCATEGORIES[formData.type as keyof typeof SUBCATEGORIES].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </FormCard>

          <FormCard step="3" title={t.communication} secondary>
            <div className="space-y-6">
              <div className="relative group">
                 <input 
                   type="file" 
                   accept="image/*,video/*"
                   onChange={handleMediaChange}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-colors bg-surface-container-low">
                   {mediaPreview ? <CheckCircle2 className="w-8 h-8 text-secondary" /> : <Upload className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />}
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{mediaPreview ? 'Archivo Adjuntado' : 'Subir Evidencia (Opcional)'}</p>
                 </div>
               </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Descripción de la Situación</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describa heridos, amenazas o peligros..."
                  className="w-full p-4 rounded-xl border-2 border-outline-variant bg-surface-container-low font-medium resize-none focus:border-primary outline-none text-on-surface transition-all"
                />
              </div>
            </div>
          </FormCard>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-container-low border-2 border-outline-variant rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <div className="p-6 bg-surface-container-lowest">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">2</div>
                  <h2 className="text-xl font-black uppercase tracking-tight">{t.current_location}</h2>
                </div>
                <button 
                  onClick={handleGetLocation}
                  disabled={loading}
                  className="px-4 py-2 bg-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                >
                  {loading ? 'GPS...' : 'ACTUALIZAR'}
                </button>
              </div>
              <div className="relative">
                <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input 
                  type="text" 
                  readOnly
                  value={address || 'Obteniendo coordenadas...'}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low border-2 border-outline-variant font-bold text-xs text-on-surface truncate"
                />
              </div>
            </div>
            <div className="h-64 relative overflow-hidden grayscale brightness-75 contrast-125">
               <EmergencyMap 
                 contacts={[]} 
                 className="w-full h-full" 
               />
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className={`w-12 h-12 bg-primary/20 rounded-full border-2 border-primary flex items-center justify-center ${location ? 'pulsate-sos' : ''}`}>
                    <div className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary" />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleSubmit}
              disabled={loading || !location}
              className="w-full py-6 bg-primary text-white rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 border-b-8 border-black/20"
            >
              <Send className="w-6 h-6 fill-current" />
              {loading ? 'DESPACHANDO...' : t.send_report}
            </button>
            <p className="text-center text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] leading-relaxed opacity-40">
              Uso exclusivo para emergencias reales.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FormCard({ step, title, children, secondary }: { step: string; title: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant p-8 rounded-3xl shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${secondary ? 'bg-surface-container-high text-on-surface' : 'bg-primary text-white'}`}>
          {step}
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TypeButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
      p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all
      ${active ? 'border-primary bg-primary/5 text-primary scale-105 shadow-xl' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'}
    `}>
      <div className={active ? 'fill-current text-primary scale-110' : ''}>{icon}</div>
      <span className="font-black text-[9px] uppercase tracking-widest">{label}</span>
    </button>
  );
}
