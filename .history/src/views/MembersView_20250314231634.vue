<template>
    <div class="members">
      <h1>This is a members page</h1>
    </div>
    <SignInForm />
    <SignUpForm />
  </template>

<script>
import SignInForm from '@/components/SignInForm.vue';
import SignUpForm from '@/components/SignUpForm.vue';

export default {
  components: {
    SignInForm,
    SignUpForm,

  },
}

</script>
 
<style scoped>

h1 {
  border-bottom: 0;
}

</style>