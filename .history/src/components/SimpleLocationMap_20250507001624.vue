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
      <div class="layer-button" 
        :class="{ active: !toolsExpanded }"
        @click="toggleTools">
        {{ toolsExpanded ? 'Hide Tools' : 'Show Tools' }}
      </div>
      <!-- New toggle button for All Stations -->
      <div class="layer-button" 
           :class="{ active: !allStationsVisible }"
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
          />
          <button type='button' @click="handleLookup">Go</button>
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

// Import partner icons
import allSupsIcon    from '@/assets/allSups.svg'
import sheetzIcon     from '@/assets/sheetz.svg'
import caseysIcon     from '@/assets/caseys.svg'
import maverikIcon    from '@/assets/maverik.svg'
import yesWayIcon     from '@/assets/yesWay.svg'
import raceTracIcon   from '@/assets/raceTrac.svg'
import raceWayIcon    from '@/assets/raceWay.svg'
import circleKIcon    from '@/assets/circleK.svg'
import taIcon         from '@/assets/ta.svg'
import petroIcon      from '@/assets/petro.svg'
import sevenFleetIcon from '@/assets/7Fleet.svg'
import speedWayIcon   from '@/assets/speedWay.svg'
import kwikTripIcon   from '@/assets/kwikTrip.svg'
import roadysIcon     from '@/assets/roadys.svg'
import sappBrosIcon   from '@/assets/sappBros.svg'
// Generic fallback icon
import huIcon         from '@/assets/huIcon.png'

// Basic map state
const map = ref(null)
const markers = ref([])
let infoWindow = null
const stationMarkers = new Map()
const nearbyStations = ref([])
const activeStationId = ref(null)
const reference = ref({ lat: 39.8283, lng: -98.5795 })
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Toolbox / UI
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(true)

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

// Initialize on mount
onMounted(async () => {
  if (window.google && window.google.maps) initMap()
  else {
    const iv = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(iv)
        initMap()
      }
    }, 100)
  }
})

// Helper: choose icon based on brand_name
function iconForBrand(name) {
  const bn = (name || '').toLowerCase()
  if (bn.includes('sheetz'))     return sheetzIcon
  if (bn.includes('casey'))      return caseysIcon
  if (bn.includes('all sup'))    return allSupsIcon
  if (bn.includes('maverik'))    return maverikIcon
  if (bn.includes('yesway'))     return yesWayIcon
  if (bn.includes('race trac'))  return raceTracIcon
  if (bn.includes('raceway'))    return raceWayIcon
  if (bn.includes('circle k'))   return circleKIcon
  if (bn === 'ta' || bn.includes('travel')) return taIcon
  if (bn.includes('petro'))      return petroIcon
  if (bn.includes('7fleet'))     return sevenFleetIcon
  if (bn.includes('speedway'))   return speedWayIcon
  if (bn.includes('kwik trip'))  return kwikTripIcon
  if (bn.includes('roadys'))     return roadysIcon
  if (bn.includes('sapp'))       return sappBrosIcon
  return huIcon
}

// Show info window
function showStationInfo(station, marker) {
  activeStationId.value = station.id
  map.value.panTo(marker.getPosition())
  marker.setAnimation(google.maps.Animation.BOUNCE)
  setTimeout(() => marker.setAnimation(null), 1400)
  const content = `<div style="font-family:Arial,sans-serif;max-width:250px">
    <h3>${station.brand_name || station.station_name}</h3>
    <p>${station.address || ''}<br>${station.city || ''}${station.state ? ', ' + station.state : ''}</p>
  </div>`
  infoWindow.setContent(content)
  infoWindow.open(map.value, marker)
}

// Initialize map
async function initMap() {
  const el = document.getElementById('stationMapFool')
  if (!el) return console.error('Map container missing')
  map.value = new google.maps.Map(el, {
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
  markers.value = []
  stationMarkers.clear()
  if (allStationsVisible.value) {
    const all = await fetchAllStations()
    createMarkers(all)
  }
  if (toolsExpanded.value) {
    if (lookupInput.value)   initAutocomplete(lookupInput.value, lookupAddress)
    if (fromInput.value)     initAutocomplete(fromInput.value, fromAddress)
    if (toInput.value)       initAutocomplete(toInput.value, toAddress)
  }
}

// Fetch all stations
async function fetchAllStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
  if (error) {
    console.error('fetchAllStations error', error)
    return []
  }
  return data
}

// Create markers function
function createMarkers(list) {
  // clear old
  stationMarkers.forEach(m => m.setMap(null))
  stationMarkers.clear()
  list.forEach(st => {
    if (st.lat == null || st.lng == null) return
    const pos = { lat: st.lat, lng: st.lng }
    const iconUrl = iconForBrand(st.brand_name)
    const m = new google.maps.Marker({ position: pos, map: map.value, title: st.brand_name, icon: { url: iconUrl, scaledSize: new google.maps.Size(20,20) } })
    m.addListener('click', () => showStationInfo(st, m))
    stationMarkers.set(st.id, m)
    markers.value.push(m)
  })
}

// ... rest of lookup, routing, controls unchanged ...
// for brevity, you can leave handleLookup, calculateRoute, toggleTools, toggleAllStations etc.

</script>

<style scoped>
/* existing styles unchanged */
.station-map-container { position: relative; width: 100%; height: 600px; }
.map { width: 100%; height: 100%; }
.map-layer-control { position: absolute; top: 10px; left: 10px; display: flex; border: 1px solid #ccc; background: #fff; font-family: Arial, sans-serif; font-size: 0.9rem; z-index: 999; }
.layer-button { padding: 8px 12px; color: #333; cursor: pointer; border-right: 1px solid #ccc; user-select: none; display: flex; align-items: center; }
.layer-button:last-child { border-right: none; }
.layer-button:hover { background-color: #b11818; color: #fff; }
.layer-button.active { background-color: #b11818; color: #fff; }
.map-overlay { position: absolute; top: 50px; left: 0; right: 0; height: 50px; background: rgba(255,255,255,0.95); display: flex; align-items: center; padding: 0 10px; z-index: 998; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
.controls-wrapper { display: flex; gap: 10px; overflow-x: auto; flex: 1; }
.map-overlay .control-group { display: flex; align-items: center; gap: 5px; }
.map-overlay .control-group input { padding: 4px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.8rem; }
.map-overlay .control-group button { padding: 4px 8px; border: none; background-color: #b11818; color: #fff; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }
.map-overlay .control-group button:hover { background-color: #a00; }
.collapse-button, .expand-button { background-color: #b11818; color: #fff; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; font-size: 0.8rem; }
.collapse-button:hover, .expand-button:hover { background-color: #a00; }
.expand-button { position: absolute; top: 10px; right: 10px; z-index: 999; }
</style>