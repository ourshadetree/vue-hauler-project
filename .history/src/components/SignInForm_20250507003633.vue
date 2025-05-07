<template>
  <div id="authContainer">
    <h1>Sign In</h1>
    <form @submit.prevent="onSubmit">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'   // uses import.meta.env under the hood

const router       = useRouter()
const email        = ref('')
const password     = ref('')
const errorMessage = ref('')
const loading      = ref(false)
const emit         = defineEmits(['close'])

// debug: list available auth methods
console.log('supabase.auth methods:', Object.keys(supabase.auth))

async function onSubmit() {
  console.log('🚀 onSubmit clicked – email:', email.value)
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('▶️ calling signInWithPassword()…')
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value,
    })

    console.log('🔐 signInWithPassword returned:', { data, error })

    if (error) {
      console.error('❌ Supabase returned error:', error)
      errorMessage.value = error.message
    } else if (data.session) {
      console.log('✅ Auth succeeded, session:', data.session)
      emit('close')
      await router.push({ name: 'profile' })
    } else {
      console.warn('⚠️ No session object:', data)
      errorMessage.value = 'Unexpected response from server.'
    }
  } catch (err) {
    console.error('💥 Exception during sign‑in:', err)
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    console.log('⏹ sign‑in flow complete')
    loading.value = false
  }
}
</script>

<style scoped>
#authContainer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Karla', sans-serif;
}
h1 {
  font-family: 'Sora', sans-serif;
  color: #0C2442;
  font-weight: 900;
  font-size: 2.5rem;
  margin-bottom: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
form input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
  font-size: 1rem;
  font-family: 'Karla', sans-serif;
  color: #0C2442;
}
form button {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #B11818;
  color: #fff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: background-color 0.3s;
}
form button:hover:not([disabled]) {
  background-color: #8F1212;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #B11818;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
