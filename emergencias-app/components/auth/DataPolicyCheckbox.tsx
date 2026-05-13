'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

interface DataPolicyCheckboxProps {
  onAccept: () => void
  policyVersion: string
}

export function DataPolicyCheckbox({ onAccept, policyVersion }: DataPolicyCheckboxProps) {
  const [accepted, setAccepted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleAccept = () => {
    if (accepted) {
      onAccept()
    }
  }

  return (
    <div className="space-y-4 p-6 bg-surface-container-low rounded-2xl border border-outline-variant">
      <div className="flex items-start gap-4">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id="data-policy"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-6 h-6 rounded-lg border-outline-variant text-primary focus:ring-primary/20 cursor-pointer appearance-none checked:bg-primary checked:border-primary transition-all bg-surface-container-lowest border-2"
          />
          {accepted && (
            <ShieldCheck className="absolute w-4 h-4 text-white left-1 pointer-events-none" />
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="data-policy"
            className="text-sm font-bold text-on-surface cursor-pointer select-none"
          >
            Acepto el Tratamiento de Datos Personales
            <span className="text-on-surface-variant font-medium block text-xs mt-0.5">Versión del protocolo: {policyVersion}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-2 hover:underline"
          >
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showDetails ? 'Ocultar Detalles' : 'Ver Detalles de Seguridad'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant text-[11px] max-h-64 overflow-y-auto leading-relaxed text-on-surface-variant font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <h4 className="font-black text-on-surface uppercase tracking-widest mb-3">Protocolos de Privacidad:</h4>
          <ul className="space-y-2 list-none">
            <li className="flex gap-2"><span className="text-primary font-bold">•</span> Gestión exclusiva para atención de emergencias críticas.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">•</span> Protección cifrada de ubicación GPS y datos sensibles.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">•</span> Consentimiento revocable en cualquier momento.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">•</span> No se comparten datos con entidades externas no autorizadas.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">•</span> Derecho a rectificación y eliminación inmediata.</li>
          </ul>
        </div>
      )}

      <Button
        onClick={handleAccept}
        disabled={!accepted}
        className={`w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all ${accepted ? 'bg-primary hover:bg-primary/90 text-white shadow-lg' : 'bg-surface-container-high text-on-surface-variant'}`}
      >
        Continuar Registro
      </Button>
    </div>
  )
}
