// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Vite only exposes env vars prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[supabaseClient] ⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Make sure you have these in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('[supabaseClient] Supabase URL:', supabaseUrl)
console.log('[supabaseClient] Supabase Key:', supabaseKey)
