// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// URL where your Edge Functions are served (Supabase default or override)
const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || '/functions'

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[supabaseClient] ⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,   // Auto-refresh tokens before they expire
    crossTab: true,           // Sync auth state across multiple tabs
    detectSessionInUrl: false,
    storage: window.localStorage
  },
  // make your Edge Functions available under supabase.functions
  functions: {
    // base path for your functions (adjust if you host elsewhere)
    url: functionsUrl
  }
})

console.log('[supabaseClient] using storage:', supabase.auth.storage)


/**
 * Helper to invoke your `send_invite` Edge Function.
 * @param {string} inviteId  the invite.id to send
 * @param {string} email     the target email address
 * @returns {Promise<object>} resolving whatever your function returns
 */
export async function sendInviteEmail(inviteId, email) {
  // supabase.functions.invoke will POST to `${functionsUrl}/send_invite`
  const { data, error } = await supabase.functions.invoke('send_invite', {
    body: { invite_id: inviteId, email }
  })
  if (error) {
    console.error('[sendInviteEmail] Error:', error)
    throw error
  }
  return data
}
