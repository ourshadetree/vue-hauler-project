import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { supabase } from '@/supabaseClient'   // @ → src alias in vite.config.js
import { auth } from '@/composables/useAuth' // @ → src alias in vite.config.js

const app = createApp(App)

// 1) Register Vuex, Router, Google Maps
app.use(store)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: 'places,geometry',
    version: 'weekly',
  },
})

// A reactive global user store — example using Vue 3 reactive (adjust if you use Vuex or Pinia)
import { reactive } from 'vue'
export const userState = reactive({ user: null })

// 2) Restore session before mounting the app
async function restoreSession() {
  const storedSession = localStorage.getItem('supabaseSession')
  if (storedSession) {
    // If session is in localStorage, use it
    const session = JSON.parse(storedSession)
    userState.user = session.user
    console.log('Session restored from localStorage:', session)
  } else {
    // If not in localStorage, get it from Supabase
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error restoring session from Supabase:', error)
    } else if (session) {
      console.log('Session restored from Supabase:', session)
      userState.user = session.user
      // Store session in localStorage for persistence across page refreshes
      localStorage.setItem('supabaseSession', JSON.stringify(session))
    }
  }
}

// 3) Supabase auth state listener (for sign in/out)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    userState.user = session.user
    // Store the session in localStorage when user signs in
    localStorage.setItem('supabaseSession', JSON.stringify(session))
  } else if (event === 'SIGNED_OUT') {
    userState.user = null
    localStorage.removeItem('supabaseSession')
  }
})

// 4) Initialize app and mount only after session is restored
async function init() {
  // Wait for session to load, then mount app
  await restoreSession()  // Ensure session is restored
  createApp(App).use(store).use(router).mount('#app')
}

init()
