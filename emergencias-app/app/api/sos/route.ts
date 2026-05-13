import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const transcript = (formData.get('transcript') as string) || ''
  const location = JSON.parse((formData.get('location') as string) || 'null')
  const metadata = JSON.parse((formData.get('metadata') as string) || '{}')
  const audio = formData.get('audio') as File | null

  const sosId = `SOS-${Date.now()}`
  const timestamp = new Date().toISOString()

  // Reenviar a n8n si el webhook está configurado
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (webhookUrl) {
    try {
      const payload = new FormData()
      payload.append('id', sosId)
      payload.append('timestamp', timestamp)
      payload.append('transcript', transcript)
      payload.append('location', JSON.stringify(location))
      payload.append('metadata', JSON.stringify(metadata))
      if (audio) payload.append('audio', audio, 'emergency.webm')

      await fetch(webhookUrl, { method: 'POST', body: payload })
    } catch (err) {
      console.error('[SOS] Error enviando a n8n:', err)
    }
  } else {
    // Sin n8n configurado: log para desarrollo
    console.log('[SOS] Emergencia recibida (N8N_WEBHOOK_URL no configurado)')
    console.log('[SOS] ID:', sosId)
    console.log('[SOS] Ubicación:', location)
    console.log('[SOS] Transcripción:', transcript)
    console.log('[SOS] Metadatos:', metadata)
    if (audio) console.log('[SOS] Audio incluido:', audio.size, 'bytes')
  }

  return NextResponse.json({ success: true, id: sosId, timestamp })
}
