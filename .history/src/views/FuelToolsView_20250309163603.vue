<template>
    <div class="fuelTools">
      <h1>This is a fuelTools page</h1>
    </div>
    <NationalAvgTool />
  </template>

<script>
import NationalAvgTool from '@/components/NationalAvgTool.vue';

export default {
  components: {
    NationalAvgTool
  },
}

</script>
 
<style scoped>

h1 {
  border-bottom: 0;
}

</style> 