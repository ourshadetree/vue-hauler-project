<template>
  <div id="app">
    <!-- … your fixed nav … -->

    <div id="bannerBox">
      <img id="banner" src="../src/assets/haulersUnitedBanner1 copy.svg" alt="haulerBanner" />

      <div class="auth-buttons">
        <!-- if no user, show Sign In / Sign Up buttons -->
        <button v-if="!user" @click="openModal('SignInForm')">Sign In</button>
        <button v-if="!user" @click="openModal('SignUpForm')">Sign Up</button>

        <!-- Profile icon → dropdown toggle -->
        <div class="profile-container" @click="toggleProfileMenu">
          <img
            :src="user ? require('@/assets/haulersUnitedLogo4.svg') : require('@/assets/profileIcon.svg')"
            alt="Profile Icon"
            class="profile-icon"
          />
          <ul v-if="showProfileMenu" class="profile-menu">
            <li v-if="!user" @click="openModal('SignInForm')">Sign In</li>
            <li v-if="!user" @click="openModal('SignUpForm')">Sign Up</li>
            <li v-if="user" @click="goToProfile">View Profile</li>
            <!-- future items here -->
          </ul>
        </div>
      </div>
    </div>

    <div id="pageContent">
      <router-view/>
    </div>

    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script>
import Modal      from '@/components/Modal.vue'
import SignInForm from '@/components/SignInForm.vue'
import SignUpForm from '@/components/SignUpForm.vue'
import { supabase } from '@/supabaseClient' // your supabase client

export default {
  name: 'App',
  components: { Modal, SignInForm, SignUpForm },
  data() {
    return {
      activeModal: '',        // “SignInForm” or “SignUpForm”
      showProfileMenu: false,
      user: null,
    }
  },
  created() {
    // initial user check
    const session = supabase.auth.session()
    this.user = session?.user || null

    // listen for changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this.user = session?.user || null
    })
  },
  methods: {
    openModal(name) {
      this.activeModal = name
      this.showProfileMenu = false
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },
    goToProfile() {
      this.showProfileMenu = false
      this.$router.push('/profile')
    },
  },
}
</script>

<style>
/* … your existing styles … */

.profile-container {
  position: relative;
  cursor: pointer;
}
.profile-icon {
  width: 30px; height: 30px; border-radius: 50%;
}
.profile-menu {
  position: absolute;
  top: 110%; right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  list-style: none;
  padding: 0.5rem 0;
  z-index: 1000;
}
.profile-menu li {
  padding: 0.5rem 1rem;
  white-space: nowrap;
}
.profile-menu li:hover {
  background-color: #f5f5f5;
}
</style>
