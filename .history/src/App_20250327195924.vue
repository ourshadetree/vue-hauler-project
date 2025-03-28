<!-- Header.vue -->
<template>
  <div id="header">
    <nav>
      <!-- Your existing nav links -->
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/members">Members</router-link>
      <router-link to="/fuelTools">Fuel Tools</router-link>
      <router-link to="/loadBoard">Load Board</router-link>
    </nav>

    <!-- Profile and Auth Buttons on the top right -->
    <div class="auth-buttons">
      <img src="@/assets/profile-icon.png" alt="Profile Icon" class="profile-icon" />
      <button @click="openModal('SignInForm')">Sign In</button>
      <button @click="openModal('SignUpForm')">Sign Up</button>
    </div>

    <!-- Modal for Sign In/Sign Up forms -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <!-- Dynamically render the form component -->
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script>
import SignInForm from "@/components/SignInForm.vue";
import SignUpForm from "@/components/SignUpForm.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "Header",
  components: {
    SignInForm,
    SignUpForm,
    Modal
  },
  data() {
    return {
      activeModal: ""  // Will be set to "SignInForm" or "SignUpForm" to open a modal
    };
  },
  methods: {
    openModal(formName) {
      this.activeModal = formName;
    }
  }
};
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

/* Style the nav as needed */
nav {
  display: flex;
  gap: 10px;
}

/* Profile and auth buttons container */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Profile icon */
.profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* Auth buttons styling */
.auth-buttons button {
  padding: 8px 12px;
  border: none;
  background-color: #073763;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.auth-buttons button:hover {
  background-color: #09457a;
}
</style>
