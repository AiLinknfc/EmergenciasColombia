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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTests() {
  console.log('Testing Supabase Connection...')
  
  // Test 1: Fetch
  const { data: fetch, error: fetchErr } = await supabase.from('contacts').select('*').limit(1)
  if (fetchErr) {
    console.error('Fetch Error:', fetchErr)
  } else {
    console.log('Fetch Success:', fetch.length, 'records')
  }

  // Test 2: Create (as anonymous user)
  console.log('Testing Create...')
  const testContact = {
    organization: 'Test Org',
    service_type: 'Other',
    icon: 'shield',
    color: '#af101a',
    order_index: 99,
  }

  const { data: createData, error: createErr } = await supabase.from('contacts').insert([testContact]).select()
  if (createErr) {
    console.error('Create Error:', createErr)
  } else {
    console.log('Create Success:', createData)
    
    // Test 3: Delete
    console.log('Testing Delete...')
    const { error: deleteErr } = await supabase.from('contacts').delete().eq('id', createData[0].id)
    if (deleteErr) {
      console.error('Delete Error:', deleteErr)
    } else {
      console.log('Delete Success')
    }
  }
}

runTests()
