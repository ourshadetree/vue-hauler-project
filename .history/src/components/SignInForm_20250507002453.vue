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
import { supabase } from '@/supabaseClient'

const router       = useRouter()
const email        = ref('')
const password     = ref('')
const errorMessage = ref('')
const loading      = ref(false)
const emit         = defineEmits(['close'])

async function onSubmit() {
  console.log('🚀 onSubmit clicked, email=', email.value)
  loading.value = true
  errorMessage.value = ''

  try {
    // 1) call the Supabase auth API
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value,
    })
    // 2) log everything so we can inspect it
    console.log('🔐 signInWithPassword returned:', { data, error })

    if (error) {
      // Supabase returned an error
      console.error('❌ Supabase error:', error)
      errorMessage.value = error.message
    } else if (data.session) {
      // We got a session back – success!
      console.log('✅ Auth success, session:', data.session)
      emit('close')
      await router.push({ name: 'profile' })
    } else {
      // No error *and* no session? Unexpected.
      console.warn('⚠️ signIn no session:', data)
      errorMessage.value = 'Unable to sign in.'
    }
  } catch (err) {
    // Something totally blew up (e.g. network)
    console.error('❌ unexpected exception:', err)
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
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
