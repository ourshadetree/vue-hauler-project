<template>
  <div id="app">
    <!-- Fixed Nav on the left -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/members">Members Services</router-link>
      <router-link to="/fuelTools">Fuel Tools</router-link>
      <router-link to="/loadBoard">Load Board</router-link>
    </nav>

    <!-- Fixed Banner at the top -->
    <div id="bannerBox">
      <img
        alt="haulerBanner"
        id="banner"
        src="@/assets/haulersUnitedBanner1 copy.svg"
      />
      <!-- Auth / Profile on the right -->
      <div class="auth-buttons">
        <button v-if="!user" @click="openModal('SignInForm')">Sign In</button>
        <button v-if="!user" @click="openModal('SignUpForm')">Sign Up</button>

        <div class="profile-container" @click="toggleProfileMenu">
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
            <li v-if="!user" @click="openModal('SignInForm')">Sign In</li>
            <li v-if="!user" @click="openModal('SignUpForm')">Sign Up</li>
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
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted }  from 'vue'
import { useRouter }      from 'vue-router'
import Modal              from '@/components/Modal.vue'
import SignInForm         from '@/components/SignInForm.vue'
import SignUpForm         from '@/components/SignUpForm.vue'
import { supabase }       from '@/../supabaseClient'

const router          = useRouter()
const activeModal     = ref('')      // 'SignInForm' | 'SignUpForm'
const showProfileMenu = ref(false)
const user            = ref(null)

// Load initial session
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user ?? null
})

// React to auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
})

function openModal(name) {
  activeModal.value     = name
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
  // close the menu immediately
  showProfileMenu.value = false
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error.message)
  } else {
    user.value = null
    router.push('/')
  }
}
</script>

<style>
/* ...keep your existing CSS from before... */

.profile-menu li {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  cursor: pointer;
}
/* highlight for menu items */
.profile-menu li:hover {
  background-color: #f5f5f5;
}
</style>
