<template>
  <div id="app" v-if="!isLoading">
    <!-- Debug message for user presence -->
    <p style="color: red;">DEBUG: user is {{ user ? 'present' : 'null' }}</p>

    <!-- Left nav -->
    <nav>
      <router-link to="/" exact>Home</router-link>
      <router-link to="/fuelTools">Fuel</router-link>
      <router-link to="/factoring">Factoring</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <!-- Top banner + Auth buttons -->
    <div id="bannerBox">
      <img
        id="banner"
        src="@/assets/haulersUnitedBanner1 copy.svg"
        alt="haulerBanner"
      />

      <div class="auth-buttons">
        <template v-if="!user">
          <router-link to="/signin" class="btn">Sign In</router-link>
          <router-link to="/signup" class="btn">Sign Up</router-link>
        </template>
        <template v-else>
          <span class="welcome-text">Welcome, {{ profileName }}</span>
          <button class="btn" @click="goToProfile">Profile</button>
          <button class="btn" @click="signOut">Sign Out</button>
        </template>
      </div>
    </div>

    <!-- Main router outlet -->
    <div id="pageContent">
      <router-view />
    </div>
  </div>

  <!-- Loading screen while the session is being restored -->
  <div v-else class="loading">
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/composables/useAuth'  // Use the singleton auth state

// Loading state to prevent rendering until user session is ready
const isLoading = ref(true)
const { user, profileName, signOut, loadUser } = auth  // Destructure auth from singleton

// Wait for the user session to be restored before rendering the app
onMounted(async () => {
  await loadUser()  // Load the user session
  if (!user.value) {
    // If no user is logged in, redirect to sign-in page
    router.push({ name: 'signin' })
  }
  isLoading.value = false  // Set loading state to false after session is loaded
})

const router = useRouter()

function goToProfile() {
  router.push({ name: 'profile' })
}
</script>

<style scoped>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Full-screen layout */
html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: 'Karla', 'Segoe UI', sans-serif;
  background-color: #fff;
}

/* Left nav - desktop */
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 120px;
  height: 100%;
  padding-top: 90px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
nav a {
  display: block;
  padding: 15px;
  text-decoration: none;
  color: #0C2442;
}
nav a.router-link-exact-active {
  color: #B11818;
  font-weight: bold;
  border-left: 2px solid #B11818;
}

/* Top banner */
#bannerBox {
  position: fixed;
  top: 0;
  left: 120px;
  right: 0;
  height: 50px;
  background: #0C2442;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 999;
}
#banner {
  width: 22%;
  height: 75%;
}

/* Auth buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}
.welcome-text {
  color: #fff;
  font-family: 'Sora', sans-serif;
  margin-right: 10px;
}

/* Red button styling */
.btn {
  display: inline-block;
  padding: 8px 12px;
  background: #B11818;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn:hover {
  background: #8F1212;
}

/* Main content area */
#pageContent {
  margin-left: 120px;
  margin-top: 50px;
  padding: 20px;
}

/* Loading state */
.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #0C2442;
}

/* Responsive tweak: stack nav on mobile */
@media (max-width: 767px) {
  nav {
    position: static;
    width: 100%;
    height: auto;
    padding: 0.5rem 0;
    flex-direction: row;
    justify-content: space-around;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    margin-top: 50px;
    z-index: 100;
  }
  #bannerBox {
    left: 0;
  }
  #pageContent {
    margin-left: 0;
    margin-top: 50px;
  }
}
</style>
