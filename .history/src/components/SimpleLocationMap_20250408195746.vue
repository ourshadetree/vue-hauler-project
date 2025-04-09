<template>
  <div class="station-map-container">
    <!-- This div will host the Google Map -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// References for the map and markers.
const map = ref(null)
const markers = ref([])

// Set default center (e.g., the center of the US) and zoom level.
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Function to clear existing markers.
function clearMarkers() {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
}

// Load station markers from 'a_to_b_stations'.
async function loadStationMarkers() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, station_name')

  if (error) {
    console.error('Error fetching station data:', error)
    return
  }

  // Clear any existing markers before adding new ones.
  clearMarkers()

  data.forEach(row => {
    // Only add a marker if both latitude and longitude are present.
    if (row.lat == null || row.lng == null) return
    const position = { lat: row.lat, lng: row.lng }
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: row.station_name || `Station ${row.id}`
    })

    // Attach an info window that shows station information.
    const infoWindow = new google.maps.InfoWindow({
      content: `<div>
                  <strong>${row.station_name || `Station ${row.id}`}</strong><br>
                  Lat: ${row.lat}, Lng: ${row.lng}
                </div>`
    })
    marker.addListener('click', () => {
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
  })
}

// Initialize the map and load markers.
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: Map container (#stationMap) not found.')
    return
  }

  // Create the map using default settings (standard Google Maps style).
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom
  })

  // Load station markers from Supabase.
  await loadStationMarkers()
}

// Wait for the Google Maps API to be loaded, then initialize the map.
onMounted(() => {
  if (window.google && window.google.maps) {
    initMap()
  } else {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval)
        initMap()
      }
    }, 100)
  }
})
</script>

<style scoped>
.station-map-container {
  width: 100%;
  height: 600px; /* Adjust height as needed */
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 10px; /* Optional: remove if you prefer no rounded corners */
}
</style>
