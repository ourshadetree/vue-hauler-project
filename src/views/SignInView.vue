<template>
  <div class="signin-view">
    <form class="sign-in-form" @submit.prevent="handleSubmit">
      <h2>Sign In</h2>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>

      <div class="actions">
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/composables/useAuth'  // Use the singleton auth state

const router   = useRouter()
const email    = ref('')
const password = ref('')

const { signIn, error, loading, user } = auth  // Use auth from singleton

async function handleSubmit() {
  const success = await signIn(email.value, password.value)
  if (success) {
    router.push({ name: 'profile' })
  }
}

// Optional: If user is already signed in, redirect immediately
watch(user, (u) => {
  if (u) router.push({ name: 'profile' })
})
</script>

<style scoped>
.signin-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
  background: #f7f7f7;
}

.sign-in-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.sign-in-form h2 {
  margin-bottom: 1.5rem;
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  text-align: center;
}
.field {
  margin-bottom: 1rem;
}
.field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #333;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.actions {
  margin-top: 1.5rem;
}
.actions button.btn {
  width: 100%;
  padding: 0.75rem;
  background: #B11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.actions button.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.actions button.btn:hover:not(:disabled) {
  background: #8F1212;
}
.error {
  margin-top: 1rem;
  color: #B11818;
  font-size: 0.9rem;
  text-align: center;
}
</style>
