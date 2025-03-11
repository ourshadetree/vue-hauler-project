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


<script>

</script>


<style scoped>

</style>