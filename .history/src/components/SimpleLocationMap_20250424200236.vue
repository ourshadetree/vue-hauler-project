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

    <!-- Floating Tools Bar (Collapsible) -->
    <div v-if="toolsExpanded" class="map-overlay">
      <div class="controls-wrapper">
        <!-- Single address -->
        <div class="control-group">
          <input
            type="text"
            v-model="lookupAddress"
            placeholder="Single address"
          />
          <button type="button" @click="handleLookup">Go</button>
        </div>
        <!-- ... routing & refresh controls ... -->
      </div>
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>

    <!-- Map container -->
    <div id="stationMapFool" class="map"></div>

    <!-- Nearby stations list -->
    <div class="station-list" v-if="nearbyStations.length">
      <ul>
        <li
          v-for="station in nearbyStations"
          :key="station.id"
          :class="{ active: station.id === activeStationId }"
          @click="selectStation(station)"
        >
          {{ station.brand_name || station.station_name }} - {{ station.city }}, {{ station.state }}
        </li>
      </ul>
    </div>
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

// Map & markers
const map = ref(null)
const markers = ref([])
let infoWindow = null
let placesService = null
let currentActiveMarker = null

// UI state
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(true)

// Nearby stations list
const nearbyStations = ref([])
const activeStationId = ref(null)

// Inputs
const lookupAddress = ref('')
// ... other address refs ...

// Directions
let directionsService = null
let directionsRenderer = null

// Init map
onMounted(async () => {
  await waitForGoogle()
  await initMap()
})

function waitForGoogle() {
  return new Promise(res => {
    const i = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(i)
        res()
      }
    }, 100)
  })
}

async function initMap() {
  const el = document.getElementById('stationMapFool')
  if (!el) return console.error('Map container missing')
  map.value = new google.maps.Map(el, {
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
  await nextTick()
  // initial load
  if (allStationsVisible.value) {
    const list = await fetchAllStations()
    handleNewStations(list)
  }
}

// Fetch stations
async function fetchAllStations() {
  const { data } = await supabase
    .from('a_to_b_stations')
    .select('id,lat,lng,brand_name,station_name,address,city,state')
  return data || []
}

// Called when new list
function handleNewStations(list) {
  nearbyStations.value = list
  createMarkers(list)
}

// Create & bind markers
function createMarkers(list) {
  // clear old
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  list.forEach(st => {
    const icon = getIconFor(st)
    const marker = new google.maps.Marker({
      position: { lat: st.lat, lng: st.lng },
      map: map.value,
      title: st.brand_name || st.station_name,
      icon: { url: icon, scaledSize: new google.maps.Size(15, 15) }
    })
    marker.stationId = st.id
    marker.addListener('click', () => onMarkerClick(marker, st))
    markers.value.push(marker)
  })
}

function getIconFor(station) {
  const bn = (station.brand_name||'').toLowerCase()
  if (bn.includes('ta')) return taIcon
  if (bn.includes('speedway')) return speedwayIcon
  if (bn.includes('sheetz')) return sheetzIcon
  if (bn.includes('maverick')) return maverickIcon
  return huIcon
}

// When a marker is clicked
function onMarkerClick(marker, station) {
  highlightMarker(marker)
  const content = `
    <div style="max-width:250px;font-family:Arial,sans-serif">
      <h3 style="margin:0">${station.brand_name||station.station_name}</h3>
      <p style="margin:0">${station.address}, ${station.city}, ${station.state}</p>
    </div>`
  infoWindow.setContent(content)
  infoWindow.open(map.value, marker)
}

// Highlight logic
function highlightMarker(marker) {
  if (currentActiveMarker && currentActiveMarker !== marker) {
    currentActiveMarker.setAnimation(null)
  }
  currentActiveMarker = marker
  marker.setAnimation(google.maps.Animation.BOUNCE)
  activeStationId.value = marker.stationId
  setTimeout(() => marker.setAnimation(null), 2100)
}

// List click handler
function selectStation(station) {
  const marker = markers.value.find(m => m.stationId === station.id)
  if (marker) onMarkerClick(marker, station)
}

// Toggle stations
async function toggleAllStations() {
  allStationsVisible.value = !allStationsVisible.value
  if (allStationsVisible.value) {
    const list = await fetchAllStations()
    handleNewStations(list)
  } else {
    markers.value.forEach(m => m.setMap(null))
    nearbyStations.value = []
  }
}

// Lookup handler (route logic omitted)
async function handleLookup() {
  // geocode, fetch subset, then:
  allStationsVisible.value = false
  const subset = await fetchStationsByBoundingBox(/* bounds */)
  handleNewStations(subset)
}

async function fetchStationsByBoundingBox() {
  // ... existing supabase logic ...
}

</script>

<style scoped>
.station-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background: rgba(255,255,255,0.9);
  z-index: 1000;
}
.station-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.station-list li {
  padding: 4px 8px;
  cursor: pointer;
}
.station-list li.active {
  background-color: #b11818;
  color: #fff;
}
</style>
