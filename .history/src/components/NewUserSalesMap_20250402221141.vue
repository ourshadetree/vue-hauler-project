<template>
    <div id="simpleMap"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue'
  import { supabase } from '@/../supabaseClient' // Ensure the path is correct
  // Import your custom marker icon asset (adjust path as needed)
  import customIcon from '../assets/potentialUserIcon.svg'
  
  export default {
    name: 'NewUserSalesMap',
    setup() {
      const map = ref(null)
  
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
  
        // Fetch city and state data from potential_users table
        const { data, error } = await supabase
          .from('potential_users')
          .select('city, state')
  
        if (error) {
          console.error('[initMap] Error fetching user data:', error)
          return
        }
        console.log('[initMap] Fetched user data:', data)
  
        // Group by state and limit markers per state (e.g., up to 10 per state)
        const stateCityMap = {}
        const limitedLocations = [] // Array to hold "city,state" strings
  
        data.forEach((user) => {
          if (user.city && user.state) {
            const stateKey = user.state.trim().toLowerCase()
            const cityKey = user.city.trim().toLowerCase()
            // Initialize set for state if not already done
            if (!stateCityMap[stateKey]) {
              stateCityMap[stateKey] = new Set()
            }
            // Only add if we haven't reached our limit (10 per state) and city not already added
            if (stateCityMap[stateKey].size < 10 && !stateCityMap[stateKey].has(cityKey)) {
              stateCityMap[stateKey].add(cityKey)
              limitedLocations.push(`${cityKey},${stateKey}`)
            }
          }
        })
        console.log('[initMap] Limited unique locations:', limitedLocations)
  
        // Use Google Maps Geocoder to get lat/lng for each unique location
        const geocoder = new google.maps.Geocoder()
  
        // Function to geocode an address using a Promise
        const geocodeAddress = (address) => {
          return new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
              if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location)
              } else {
                console.error(`[initMap] Geocode error for ${address}: ${status}`)
                resolve(null) // Resolve as null so processing continues
              }
            })
          })
        }
  
        // Helper function to delay execution
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
        // Process each limited location sequentially with a delay to avoid rate limits
        limitedLocations.forEach(async (locationKey) => {
          const [city, state] = locationKey.split(',')
          // Append ", USA" for better geocoding accuracy
          const address = `${city}, ${state}, USA`
          const position = await geocodeAddress(address)
          if (position) {
            new google.maps.Marker({
              position,
              map: map.value,
              title: address,
              icon: customIcon // Use your custom marker icon here
            })
            console.log(`[initMap] Added marker for ${address} at ${position}`)
          }
          // Delay between requests (you might want to chain these promises for sequential execution)
          await delay(200)
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
    height: 400px;
    border-radius: 10px;
  }
  </style>
  