<template>
    <div id="simpleMap"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  import { supabase } from '@/../supabaseClient' // Ensure the path is correct
  import customIcon from '@/assets/potentialUserIcon.svg' // Your custom marker icon
  
  export default {
    name: 'NewUserSalesMap',
    setup() {
      const map = ref(null)
  
      // Helper: delay execution
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
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
  
        // Pagination parameters
        const batchSize = 1000
        let from = 0
        let done = false
  
        // Use a Map to store one representative city per state (key: state lowercase, value: city)
        const stateCityMap = new Map()
  
        // Fetch data in batches until we've either fetched all rows or collected markers for all 45 states
        while (!done && stateCityMap.size < 45) {
          const { data, error } = await supabase
            .from('potential_users')
            .select('city, state')
            .range(from, from + batchSize - 1)
          if (error) {
            console.error('[initMap] Error fetching user data:', error)
            break
          }
          console.log(`[initMap] Fetched ${data.length} rows (from ${from} to ${from + batchSize - 1}).`)
  
          // If no rows are returned, stop pagination
          if (data.length === 0) {
            done = true
            break
          }
  
          // For each row, add a representative city for the state if not already present
          data.forEach((user) => {
            if (user.city && user.state) {
              const stateKey = user.state.trim().toLowerCase()
              if (!stateCityMap.has(stateKey)) {
                stateCityMap.set(stateKey, user.city.trim())
              }
            }
          })
  
          // If fewer rows were returned than batchSize, we've reached the end
          if (data.length < batchSize) {
            done = true
          } else {
            from += batchSize
          }
        }
  
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
  
        // Process each state and add a marker
        for (const [stateKey, city] of stateCityMap.entries()) {
          const address = `${city}, ${stateKey}, USA`
          const position = await geocodeAddress(address)
          if (position) {
            new google.maps.Marker({
              position,
              map: map.value,
              title: address,
              icon: {
                url: customIcon,
                scaledSize: new google.maps.Size(30, 30)
              }
            })
            console.log(`[initMap] Added marker for ${address} at ${position}`)
          }
          await delay(200) // Delay between geocoding requests
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
  