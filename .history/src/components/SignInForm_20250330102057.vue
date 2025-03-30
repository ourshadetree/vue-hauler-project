<template>
  <div id="authContainer">
    <h1>Sign In</h1>
    <form @submit.prevent="signIn">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from '@/../supabaseClient';  // Ensure the path is correct

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
/* Container */
#authContainer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #FFFFFF; /* White background */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Karla', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Heading: Using Sora */
h1 {
  font-family: 'Sora', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #0C2442; /* Dark Blue */
  font-weight: 900;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

/* Form Styles */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #E5E5E5; /* Light grey border */
  font-size: 1rem;
  font-family: 'Karla', sans-serif;
  color: #0C2442; /* Dark Blue text */
}

/* Button */
form button {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #B11818; /* Red accent */
  color: #FFFFFF;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #8F1212; /* Slightly darker red */
}

/* Error Message */
.error {
  color: #B11818;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
