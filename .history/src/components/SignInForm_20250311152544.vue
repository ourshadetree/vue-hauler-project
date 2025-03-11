<template>
    <div>
      <h2 v-if="!user">Sign In</h2>
      <form v-if="!user" @submit.prevent="signIn">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      </form>
  
      <div v-else>
        <p>Welcome, {{ user.email }}</p>
        <button @click="signOut">Sign Out</button>
      </div>
    </div>
  </template>


<script setup>
import { ref } from "vue";
import { supabase } from '@/../supabaseClient';  // ✅ Ensure correct import path

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const user = ref(null);

// Function to sign in the user
const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = "Invalid email or password.";
  } else {
    user.value = data.user;
    console.log("Signed in:", data.user);
  }
};

// Function to sign out the user
const signOut = async () => {
  await supabase.auth.signOut();
  user.value = null;
};
</script>


<style scoped>

</style>