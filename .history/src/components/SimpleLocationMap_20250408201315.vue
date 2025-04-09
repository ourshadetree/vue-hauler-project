<template>
  <div class="station-map-container">
    <!-- Layer Control Buttons -->
    <div class="map-layer-control">
      <div class="layer-button active">Map</div>
      <div class="layer-button">Satellite</div>
      <div class="layer-button" @click="toggleTools">
        Map Tools
      </div>
    </div>

    <!-- Collapsible top bar with map tools, hidden by default -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
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
        
        <!-- Routing controls -->
        <div class="control-group">
          <label>From:</label>
          <select v-model="fromStationId">
            <option value="">Select</option>
            <option v-for="station in stations" :key="station.id" :value="station.id">
              {{ station.brand_name || station.station_name || station.id }}
            </option>
          </select>
        </div>
        <div class="control-group">
          <label>To:</label>
          <select v-model="toStationId">
            <option value="">Select</option>
            <option v-for="station in stations" :key="station.id" :value="station.id">
              {{ station.brand_name || station.station_name || station.id }}
            </option>
          </select>
        </div>
        
        <div class="control-group">
          <button @click="calculateRoute">Route</button>
          <button @click="clearDirections">Clear</button>
        </div>
        
        <!-- Refresh Map -->
        <div class="control-group">
          <button @click="refreshMapData">Refresh Map</button>
        </div>
      </div>
    </div>

    <!-- Main map container -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// =========== MAP STATE ============
const map = ref(null)
const markers = ref([])
const stations = ref([])

// Single global info window
let infoWindow = null

const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Directions / routing
let directionsService = null
let directionsRenderer = null

// =========== TOOLBOX STATE ============
const fromStationId = ref('')
const toStationId = ref('')
const lookupAddress = ref('')

// Collapsed by default
const toolsExpanded = ref(false)

// =========== INITIAL LOAD / MAP SETUP ============
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

async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Could not find #stationMap element.')
    return
  }

  // Create the map
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom
  })

  // Info window (single instance)
  infoWindow = new google.maps.InfoWindow()
  map.value.addListener('click', () => {
    infoWindow.close()
  })

  // Directions
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  // Load stations and create markers
  await loadStations()
  createMarkers()
}

// =========== DATA / STATIONS ============
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

function createMarkers() {
  clearMarkers()

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
          <h3 style="margin: 0 0 5px 0;">
            ${station.brand_name || station.station_name || `Station ${station.id}`}
          </h3>
          <p style="margin: 0; line-height: 1.4;">
            ${station.address || 'No address provided'}<br>
            ${station.city || ''}${station.city && station.state ? ', ' : ''}${station.state || ''}
          </p>
          <p style="margin: 5px 0 0; font-size: 0.85rem; color: #555;">
            Lat: ${station.lat}, Lng: ${station.lng}
          </p>
        </div>
      `
      infoWindow.setContent(content)
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
  })
}

function clearMarkers() {
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
}

// =========== ROUTING ============
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

function clearDirections() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null)
  }
}

// =========== ADDRESS LOOKUP ============
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

async function geocodeAddress(address) {
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  
  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    
    const data = await resp.json()
    if (data.status !== 'OK' || !data.results || !data.results.length) return null
    return data.results[0].geometry.location
  } catch (err) {
    console.error('Error geocoding:', err)
    return null
  }
}

// =========== REFRESH MAP DATA ============
async function refreshMapData() {
  map.value.setCenter(defaultCenter)
  map.value.setZoom(defaultZoom)
  await loadStations()
  createMarkers()
  clearDirections()
  infoWindow.close()
}

// =========== COLLAPSIBLE TOOLS ============
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
}
</script>

<style scoped>
.station-map-container {
  position: relative;
  width: 100%;
  height: 600px; /* Adjust as needed */
}

/* The main map */
.map {
  width: 100%;
  height: 100%;
}

/* The small set of toggles in the top-left that replicate the look of
   "Map" / "Satellite" on Google Maps. */
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
  padding: 6px 10px;
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
  background-color: #e5e5e5;
  color: #000;
}

/* The collapsible "tools" bar spanning the top, hidden by default */
.map-overlay {
  position: absolute;
  top: 50px; /* sits just below the .map-layer-control bar */
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 998; /* slightly below the layer control for layering */
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.controls-wrapper {
  display: flex;
  gap: 10px;
  overflow-x: auto; /* for smaller screens */
  flex: 1;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.control-group input,
.control-group select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;
}

.control-group button {
  padding: 4px 8px;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.control-group button:hover {
  background-color: #a00;
}
</style>
