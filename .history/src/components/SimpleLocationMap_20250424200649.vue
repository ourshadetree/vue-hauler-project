<template>
  <div class="station-map-container">
    <!-- Custom Layer Control -->
    <div class="map-layer-control">
      <div class="layer-button" :class="{ active: currentMapType === 'roadmap' }" @click="setMapType('roadmap')">Map</div>
      <div class="layer-button" :class="{ active: currentMapType === 'satellite' }" @click="setMapType('satellite')">Satellite</div>
      <div
        class="layer-button"
        :class="{ active: !toolsExpanded }"
        @click="toggleTools"
      >
        {{ toolsExpanded ? 'Hide Tools' : 'Show Tools' }}
      </div>
      <div
        class="layer-button"
        :class="{ active: !allStationsVisible }"
        @click="toggleAllStations"
      >
        {{ allStationsVisible ? 'Hide All Stations' : 'Show All Stations' }}
      </div>
    </div>

    <!-- Floating Tools Bar -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
        <div class="control-group">
          <input type="text" v-model="lookupAddress" placeholder="Single address" />
          <button type="button" @click="handleLookup">Go</button>
        </div>
        <div class="control-group">
          <input type="text" v-model="fromAddress" placeholder="Starting address" />
        </div>
        <div class="control-group">
          <input type="text" v-model="toAddress" placeholder="Ending address" />
        </div>
        <div class="control-group">
          <button @click="calculateRoute">Route</button>
          <button @click="clearRouteInputs">Clear</button>
        </div>
        <div class="control-group">
          <button @click="refreshMap">Refresh Map</button>
        </div>
      </div>
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>

    <!-- Map -->
    <div id="stationMapFool" class="map"></div>

    <!-- Nearby Stations List -->
    <div class="station-list" v-if="nearbyStations.length">
      <ul>
        <li
          v-for="station in nearbyStations"
          :key="station.id"
          :class="{ active: station.id === activeStationId }"
          @click="selectStation(station)"
        >
          {{ station.brand_name || station.station_name || `Station ${station.id}` }} - {{ station.city }}, {{ station.state }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'
import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

// Map and marker state
const map = ref(null)
const markers = ref([])
let infoWindow = null
let placesService = null
let currentActiveMarker = null

// UI state
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(true)

// Nearby stations
const nearbyStations = ref([])
const activeStationId = ref(null)

// Address inputs
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')

// Directions services
let directionsService = null
let directionsRenderer = null

// Initialize map when Google API is ready
onMounted(async () => {
  await waitForGoogle()
  initMap()
})

function waitForGoogle() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
}

function initMap() {
  const mapEl = document.getElementById('stationMapFool')
  if (!mapEl) return console.error('Map container not found')

  map.value = new google.maps.Map(mapEl, {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 4,
    disableDefaultUI: true,
    mapTypeId: currentMapType.value
  })

  infoWindow = new google.maps.InfoWindow()
  placesService = new google.maps.places.PlacesService(map.value)
  map.value.addListener('click', () => infoWindow.close())

  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  // On initial load, show all stations
  if (allStationsVisible.value) {
    fetchAllStations().then(list => handleNewStations(list))
  }
}

async function fetchAllStations() {
  const { data } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
  return data || []
}

async function fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng) {
  const { data } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
    .gte('lat', minLat).lte('lat', maxLat)
    .gte('lng', minLng).lte('lng', maxLng)
  return data || []
}

function handleNewStations(list) {
  nearbyStations.value = list
  createMarkers(list)
}

function createMarkers(list) {
  // Clear old markers
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  list.forEach(station => {
    const iconUrl = getIconFor(station)
    const marker = new google.maps.Marker({
      position: { lat: station.lat, lng: station.lng },
      map: map.value,
      title: station.brand_name || station.station_name,
      icon: { url: iconUrl, scaledSize: new google.maps.Size(15, 15) }
    })
    marker.stationId = station.id
    marker.addListener('click', () => onMarkerClick(marker, station))
    markers.value.push(marker)
  })
}

function getIconFor(st) {
  const bn = (st.brand_name || '').toLowerCase()
  if (bn.includes('ta')) return taIcon
  if (bn.includes('speedway')) return speedwayIcon
  if (bn.includes('sheetz')) return sheetzIcon
  if (bn.includes('maverick')) return maverickIcon
  return huIcon
}

function onMarkerClick(marker, station) {
  highlightMarker(marker)
  const content = `
    <div style="max-width:250px;font-family:Arial,sans-serif">
      <h3 style="margin:0">${station.brand_name || station.station_name}</h3>
      <p style="margin:0">${station.address}, ${station.city}, ${station.state}</p>
    </div>`
  infoWindow.setContent(content)
  infoWindow.open(map.value, marker)
}

