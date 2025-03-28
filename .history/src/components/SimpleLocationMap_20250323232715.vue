<template>
    <div id="simpleMap" style="width: 100%; height: 500px;"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  
  export default {
    name: 'SimpleLocationMap',
    setup() {
      const map = ref(null)
  
      const initMap = () => {
        // Get the div by ID (or use a ref)
        const mapDiv = document.getElementById('simpleMap')
        if (!mapDiv) {
          console.error('Map div not found.')
          return
        }
        map.value = new google.maps.Map(mapDiv, {
          center: { lat: 39.8283, lng: -98.5795 }, // Center of the U.S.
          zoom: 4,
        })
      }
  
      onMounted(() => {
        if (window.google && window.google.maps) {
          initMap()
        } else {
          // Poll for window.google every 100ms until it's available
          const interval = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(interval)
              initMap()
            }
          }, 100)
        }
      })
  
      return { map }
    }
  }
  </script>
  
  <style scoped>
  #simpleMap {
    width: 100%;
    height: 500px;
  }
  </style>
  