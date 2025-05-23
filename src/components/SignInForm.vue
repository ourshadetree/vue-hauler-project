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

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message
    } else if (data.session) {
      console.log('✅ login successful, routing to /profile')
      await router.push({ name: 'profile' })  
    } else {
      errorMessage.value = 'Unexpected response from auth service.'
    }
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#authContainer {
  max-width: 400px;
  margin: 4rem auto;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Karla', sans-serif;
}
h1 {
  font-family: 'Sora', sans-serif;
  color: #0C2442;
  font-weight: 900;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
form input {
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
  font-size: 1rem;
  color: #0C2442;
}
form button {
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #B11818;
  color: #fff;
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
  font-size: 0.9rem;
}
</style>
