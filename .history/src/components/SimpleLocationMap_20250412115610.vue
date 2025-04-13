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
      <div class="layer-button" @click="toggleTools">
        Map Tools
      </div>
    </div>

    <!-- Floating Tools Bar (Collapsible) -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
        <!-- Single address lookup with autocomplete -->
        <div class="control-group">
          <input
            type="text"
            v-model="lookupAddress"
            ref="lookupInput"
            placeholder="Single address"
            @keyup.enter="handleLookup"
          />
          <button @click="handleLookup">Go</button>
        </div>
        <!-- Routing Inputs (as text fields with autocomplete) -->
        <div class="control-group">
          <input
            type="text"
            v-model="fromAddress"
            ref="fromInput"
            placeholder="Starting address"
            @keyup.enter="calculateRoute"
          />
        </div>
        <div class="control-group">
          <input
            type="text"
            v-model="toAddress"
            ref="toInput"
            placeholder="Ending address"
            @keyup.enter="calculateRoute"
          />
        </div>
        <div class="control-group">
          <button @click="calculateRoute">Route</button>
          <button @click="clearRouteInputs">Clear</button>
        </div>
      </div>
      <!-- Collapse button on right side -->
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>
    <!-- When tools are collapsed, show a minimal expand button in the top-right -->
    <button v-else class="expand-button" @click="toggleTools">Tools</button>

    <!-- Map container -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '@/../supabaseClient'

// Import icons for the markers.
import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

/**
 * NOTE: We removed refreshMapData entirely for now.
 * If you want a "refresh" or "show all" feature in the future,
 * you can add a separate button that re-shows or re-creates the markers. 
 */

// --- MAP VARIABLES ---
const map = ref(null)
const markers = ref([])
const stations = ref([]) // Array of all station data

// Global info window (single instance)
let infoWindow = null

// Default map settings
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

// Directions objects for routing
let directionsService = null
let directionsRenderer = null

// --- CONTROLS & ADDRESS LOOKUP ---
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
// Refs for autocomplete on inputs
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

// Toolbox expanded/collapsed state (collapsed by default)
const toolsExpanded = ref(false)
// Map type state (default roadmap)
const currentMapType = ref('roadmap')

/**
 * Toggle toolbox visibility and attach autocomplete
 */
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
  if (toolsExpanded.value) {
    nextTick(() => {
      if (lookupInput.value) initAutocomplete(lookupInput.value, lookupAddress)
      if (fromInput.value) {
        const fromAuto = new google.maps.places.Autocomplete(fromInput.value, { types: ['geocode'] })
        fromAuto.addListener('place_changed', () => {
          const place = fromAuto.getPlace()
          if (place && place.formatted_address) {
            fromAddress.value = place.formatted_address
          }
        })
      }
      if (toInput.value) {
        const toAuto = new google.maps.places.Autocomplete(toInput.value, { types: ['geocode'] })
        toAuto.addListener('place_changed', () => {
          const place = toAuto.getPlace()
          if (place && place.formatted_address) {
            toAddress.value = place.formatted_address
          }
        })
      }
    })
  }
}

/**
 * Change map type
 */
function setMapType(mapType) {
  currentMapType.value = mapType
  if (map.value) {
    map.value.setMapTypeId(mapType)
  }
}

/**
 * Fetch all stations using pagination
 */
async function fetchAllStations() {
  const all = []
  const batchSize = 1000
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('a_to_b_stations')
      .select('id, lat, lng, brand_name, station_name, address, city, state')
      .range(offset, offset + batchSize - 1)
    if (error) {
      console.error('Error fetching batch:', error)
      break
    }
    if (!data || data.length === 0) break
    all.push(...data)
    offset += data.length
    if (data.length < batchSize) break
  }
  return all
}

/**
 * Load stations from DB
 */
async function loadStations() {
  stations.value = await fetchAllStations()
}

/**
 * Create markers for each station with custom icons
 */
function createMarkers() {
  // Clear any old markers
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  stations.value.forEach(station => {
    if (station.lat == null || station.lng == null) return
    const position = { lat: station.lat, lng: station.lng }
    const bn = (station.brand_name || '').trim().toLowerCase()

    let iconUrl
    if (bn === 'ta petro') iconUrl = taIcon
    else if (bn === 'speedway') iconUrl = speedwayIcon
    else if (bn === 'sheetz') iconUrl = sheetzIcon
    else if (bn === 'maverick') iconUrl = maverickIcon
    else iconUrl = huIcon

    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || station.station_name || `Station ${station.id}`,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(15, 15)
      }
    })

    marker.stationData = station

    marker.addListener('click', () => {
      const content = `
        <div style="max-width:250px;font-family:Arial,sans-serif">
          <h3 style="margin:0 0 5px 0;">${station.brand_name || station.station_name || `Station ${station.id}`}</h3>
          <p style="margin:0;line-height:1.4">
            ${station.address || 'No address provided'}<br>
            ${station.city || ''}${station.city && station.state ? ', ' : ''}${station.state || ''}
          </p>
        </div>
      `
      infoWindow.setContent(content)
      infoWindow.open(map.value, marker)
    })

    markers.value.push(marker)
  })
}

/**
 * Filter stations near a single address
 * using computeDistanceBetween
 */
