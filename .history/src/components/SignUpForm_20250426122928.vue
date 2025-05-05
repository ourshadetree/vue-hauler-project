<template>
  <div id="authContainer">
    <h1>Create Account</h1>

    <!-- OAuth Providers -->
    <div class="social-signup">
      <p>Or sign up with:</p>
      <button @click="signUpWithProvider('google')" class="oauth google">
        Google
      </button>
      <button @click="signUpWithProvider('facebook')" class="oauth facebook">
        Facebook
      </button>
      <button @click="signUpWithProvider('apple')" class="oauth apple">
        Apple
      </button>
    </div>

    <form @submit.prevent="handleSignUp">
      <input v-model="firstName" type="text" placeholder="First Name" required />
      <input v-model="lastName"  type="text" placeholder="Last Name"  required />
      <input v-model="email"     type="email" placeholder="Email"      required />
      <input
        v-model="confirmEmail"
        type="email"
        placeholder="Confirm Email"
        required
      />
      <input v-model="password"        type="password" placeholder="Password"        required />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
      />

      <button type="submit">Create Account</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router = useRouter()

// form fields
const firstName       = ref('')
const lastName        = ref('')
const email           = ref('')
const confirmEmail    = ref('')
const password        = ref('')
const confirmPassword = ref('')

// feedback
const errorMessage = ref('')

// email/password signup
async function handleSignUp() {
  errorMessage.value = ''

  if (email.value.toLowerCase() !== confirmEmail.value.toLowerCase()) {
    errorMessage.value = 'Emails do not match.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  // 1) create the user
  const { data, error } = await supabase.auth.signUp({
    email:    email.value,
    password: password.value
  })
  if (error) {
    errorMessage.value = error.message
    return
  }

  // 2) insert minimal profile row
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id:    data.user.id,
      first_name: firstName.value,
      last_name:  lastName.value
    })
  if (profileError) {
    errorMessage.value = profileError.message
    return
  }

  // 3) redirect home with flag
  router.push({ path: '/', query: { signedUp: 'true' } })
}

// OAuth signup
async function signUpWithProvider(provider) {
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/?signedUp=true`
    }
  })
  if (error) {
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
/* … your existing styles … */
</style>
