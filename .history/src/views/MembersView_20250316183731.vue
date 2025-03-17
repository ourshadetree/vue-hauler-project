<template>
  <div class="members">
    <component :is="activeForm" />

    <p class="switch">
      <span v-if="activeForm === 'SignUpForm'">
        Already a member? <a href="#" @click.prevent="toggleForm">Sign In</a>
      </span>
      <span v-else>
        Don't have an account? <a href="#" @click.prevent="toggleForm">Sign Up</a>
      </span>
    </p>
  </div>
</template>

<script>
import SignUpForm from "@/components/SignUpForm.vue";
import SignInForm from "@/components/SignInForm.vue";

export default {
  components: {
    SignUpForm,
    SignInForm
  },
  data() {
    return {
      activeForm: "SignUpForm" // Default to SignUpForm
    };
  },
  methods: {
    toggleForm() {
      this.activeForm = this.activeForm === "SignUpForm" ? "SignInForm" : "SignUpForm";
    }
  }
};
</script>

<style scoped>
.members {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
