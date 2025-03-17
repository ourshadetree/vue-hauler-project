<template>
    <div class="members">
      <h1>This is a members page</h1>
    </div>
    
    <SignUpForm />
  </template>

<script>

import SignUpForm from '@/components/SignUpForm.vue';

export default {
  components: {
    
    SignUpForm,

  },
}

</script>
 
<style scoped>

h1 {
  border-bottom: 0;
}

</style>