<template>
    <div class="members">
      <h1>This is a members page</h1>
    </div>
    <SignInForm />
  </template>

<script>
import SignInForm from '@/components/SignInForm.vue';

export default {
  components: {
    SignInForm
  },
}

</script>
 
<style scoped>

h1 {
  border-bottom: 0;
}

</style>