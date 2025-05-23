<template>
    <div class="signup-view">
      <SignUpForm @success="onSuccess" />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import SignUpForm     from '@/components/SignUpForm.vue'
  
  const router = useRouter()
  
  function onSuccess() {
    // after successful sign‑up, navigate into the protected profile route
    router.push({ name: 'profile' })
  }
  </script>
  
  <style scoped>
  .signup-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  </style>
  