<template>
    <div id="authContainer">
      <h1>Sign Up</h1>
  
      <form @submit.prevent="handleSignUp">
        <input v-model="firstName" type="text" placeholder="First Name" />
        <input v-model="lastName" type="text" placeholder="Last Name" />
  
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="confirmEmail" type="email" placeholder="Confirm Email" />
  
        <input v-model="password" type="password" placeholder="Password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
  
        <button type="submit">Create Account</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
  
      
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from '@/../supabaseClient';
  
  export default {
    name: "SignUpForm",
    setup() {
      const router = useRouter();
  
      // Form fields
      const email = ref("");
      const confirmEmail = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const firstName = ref("");
      const lastName = ref("");
  
      // Feedback
      const errorMessage = ref("");
      const successMessage = ref("");
  
      // Sign Up Handler
      const handleSignUp = async () => {
        try {
          errorMessage.value = "";
          successMessage.value = "";
  
          // 1) Check if emails match
          if (email.value.trim().toLowerCase() !== confirmEmail.value.trim().toLowerCase()) {
            throw new Error("Emails do not match.");
          }
  
          // 2) Check if passwords match
          if (password.value !== confirmPassword.value) {
            throw new Error("Passwords do not match.");
          }
  
          // 3) Create user in Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
          });
  
          if (error) throw error;
          if (!data?.user) {
            throw new Error("No user returned from signUp.");
          }
  
          // 4) Insert into user_profiles
          const { error: profileError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: data.user.id,
                first_name: firstName.value || null,
                last_name: lastName.value || null
              }
            ]);
          if (profileError) throw profileError;
  
          // Success
          successMessage.value = "Account created! Please check your email for verification.";
  
          // Redirect to sign in
          setTimeout(() => router.push("/signin"), 2000);
        } catch (err) {
          errorMessage.value = err.message || "Unknown error.";
        }
      };
  
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
      };
    }
  };
  </script>
  
  <style scoped>
  #authContainer {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    padding: 40px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: pink;
    font-weight: 900;
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
  
  .switch {
    margin-top: 20px;
  }
  
  .switch a {
    color: #0073d1;
    font-weight: bold;
    text-decoration: none;
  }
  
  .switch a:hover {
    text-decoration: underline;
  }
  </style>
  