import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { supabase } from '@/supabaseClient'   // @ → src alias in vite.config.js
import { auth } from '@/composables/useAuth' // @ → src alias in vite.config.js

// 1) Register Vuex, Router, Google Maps
const app = createApp(App)
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
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error restoring session:', error)
  } else if (session) {
    console.log('Session restored:', session)
    userState.user = session?.user || null
    // optionally commit to Vuex or Pinia store here
  }
}

// 3) Supabase auth state listener (for sign in/out)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    userState.user = session.user
    // your existing user_profiles logic here
    const userId = session.user.id
    const { data: existing, error: fetchErr } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error('Error checking user_profiles:', fetchErr)
      return
    }

    if (!existing) {
      const { error: insertErr } = await supabase
        .from('user_profiles')
        .insert({ user_id: userId })
      if (insertErr) {
        console.error('Error creating user_profiles row:', insertErr)
      }
    }
  } else if (event === 'SIGNED_OUT') {
    userState.user = null
  }
})

// 4) Initialize app and mount only after session is restored
async function init() {
  try {
    // First, restore the session
    await restoreSession()

    // Once the session is restored, initialize the app
    auth.initAuthListener()  // listen for auth changes after session load
    app.mount('#app')  // Mount the app only after session is restored
  } catch (error) {
    console.error('Error during app initialization:', error)
  }
}

init()

// Global error handler
app.config.errorHandler = (err, _vm, info) => {
  console.error('⚠️ Global error handler:', err, info)
}
