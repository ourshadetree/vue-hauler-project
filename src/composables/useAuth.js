// src/composables/useAuth.js
import { ref, readonly } from 'vue'
import { supabase } from '@/supabaseClient'

const user = ref(null)
const profileName = ref('')
const loading = ref(false)
const error = ref(null)
const sessionLoaded = ref(false)

async function loadUser() {
  loading.value = true
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user ?? null

  if (user.value) {
    const { data, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name')
      .eq('user_id', user.value.id)
      .single()
    if (!profileError && data) profileName.value = data.first_name
    else profileName.value = ''
  } else {
    profileName.value = ''
  }
  loading.value = false
  sessionLoaded.value = true
}

async function signIn(email, password) {
  loading.value = true
  error.value = null
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  loading.value = false
  if (signInError) {
    error.value = signInError.message
    return false
  }
  await loadUser()
  return true
}

async function signOut() {
  loading.value = true
  await supabase.auth.signOut()
  user.value = null
  profileName.value = ''
  loading.value = false
}

function initAuthListener() {
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      await loadUser()
    } else {
      user.value = null
      profileName.value = ''
    }
  })
}

// Export a singleton object — this is key for shared state
export const auth = {
  user: readonly(user),
  profileName: readonly(profileName),
  loading: readonly(loading),
  error: readonly(error),
  sessionLoaded: readonly(sessionLoaded),
  signIn,
  signOut,
  loadUser,
  initAuthListener,
}
