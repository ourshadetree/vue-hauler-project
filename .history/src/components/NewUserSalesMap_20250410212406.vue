<template>
  <div class="mapContainer">
    <!-- Map container -->
    <div id="simpleMapNewUser"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/../supabaseClient'

// Map and marker state
const map = ref(null)
const currentMarkers = ref([])

// Default map center & zoom
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 3.5

// Get the Vuex store instance
const store = useStore()

// Clear all markers from the map
function clearMarkers() {
  currentMarkers.value.forEach(marker => marker.setMap(null))
  currentMarkers.value = []
}

// Load base markers from the "current_members" table using stored lat/lng
async function loadMemberMarkers() {
  const { data, error } = await supabase
    .from('current_members')
    .select('lat, lng, business_name, state')
  if (error) {
    console.error('[loadMemberMarkers] Error:', error)
    return
  }
  data.forEach(row => {
    if (row.lat == null || row.lng == null) return  // Skip rows with missing coordinates
    const pos = { lat: row.lat, lng: row.lng }
    const title = row.business_name ? `${row.business_name} (${row.state})` : ''
    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title,
      icon: {
        url: require('@/assets/huIcon.png'),
        scaledSize: new google.maps.Size(20, 20)
      }
    })
    currentMarkers.value.push(marker)
  })
}

// Function to add a green marker from an address (city, state) with a title (business name)
function addGreenMarkerFromAddress(address, title) {
  if (!map.value) return
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location
      const marker = new google.maps.Marker({
        position: location,
        map: map.value,
        title,
        icon: {
          url: require('@/assets/logo.png'), // Change to your green marker image if needed.
          scaledSize: new google.maps.Size(30, 30)
        }
      })
      currentMarkers.value.push(marker)
      // Optionally re-center/zoom the map on the new marker.
      map.value.setCenter(location)
      map.value.setZoom(10)
    } else {
      console.error('Geocoding failed: ' + status)
    }
  })
}

// Refresh the map by clearing markers, resetting center/zoom, and reloading the markers
async function refreshMap() {
  if (!map.value) return
  clearMarkers()
  map.value.setCenter(defaultCenter)
  map.value.setZoom(defaultZoom)
  await loadMemberMarkers()
}

// Initialize the map
async function initMap() {
  const mapDiv = document.getElementById('simpleMapNewUser')
  if (!mapDiv) {
    console.error('[initMap] #simpleMapNewUser not found.')
    return
  }
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    mapId: "c6b4cd9ac7195e38"
  })
  await loadMemberMarkers()
}

// Watch the store's mapCommand for commands (refresh or add marker)
const mapCommand = computed(() => store.state.mapCommand)
watch(mapCommand, async (newVal) => {
  if (!newVal) return
  // If the command is an object with a type
  if (typeof newVal === 'object') {
    if (newVal.command === 'addGreenMarker' && newVal.data) {
      addGreenMarkerFromAddress(newVal.data.address, newVal.data.title)
    }
    // Additional commands can be added here if needed.
  } else if (newVal === 'refreshMap') {
    await refreshMap()
  }
  // Clear the command after handling.
  store.commit('CLEAR_MAP_COMMAND')
})

// Initialize the map when the component is mounted
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
.mapContainer {
  width: 100%;
  position: relative;
}

#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>
