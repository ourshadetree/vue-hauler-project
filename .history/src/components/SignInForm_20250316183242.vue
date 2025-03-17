<template>
  <div id="authContainer">
    <h1>Sign In</h1>

    <form @submit.prevent="signIn">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>

    <!-- Button to go to Sign Up -->
    <p class="switch">
      New here? <router-link to="/signup">Create an account</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from '@/../supabaseClient';  // ✅ Ensure correct import path

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

// Function to sign in the user
const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = "Invalid email or password.";
  } else {
    console.log("Signed in:", data.user);
    router.push("/dashboard"); // Redirect after login (adjust route as needed)
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
