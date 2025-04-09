<template>
  <div class="station-map-container">
    <!-- Map container; the overlay will be positioned over it -->
    <div id="stationMap" class="map"></div>
    
    <!-- Floating overlay toolbar -->
    <div class="map-overlay">
      <!-- Single address lookup -->
      <div class="control-group">
        <input
          type="text"
          v-model="lookupAddress"
          placeholder="Enter an address"
          @keyup.enter="onLookupAddress"
        />
        <button @click="onLookupAddress">Go</button>
      </div>
      
      <!-- Routing: selecting from/to stations -->
      <div class="control-group">
        <label>From:</label>
        <select v-model="fromStationId">
          <option value="">Select Station</option>
          <option v-for="station in stations" :key="station.id" :value="station.id">
            {{ station.brand_name || station.station_name || station.id }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <label>To:</label>
        <select v-model="toStationId">
          <option value="">Select Station</option>
          <option v-for="station in stations" :key="station.id" :value="station.id">
            {{ station.brand_name || station.station_name || station.id }}
          </option>
        </select>
      </div>
      <div class="control-group">
        <button @click="calculateRoute">Route</button>
        <button @click="clearDirections">Clear Route</button>
      </div>
      
      <!-- Refresh button -->
      <div class="control-group">
        <button @click="refreshMapData">Refresh Map</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// Map and marker variables
const map = ref(null)
const markers = ref([])

// Array to hold station data fetched from supabase
const stations = ref([])

// Global info window reused for markers
let infoWindow = null

// Properties for routing controls
const fromStationId = ref('')
const toStationId = ref('')

// Property for single address lookup
const lookupAddress = ref('')

// Default map settings
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Directions objects for routing
let directionsService = null
let directionsRenderer = null

// -------------------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------------------

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

// Create markers for each station with info windows. Uses a single global info window.
function createMarkers() {
  clearMarkers()
  
  stations.value.forEach(station => {
    // Only create a marker if both latitude and longitude exist.
    if (station.lat == null || station.lng == null) return
    const position = { lat: station.lat, lng: station.lng }
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || station.station_name || `Station ${station.id}`
    })
    
    // Attach a click listener that updates and opens the global info window.
    marker.addListener('click', () => {
      const content = `
        <div style="max-width: 250px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 5px 0;">${station.brand_name || station.station_name || `Station ${station.id}`}</h3>
          <p style="margin: 0; line-height: 1.4;">
            ${station.address || 'No address provided'}<br>
            ${station.city || ''}${station.city && station.state ? ', ' : ''}${station.state || ''}
          </p>
          <p style="margin: 5px 0 0; font-size: 0.85rem; color: #555;">
            Lat: ${station.lat}, Lng: ${station.lng}
          </p>
        </div>
      `;
      infoWindow.setContent(content)
      infoWindow.open(map.value, marker)
    })
    
    markers.value.push(marker)
  })
}

// Remove all markers from the map.
function clearMarkers() {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
}

// Initialize the Google Map, directions objects and load stations.
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: #stationMap element not found.')
    return
  }
  
  // Initialize map with standard styling.
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom
  })
  
  // Create a global info window
  infoWindow = new google.maps.InfoWindow()
  
  // Add a listener to the map to close the info window when clicking outside markers.
  map.value.addListener('click', () => {
    infoWindow.close()
  })
  
  // Initialize directions service and renderer for routing.
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)
  
  // Load station data and create markers.
  await loadStations()
  createMarkers()
}

// Perform a single address lookup: geocode the address and center the map.
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

// Use the Google Geocoding API to look up an address.
async function geocodeAddress(address) {
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE' // Replace with your actual API key.
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  
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
    
    return data.results[0].geometry.location // {lat, lng}
  } catch (error) {
    console.error('Error in geocodeAddress:', error)
    return null
  }
}

// Calculate a route between two selected stations.
function calculateRoute() {
  if (!fromStationId.value || !toStationId.value) {
    alert('Please select both origin and destination stations.')
    return
  }
  
  // Find the stations corresponding to the selected IDs.
  const originStation = stations.value.find(s => s.id === fromStationId.value)
  const destinationStation = stations.value.find(s => s.id === toStationId.value)
  
  if (!originStation || !destinationStation) {
    alert('Could not find selected station(s).')
    return
  }
  
  const origin = { lat: originStation.lat, lng: originStation.lng }
  const destination = { lat: destinationStation.lat, lng: destinationStation.lng }
  
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
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

// Clear the currently displayed route.
function clearDirections() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null)
  }
}

// Refresh the map markers. This also reloads station data.
async function refreshMapData() {
  await loadStations()
  createMarkers()
  // Optionally clear any directions or info windows.
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
  height: 600px; /* Adjust height as needed */
}

/* The map fills the container */
.map {
  width: 100%;
  height: 100%;
}

/* Floating overlay controls */
.map-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
  max-width: 300px;
}

.map-overlay .control-group {
  margin-bottom: 10px;
}

.map-overlay .control-group input,
.map-overlay .control-group select {
  width: 100%;
  padding: 6px;
  margin: 3px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.map-overlay .control-group button {
  width: 100%;
  padding: 6px;
  margin: 3px 0;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.map-overlay .control-group button:hover {
  background-color: #a00;
}

.map-overlay label {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 3px;
  display: block;
}
</style>
