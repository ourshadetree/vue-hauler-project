<template>
  <div class="station-map-container">
    <!-- Layer controls (map type, tools toggle, station toggle, export) -->
    <div class="map-layer-control">
      <button
        class="layer-button"
        :class="{ active: currentMapType === 'roadmap' }"
        @click="setMapType('roadmap')"
      >Map</button>
      <button
        class="layer-button"
        :class="{ active: currentMapType === 'satellite' }"
        @click="setMapType('satellite')"
      >Satellite</button>
      <button
        class="layer-button"
        :class="{ active: !toolsExpanded }"
        @click="toggleTools"
      >
        {{ toolsExpanded ? 'Hide Tools' : 'Show Tools' }}
      </button>
      <button
        class="layer-button"
        :class="{ active: !allStationsVisible }"
        @click="toggleAllStations"
      >
        {{ allStationsVisible ? 'Hide All Stations' : 'Show All Stations' }}
      </button>
      <!-- Export button only after a route exists -->
      <button
        v-if="hasRoute"
        class="layer-button"
        @click="openInMaps"
      >Open in Maps</button>
    </div>

    <!-- Floating tools (address lookup + routing) -->
    <div v-if="toolsExpanded" class="tools-bar">
      <div class="control-group">
        <input
          ref="lookupInput"
          v-model="lookupAddress"
          class="input"
          placeholder="Single address"
        />
        <button @click="handleLookup" class="btn">Go</button>
      </div>
      <div class="control-group">
        <input
          ref="fromInput"
          v-model="fromAddress"
          class="input"
          placeholder="Starting address"
          @keyup.enter="calculateRoute"
        />
        <input
          ref="toInput"
          v-model="toAddress"
          class="input"
          placeholder="Ending address"
          @keyup.enter="calculateRoute"
        />
        <button @click="calculateRoute" class="btn">Route</button>
        <button @click="clearRouteInputs" class="btn secondary">Clear</button>
      </div>
      <div class="control-group">
        <button @click="refreshMap" class="btn">Refresh Map</button>
      </div>
      <button class="btn collapse-btn" @click="toggleTools">Collapse</button>
    </div>

    <!-- The Google Map -->
    <div id="stationMapFool" class="map"></div>

    <!-- Side list of filtered stations -->
    <StationList
      :filteredStations="nearbyStations"
      :referenceLocation="reference"
      :activeStationId="activeStationId"
      @select="handleStationSelect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '@/supabaseClient'
import StationList from '@/components/StationList.vue'

// --- Icons ---
import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'
import speedwayIconPNG from '@/assets/speedWayIconPNG.png'

import small711 from '@/assets/small711.png'
import smallAS from '@/assets/smallAS.png'
import smallC from '@/assets/smallC.png'
import smallCK from '@/assets/smallCK.png'
import smallKT from '@/assets/smallKT.png'
import smallM from '@/assets/smallM.png'
import smallP from '@/assets/smallP.png'
import smallR from '@/assets/smallR.png'
import smallRT from '@/assets/smallRT.png'
import smallRW from '@/assets/smallRW.png'
import smallS from '@/assets/smallS.png'
import smallSB from '@/assets/smallSB.png'
import smallSW from '@/assets/smallSW.png'
import smallTA from '@/assets/smallTA.png'
import smallYW from '@/assets/smallYW.png'


// --------------------------------------------------
// Reactive state & refs
// --------------------------------------------------
const map = ref(null)
const markers = ref([])                 // flat array of Marker instances
const stationMarkers = new Map()        // id → Marker
let infoWindow = null

const nearbyStations = ref([])
const activeStationId  = ref(null)
const reference        = ref({ lat:39.8283, lng:-98.5795 }) // route origin
const destinationCoord = ref(null)      // route destination

// UI state
const toolsExpanded      = ref(true)
const currentMapType     = ref('roadmap')
const allStationsVisible = ref(true)
const hasRoute           = ref(false)

// Address inputs & locations from Autocomplete
const lookupAddress = ref('')
const lookupLocation = ref(null)
const fromAddress   = ref('')
const toAddress     = ref('')
const fromLocation  = ref(null)
const toLocation    = ref(null)
const lookupInput   = ref(null)
const fromInput     = ref(null)
const toInput       = ref(null)

