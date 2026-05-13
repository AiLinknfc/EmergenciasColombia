'use client'

import React from 'react';
import { 
  AlertTriangle, 
  X,
  BatteryFull,
  SignalHigh,
  Mic,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';

interface SOSViewProps {
  onCancel: () => void;
  lang?: 'es' | 'en';
}

export function SOSView({ onCancel, lang = 'es' }: SOSViewProps) {
  const t = translations[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center px-4 md:px-6 sos-bg-glow overflow-y-auto"
    >
      {/* Mobile Return Button */}
      <button 
        onClick={onCancel}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.2em] hover:bg-primary/5 p-2 rounded-xl transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{t.back_to_dashboard}</span>
      </button>

      <div className="absolute inset-0 opacity-5 grayscale pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
          alt="BG" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full py-8">
        {/* Smaller Pulsar */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-primary sos-pulse-ring" />
          <div className="absolute inset-0 rounded-full border-2 border-primary sos-pulse-ring" style={{ animationDelay: '0.8s' }} />
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white">
            <span className="text-2xl md:text-4xl font-black tracking-tighter">SOS</span>
            <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tighter mb-1 uppercase">{t.active_alert}</h2>
          <p className="text-[10px] md:text-xs text-on-surface-variant font-black animate-pulse uppercase tracking-[0.2em]">{t.connecting}</p>
        </div>

        <div className="w-full bg-surface-container-low/90 backdrop-blur-xl border-2 border-outline-variant p-6 rounded-3xl shadow-2xl space-y-4 mb-8">
          <div className="flex gap-4">
            <div className="w-1 bg-primary rounded-full h-10" />
            <div className="min-w-0">
              <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">{t.current_location}</span>
              <p className="font-black text-xs md:text-sm truncate uppercase tracking-tight">Sector-G4, Distrito Central</p>
              <p className="text-[9px] text-on-surface-variant font-mono opacity-50">4.5709° N | 74.2973° W</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
            <div className="flex items-center gap-2">
              <BatteryFull className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black">98%</span>
            </div>
            <div className="flex items-center gap-2">
              <SignalHigh className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">5G OK</span>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mb-4">
          <button className="h-12 bg-surface-container-high border border-outline-variant rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
             Policía
          </button>
          <button className="h-12 bg-surface-container-high border border-outline-variant rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
             Bomberos
          </button>
          <button className="h-12 bg-surface-container-high border border-outline-variant rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
             Ambulancia
          </button>
          <button className="h-12 bg-surface-container-high border border-outline-variant rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all">
             Defensa Civil
          </button>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                alert('Micrófono activado. Grabando...');
                // You would handle the stream here
              } catch (err) {
                alert('No se pudo acceder al micrófono. Por favor permite el acceso en tu navegador.');
              }
            }}
            className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Mic className="w-4 h-4" />
            {t.voice_note}
          </button>
          <button 
            onClick={onCancel}
            className="w-full h-14 border-2 border-outline-variant text-on-surface rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-error/5 hover:text-error hover:border-error/20 active:scale-[0.98] transition-all"
          >
            <X className="w-4 h-4" />
            {t.cancel_alert}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
