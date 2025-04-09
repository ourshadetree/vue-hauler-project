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

    // Mapping of table names to marker color options.
    const tableMarkerOptions = {
      '7_fleet_fuel_data': { color: '#B11818' },      // Red
      'casey_fuel_data': { color: '#0C2442' },          // Dark Blue
      'circle_k_fuel_data': { color: '#008000' },       // Green
      'kwik_fuel_data': { color: '#FFA500' },           // Orange
      'maverick_fuel_data': { color: '#073763' },       // Navy
      'sheetz_fuel_data': { color: '#800080' },         // Purple
      'ta_fuel_data': { color: '#FFD700' }              // Gold
    }

    const initMap = async () => {
      console.log('[initMap] Initializing map...')
      const mapDiv = document.getElementById('simpleMap')
      if (!mapDiv) {
        console.error('[initMap] Map div not found.')
        return
      }
      // Initialize the map centered on the U.S.
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4,
      })
      console.log('[initMap] Map initialized successfully.')

      // Define the tables to fetch from.
      const tables = [
        '7_fleet_fuel_data',
        'casey_fuel_data',
        'circle_k_fuel_data',
        'kwik_fuel_data',
        'maverick_fuel_data',
        'sheetz_fuel_data',
        'ta_fuel_data'
      ]

      // Fetch data concurrently from all tables.
      const fetchPromises = tables.map((table) =>
        supabase
          .from(table)
          .select('latitude, longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[initMap] Error fetching data from ${table}:`, error)
              return []  // Return an empty array if there is an error.
            }
            console.log(`[initMap] Fetched data from ${table}:`, data)
            // Attach the table name to each row for later use
            return data.map(row => ({ ...row, table }))
          })
      )

      // Wait for all fetches to complete and combine the results.
      const results = await Promise.all(fetchPromises)
      const allData = results.flat()

      console.log('[initMap] Total combined data:', allData.length)

      // Add markers for each station.
      allData.forEach((station) => {
        if (station.latitude && station.longitude && station.table) {
          // Get the color for this station's table.
          const options = tableMarkerOptions[station.table]
          const markerColor = options ? options.color : '#000000'
          // Create a symbol for the marker.
          const markerSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1,
            scale: 6 // Adjust size as needed
          }
          new google.maps.Marker({
            position: { lat: station.latitude, lng: station.longitude },
            map: map.value,
            title: `${station.table} Station`,
            icon: markerSymbol
          })
          console.log(
            `[initMap] Added marker for ${station.table} at (${station.latitude}, ${station.longitude})`
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
