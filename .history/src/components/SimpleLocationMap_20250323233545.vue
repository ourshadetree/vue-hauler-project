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
        console.log('[initMap] Trying to initialize the map...')
        // Get the div by ID (or use a ref)
        const mapDiv = document.getElementById('simpleMap')
        if (!mapDiv) {
          console.error('[initMap] Map div not found.')
          return
        }
        map.value = new google.maps.Map(mapDiv, {
          center: { lat: 39.8283, lng: -98.5795 }, // Center of the U.S.
          zoom: 4,
        })
        console.log('[initMap] Map initialized successfully.')
      }
  
      onMounted(() => {
        console.log('[onMounted] Component mounted. Checking for window.google...')
        if (window.google && window.google.maps) {
          console.log('[onMounted] Google Maps API is already loaded.')
          initMap()
        } else {
          console.log('[onMounted] Google Maps API not found. Starting polling...')
          const interval = setInterval(() => {
            console.log('[Polling] Checking for Google Maps API...')
            if (window.google && window.google.maps) {
              console.log('[Polling] Google Maps API is now available. Clearing interval and initializing map...')
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
  