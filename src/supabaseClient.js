// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[supabaseClient] ⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'
  )
}

// **Explicitly tell supabase to persist sessions in window.localStorage**
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,  // ✅ Auto-refresh tokens before they expire
    crossTab: true,          // ✅ Sync auth state across multiple tabs
    detectSessionInUrl: false, // ✅ Prevent session from being rehydrated from URL
    storage: window.localStorage // persist session in localStorage
  }
})

console.log('[supabaseClient] using storage:', supabase.auth.storage)  
export { supabase }
