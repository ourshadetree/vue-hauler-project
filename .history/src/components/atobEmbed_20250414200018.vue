<template>
    <div class="embed-container">
      <iframe :src="embedUrl" frameborder="0" scrolling="yes"></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'atobEmbed',
    data() {
      return {
        embedUrl: 'https://go.atob.com/haulersunited'
      }
    }
  }
  </script>
  
  <style scoped>
  .embed-container {
    width: 100%;
    /* Ensure the container takes the full height it’s given by the parent */
    height: 100%;
  }
  .embed-container iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  </style>
  