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
          .order('random()')''
          .range(0, 10000) // adjust as needed
  
        if (error) {
          console.error('[initMap] Error fetching user data:', error)
          return
        }
        console.log('[initMap] Fetched user data:', data)
  
        // Log distinct states from data
        const distinctStates = new Set(data.map(user => user.state.trim().toLowerCase()))
        console.log('[initMap] Distinct states:', [...distinctStates])
  
        // Group by state, choosing one representative city per state
        const stateCityMap = new Map();
        data.forEach((user) => {
          if (user.city && user.state) {
            const stateKey = user.state.trim().toLowerCase();
            // Only add one representative city per state
            if (!stateCityMap.has(stateKey)) {
              stateCityMap.set(stateKey, user.city.trim());
            }
          }
        });
        console.log('[initMap] States with representative cities:', stateCityMap)
  
        // Use Google Maps Geocoder to get lat/lng for each state (using representative city)
        const geocoder = new google.maps.Geocoder();
  
        // Function to geocode an address using a Promise
        const geocodeAddress = (address) => {
          return new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
              if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                console.error(`[initMap] Geocode error for ${address}: ${status}`);
                resolve(null); // Continue processing even if one fails
              }
            });
          });
        };
  
        // Helper function to delay execution (200ms)
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
        // Process each state and add a marker
        for (const [stateKey, city] of stateCityMap.entries()) {
          // Create address string with city, state, and country for better accuracy
          const address = `${city}, ${stateKey}, USA`;
          const position = await geocodeAddress(address);
          if (position) {
            new google.maps.Marker({
              position,
              map: map.value,
              title: address,
              icon: {
                url: customIcon,
                scaledSize: new google.maps.Size(30, 30) // adjust as needed
              }
            });
            console.log(`[initMap] Added marker for ${address} at ${position}`);
          }
          await delay(200);
        }
      };
  
      onMounted(() => {
        console.log('[onMounted] Component mounted. Checking for window.google...');
        if (window.google && window.google.maps) {
          console.log('[onMounted] Google Maps API is already loaded.');
          initMap();
        } else {
          console.log('[onMounted] Google Maps API not found. Starting polling...');
          const interval = setInterval(() => {
            console.log('[Polling] Checking for Google Maps API...');
            if (window.google && window.google.maps) {
              console.log('[Polling] Google Maps API is now available. Clearing interval and initializing map...');
              clearInterval(interval);
              initMap();
            }
          }, 100);
        }
      });
  
      return { map };
    },
  };
  </script>
  
  <style scoped>
  #simpleMap {
    width: 100%;
    height: 400px;
    border-radius: 10px;
  }
  </style>
  