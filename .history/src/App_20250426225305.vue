<template>
  <div id="app">
    <!-- Fixed Nav on the left -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/fuelTools">Fuel</router-link>
      <router-link to="/factoring">Factoring</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>

    <!-- Fixed Banner at the top -->
    <div id="bannerBox">
      <img
        id="banner"
        src="@/assets/haulersUnitedBanner1 copy.svg"
        alt="haulerBanner"
      />

      <!-- Auth / Profile on the right -->
      <div class="auth-buttons">
        <!-- when not signed in -->
        <template v-if="!user">
          <button @click="openModal(SignInForm)">Sign In</button>
          <button @click="openModal(SignUpForm)">Sign Up</button>
        </template>

        <!-- when signed in -->
        <template v-else>
          <span class="welcome-text">Welcome, {{ profileName }}</span>
        </template>

        <div
          class="profile-container"
          ref="profileContainer"
          @click.stop="toggleProfileMenu"
        >
          <img
            v-if="user"
            src="@/assets/haulersUnitedLogo4.svg"
            alt="Hauler Logo"
            class="profile-icon"
          />
          <div
            v-else
            class="profile-placeholder"
            aria-label="Profile menu"
          ></div>

          <ul v-if="showProfileMenu" class="profile-menu">
            <li v-if="!user" @click="openModal(SignInForm)">Sign In</li>
            <li v-if="!user" @click="openModal(SignUpForm)">Sign Up</li>
            <li v-if="user" @click="goToProfile">View Profile</li>
            <li v-if="user" @click="signOut">Sign Out</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div id="pageContent">
      <router-view />
    </div>

    <!-- Authentication Modal -->
    <Modal v-if="activeModal" @close="activeModal = null">
      <component :is="activeModal" @close="activeModal = null" />
    </Modal>

    <ChatAssistanct />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
import { useRouter }    from 'vue-router'
import Modal            from '@/components/Modal.vue'
import SignInForm       from '@/components/SignInForm.vue'
import SignUpForm       from '@/components/SignUpForm.vue'
import ChatAssistanct   from '@/components/ChatAssistanct.vue'
import { supabase }     from './supabaseClient'

const router          = useRouter()
const activeModal     = ref(null)
const showProfileMenu = ref(false)
const user            = ref(null)
const profileName     = ref('')
const profileContainer = ref(null)

// load current session + profileName
async function loadUser() {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user ?? null

  if (user.value) {
    // fetch first_name from user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('first_name')
      .eq('user_id', user.value.id)
      .single()
    if (!error && data) profileName.value = data.first_name
  } else {
    profileName.value = ''
  }
}

// close menu when clicking outside
function handleDocumentClick(e) {
  if (
    showProfileMenu.value &&
    profileContainer.value &&
    !profileContainer.value.contains(e.target)
  ) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  loadUser()
  // watch auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    loadUser()
  })
  // global click listener for closing the menu
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

function openModal(component) {
  activeModal.value     = markRaw(component)
  showProfileMenu.value = false
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function goToProfile() {
  showProfileMenu.value = false
  router.push('/profile')
}

async function signOut() {
  showProfileMenu.value = false
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error.message)
  } else {
    user.value = null
    profileName.value = ''
    router.push('/')
  }
}
</script>

<style>
/* Reset */
* {
  margin: 0; padding: 0; box-sizing: border-box;
}

/* Full-screen layout */
html, body, #app {
  width: 100%; height: 100%;
  overflow-x: hidden;
  font-family: 'Karla', 'Segoe UI', sans-serif;
  background-color: #fff;
}

/* Left nav */
nav {
  position: fixed; top: 0; left: 0;
  width: 120px; height: 100%;
  padding-top: 90px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
}
nav a {
  display: block; padding: 15px;
  text-decoration: none; color: #0C2442;
}
nav a.router-link-exact-active {
  color: #B11818; font-weight: bold;
  border-left: 2px solid #B11818;
}

/* Top banner */
#bannerBox {
  position: fixed; top: 0; left: 120px; right: 0;
  height: 50px;
  background: #0C2442;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 20px; z-index: 999;
}
#banner {
  width: 22%; height: 75%;
}

/* Auth buttons */
.auth-buttons {
  display: flex; align-items: center; gap: 10px;
}
.auth-buttons button {
  padding: 8px 12px; background: #B11818; color: #fff;
  border: none; border-radius: 4px; cursor: pointer;
  font-size: 0.9rem;
}
.auth-buttons button:hover {
  background: #8F1212;
}
.welcome-text {
  color: #fff;
  font-family: 'Sora', sans-serif;
  margin-right: 10px;
}

/* Profile icon & menu */
.profile-container {
  position: relative; cursor: pointer;
}
.profile-icon {
  width: 30px; height: 30px; border-radius: 50%;
}
.profile-placeholder {
  width: 30px; height: 30px; border-radius: 50%;
  background-color: #CCCCCC;
}
.profile-menu {
  position: absolute; top: 110%; right: 0;
  background: #fff; border: 1px solid #ddd; border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  list-style: none; padding: 0.5rem 0; z-index: 1000;
}
.profile-menu li {
  padding: 0.5rem 1rem; white-space: nowrap;
  cursor: pointer;
}
.profile-menu li:hover {
  background-color: #f5f5f5;
}

/* Main content area */
#pageContent {
  margin-left: 120px;
  margin-top: 50px;
  padding: 20px;
}
</style>
