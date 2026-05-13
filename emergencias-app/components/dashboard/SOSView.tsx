'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  AlertTriangle, X, Mic, MicOff, MapPin,
  Send, ChevronLeft, CheckCircle, Loader2, Smartphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SOSAlert } from '@/hooks/useSOSAlerts'

type SOSPhase = 'idle' | 'recording' | 'preview' | 'sending' | 'sent'

interface LocationData { lat: number; lng: number }

interface SOSViewProps {
  onCancel: () => void
  onAlertSent?: (alert: SOSAlert) => void
  lang?: 'es' | 'en'
}

export function SOSView({ onCancel, onAlertSent }: SOSViewProps) {
  const [phase, setPhase] = useState<SOSPhase>('idle')
  const [transcript, setTranscript] = useState('')
  const [manualDesc, setManualDesc] = useState('')
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLabel, setLocationLabel] = useState('Obteniendo ubicación...')
  const [recordingTime, setRecordingTime] = useState(0)
  const [sosId, setSosId] = useState('')
  const [micError, setMicError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationLabel(`${pos.coords.latitude.toFixed(4)}° N | ${pos.coords.longitude.toFixed(4)}° W`)
      },
      () => setLocationLabel('Ubicación no disponible')
    )
  }, [])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const startRecording = async () => {
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start(100)
      recorderRef.current = recorder

      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)

      // Transcripción en tiempo real via Web Speech API
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SR) {
        const recognition = new SR()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'es-CO'
        recognition.onresult = (e: any) => {
          let text = ''
          for (let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript + ' '
          }
          setTranscript(text.trim())
        }
        recognition.onerror = () => {}
        recognition.start()
        recognitionRef.current = recognition
      }

      setPhase('recording')
    } catch {
      setMicError('No se pudo acceder al micrófono. Permite el acceso en tu navegador.')
    }
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    recognitionRef.current?.stop()
    if (recorderRef.current) {
      recorderRef.current.stop()
      recorderRef.current.stream.getTracks().forEach(t => t.stop())
    }
    setPhase('preview')
  }

  const getDeviceMeta = async () => {
    const meta: Record<string, any> = {
      userAgent: navigator.userAgent.substring(0, 300),
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    if ('getBattery' in navigator) {
      try {
        const bat = await (navigator as any).getBattery()
        meta.battery = `${Math.round(bat.level * 100)}%`
        meta.charging = bat.charging
      } catch {}
    }
    const conn = (navigator as any).connection
    if (conn) meta.connection = conn.effectiveType
    return meta
  }

  const sendEmergency = async () => {
    setPhase('sending')
    const metadata = await getDeviceMeta()
    const audioBlob = chunksRef.current.length > 0
      ? new Blob(chunksRef.current, { type: 'audio/webm' })
      : null

    const form = new FormData()
    form.append('transcript', transcript || manualDesc)
    form.append('location', JSON.stringify(location))
    form.append('metadata', JSON.stringify(metadata))
    if (audioBlob) form.append('audio', audioBlob, 'emergency.webm')

    try {
      const res = await fetch('/api/sos', { method: 'POST', body: form })
      const data = await res.json()
      const id = data.id || `SOS-${Date.now()}`
      setSosId(id)
      onAlertSent?.({
        id,
        timestamp: data.timestamp || new Date().toISOString(),
        transcript: transcript || manualDesc,
        locationLabel,
        location,
        status: 'active',
        read: false,
      })
    } catch {
      const id = `SOS-${Date.now()}`
      setSosId(id)
      onAlertSent?.({
        id,
        timestamp: new Date().toISOString(),
        transcript: transcript || manualDesc,
        locationLabel,
        location,
        status: 'active',
        read: false,
      })
    }
    setPhase('sent')
  }

  const BARS = Array.from({ length: 18 })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center px-4 md:px-6 sos-bg-glow overflow-y-auto"
    >
      <div className="absolute inset-0 opacity-5 grayscale pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {phase !== 'sent' && (
        <button
          onClick={phase === 'recording' ? stopRecording : onCancel}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.2em] hover:bg-primary/5 p-2 rounded-xl transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{phase === 'recording' ? 'Detener' : 'Volver'}</span>
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full py-16 gap-6">
        <AnimatePresence mode="wait">

          {/* ── IDLE ── */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary sos-pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-primary sos-pulse-ring" style={{ animationDelay: '0.8s' }} />
                <div className="w-28 h-28 bg-primary rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white">
                  <span className="text-3xl font-black tracking-tighter">SOS</span>
                  <AlertTriangle className="w-5 h-5 fill-current" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-black text-primary tracking-tighter uppercase">Emergencia</h2>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-1">
                  Graba y describe la situación
                </p>
              </div>

              {/* Location */}
              <div className="w-full bg-surface-container-low/90 border border-outline-variant p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 shrink-0 ${location ? 'text-primary' : 'text-on-surface-variant/50'}`} />
                  <div className="min-w-0">
                    <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">Ubicación</span>
                    <p className="font-black text-[10px] font-mono opacity-70 truncate">{locationLabel}</p>
                  </div>
                </div>
              </div>

              {micError && (
                <div className="w-full bg-error/10 border border-error/20 rounded-2xl p-3">
                  <p className="text-[10px] text-error font-black text-center">{micError}</p>
                  <textarea
                    value={manualDesc}
                    onChange={e => setManualDesc(e.target.value)}
                    placeholder="Describe la emergencia aquí..."
                    className="w-full mt-2 bg-transparent text-xs text-on-surface resize-none outline-none placeholder:opacity-40"
                    rows={3}
                  />
                </div>
              )}

              <button
                onClick={startRecording}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Mic className="w-5 h-5" />
                Iniciar Grabación
              </button>

              {micError && manualDesc && (
                <button
                  onClick={() => setPhase('preview')}
                  className="w-full h-12 border-2 border-primary text-primary rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Continuar con texto
                </button>
              )}

              <button
                onClick={onCancel}
                className="w-full h-12 border-2 border-outline-variant text-on-surface rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-error/5 hover:text-error hover:border-error/20 active:scale-[0.98] transition-all"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </motion.div>
          )}

          {/* ── RECORDING ── */}
          {phase === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
                <span className="font-mono font-black text-2xl text-on-surface tracking-widest">
                  {formatTime(recordingTime)}
                </span>
              </div>

              {/* Waveform */}
              <div className="flex items-center justify-center gap-[3px] h-14">
                {BARS.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-primary rounded-full"
                    style={{ height: 32, transformOrigin: 'center' }}
                    animate={{ scaleY: [0.15, 1, 0.15] }}
                    transition={{
                      duration: 0.7 + (i % 3) * 0.15,
                      repeat: Infinity,
                      delay: i * 0.045,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>

              {/* Live transcript */}
              <div className="w-full bg-surface-container-low border border-outline-variant rounded-2xl p-4 min-h-[80px]">
                <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">Transcripción en vivo</span>
                <p className="text-xs text-on-surface mt-2 leading-relaxed">
                  {transcript
                    ? transcript
                    : <span className="opacity-40 italic text-[10px]">Habla claramente para describir la emergencia...</span>
                  }
                </p>
              </div>

              <button
                onClick={stopRecording}
                className="w-full h-14 bg-error text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-error/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <MicOff className="w-5 h-5" />
                Detener y Revisar
              </button>
            </motion.div>
          )}

          {/* ── PREVIEW ── */}
          {phase === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4 w-full"
            >
              <div className="text-center">
                <h2 className="text-lg font-black text-on-surface uppercase tracking-tight">Confirmar envío</h2>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-1">
                  Revisa antes de enviar
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4">
                  <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">Descripción</span>
                  {(transcript || manualDesc) ? (
                    <p className="text-xs text-on-surface mt-2 leading-relaxed">{transcript || manualDesc}</p>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant opacity-50 mt-2 italic">
                      Sin transcripción — se enviará el audio grabado
                    </p>
                  )}
                </div>

                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">Ubicación</span>
                    <p className="text-[10px] font-mono text-on-surface truncate">{locationLabel}</p>
                  </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">Metadatos del dispositivo</span>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Plataforma, hora, batería y red incluidos
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={sendEmergency}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Send className="w-4 h-4" />
                Enviar Emergencia
              </button>

              <button
                onClick={() => setPhase('idle')}
                className="w-full h-12 border-2 border-outline-variant text-on-surface rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-surface-container-high active:scale-[0.98] transition-all"
              >
                Volver a grabar
              </button>
            </motion.div>
          )}

          {/* ── SENDING ── */}
          {phase === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <Loader2 className="w-14 h-14 text-primary animate-spin" />
              <p className="font-black text-xs uppercase tracking-[0.2em] text-on-surface-variant animate-pulse">
                Enviando emergencia...
              </p>
            </motion.div>
          )}

          {/* ── SENT ── */}
          {phase === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 w-full text-center"
            >
              <CheckCircle className="w-20 h-20 text-primary" />
              <div>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Alerta Enviada</h2>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-1">
                  Tu reporte fue recibido y está siendo procesado
                </p>
              </div>
              <div className="w-full bg-surface-container-low border border-outline-variant rounded-2xl p-4">
                <span className="text-[8px] font-black tracking-[0.3em] text-primary uppercase">ID de seguimiento</span>
                <p className="font-mono font-black text-lg mt-1 tracking-widest">{sosId}</p>
              </div>
              <button
                onClick={onCancel}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Volver al Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}