// Google Directions services
let directionsService  = null
let directionsRenderer = null

const emit = defineEmits(['filtered'])

// --------------------------------------------------
// Lifecycle: wait for Google Maps API to load
// --------------------------------------------------
const waitForGoogleMaps = () => new Promise(resolve => {
  if (window.google?.maps) return resolve()
  const iv = setInterval(() => {
    if (window.google?.maps) {
      clearInterval(iv)
      resolve()
    }
  }, 100)
})

onMounted(async () => {
  await waitForGoogleMaps()
  await nextTick()
  await initMap()
})

// --------------------------------------------------
// Initialize map, InfoWindow, Autocomplete & Markers
// --------------------------------------------------
async function initMap() {
  // Create the map
  map.value = new google.maps.Map(
    document.getElementById('stationMapFool'),
    { center: reference.value, zoom: 4, disableDefaultUI: true, mapTypeId: currentMapType.value }
  )

  // Set up InfoWindow
  infoWindow = new google.maps.InfoWindow()
  map.value.addListener('click', () => infoWindow.close())

  // Directions API bindings
  directionsService  = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  await nextTick()

  // Wire up Autocomplete (initial load + when toggling tools)
  if (toolsExpanded.value) {
    if (lookupInput.value) initPlacesAuto(lookupInput.value, lookupAddress, lookupLocation)
    if (fromInput.value)   initPlacesAuto(fromInput.value,   fromAddress,   fromLocation)
    if (toInput.value)     initPlacesAuto(toInput.value,     toAddress,     toLocation)
  }

  // Show all stations by default
  if (allStationsVisible.value) {
    const allStations = await fetchAllStations()
    renderMarkers(allStations)
  }
}

// --------------------------------------------------
// Autocomplete helper: binds input → text + location ref
// --------------------------------------------------
function initPlacesAuto(el, textRef, locRef) {
  const auto = new google.maps.places.Autocomplete(el, { types: ['geocode'] })
  auto.addListener('place_changed', () => {
    const place = auto.getPlace()
    if (!place?.geometry?.location) return
    // Fill in the input and capture exact coordinates
    textRef.value = place.formatted_address
    if (locRef) {
      locRef.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    }
  })
}

// --------------------------------------------------
// Fetch stations for a bounding box
// --------------------------------------------------
async function fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng) {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id,lat,lng,brand_name,station_name,address,city,state')
    .gte('lat', minLat).lte('lat', maxLat)
    .gte('lng', minLng).lte('lng', maxLng)
  if (error) console.error(error)
  return data || []
}

// Fetch all stations unfiltered
async function fetchAllStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id,lat,lng,brand_name,station_name,address,city,state')
  if (error) console.error(error)
  return data || []
}

// --------------------------------------------------
// Render markers on the current map & track them
// --------------------------------------------------
function renderMarkers(stations) {
  // Clear old
  stationMarkers.forEach(m => m.setMap(null))
  stationMarkers.clear()
  markers.value = []
  // Add new
  stations.forEach(st => {
    if (!st.lat || !st.lng) return
    const pos = { lat: st.lat, lng: st.lng }
    let icon = huIcon
    const bn = (st.brand_name||'').toLowerCase()
    if (bn.includes('speedway')) icon = smallSW
    else if (bn.includes('sheetz'))  icon = smallS
    else if (bn.includes('ta'))      icon = smallTA
    else if (bn.includes('maverick'))icon = smallM
    else if (bn.includes('yesway')) icon = smallYW
    else if (bn.includes('sapp')) icon = smallSB
    else if (bn.includes('roady')) icon = smallR
    else if (bn.includes('racetrac')) icon = smallRT
    else if (bn.includes('kwik')) icon = smallKT
    else if (bn.includes('circle')) icon = smallCK
    else if (bn.includes('casey')) icon = smallC
    else if (bn.includes('eleven')) icon = small711
    else if (bn.includes('allsup')) icon = smallAS


    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title: st.brand_name || st.station_name || `Station ${st.id}`,
      icon: { url: icon, scaledSize: new google.maps.Size(15,15) }
    })
    marker.addListener('click', () => showStationInfo(st, marker))
    stationMarkers.set(st.id, marker)
    markers.value.push(marker)
  })
}

