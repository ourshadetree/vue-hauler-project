// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { supabase } from '@/supabaseClient'   // @ → src alias in vite.config.js

const app = createApp(App)

// ——————————————————————————————————————————————————————————
// 1) Register Vuex, Router, Google Maps
// ——————————————————————————————————————————————————————————
app.use(store)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    // use the env var you set in .env.local
    key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: 'places,geometry',
  },
})

// ——————————————————————————————————————————————————————————
// 2) Supabase auth state listener
//    Ensure a profile row exists after sign‑in
// ——————————————————————————————————————————————————————————
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event !== 'SIGNED_IN' || !session?.user) return

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
})

// ——————————————————————————————————————————————————————————
// 3) Mount your app
// ——————————————————————————————————————————————————————————
app.mount('#app')
