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
      <input v-model="confirmEmail"
             type="email"
             placeholder="Confirm Email"
             required
      />
      <input v-model="password"        type="password" placeholder="Password"        required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

      <button type="submit">Create Account</button>
    </form>

    <p v-if="errorMessage"   class="error"  >{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router = useRouter()

// simple form fields
const firstName       = ref('')
const lastName        = ref('')
const email           = ref('')
const confirmEmail    = ref('')
const password        = ref('')
const confirmPassword = ref('')

// feedback
const errorMessage   = ref('')
const successMessage = ref('')

// traditional email/password signup
async function handleSignUp() {
  errorMessage.value = ''
  successMessage.value = ''

  if (email.value.toLowerCase() !== confirmEmail.value.toLowerCase()) {
    return errorMessage.value = 'Emails do not match.'
  }
  if (password.value !== confirmPassword.value) {
    return errorMessage.value = 'Passwords do not match.'
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

  // 2) insert a minimal profile row (we’ll fill in the rest later)
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

  successMessage.value = 'Account created! Check your email to verify.'
  setTimeout(() => router.push('/signin'), 2000)
}

// OAuth signup
async function signUpWithProvider(provider) {
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  if (error) {
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
#authContainer {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: center;
  font-family: 'Karla', sans-serif;
}

h1 {
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  margin-bottom: 1rem;
}

/* OAuth Buttons */
.social-signup {
  margin-bottom: 1.5rem;
}
.social-signup p {
  margin-bottom: 0.5rem;
  color: #666;
}
.social-signup .oauth {
  margin: 0 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Karla', sans-serif;
  color: #fff;
}
.social-signup .google   { background: #db4437; }
.social-signup .facebook { background: #4267B2; }
.social-signup .apple    { background: #000; }

/* Form Inputs */
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
form input {
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 1rem;
  color: #0c2442;
}
form button {
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 4px;
  background: #b11818;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: bold;
  cursor: pointer;
}
form button:hover {
  background: #8f1212;
}

/* feedback */
.error {
  margin-top: 1rem;
  color: #b11818;
}
.success {
  margin-top: 1rem;
  color: #28a745;
}
</style>
