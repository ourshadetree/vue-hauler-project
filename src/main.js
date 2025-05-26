import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { supabase } from '@/supabaseClient'
import { auth } from '@/composables/useAuth'

// Global reactive user state
export const userState = reactive({ user: null })

// Dynamically load the Google Maps script
async function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve()

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Restore Supabase session from localStorage or Supabase directly
async function restoreSession() {
  const storedSession = localStorage.getItem('supabaseSession')
  if (storedSession) {
    const session = JSON.parse(storedSession)
    userState.user = session.user
    console.log('Session restored from localStorage:', session)
  } else {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error restoring session from Supabase:', error)
    } else if (session) {
      console.log('Session restored from Supabase:', session)
      userState.user = session.user
      localStorage.setItem('supabaseSession', JSON.stringify(session))
    }
  }
}

// Supabase auth listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    userState.user = session.user
    localStorage.setItem('supabaseSession', JSON.stringify(session))
  } else if (event === 'SIGNED_OUT') {
    userState.user = null
    localStorage.removeItem('supabaseSession')
  }
})

// Initialize the app
async function init() {
  try {
    await Promise.all([
      loadGoogleMaps(),
      restoreSession()
    ])

    createApp(App).use(store).use(router).mount('#app')
  } catch (err) {
    console.error('❌ App failed to initialize:', err)
  }
}

init()
