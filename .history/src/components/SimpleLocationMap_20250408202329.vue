<template>
  <div class="station-map-container">
    <!-- Custom Layer Control (top-left overlay) -->
    <div class="map-layer-control">
      <div
        class="layer-button"
        :class="{ active: currentMapType === 'roadmap' }"
        @click="setMapType('roadmap')"
      >
        Map
      </div>
      <div
        class="layer-button"
        :class="{ active: currentMapType === 'satellite' }"
        @click="setMapType('satellite')"
      >
        Satellite
      </div>
    </div>

    <!-- Floating Tools Bar (Collapsible) -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
        <!-- Single address lookup with Autocomplete later if needed -->
        <div class="control-group">
          <input
            type="text"
            v-model="lookupAddress"
            placeholder="Enter an address"
            @keyup.enter="onLookupAddress"
          />
          <button @click="onLookupAddress">Go</button>
        </div>
        <!-- Routing Controls -->
        <div class="control-group">
          <label>From:</label>
          <select v-model="fromStationId">
            <option value="">Select</option>
            <option
              v-for="station in stations"
              :key="station.id"
              :value="station.id"
            >
              {{ station.brand_name || station.station_name || station.id }}
            </option>
          </select>
        </div>
        <div class="control-group">
          <label>To:</label>
          <select v-model="toStationId">
            <option value="">Select</option>
            <option
              v-for="station in stations"
              :key="station.id"
              :value="station.id"
            >
              {{ station.brand_name || station.station_name || station.id }}
            </option>
          </select>
        </div>
        <div class="control-group">
          <button @click="calculateRoute">Route</button>
          <button @click="clearDirections">Clear</button>
        </div>
        <!-- Refresh Button -->
        <div class="control-group">
          <button @click="refreshMapData">Refresh Map</button>
        </div>
      </div>
      <!-- Collapse button on right side of overlay -->
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>
    <!-- If tools are collapsed, show a minimal expand button in the top-right -->
    <button v-else class="expand-button" @click="toggleTools">Tools</button>

    <!-- Map container -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// Map variables
const map = ref(null)
const markers = ref([])
// Array for station data
const stations = ref([])

// Global info window (single instance)
let infoWindow = null

// Default map settings
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Directions objects for routing
let directionsService = null
let directionsRenderer = null

// Routing controls and address lookup
const fromStationId = ref('')
const toStationId = ref('')
const lookupAddress = ref('')

// Toolbox expanded/collapsed state (collapsed by default)
const toolsExpanded = ref(false)

// Map type state (default roadmap)
const currentMapType = ref('roadmap')

// Toggle toolbox visibility
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
}

// Set the map type (roadmap or satellite)
function setMapType(mapType) {
  currentMapType.value = mapType
  if (map.value) {
    map.value.setMapTypeId(mapType)
  }
}

// Fetch station data from the 'a_to_b_stations' table
async function loadStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
  if (error) {
    console.error('Error loading station data:', error)
    return
  }
  stations.value = data || []
}

// Create markers for each station, attaching a single global info window.
function createMarkers() {
  // Clear current markers.
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  stations.value.forEach(station => {
    if (station.lat == null || station.lng == null) return
    const position = { lat: station.lat, lng: station.lng }
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || station.station_name || `Station ${station.id}`
    })

    marker.addListener('click', () => {
      const content = `
        <div style="max-width: 250px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 5px 0;">${
            station.brand_name || station.station_name || `Station ${station.id}`
          }</h3>
          <p style="margin: 0; line-height: 1.4;">
            ${station.address || 'No address provided'}<br>
            ${station.city || ''}${
        station.city && station.state ? ', ' : ''
      }${station.state || ''}
          </p>
        </div>
      `
      infoWindow.setContent(content)
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
  })
}

// Clear markers from the map.
function clearMarkers() {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
}

// Initialize the map and load initial data.
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: #stationMap not found.')
    return
  }

  // Create the map with default controls disabled.
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    disableDefaultUI: true,
    mapTypeId: currentMapType.value
  })

  // Create the global info window.
  infoWindow = new google.maps.InfoWindow()
  // Close info window when clicking elsewhere.
  map.value.addListener('click', () => {
    infoWindow.close()
  })

  // Initialize routing services.
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  // Load station data and create markers.
  await loadStations()
  createMarkers()
}

// Address lookup: geocode an address and recenter the map.
async function onLookupAddress() {
  if (!lookupAddress.value) return
  const location = await geocodeAddress(lookupAddress.value)
  if (location) {
    map.value.setCenter(location)
    map.value.setZoom(10)
  } else {
    alert('Address not found.')
  }
}

// Use Google Geocoding API to convert an address to coordinates.
async function geocodeAddress(address) {
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE' // Replace with your actual API key.
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('Failed to fetch geocode info')
      return null
    }
    const data = await response.json()
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error(`Geocode error for ${address}`)
      return null
    }
    return data.results[0].geometry.location
  } catch (error) {
    console.error('Error in geocodeAddress:', error)
    return null
  }
}

// Calculate a driving route between two selected stations.
function calculateRoute() {
  if (!fromStationId.value || !toStationId.value) {
    alert('Please select both origin and destination stations.')
    return
  }
  const originStation = stations.value.find(s => s.id === fromStationId.value)
  const destinationStation = stations.value.find(s => s.id === toStationId.value)
  if (!originStation || !destinationStation) {
    alert('Could not find selected station(s).')
    return
  }
  const request = {
    origin: { lat: originStation.lat, lng: originStation.lng },
    destination: { lat: destinationStation.lat, lng: destinationStation.lng },
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
    } else {
      console.error('Error calculating route:', status)
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

// Clear any displayed route.
function clearDirections() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null)
  }
}

// Refresh the map: recenter, reset zoom, reload station data/markers, clear route and info window.
async function refreshMapData() {
  map.value.setCenter(defaultCenter)
  map.value.setZoom(defaultZoom)
  await loadStations()
  createMarkers()
  clearDirections()
  infoWindow.close()
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
  position: relative;
  width: 100%;
  height: 600px;
}

/* Map fills the container */
.map {
  width: 100%;
  height: 100%;
}

/* Custom map layer control (top-left overlay) */
.map-layer-control {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  border: 1px solid #ccc;
  background: #fff;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  z-index: 999;
}

.layer-button {
  padding: 8px 12px; /* Increased height */
  color: #333;
  cursor: pointer;
  border-right: 1px solid #ccc;
  user-select: none;
  display: flex;
  align-items: center;
}

.layer-button:last-child {
  border-right: none;
}

.layer-button:hover {
  background-color: #b11818;
  color: #fff;
}

.layer-button.active {
  background-color: #b11818;
  color: #fff;
}

/* Top toolbar overlay (collapsible tools) */
.map-overlay {
  position: absolute;
  top: 50px; /* Below the map-layer-control */
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 998;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.controls-wrapper {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  flex: 1;
}

.map-overlay .control-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.map-overlay .control-group input,
.map-overlay .control-group select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;
}

.map-overlay .control-group button {
  padding: 4px 8px;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.map-overlay .control-group button:hover {
  background-color: #a00;
}

/* Collapse/expand button styles */
.collapse-button,
.expand-button {
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.8rem;
}

.collapse-button:hover,
.expand-button:hover {
  background-color: #a00;
}

/* Place the expand button at the top-right to avoid overlapping the map-layer-control */
.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
</style>