function highlightMarker(marker) {
  if (currentActiveMarker && currentActiveMarker !== marker) {
    currentActiveMarker.setAnimation(null)
  }
  currentActiveMarker = marker
  marker.setAnimation(google.maps.Animation.BOUNCE)
  activeStationId.value = marker.stationId
  setTimeout(() => marker.setAnimation(null), 2100)
}

function selectStation(station) {
  const marker = markers.value.find(m => m.stationId === station.id)
  if (marker) onMarkerClick(marker, station)
}

async function handleLookup() {
  allStationsVisible.value = false
  const loc = await geocodeAddress(lookupAddress.value)
  if (!loc) return alert('Address not found')
  map.value.setCenter(loc)
  map.value.setZoom(10)
  const r = 0.72
  const minLat = loc.lat - r, maxLat = loc.lat + r
  const minLng = loc.lng - r, maxLng = loc.lng + r
  const list = await fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng)
  handleNewStations(list)
}

async function calculateRoute() {
  allStationsVisible.value = false
  if (!fromAddress.value || !toAddress.value) return alert('Enter both addresses')
  const origin = await geocodeAddress(fromAddress.value)
  const dest = await geocodeAddress(toAddress.value)
  if (!origin || !dest) return alert('Geocode failed')
  directionsService.route({ origin, destination: dest, travelMode: google.maps.TravelMode.DRIVING }, (res, status) => {
    if (status==='OK') {
      directionsRenderer.setDirections(res)
      const path = res.routes[0].overview_path
      let latMin=Infinity, latMax=-Infinity, lngMin=Infinity, lngMax=-Infinity
      path.forEach(p=>{ latMin=Math.min(latMin,p.lat()), latMax=Math.max(latMax,p.lat()); lngMin=Math.min(lngMin,p.lng()); lngMax=Math.max(lngMax,p.lng()) })
      const mLat = (latMax-latMin)*0.1, mLng = (lngMax-lngMin)*0.1
      const list = await fetchStationsByBoundingBox(latMin-mLat, latMax+mLat, lngMin-mLng, lngMax+mLng)
      handleNewStations(list)
    } else alert(`Route error: ${status}`)
  })
}

function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  directionsRenderer.set('directions', null)
}

function refreshMap() {
  clearRouteInputs()
  allStationsVisible.value = true
  activeStationId.value = null
  map.value.setCenter({ lat: 39.8283, lng: -98.5795 })
  map.value.setZoom(4)
  fetchAllStations().then(list => handleNewStations(list))
}

function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
}

function setMapType(type) {
  currentMapType.value = type
  map.value.setMapTypeId(type)
}

function initAutocomplete(inputEl, modelRef) {
  const auto = new google.maps.places.Autocomplete(inputEl)
  auto.addListener('place_changed', () => {
    const p = auto.getPlace()
    if (p.formatted_address) modelRef.value = p.formatted_address
  })
}

async function geocodeAddress(addr) {
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`)
    const json = await res.json()
    if (json.status==='OK') return json.results[0].geometry.location
  } catch {};
  return null
}

async function toggleAllStations() {
  allStationsVisible.value = !allStationsVisible.value
  if (allStationsVisible.value) {
    fetchAllStations().then(list => handleNewStations(list))
  } else {
    markers.value.forEach(m=>m.setMap(null))
    nearbyStations.value = []
    activeStationId.value = null
  }
}
</script>

<style scoped>
.station-map-container { position: relative; width: 100%; height: 100%; }
.map { width: 100%; height: 100%; }
.map-layer-control { position: absolute; top: 10px; left: 10px; display: flex; background: #fff; border: 1px solid #ccc; font-size: 0.9rem; z-index: 999; }
.layer-button { padding: 8px 12px; cursor: pointer; border-right: 1px solid #ccc; }
.layer-button:last-child { border-right: none; }
.layer-button:hover, .layer-button.active { background: #b11818; color: #fff; }
.map-overlay { position: absolute; top: 50px; left: 0; right: 0; background: rgba(255,255,255,0.95); z-index: 998; padding: 5px; display: flex; }
.controls-wrapper { display: flex; gap: 10px; }
.control-group { display: flex; gap: 5px; }
.control-group input { padding: 4px; border: 1px solid #ccc; border-radius: 4px; }
.control-group button { padding: 4px 8px; border: none; background: #b11818; color: #fff; border-radius: 4px; cursor: pointer; }
.control-group button:hover { background: #a00; }
.collapse-button { background: #b11818; color: #fff; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; margin-left: auto; }
.station-list { position: absolute; bottom: 0; left: 0; width: 100%; max-height: 150px; overflow-y: auto; background: rgba(255,255,255,0.9); z-index: 1000; }
.station-list ul { margin: 0; padding: 0; list-style: none; }
.station-list li { padding: 8px; cursor: pointer; }
.station-list li.active { background: #b11818; color: #fff; }
</style>
