<template>
  <div class="station-map-container">
    <!-- Custom Layer Control -->
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
        <!-- Single address lookup -->
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
        <!-- Routing Inputs -->
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
        <!-- Refresh Map Button -->
        <div class="control-group">
          <button @click="refreshMap">Refresh Map</button>
        </div>
      </div>
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>
    <button v-else class="expand-button" @click="toggleTools">Tools</button>

    <!-- Map container -->
    <div id="stationMapFool" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '@/../supabaseClient'

// Import marker icons
import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

// Basic map state and defaults
const map = ref(null)
const markers = ref([])
let infoWindow = null
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

// Toolbox / UI
const toolsExpanded = ref(false)
const currentMapType = ref('roadmap')

// Address fields
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

// Directions objects
let directionsService = null
let directionsRenderer = null


//-------------------------------------------------
//  MOUNTED: Initialize the map
//-------------------------------------------------
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

// Initialize the map and fetch & display all stations
async function initMap() {
  const mapDiv = document.getElementById('stationMapFool')
  if (!mapDiv) {
    console.error('Error: #stationMapFool not found.')
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

  // **Display All Stations Initially**
  const allStations = await fetchAllStations()
  fetchAndCreateMarkers(allStations)

  await nextTick()
  if (toolsExpanded.value && lookupInput.value) {
    initAutocomplete(lookupInput.value, lookupAddress)
  }
  if (toolsExpanded.value && fromInput.value) {
    const fromAuto = new google.maps.places.Autocomplete(fromInput.value, { types: ['geocode'] })
    fromAuto.addListener('place_changed', () => {
      const place = fromAuto.getPlace()
      if (place && place.formatted_address) fromAddress.value = place.formatted_address
    })
  }
  if (toolsExpanded.value && toInput.value) {
    const toAuto = new google.maps.places.Autocomplete(toInput.value, { types: ['geocode'] })
    toAuto.addListener('place_changed', () => {
      const place = toAuto.getPlace()
      if (place && place.formatted_address) toAddress.value = place.formatted_address
    })
  }
}

/**
 * Fetch all stations from the database.
 */
async function fetchAllStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
  if (error) {
    console.error('Error fetching all stations:', error)
    return []
  }
  return data
}

/**
 * Query stations using a bounding box.
 */
async function fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng) {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
    .gte('lat', minLat)
    .lte('lat', maxLat)
    .gte('lng', minLng)
    .lte('lng', maxLng)
  if (error) {
    console.error('[fetchStationsByBoundingBox] Error:', error)
    return []
  }
  return data
}

/**
 * Clear all current markers.
 */
function clearAllMarkers() {
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
}

/**
 * Create markers for a given set of station data.
 */
function fetchAndCreateMarkers(stationData) {
  clearAllMarkers()

  stationData.forEach(station => {
    if (!station.lat || !station.lng) return

    const position = { lat: station.lat, lng: station.lng }
    let iconUrl
    const bn = (station.brand_name || '').trim().toLowerCase()
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
 * Lookup a single address and fetch markers for stations within ~50 miles.
 */
async function handleLookup() {
  if (!lookupAddress.value) return
  const location = await geocodeAddress(lookupAddress.value)
  if (!location) {
    alert('Address not found.')
    return
  }
  map.value.setCenter(location)
  map.value.setZoom(10)

  const degRadius = 0.72  // ~50 miles radius approximation
  const minLat = location.lat - degRadius
  const maxLat = location.lat + degRadius
  const minLng = location.lng - degRadius
  const maxLng = location.lng + degRadius

  const stationsSubset = await fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng)
  fetchAndCreateMarkers(stationsSubset)

  // Optionally emit an event if needed
  // emit('filtered', { stations: stationsSubset, reference: location })
}

/**
 * Route lookup: Calculates a route and then uses the bounding box of the route to fetch stations.
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
  directionsService.route(request, async (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)
      const poly = result.routes?.[0]?.overview_polyline
      const encoded = typeof poly === 'string' ? poly : poly?.points
      if (!encoded) return console.error('No encoded polyline found.')
      const pathArray = google.maps.geometry.encoding.decodePath(encoded)
      let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
      pathArray.forEach(pt => {
        const lat = pt.lat()
        const lng = pt.lng()
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
      })
      const latMargin = (maxLat - minLat) * 0.1
      const lngMargin = (maxLng - minLng) * 0.1
      minLat -= latMargin
      maxLat += latMargin
      minLng -= lngMargin
      maxLng += lngMargin

      const stationsSubset = await fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng)
      fetchAndCreateMarkers(stationsSubset)

      // Optionally emit an event if needed
      // emit('filtered', { stations: stationsSubset, reference: origin })
    } else {
      console.error('Error calculating route:', status)
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

/**
 * Clears route inputs and directions.
 */
function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()
}

/**
 * Refreshes the map.
 * Clears inputs, directions, and markers, and re-initializes the map.
 * Also fetches and displays all stations on initial refresh.
 */
function refreshMap() {
  console.log('Refreshing map...')
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()

  // Remove all markers
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  // Destroy and re-initialize the map to clear any residual references
  map.value = null
  initMap().then(async () => {
    // After re-initializing, fetch and display all stations.
    const allStations = await fetchAllStations()
    fetchAndCreateMarkers(allStations)
  })
}

function clearDirections() {
  if (directionsRenderer) directionsRenderer.set('directions', null)
}

//--------------------------------------------
// AUTOCOMPLETE & MISC
//--------------------------------------------
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
  if (toolsExpanded.value) {
    nextTick(() => {
      if (lookupInput.value) initAutocomplete(lookupInput.value, lookupAddress)
      if (fromInput.value) {
        const fromAuto = new google.maps.places.Autocomplete(fromInput.value, { types: ['geocode'] })
        fromAuto.addListener('place_changed', () => {
          const place = fromAuto.getPlace()
          if (place && place.formatted_address) fromAddress.value = place.formatted_address
        })
      }
      if (toInput.value) {
        const toAuto = new google.maps.places.Autocomplete(toInput.value, { types: ['geocode'] })
        toAuto.addListener('place_changed', () => {
          const place = toAuto.getPlace()
          if (place && place.formatted_address) toAddress.value = place.formatted_address
        })
      }
    })
  }
}

function setMapType(mapType) {
  currentMapType.value = mapType
  if (map.value) {
    map.value.setMapTypeId(mapType)
  }
}

function initAutocomplete(inputEl, modelRef) {
  const auto = new google.maps.places.Autocomplete(inputEl, { types: ['geocode'] })
  auto.addListener('place_changed', () => {
    const place = auto.getPlace()
    if (place && place.geometry && place.geometry.location) {
      const loc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      map.value.setCenter(loc)
      map.value.setZoom(10)
      modelRef.value = place.formatted_address || ''
    }
  })
}

/**
 * Basic geocode function.
 */
async function geocodeAddress(address) {
  const apiKey = 'YOUR_API_KEY'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    const data = await resp.json()
    if (data.status !== 'OK' || !data.results?.length) return null
    return data.results[0].geometry.location
  } catch (err) {
    console.error(err)
    return null
  }
}



</script>

<style scoped>
.station-map-container {
  position: relative;
  width: 100%;
  height: 600px;
}
.map {
  width: 100%;
  height: 100%;
}
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
.map-overlay .control-group input {
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
.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
</style>
