<template>
    <div id="simpleMap"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  import { supabase } from '@/../supabaseClient' // Ensure the path is correct
  import customIcon from '../assets/potentialUserIcon.svg' // Your custom marker icon
  
  export default {
    name: 'NewUserSalesMap',
    setup() {
      const map = ref(null)
  
      // Simple Fisher-Yates shuffle algorithm
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
      }
  
      const initMap = async () => {
        console.log('[initMap] Initializing map...')
        const mapDiv = document.getElementById('simpleMap')
        if (!mapDiv) {
          console.error('[initMap] Map div not found.')
          return
        }
        // Initialize map centered on the U.S.
        map.value = new google.maps.Map(mapDiv, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
        })
        console.log('[initMap] Map initialized successfully.')
  
        // Fetch a larger range of city and state data from potential_users table
        const { data, error } = await supabase
          .from('potential_users')
          .select('city, state')
          .range(0, 10000) // Adjust this range as needed
  
        if (error) {
          console.error('[initMap] Error fetching user data:', error)
          return
        }
        console.log('[initMap] Fetched user data:', data.length, 'rows')
  
        // Shuffle the fetched data to randomize sampling
        const shuffledData = shuffle(data)
        console.log('[initMap] Shuffled data length:', shuffledData.length)
  
        // Group by state and select one representative city per state
        const stateCityMap = new Map()
        shuffledData.forEach((user) => {
          if (user.city && user.state) {
            const stateKey = user.state.trim().toLowerCase()
            // Only store the first encountered city per state
            if (!stateCityMap.has(stateKey)) {
              stateCityMap.set(stateKey, user.city.trim())
            }
          }
        })
        console.log('[initMap] States with representative cities:', stateCityMap)
  
        // Use Google Maps Geocoder to get lat/lng for each state (using the representative city)
        const geocoder = new google.maps.Geocoder()
  
        // Function to geocode an address using a Promise
        const geocodeAddress = (address) => {
          return new Promise((resolve) => {
            geocoder.geocode({ address: address }, (results, status) => {
              if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location)
              } else {
                console.error(`[initMap] Geocode error for ${address}: ${status}`)
                resolve(null)
              }
            })
          })
        }
  
        // Helper function to delay execution (200ms)
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
        // Process each state and add a marker
        for (const [stateKey, city] of stateCityMap.entries()) {
          // Create an address string with city, state, and country for better geocoding accuracy
          const address = `${city}, ${stateKey}, USA`
          const position = await geocodeAddress(address)
          if (position) {
            new google.maps.Marker({
              position,
              map: map.value,
              title: address,
              icon: {
                url: customIcon,
                scaledSize: new google.maps.Size(30, 30) // Adjust dimensions as needed
              }
            })
            console.log(`[initMap] Added marker for ${address} at ${position}`)
          }
          await delay(200)
        }
      }
  
      onMounted(() => {
        console.log('[onMounted] Component mounted. Checking for window.google...')
        if (window.google && window.google.maps) {
          console.log('[onMounted] Google Maps API is already loaded.')
          initMap()
        } else {
          console.log('[onMounted] Google Maps API not found. Starting polling...')
          const interval = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(interval)
              initMap()
            }
          }, 100)
        }
      })
  
      return { map }
    },
  }
  </script>
  
  <style scoped>
  #simpleMap {
    width: 100%;
    height: 400px;
    border-radius: 10px;
  }
  </style>
  