import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+?)[=:](.*)/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/['"]/g, '')
      process.env[key] = value
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFullPayload() {
  console.log('Testing Create with ALL fields...')
  const payload = {
    organization: 'Test Full Org',
    service_type: 'Police Services',
    icon: 'shield',
    color: '#af101a',
    order_index: 100,
    created_by: '00000000-0000-0000-0000-000000000000', // Dummy UUID, might fail if foreign key exists
    image_url: 'https://example.com/image.png'
  }

  const { data, error } = await supabase.from('contacts').insert([payload]).select()
  
  if (error) {
    console.error('Test Failed:', error.message, error.details, error.hint, error.code)
  } else {
    console.log('Test Succeeded:', data)
    // Cleanup
    await supabase.from('contacts').delete().eq('id', data[0].id)
  }
}

testFullPayload()
