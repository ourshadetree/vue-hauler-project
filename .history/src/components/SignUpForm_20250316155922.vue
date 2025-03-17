<template>
    <div id="signupContainer">
      <h1>Sign Up</h1>
      
      <form @submit.prevent="handleSignUp">
        <!-- First Name -->
        <input 
          type="text" 
          v-model="firstName" 
          placeholder="First Name"
        />
  
        <!-- Last Name -->
        <input 
          type="text" 
          v-model="lastName" 
          placeholder="Last Name"
        />
  
        <!-- Email -->
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email" 
        />
  
        <!-- Confirm Email -->
        <input
          type="email"
          v-model="confirmEmail"
          placeholder="Confirm Email"
        />
  
        <!-- Password -->
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password"
        />
  
        <!-- Confirm Password -->
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm Password"
        />
  
        <!-- Submit -->
        <button type="submit">Create Account</button>
      </form>
  
      <!-- Error or success message -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { supabase } from '@/../supabaseClient';  // ✅ Ensure correct import path
  
  
  
  export default {
    name: 'SignUp',
    setup() {
      // Form fields
      const email = ref('')
      const confirmEmail = ref('')
      const password = ref('')
      const confirmPassword = ref('')
      const firstName = ref('')
      const lastName = ref('')
  
      // Feedback
      const errorMessage = ref('')
      const successMessage = ref('')
  
      // Sign Up Handler
      const handleSignUp = async () => {
        try {
          errorMessage.value = ''
          successMessage.value = ''
  
          // 1) Check if emails match
          if (email.value.trim().toLowerCase() !== confirmEmail.value.trim().toLowerCase()) {
            throw new Error('Emails do not match.')
          }
  
          // 2) Check if passwords match
          if (password.value !== confirmPassword.value) {
            throw new Error('Passwords do not match.')
          }
  
          // 3) Create user in Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
          })
  
          if (error) throw error
          if (!data?.user) {
            throw new Error('No user returned from signUp.')
          }
  
          // 4) Insert into user_profiles
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                first_name: firstName.value || null,
                last_name: lastName.value || null
                // add dot_number, company_name, etc., if needed
              }
            ])
          if (profileError) throw profileError
  
          // Success
          successMessage.value = 'Account created! Please check your email for verification.'
          // Clear the form
          email.value = ''
          confirmEmail.value = ''
          password.value = ''
          confirmPassword.value = ''
          firstName.value = ''
          lastName.value = ''
        } catch (err) {
          errorMessage.value = err.message || 'Unknown error.'
        }
      }
  
      return {
        email,
        confirmEmail,
        password,
        confirmPassword,
        firstName,
        lastName,
        errorMessage,
        successMessage,
        handleSignUp
      }
    }
  }
  </script>
  
  <style scoped>
  #signupContainer {
    max-width: 400px;
    margin: 0 auto; /* centers within your #pageContent */
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    text-align: center;
  }
  
  #signupContainer h1 {
    color: pink;
    margin-bottom: 20px;
    font-weight: 900;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  form input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
  
  form button {
    padding: 12px;
    border-radius: 4px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    background-color: #073763;
    color: #fff;
    font-size: 1rem;
  }
  
  form button:hover {
    background-color: #09457a;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  </style>
  