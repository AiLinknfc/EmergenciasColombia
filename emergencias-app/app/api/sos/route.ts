import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const transcript = (formData.get('transcript') as string) || ''
  const location = JSON.parse((formData.get('location') as string) || 'null')
  const metadata = JSON.parse((formData.get('metadata') as string) || '{}')
  const audio = formData.get('audio') as File | null

  const sosId = `SOS-${Date.now()}`
  const timestamp = new Date().toISOString()

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (webhookUrl) {
    try {
      const n8nRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sosId,
          timestamp,
          transcript,
          location,
          metadata,
          hasAudio: !!audio,
          audioSizeBytes: audio?.size ?? 0,
        }),
      })
      const n8nBody = await n8nRes.text()
      console.log(`[SOS] n8n status: ${n8nRes.status} | body: ${n8nBody.substring(0, 200)}`)
    } catch (err) {
      console.error('[SOS] Error conectando a n8n:', err)
    }
  } else {
    console.log('[SOS] N8N_WEBHOOK_URL no configurado. Payload:')
    console.log({ sosId, timestamp, transcript, location, metadata })
  }

  return NextResponse.json({ success: true, id: sosId, timestamp })
}
