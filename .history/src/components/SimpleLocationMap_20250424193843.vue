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
      <!-- New toggle button for All Stations -->
      <div class="layer-button" 
           :class="{ active: allStationsVisible }"
           @click="toggleAllStations">
        {{ allStationsVisible ? 'Hide All Stations' : 'Show All Stations' }}
      </div>
    </div>

    <!-- Floating Tools Bar (Collapsible) -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
        <!-- Single address -->
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
    

    <!-- Map container -->
    <div id="stationMapFool" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '@/supabaseClient'

import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

// Basic map state
const map = ref(null)
const markers = ref([])
let infoWindow = null
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Toolbox / UI
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(true) // NEW: controls display of all stations

// Address fields
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

// Directions
let directionsService = null
let directionsRenderer = null

const emit = defineEmits(['filtered'])

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

// Initialize the map
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

  // Initially, no stations are fetched
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

//--------------------------------------------
// SERVER-SIDE QUERY APPROACH (Bounding Box)
//--------------------------------------------
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

// NEW: Fetch all stations regardless of bounding box
async function fetchAllStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
    
  if (error) {
    console.error('[fetchAllStations] Error:', error)
    return []
  }
  return data
}

function fetchAndCreateMarkers(stationData) {
  // Clear existing markers
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

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

//--------------------------------------------
// SINGLE ADDRESS LOOKUP
//--------------------------------------------
async function handleLookup() {
  // Destroy and reinitialize map:
    map.value = null;
    initMap();
  if (!lookupAddress.value) return
  const location = await geocodeAddress(lookupAddress.value)
  if (!location) {
    alert('Address not found.')
    return
  }
  map.value.setCenter(location)
  map.value.setZoom(10)

  // Approx bounding box ~50 miles each direction
  const degRadius = 0.72 
  const minLat = location.lat - degRadius
  const maxLat = location.lat + degRadius
  const minLng = location.lng - degRadius
  const maxLng = location.lng + degRadius

  const stationsSubset = await fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng)
  fetchAndCreateMarkers(stationsSubset)

  emit('filtered', {
    stations: stationsSubset,
    reference: location
  })
}

//--------------------------------------------
// ROUTE LOOKUP
//--------------------------------------------
async function calculateRoute() {
  // Destroy and reinitialize map:
    map.value = null;
    initMap();
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
      
      emit('filtered', {
        stations: stationsSubset,
        reference: origin
      })
    } else {
      console.error('Error calculating route:', status)
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

//--------------------------------------------
// CLEAR / REFRESH
//--------------------------------------------
function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()
}

/** 
 * NEW: refreshMap
 *   - Clears route/addresses
 *   - Removes markers
 *   - Resets map to default center & zoom
 */
function refreshMap() {
  console.log('Refreshing map...');
  
  // Clear inputs and directions:
  fromAddress.value = '';
  toAddress.value = '';
  lookupAddress.value = '';
  clearDirections();

  // Clear markers:
  markers.value.forEach(m => m.setMap(null))
  markers.value = [];

  // Reset toggle state if needed:
  allStationsVisible.value = false;

  // Destroy and reinitialize map:
  map.value = null;
  initMap();
  
  // Clear the nearby station list data:
  emit('clearFiltered');
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

// Basic geocode function
async function geocodeAddress(address) {
  const apiKey = 'AIzaSyDYpNJXRFRuQq5IV8LQZi8E90r1gIaiORI'
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

// -------------------------------------
// NEW: Toggle All Stations Functionality
// -------------------------------------
async function toggleAllStations() {
  // Toggle the state
  allStationsVisible.value = !allStationsVisible.value
  if (allStationsVisible.value) {
    // When toggled on, fetch all stations and create markers.
    const allStations = await fetchAllStations()
    fetchAndCreateMarkers(allStations)
  } else {
    // When toggled off, remove the markers.
    markers.value.forEach(m => m.setMap(null))
    markers.value = []
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
