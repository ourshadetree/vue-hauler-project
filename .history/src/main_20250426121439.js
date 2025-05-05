// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { supabase } from '@/supabaseClient'   // ← import your Supabase client

const app = createApp(App)

// ——————————————————————————————————————————————————————————
// 1) Register Vuex, Router, Google Maps exactly as before
// ——————————————————————————————————————————————————————————
app.use(store)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDYpNJXRFRuQq5IV8LQZi8E90r1gIaiORI',
    libraries: 'places',
  }
})

// ——————————————————————————————————————————————————————————
// 2) Listen for any new sign-in (email/password or OAuth) and
//    ensure a row exists in your `user_profiles` table.
// ——————————————————————————————————————————————————————————
supabase.auth.onAuthStateChange(async (event, session) => {
  // only care about successful sign-in events
  if (event !== 'SIGNED_IN' || !session?.user) return

  const userId = session.user.id

  // check if we already have a profile row
  const { data: existing, error: fetchErr } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  // if there's some unexpected error, log it
  if (fetchErr && fetchErr.code !== 'PGRST116') {
    console.error('Error checking user_profiles:', fetchErr)
    return
  }

  // if no profile yet, insert one
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
// 3) Finally mount your app
// ——————————————————————————————————————————————————————————
app.mount('#app')
