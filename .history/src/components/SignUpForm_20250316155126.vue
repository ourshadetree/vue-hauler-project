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
  
        <!-- Password -->
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password"
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
  /**
   * If you're using the official Supabase Vue 3 library
   * (https://github.com/supabase-community/supabase-vue),
   * import 'useSupabaseClient' from '@supabase/vue'.
   * Otherwise, import directly from '@supabase/supabase-js'.
   */
  import { ref } from 'vue'
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseUrl = 'https://YOUR-PROJECT-REF.supabase.co'
  const supabaseKey = 'YOUR-ANON-OR-SERVICE-ROLE-KEY'
  // If using the official supabase-js approach:
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  /* If using @supabase/vue, it would look like:
  import { useSupabaseClient } from '@supabase/vue'
  export default {
    setup() {
      const supabase = useSupabaseClient()
      ...
    }
  }
  */
  
  export default {
    name: 'SignUp',
    setup() {
      const email = ref('')
      const password = ref('')
      const firstName = ref('')
      const lastName = ref('')
      const errorMessage = ref('')
      const successMessage = ref('')
  
      const handleSignUp = async () => {
        try {
          errorMessage.value = ''
          successMessage.value = ''
  
          // 1) Create user in Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
          })
          if (error) throw error
  
          // If no user is returned, something went wrong
          if (!data.user) {
            throw new Error('No user returned from signUp.')
          }
  
          // 2) Insert into user_profiles, referencing the new user id
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              id: data.user.id,
              first_name: firstName.value || null,
              last_name: lastName.value || null
              // Add dot_number, company_name, etc. if desired
            }])
  
          if (profileError) throw profileError
  
          // Success
          successMessage.value = 'Account created! Please check your email.'
          // Clear the form
          email.value = ''
          password.value = ''
          firstName.value = ''
          lastName.value = ''
        } catch (err) {
          errorMessage.value = err.message || 'Unknown error'
        }
      }
  
      return {
        email,
        password,
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
  /* Container to center the signup form within the #pageContent */
  #signupContainer {
    max-width: 400px;
    margin: 0 auto; /* centers in the content area */
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    text-align: center;
  }
  
  /* Match your banner’s pink for the heading, or pick another color */
  #signupContainer h1 {
    color: pink;
    margin-bottom: 20px;
    font-weight: 900;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  form input {
    margin-bottom: 10px;
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
    background-color: #073763; /* your site's main color scheme */
    color: #fff;
    font-size: 1rem;
  }
  form button:hover {
    background-color: #09457a; /* slightly darker hover */
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
  