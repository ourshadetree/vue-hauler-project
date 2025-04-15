<template>
  <div id="memberServicesContainer">
    <atobEmbed />
  </div>
</template>

<script>
import Commitment from '@/components/Commitment.vue'
import atobEmbed from '@/components/atobEmbed.vue'

export default {
  name: 'members',
  components: {
    Commitment,
    atobEmbed
  },
}
</script>

<style scoped>
/* Overall Container: Blue background with white text */
#memberServicesContainer {
  height: 200vh;
}

</style>