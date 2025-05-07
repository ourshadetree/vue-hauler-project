<template>
  <div class="mapContainer">
    <!-- Map container where Google Maps will render -->
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

// Vuex store for listening to DOT search commands
const store = useStore()

// Map and circle references
const mapRef = ref(null)
let circle = null

// Default map center (USA) and zoom level
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Initialize the map once
onMounted(() => {
  mapRef.value = new google.maps.Map(
    document.getElementById('simpleMapNewUser'),
    {
      center: defaultCenter,
      zoom: defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }
  )
})

// Watch for the 'addGreenMarker' command from the ActionCall component
watch(
  () => store.state.mapCommand,
  (cmd) => {
    if (!cmd || cmd.command !== 'addGreenMarker') return

    // Clear previous circle if exists
    if (circle) {
      circle.setMap(null)
    }

    // Geocode the city/state
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: cmd.data.address }, (results, status) => {
      if (status !== 'OK' || !results[0]) return
      const loc = results[0].geometry.location

      // Center map and adjust zoom
      mapRef.value.setCenter(loc)
      mapRef.value.setZoom(8)

      // Draw a 50-mile radius circle (~80,467 meters)
      circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        map: mapRef.value,
        center: loc,
        radius: 40234,
      })
    })
  }
)
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 400px;
}
.mapCanvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
}
</style>