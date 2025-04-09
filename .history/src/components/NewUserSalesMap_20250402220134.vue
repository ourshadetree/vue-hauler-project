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
      const markers = [] // Array to hold all markers
  
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
  
        // Filter out duplicates based on city and state
        const uniqueLocations = new Set()
        data.forEach((user) => {
          if (user.city && user.state) {
            const key = `${user.city.trim().toLowerCase()},${user.state.trim().toLowerCase()}`
            uniqueLocations.add(key)
          }
        })
        console.log('[initMap] Unique locations:', uniqueLocations)
  
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
                resolve(null) // Resolve as null so that processing continues
              }
            })
          })
        }
  
        // Helper function to delay execution
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  
        // Process each unique location sequentially with a delay
        for (const locationKey of uniqueLocations) {
          const [city, state] = locationKey.split(',')
          // Append ", USA" for better geocoding accuracy
          const address = `${city}, ${state}, USA`
          const position = await geocodeAddress(address)
          if (position) {
            const marker = new google.maps.Marker({
              position,
              title: address,
            })
            markers.push(marker)
            console.log(`[initMap] Added marker for ${address} at ${position}`)
          }
          // Delay between requests to avoid rate limits (e.g., 200ms)
          await delay(200)
        }
  
        // Use MarkerClusterer to manage markers
        if (markers.length > 0) {
          // Ensure the MarkerClusterer library is loaded.
          new MarkerClusterer(map.value, markers, {
            imagePath:
              'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          })
          console.log(`[initMap] Marker clustering initialized with ${markers.length} markers.`)
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
  