<template>
  <div class="station-map-container">
    <!-- Top controls for address lookup, routing, and display settings -->
    <div class="map-controls">
      <!-- Single address lookup -->
      <div class="address-lookup">
        <input
          v-model="lookupAddress"
          type="text"
          placeholder="Enter an address..."
          @keyup.enter="onLookupAddress"
        />
        <button @click="onLookupAddress">Go</button>
      </div>

      <!-- Routing form -->
      <div class="route-form">
        <label>From:</label>
        <select v-model="fromStationId">
          <option value="">Select Station</option>
          <option
            v-for="station in stations"
            :key="station.id"
            :value="station.id"
          >
            {{ station.station_name || `Station #${station.id}` }}
          </option>
        </select>

        <label>To:</label>
        <select v-model="toStationId">
          <option value="">Select Station</option>
          <option
            v-for="station in stations"
            :key="station.id"
            :value="station.id"
          >
            {{ station.station_name || `Station #${station.id}` }}
          </option>
        </select>

        <button @click="calculateRoute">Route</button>
      </div>

      <!-- Display settings (toggle dark style or default style) -->
      <div class="display-settings">
        <label>
          <input type="checkbox" v-model="useDarkStyle" @change="onDisplayChange" />
          Dark Map
        </label>
      </div>
    </div>

    <!-- The map container -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// References to hold the map instance, markers, directions, etc.
const map = ref(null)
const markers = ref([])
const stations = ref([])       // Fetched from 'a_to_b_stations'
const fromStationId = ref('')  // For routing
const toStationId = ref('')    // For routing
const lookupAddress = ref('')  // For address lookup
const useDarkStyle = ref(true) // Toggle for map style

// Google Directions objects
let directionsService = null
let directionsRenderer = null

// Default center & zoom
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

// Example dark style vs. default style
const darkStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  // Add additional style rules as desired
]
const defaultStyle = [] // empty means default Google style

// Load stations (lat, lng, station_name, plus an id)
async function loadStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, station_name')
  
  if (error) {
    console.error('Error loading stations:', error)
    return
  }
  stations.value = data
}

// Create map markers with info windows
function createMarkersForStations() {
  clearMarkers()
  
  stations.value.forEach(station => {
    if (station.lat == null || station.lng == null) return
    const position = { lat: station.lat, lng: station.lng }
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.station_name || `Station #${station.id}`,
    })

    // Info Window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <strong>${station.station_name || `Station #${station.id}`}</strong><br>
          Lat: ${station.lat}, Lng: ${station.lng}
        </div>
      `,
    })
    
    marker.addListener('click', () => {
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
  })
}

// Clear existing markers
function clearMarkers() {
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
}

// Initialize the map, directions, load stations & markers
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: #stationMap element not found.')
    return
  }

  // Create map
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    styles: useDarkStyle.value ? darkStyle : defaultStyle,
  })

  // Create directionsService and directionsRenderer
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(map.value)

  // Load stations from Supabase
  await loadStations()

  // Create markers for each station
  createMarkersForStations()
}

// Calculate a route between two stations (if both are selected)
async function calculateRoute() {
  if (!fromStationId.value || !toStationId.value || !directionsService) return

  // Get the fromStation and toStation data
  const fromStation = stations.value.find(s => s.id === fromStationId.value)
  const toStation = stations.value.find(s => s.id === toStationId.value)
  if (!fromStation || !toStation) return

  const origin = { lat: fromStation.lat, lng: fromStation.lng }
  const destination = { lat: toStation.lat, lng: toStation.lng }

  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
  }
  
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
    } else {
      console.error('Error calculating route:', status)
      alert(`Couldn't calculate route: ${status}`)
    }
  })
}

// Single address lookup using Google Geocoding, then center the map
async function onLookupAddress() {
  if (!lookupAddress.value) return

  try {
    const geocodeResult = await geocodeAddress(lookupAddress.value)
    if (geocodeResult) {
      map.value.setCenter(geocodeResult)
      map.value.setZoom(10)
    } else {
      alert('Address not found.')
    }
  } catch (err) {
    console.error('Error geocoding address:', err)
    alert('Error geocoding address.')
  }
}

// Geocode an address using Google's API (client-side)
async function geocodeAddress(address) {
  // NOTE: If you prefer server-side, do so to avoid exposing your API key
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  const resp = await fetch(url)
  if (!resp.ok) return null
  const data = await resp.json()
  if (data.status !== 'OK' || !data.results || data.results.length === 0) return null
  return data.results[0].geometry.location // { lat, lng }
}

// Handler for toggling display settings (e.g., dark mode)
function onDisplayChange() {
  if (!map.value) return
  map.value.setOptions({
    styles: useDarkStyle.value ? darkStyle : defaultStyle
  })
}

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
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Top controls bar */
.map-controls {
  background-color: #f2f2f2;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Basic styling for form elements within .map-controls */
.map-controls input[type="text"] {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.map-controls button {
  padding: 6px 10px;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.map-controls button:hover {
  background-color: #a00;
}

/* The map itself */
#stationMap {
  flex: 1;
  width: 100%;
}
</style>
