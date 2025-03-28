<template>
    <div id="simpleMap"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  import { supabase } from '@/../supabaseClient' // Ensure the path is correct
  
  export default {
    name: 'SimpleLocationMap',
    setup() {
      const map = ref(null)
  
      const initMap = async () => {
        console.log('[initMap] Trying to initialize the map...')
        // Get the div by ID (or you could use a ref)
        const mapDiv = document.getElementById('simpleMap')
        if (!mapDiv) {
          console.error('[initMap] Map div not found.')
          return
        }
        // Initialize the map
        map.value = new google.maps.Map(mapDiv, {
          center: { lat: 39.8283, lng: -98.5795 }, // Center of the U.S.
          zoom: 4,
        })
        console.log('[initMap] Map initialized successfully.')
  
        // Fetch gas station data from Supabase
        const { data, error } = await supabase
          .from('7_fleet_fuel_data')
          .select('latitude, longitude')
  
        if (error) {
          console.error('[initMap] Error fetching gas station data:', error)
          return
        }
        console.log('[initMap] Fetched gas station data:', data)
  
        // Add markers for each gas station
        data.forEach((station) => {
          if (station.latitude && station.longitude) {
            new google.maps.Marker({
              position: { lat: station.latitude, lng: station.longitude },
              map: map.value,
              title: 'Gas Station'
            })
            console.log(
              `[initMap] Added marker at (${station.latitude}, ${station.longitude})`
            )
          }
        })
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
              console.log(
                '[Polling] Google Maps API is now available. Clearing interval and initializing map...'
              )
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
    height: 400px;
  }
  </style>
  