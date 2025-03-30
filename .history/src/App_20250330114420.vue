<template>
  <div id="app">
    <!-- Fixed Nav on the left -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/members">Members Services</router-link>
      <router-link to="/fuelTools">Fuel Tools</router-link>
      <router-link to="/loadBoard">Load Board</router-link>
    </nav>

    <!-- Fixed Banner at the top -->
    <div id="bannerBox">
      <img
        alt="haulerBanner"
        id="banner"
        src="../src/assets/haulersUnitedBanner1 copy.svg"
      />
      <!-- Auth Buttons on the right -->
      <div class="auth-buttons">
        <button @click="openModal('SignInForm')">Sign In</button>
        <button @click="openModal('SignUpForm')">Sign Up</button>
        <img
          src="@/assets/haulersUnitedLogo4.svg"
          alt="Profile Icon"
          class="profile-icon"
        />
      </div>
    </div>

    <!-- Main content area (Router View) -->
    <div id="pageContent">
      <router-view/>
    </div>

    <!-- Modal for authentication forms -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import SignInForm from "@/components/SignInForm.vue";
import SignUpForm from "@/components/SignUpForm.vue";

export default {
  name: "App",
  components: {
    Modal,
    SignInForm,
    SignUpForm,
  },
  data() {
    return {
      activeModal: "", // Will be set to "SignInForm" or "SignUpForm"
    };
  },
  methods: {
    openModal(formName) {
      this.activeModal = formName;
    },
  },
};
</script>

<style>
/* Reset margin/padding for a clean slate */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Global Typography & Background */
html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: 'Karla', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  background-color: #FFFFFF; /* Main page background */
}

/* FIXED NAV on the left side */
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 120px;
  height: 100%;
  padding-top: 90px; /* Space for banner */
  background-color: #FFFFFF;
  border-right: 1px solid #E5E5E5;
}

nav a {
  display: block;
  padding: 15px;
  text-decoration: none;
  color: #0C2442; /* Dark Blue */
  font-size: 1rem;
}

nav a:hover {
  background-color: #F5F5F5;
}

nav a.router-link-exact-active {
  color: #B11818; /* Red accent for active link */
  font-weight: bold;
  border-left: 2px solid #B11818;
}

/* FIXED BANNER at the top */
#bannerBox {
  position: fixed;
  top: 0;
  left: 120px; /* same width as nav */
  right: 0;
  height: 50px;
  background-color: #0C2442; /* Dark Blue for hero/banner */
  z-index: 999; /* stays above content */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

#banner {
  width: 22%;
  height: 75%; 
}

/* Auth buttons in the banner */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-buttons .profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.auth-buttons button {
  padding: 8px 12px;
  border: none;
  background-color: #B11818; /* Red accent */
  color: #FFFFFF;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'Sora', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  transition: background-color 0.3s;
}

.auth-buttons button:hover {
  background-color: #8F1212;
}

/* MAIN CONTENT area */
#pageContent {
  margin-left: 120px; /* same width as nav */
  margin-top: 50px;  /* same height as banner */
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}
</style>
