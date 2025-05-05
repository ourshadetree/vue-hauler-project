<template>
  <div id="authContainer">
    <h1>Sign In</h1>
    <form @submit.prevent="signIn">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" :disabled="loading">
        <span v-if="loading">Signing in…</span>
        <span v-else>Sign In</span>
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from '@/supabaseClient'

const router       = useRouter()
const email        = ref("")
const password     = ref("")
const errorMessage = ref("")
const loading      = ref(false)

async function signIn() {
  console.log("🔐 Attempting sign in for:", email.value)
  errorMessage.value = ""
  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value,
    })

    if (error) {
      console.error("❌ Supabase error:", error)
      throw error
    }

    console.log("✅ Signed in user:", data.user)
    // route by name — make sure your router has { name: 'ProfileView', path: '/profile', … }
    router.push({ name: "ProfileView" })
  } catch (err) {
    errorMessage.value = err.message || "Sign-in failed."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* …your existing styles… */

input, button { /* keep your styles */ }

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
