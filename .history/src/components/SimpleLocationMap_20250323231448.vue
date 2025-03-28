<template>
    <div id="mapContainer">
      <div id="map"></div>
      <div id="mapTools">
        <!-- Optional: add map controls or extra tools here -->
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, getCurrentInstance, watch } from 'vue'
  import { supabase } from '@/../supabaseClient' // Ensure this path is correct
  
  export default {
    name: 'GasStationsMap',
    setup() {
      const map = ref(null)
      const instance = getCurrentInstance()
  
      // Function to initialize the map once the API is ready
      const initMap = async () => {
        const mapDiv = document.getElementById('map')
        map.value = new google.maps.Map(mapDiv, {
          center: { lat: 39.8283, lng: -98.5795 }, // Center of the U.S.
          zoom: 4,
        })
  
        // Fetch gas station data from Supabase
        const { data, error } = await supabase
          .from('7_fleet_fuel_data')
          .select('latitude, longitude')
  
        if (error) {
          console.error('Error fetching gas station data:', error)
          return
        }
  
        // Add markers for each gas station
        data.forEach((station) => {
          if (station.latitude && station.longitude) {
            new google.maps.Marker({
              position: { lat: station.latitude, lng: station.longitude },
              map: map.value,
              title: 'Gas Station'
            })
          }
        })
      }
  
      onMounted(() => {
        // Access the global property injected by the plugin
        const gmapLoaded = instance.appContext.config.globalProperties.$gmapLoaded
        if (gmapLoaded) {
          // API is already loaded
          initMap()
        } else {
          // Watch for when it becomes available
          watch(
            () => instance.appContext.config.globalProperties.$gmapLoaded,
            (newVal) => {
              if (newVal) {
                initMap()
              }
            }
          )
        }
      })
  
      return { map }
    }
  }
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 500px; /* Adjust as needed */
  }
  #mapContainer {
    display: flex;
    flex-direction: column;
  }
  </style>
  