// --------------------------------------------------
// Show info window and animate marker
// --------------------------------------------------
function showStationInfo(station, marker) {
  activeStationId.value = station.id
  map.value.panTo(marker.getPosition())
  marker.setAnimation(google.maps.Animation.BOUNCE)
  setTimeout(() => marker.setAnimation(null), 1400)
  const content = `
    <div class="info-window">
      <h3>${station.brand_name || station.station_name}</h3>
      <p>${station.address}<br>${station.city}, ${station.state}</p>
    </div>`
  infoWindow.setContent(content)
  infoWindow.open(map.value, marker)
}

// --------------------------------------------------
// Single‐address lookup (approx 50-mile box)
// --------------------------------------------------
async function handleLookup() {
  clearMapState()
  if (!lookupAddress.value) return

  // use the Autocomplete pick if available, else geocode
  const loc = lookupLocation.value
    ? lookupLocation.value
    : await geocodeAddress(lookupAddress.value)

  if (!loc) {
    console.error('geocodeAddress result:', loc)
    return alert('Address not found.')
  }

  // now proceed exactly as before
  reference.value = loc
  map.value.setCenter(loc)
  map.value.setZoom(10)
  const deg = 0.72
  const stations = await fetchStationsByBoundingBox(
    loc.lat - deg, loc.lat + deg,
    loc.lng - deg, loc.lng + deg
  )
  nearbyStations.value = stations
  renderMarkers(stations)
  emit('filtered', { stations, reference: loc })
}

// --------------------------------------------------
// Handle station clicks from the list
// --------------------------------------------------
function handleStationSelect(stationId) {
   const station = nearbyStations.value.find(s => s.id === stationId)
   const marker  = stationMarkers.get(stationId)
   if (!station || !marker) return
   showStationInfo(station, marker)
 }


// --------------------------------------------------
// Calculate route & filter stations to on‐route only
// --------------------------------------------------
async function calculateRoute() {
  clearMapState()
  allStationsVisible.value = false

  // ensure inputs
  if (!fromAddress.value || !toAddress.value)
    return alert('Please enter both a starting and ending address.')

  // pick Autocomplete coords or fall back to geocode
  const origin      = fromLocation.value  || await geocodeAddress(fromAddress.value)
  const destination = toLocation.value    || await geocodeAddress(toAddress.value)
  if (!origin || !destination)
    return alert('Unable to load one or both addresses.')

  // save for export
  reference.value       = origin
  destinationCoord.value = destination

  // re‐init map (await to ensure services exist)
  await initMap()

  // request directions
  directionsService.route(
    { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
    async (result, status) => {
      if (status !== 'OK')
        return alert(`Unable to calculate route: ${status}`)

      // draw route
      directionsRenderer.setDirections(result)

      // gather every step’s path for high resolution
      const fullPath = []
      result.routes[0].legs.forEach(leg =>
        leg.steps.forEach(step =>
          step.path.forEach(pt => fullPath.push(pt))
        )
      )

      // compute tight bounding box
      let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
      fullPath.forEach(pt => {
        minLat = Math.min(minLat, pt.lat())
        maxLat = Math.max(maxLat, pt.lat())
        minLng = Math.min(minLng, pt.lng())
        maxLng = Math.max(maxLng, pt.lng())
      })
      const boxMargin = 0.0005
      const candidates = await fetchStationsByBoundingBox(
        minLat - boxMargin, maxLat + boxMargin,
        minLng - boxMargin, maxLng + boxMargin
      )

      // filter exactly on the polyline (±0.0005° ≈ 55m)
      const poly = new google.maps.Polyline({ path: fullPath, geodesic: true })
      const onRoute = candidates.filter(st => {
        const pos = new google.maps.LatLng(st.lat, st.lng)
        return google.maps.geometry.poly.isLocationOnEdge(pos, poly, 0.02)
      })

      // render & finalize
      nearbyStations.value = onRoute
      renderMarkers(onRoute)
      hasRoute.value = true
      emit('filtered', { stations: onRoute, reference: origin })
    }
  )
}

// --------------------------------------------------
// Export to Google Maps web/app
// --------------------------------------------------
function openInMaps() {
  if (!hasRoute.value || !destinationCoord.value)
    return alert('Create a route first before exporting.')

  const o = reference.value
  const d = destinationCoord.value
  const waypoints = nearbyStations.value.map(s => `${s.lat},${s.lng}`).join('|')

  const url = [
    'https://www.google.com/maps/dir/?api=1',
    `origin=${o.lat},${o.lng}`,
    `destination=${d.lat},${d.lng}`,
    'travelmode=driving',
    waypoints && `waypoints=${waypoints}`
  ].filter(Boolean).join('&')

  window.open(url, '_blank')
}

// --------------------------------------------------
// Helpers: reset state & map
// --------------------------------------------------
function clearMapState() {
  // clear markers
  stationMarkers.forEach(m => m.setMap(null))
  stationMarkers.clear()
  markers.value = []
  // reset refs
  nearbyStations.value = []
  activeStationId.value  = null
  hasRoute.value         = false
  destinationCoord.value = null
  // close infoWindow
  if (infoWindow) infoWindow.close()
}

function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value   = ''
  lookupAddress.value = ''
  fromLocation.value = null
  toLocation.value   = null
}

