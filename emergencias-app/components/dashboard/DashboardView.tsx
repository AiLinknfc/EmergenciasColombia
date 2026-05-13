'use client'

import React, { useState } from 'react';
import {
  Flame,
  Map as MapIcon,
  Ambulance,
  ShieldCheck,
  Navigation,
  History,
  Minus,
  Maximize2,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useAuth } from '@/hooks/useAuth';
import { SOSAlert } from '@/hooks/useSOSAlerts';

interface DashboardViewProps {
  onReport: () => void;
  lang?: 'es' | 'en';
  sosAlerts?: SOSAlert[];
  onCloseAlert?: (id: string) => void;
}

const MOCK_ACTIVE = [
  { id: 'INC-88392', title: 'Incendio Estructural', location: 'Calle 24 #15-32', details: 'Unidad E-42 en camino', status: 'crítico', time: '04:12', isSOS: false },
  { id: 'INC-88401', title: 'Emergencia Médica', location: 'Parque Central Sur', details: 'Unidad EMS A-02 en escena', status: 'urgente', time: '01:58', isSOS: false }
];

const MOCK_INACTIVE = [
  { id: 'INC-88300', title: 'Fuga de Gas', location: 'Avenida 5 #10', details: 'Controlado y cerrado', status: 'cerrado', time: '14:20', isSOS: false },
  { id: 'INC-88312', title: 'Rescate Animal', location: 'Barrio Obrero', details: 'Exitoso', status: 'cerrado', time: '10:05', isSOS: false }
];

export function DashboardView({ onReport, lang = 'es', sosAlerts = [], onCloseAlert }: DashboardViewProps) {
  const t = translations[lang];
  const { user } = useAuth();
  const isAdmin = user?.role === 'business';

  const [activeExpanded, setActiveExpanded] = useState(true);
  const [inactiveExpanded, setInactiveExpanded] = useState(true);

  // Convertir alertas SOS a formato de incidente
  const cutoff = Date.now() - 4 * 60 * 60 * 1000
  const sosActive = sosAlerts
    .filter(a => a.status === 'active' && new Date(a.timestamp).getTime() > cutoff)
    .map(a => ({
      id: a.id,
      title: 'Alerta SOS',
      location: a.locationLabel || 'Ubicación no disponible',
      details: a.transcript || 'Sin descripción de voz',
      status: 'crítico',
      time: new Date(a.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      isSOS: true,
      alertRef: a,
    }))
  const sosClosed = sosAlerts
    .filter(a => a.status === 'closed' || new Date(a.timestamp).getTime() <= cutoff)
    .map(a => ({
      id: a.id,
      title: 'Alerta SOS',
      location: a.locationLabel || 'Ubicación no disponible',
      details: a.transcript || 'Sin descripción de voz',
      status: 'cerrado',
      time: new Date(a.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      isSOS: true,
      alertRef: a,
    }))

  const allActive = [...sosActive, ...MOCK_ACTIVE]
  const allInactive = [...sosClosed, ...MOCK_INACTIVE]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-10 pb-20 px-4"
    >
      {/* Hero Button - Standardized Title */}
      <button 
        onClick={onReport}
        className="w-full bg-primary text-white group relative overflow-hidden py-8 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-2xl border-b-8 border-black/20 active:scale-[0.98] transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 group-hover:opacity-70" />
        <Flame className="w-12 h-12 fill-current relative z-10" />
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase relative z-10">{t.report_emergency}</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-80 relative z-10">{t.immediate_protocol}</p>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map - Standardized Layout */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl overflow-hidden shadow-xl h-[500px] flex flex-col">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <MapIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">{t.incident_geo}</h3>
              </div>
            </div>
            <div className="flex-1 relative bg-surface-dim grayscale contrast-125">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
                alt="Map"
                className="w-full h-full object-cover opacity-40"
              />
            </div>
          </div>

          {/* Active Incidents - Accordion */}
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">{t.active_incidents}</h2>
              <button 
                onClick={() => setActiveExpanded(!activeExpanded)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-all"
              >
                {activeExpanded ? <Minus className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
            <AnimatePresence>
              {activeExpanded && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden divide-y divide-outline-variant"
                >
                  {allActive.map((incident) => (
                    <IncidentRow key={incident.id} incident={incident} t={t} onClose={incident.isSOS ? () => onCloseAlert?.(incident.id) : undefined} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inactive Incidents (Admin Only) */}
          {isAdmin && (
            <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl overflow-hidden shadow-xl opacity-80">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-on-surface-variant" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant">Incidentes Inactivos (Historial)</h2>
                </div>
                <button 
                  onClick={() => setInactiveExpanded(!inactiveExpanded)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-all"
                >
                  {inactiveExpanded ? <Minus className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {inactiveExpanded && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden divide-y divide-outline-variant"
                  >
                    {allInactive.map((incident) => (
                      <IncidentRow key={incident.id} incident={incident} t={t} inactive />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar Stats - Standardized */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 border-l-4 border-primary pl-4">{t.dispatcher_status}</h3>
            <div className="space-y-8">
              <StatBar label={t.active_calls} count="12" percent="65%" color="bg-primary" />
              <StatBar label={t.pending_dispatch} count="04" percent="30%" color="bg-on-surface" />
            </div>
          </div>

          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-3xl p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 border-l-4 border-primary pl-4">{t.available_resources}</h3>
            <div className="grid grid-cols-2 gap-4">
              <ResourceCard icon={<Ambulance className="w-5 h-5" />} label="EMS" count="8" />
              <ResourceCard icon={<Flame className="w-5 h-5" />} label="Bomberos" count="5" />
              <ResourceCard icon={<ShieldCheck className="w-5 h-5" />} label="Policía" count="2" />
              <ResourceCard icon={<Navigation className="w-5 h-5" />} label="Aéreo" count="1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IncidentRow({ incident, t, inactive = false, onClose }: { incident: any; t: any; inactive?: boolean; onClose?: () => void }) {
  return (
    <div className={`p-5 flex items-start gap-4 hover:bg-surface-container-low transition-all group cursor-pointer ${inactive ? 'opacity-70' : ''}`}>
      <div className={`w-1.5 h-10 rounded-full shrink-0 mt-1 ${inactive ? 'bg-outline-variant' : incident.isSOS ? 'bg-error' : 'bg-primary'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{incident.id}</span>
          {incident.isSOS && (
            <span className="flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-error/10 text-error uppercase tracking-widest">
              <Radio className="w-2.5 h-2.5" /> SOS
            </span>
          )}
          <h4 className="font-black text-xs uppercase tracking-tight truncate">{incident.title}</h4>
        </div>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate">
          {incident.location} • {incident.details}
        </p>
        {onClose && !inactive && (
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-error transition-colors"
          >
            Cerrar incidente
          </button>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="font-black text-sm tracking-tighter text-primary">{incident.time}</p>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">{t.time_active}</p>
      </div>
    </div>
  );
}

function StatBar({ label, count, percent, color }: { label: string; count: string; percent: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</span>
        <span className="text-3xl font-black tracking-tighter">{count}</span>
      </div>
      <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline-variant">
        <motion.div initial={{ width: 0 }} animate={{ width: percent }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  );
}

function ResourceCard({ icon, label, count }: { icon: React.ReactNode; label: string; count: string }) {
  return (
    <div className="p-4 bg-surface-container-low rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all text-center">
      <div className="text-primary mb-2 flex justify-center">{icon}</div>
      <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
      <p className="text-xl font-black tracking-tighter">{count}</p>
    </div>
  );
}
