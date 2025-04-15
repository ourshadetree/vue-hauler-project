<template>
  <div class="embedded-page">
    <iframe :src="pageUrl" width="100%" height="600" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageUrl: 'https://go.atob.com/haulersunited'
    }
  }
}
</script>

<style scoped>
.embedded-page {
  /* Adjust as needed */
  
}
iframe {
  display: block;
  width: 100%;
  border: none;
}
</style>