function filterStationsNear(location) {
  console.log('filterStationsNear: Center = ', location)
  const center = new google.maps.LatLng(location.lat, location.lng)
  const tolerance = 40233 // 50 miles in meters

  markers.value.forEach(marker => {
    const station = marker.stationData
    if (!station?.lat || !station?.lng) return
    const pt = new google.maps.LatLng(station.lat, station.lng)
    const distance = google.maps.geometry.spherical.computeDistanceBetween(center, pt)
    console.log(`Station ${station.id}, distance = ${distance}`)

    if (distance <= tolerance) {
      console.log(`Station ${station.id} -> Visible`)
      marker.setMap(map.value)
    } else {
      console.log(`Station ${station.id} -> Hiding`)
      marker.setMap(null)
    }
  })
}

/**
 * Filter stations along a route using bounding box
 */
function filterStationsByBoundingBox(pathArray) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  pathArray.forEach(pt => {
    const lat = pt.lat()
    const lng = pt.lng()
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  })

  // Add margin
  const latMargin = (maxLat - minLat) * 0.1
  const lngMargin = (maxLng - minLng) * 0.1
  minLat -= latMargin
  maxLat += latMargin
  minLng -= lngMargin
  maxLng += lngMargin

  console.log(`Bounding Box: lat [${minLat}, ${maxLat}], lng [${minLng}, ${maxLng}]`)

  markers.value.forEach(marker => {
    const station = marker.stationData
    if (!station?.lat || !station?.lng) return
    const { lat, lng } = station
    const inBox = (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng)
    marker.setMap(inBox ? map.value : null)
    console.log(`Station ${station.id} inBox=${inBox} [${lat},${lng}]`)
  })
}

/**
 * Initialize the map, directions, and attach autocomplete
 */
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: #stationMap not found.')
    return
  }
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    disableDefaultUI: true,
    mapTypeId: currentMapType.value
  })

  infoWindow = new google.maps.InfoWindow()
  map.value.addListener('click', () => infoWindow.close())

  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  await loadStations()
  createMarkers()

  await nextTick()
  if (toolsExpanded.value && lookupInput.value) {
    initAutocomplete(lookupInput.value, lookupAddress)
  }
  if (toolsExpanded.value && fromInput.value) {
    const fromAuto = new google.maps.places.Autocomplete(fromInput.value, { types: ['geocode'] })
    fromAuto.addListener('place_changed', () => {
      const place = fromAuto.getPlace()
      if (place && place.formatted_address) {
        fromAddress.value = place.formatted_address
      }
    })
  }
  if (toolsExpanded.value && toInput.value) {
    const toAuto = new google.maps.places.Autocomplete(toInput.value, { types: ['geocode'] })
    toAuto.addListener('place_changed', () => {
      const place = toAuto.getPlace()
      if (place && place.formatted_address) {
        toAddress.value = place.formatted_address
      }
    })
  }
}

/**
 * Generic autocomplete initializer that updates the given model
 */
function initAutocomplete(inputElement, modelRef) {
  const autocomplete = new google.maps.places.Autocomplete(inputElement, { types: ['geocode'] })
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place && place.geometry && place.geometry.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      map.value.setCenter(location)
      map.value.setZoom(10)
      modelRef.value = place.formatted_address || ''
    }
  })
}

/**
 * Single address lookup:
 * recenter map + filter stations near that address
 */
async function handleLookup() {
  if (!lookupAddress.value) return
  const location = await geocodeAddress(lookupAddress.value)
  if (location) {
    map.value.setCenter(location)
    map.value.setZoom(10)
    filterStationsNear(location)
  } else {
    alert('Address not found.')
  }
}

/**
 * Geocode an address using Google Geocoding API
 */
async function geocodeAddress(address) {
  // Replace with your actual API key
  const apiKey = 'YOUR_API_KEY'
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
    return data.results[0].geometry.location
  } catch (error) {
    console.error('Error in geocodeAddress:', error)
    return null
  }
}

/**
 * Calculate a driving route between two addresses
 * and filter stations along the route using bounding box
 */
async function calculateRoute() {
  if (!fromAddress.value || !toAddress.value) {
    alert('Please enter both a starting and ending address.')
    return
  }
  const origin = await geocodeAddress(fromAddress.value)
  const destination = await geocodeAddress(toAddress.value)
  if (!origin || !destination) {
    alert('Unable to geocode one or both addresses.')
    return
  }
  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
      const polylineObj = result.routes[0].overview_polyline
      if (!polylineObj) {
        console.error('No overview polyline found in the route result.')
        return
      }
      const encoded = typeof polylineObj === 'string' ? polylineObj : polylineObj.points
      if (!encoded) {
        console.error('No encoded polyline found in the route result.')
        return
      }
      const fullPath = google.maps.geometry.encoding.decodePath(encoded)
      filterStationsByBoundingBox(fullPath)
    } else {
      console.error('Error calculating route:', status)
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

/**
 * Clear route input fields
 * NOTE: We do NOT re-show all markers here
 */
function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()
  // Keep the stations in their current filtered state, 
  // we won't re-add them to the map.
}

/**
 * Clear route from the map
 */
function clearDirections() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null)
  }
}

// onMounted: load google, init map
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

/* Map container styling */
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
  padding: 8px 12px;
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
  top: 50px;
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

/* Place the expand button at top-right */
.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
</style>