// --------------------------------------------------
// Refresh map completely
// --------------------------------------------------
function refreshMap() {
  clearMapState()
  allStationsVisible.value = true
  initMap()
  emit('clearFiltered')
}

// --------------------------------------------------
// Toggle tools & re-bind autocomplete
// --------------------------------------------------
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
  if (toolsExpanded.value) {
    nextTick(() => {
      if (lookupInput.value) initPlacesAuto(lookupInput.value, lookupAddress, lookupLocation)
      if (fromInput.value)   initPlacesAuto(fromInput.value,   fromAddress,   fromLocation)
      if (toInput.value)     initPlacesAuto(toInput.value,     toAddress,     toLocation)
    })
  }
}

// --------------------------------------------------
// Toggle showing all stations
// --------------------------------------------------
async function toggleAllStations() {
  clearMapState()
  await initMap()
  allStationsVisible.value = !allStationsVisible.value
  if (allStationsVisible.value) {
    const allStations = await fetchAllStations()
    renderMarkers(allStations)
  }
}

// --------------------------------------------------
// Helper: geocode a free-text address
// --------------------------------------------------
async function geocodeAddress(address) {
  const key = 'AIzaSyDYpNJXRFRuQjIV8LQZi8E90rIaiORI'
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`
  )
  const data = await resp.json()
  if (data.status !== 'OK' || !data.results.length) return null
  return data.results[0].geometry.location
}
</script>

<style scoped>
/* Container & map */
.station-map-container {
  position: relative;
  width: 100%;
  height: 600px;
}
.map {
  width: 100%;
  height: 100%;
}

/* Layer‐control bar */
.map-layer-control {
  position: absolute;
  top: 10px; left: 10px;
  display: flex;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 999;
}
.layer-button {
  padding: 8px 12px;
  border-right: 1px solid #ccc;
  background: none;
  border: none;
  cursor: pointer;
  font: 0.9rem Arial, sans-serif;
}
.layer-button:last-child { border-right: none; }
.layer-button:hover,
.layer-button.active {
  background-color: #b11818;
  color: #fff;
}

/* Tools bar */
.tools-bar {
  position: absolute;
  top: 50px; left: 0; right: 0;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.95);
  padding: 5px 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 998;
}
.control-group {
  display: flex;
  gap: 5px;
  margin-right: 15px;
}
.input {
  padding: 4px 6px;
  font: 0.85rem Arial, sans-serif;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 4px 8px;
  font: 0.85rem Arial, sans-serif;
  border: none;
  border-radius: 4px;
  background-color: #b11818;
  color: #fff;
  cursor: pointer;
}
.btn.secondary { background-color: #555; }
.btn:hover { background-color: #a00; }
.collapse-btn {
  margin-left: auto;
  background-color: #b11818;
}

/* InfoWindow content */
.info-window h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}
.info-window p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
