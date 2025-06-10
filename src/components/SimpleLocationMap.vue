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
      <!-- Hide/Show All Stations -->
      <div
        class="layer-button"
        :class="{ active: !allStationsVisible }"
        @click="toggleAllStations"
      >
        {{ allStationsVisible ? 'Hide All Stations' : 'Show All Stations' }}
      </div>
      <!-- Open in Google Maps (only after route) -->
      <div
        v-if="hasRoute"
        class="layer-button"
        @click="openInMaps"
      >
        Open in Maps
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
          <button type="button" @click="handleLookup">Go</button>
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

import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

// Basic map state
const map = ref(null)
const markers = ref([])
let infoWindow = null
const stationMarkers = new Map()
const nearbyStations = ref([])
const activeStationId = ref(null)
const reference = ref({ lat: 39.8283, lng: -98.5795 }) // default origin
const destinationCoord = ref(null)                    // store destination
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Toolbox / UI
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(true)
const hasRoute = ref(false)  // tracks if a route has been plotted

// Address fields
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)
const fromLocation = ref(null)
const toLocation = ref(null)

// Directions
let directionsService = null
let directionsRenderer = null

const emit = defineEmits(['filtered'])

//-------------------------------------------------
//  MOUNTED: Initialize the map
//-------------------------------------------------
const waitForGoogleMaps = () => {
  return new Promise(resolve => {
    if (window.google && window.google.maps) resolve()
    else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    }
  })
}

onMounted(async () => {
  await waitForGoogleMaps()
  await nextTick()
  const el = document.getElementById('stationMapFool')
  if (!el) return console.error('#stationMapFool not found')
  initMap()
})

//--------------------------------------------
// MAP & MARKERS
//--------------------------------------------
async function initMap() {
  const mapDiv = document.getElementById('stationMapFool')
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

  await nextTick()

  // ← Add back autocomplete initialization here:
  if (toolsExpanded.value) {
    if (lookupInput.value) initAutocomplete(lookupInput.value, lookupAddress)
    if (fromInput.value) initPlacesAuto(fromInput.value, fromAddress, fromLocation)
    if (toInput.value) initPlacesAuto(toInput.value, toAddress, toLocation)
  }

  if (allStationsVisible.value) {
    const allStations = await fetchAllStations()
    fetchAndCreateMarkers(allStations)
  }
}


function fetchAndCreateMarkers(stationData) {
  stationMarkers.forEach(m => m.setMap(null))
  stationMarkers.clear()
  markers.value = []
  stationData.forEach(station => {
    if (!station.lat || !station.lng) return
    const position = { lat: station.lat, lng: station.lng }
    let iconUrl = huIcon
    const bn = (station.brand_name||'').toLowerCase()
    if (bn.includes('speedway')) iconUrl = speedwayIcon
    else if (bn.includes('sheetz')) iconUrl = sheetzIcon
    else if (bn.includes('ta')) iconUrl = taIcon
    else if (bn.includes('maverick')) iconUrl = maverickIcon

    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || station.station_name || `Station ${station.id}`,
      icon: { url: iconUrl, scaledSize: new google.maps.Size(15,15) }
    })
    marker.addListener('click', () => showStationInfo(station, marker))
    stationMarkers.set(station.id, marker)
    markers.value.push(marker)
  })
}

//--------------------------------------------
// INFO WINDOW
//--------------------------------------------
function showStationInfo(station, marker) {
  activeStationId.value = station.id
  map.value.panTo(marker.getPosition())
  marker.setAnimation(google.maps.Animation.BOUNCE)
  setTimeout(() => marker.setAnimation(null), 1400)
  const content = `
    <div style="max-width:250px;font-family:Arial,sans-serif">
      <h3 style="margin:0 0 5px;">${station.brand_name || station.station_name}</h3>
      <p style="margin:0;line-height:1.4">
        ${station.address || ''}<br>
        ${station.city || ''}${station.city && station.state ? ', ' : ''}${station.state || ''}
      </p>
    </div>`
  infoWindow.setContent(content)
  infoWindow.open(map.value, marker)
}

//--------------------------------------------
// DATA FETCH
//--------------------------------------------
async function fetchStationsByBoundingBox(minLat, maxLat, minLng, maxLng) {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
    .gte('lat', minLat).lte('lat', maxLat)
    .gte('lng', minLng).lte('lng', maxLng)
  if (error) console.error(error)
  return data || []
}

async function fetchAllStations() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, station_name, address, city, state')
  if (error) console.error(error)
  return data || []
}

//--------------------------------------------
// ROUTING & FILTERING
//--------------------------------------------
async function calculateRoute() {
  // reset
  nearbyStations.value = []
  activeStationId.value = null
  hasRoute.value = false
  if (infoWindow) infoWindow.close()
  clearDirections()

  // re-init map
  map.value = null
  initMap()
  allStationsVisible.value = false

  // require at least text in both fields
  if (!fromAddress.value || !toAddress.value) {
    return alert('Please enter both a starting and ending address.')
  }

  // use selected autocomplete locations if present, otherwise geocode
  const origin = fromLocation.value
    ? fromLocation.value
    : await geocodeAddress(fromAddress.value)
  const destination = toLocation.value
    ? toLocation.value
    : await geocodeAddress(toAddress.value)

  if (!origin || !destination) {
    return alert('Unable to load one or both addresses.')
  }

  // store for export
  reference.value       = origin
  destinationCoord.value = destination

  directionsService.route({
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, async (result, status) => {
    if (status !== 'OK') {
      console.error(status)
      return alert(`Unable to calculate route: ${status}`)
    }

    // draw the route
    directionsRenderer.setDirections(result)

    // build high-res path from every step
    const fullPath = []
    result.routes[0].legs.forEach(leg =>
      leg.steps.forEach(step =>
        step.path.forEach(pt => fullPath.push(pt))
      )
    )

    const routePolyline = new google.maps.Polyline({
      path: fullPath,
      geodesic: true
    })

    // compute tight bounding box around the path
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
    fullPath.forEach(pt => {
      minLat = Math.min(minLat, pt.lat())
      maxLat = Math.max(maxLat, pt.lat())
      minLng = Math.min(minLng, pt.lng())
      maxLng = Math.max(maxLng, pt.lng())
    })
    const boxMargin = 0.01

    const stationsSubset = await fetchStationsByBoundingBox(
      minLat - boxMargin, maxLat + boxMargin,
      minLng - boxMargin, maxLng + boxMargin
    )

    // filter only those actually on (or very near) the polyline
    const tolerance = 0.01
    const onRouteStations = stationsSubset.filter(station => {
      const pos = new google.maps.LatLng(station.lat, station.lng)
      return google.maps.geometry.poly.isLocationOnEdge(pos, routePolyline, tolerance)
    })

    // render
    nearbyStations.value = onRouteStations
    fetchAndCreateMarkers(onRouteStations)

    hasRoute.value = true
    emit('filtered', { stations: onRouteStations, reference: origin })
  })
}


//--------------------------------------------
// OPEN IN GOOGLE MAPS
//--------------------------------------------
function openInMaps() {
  if (!hasRoute.value || !destinationCoord.value) {
    return alert('Create a route first before exporting.')
  }
  const o = reference.value
  const d = destinationCoord.value
  const waypoints = nearbyStations.value
    .map(s => `${s.lat},${s.lng}`)
    .join('|')

  const url = [
    'https://www.google.com/maps/dir/?api=1',
    `origin=${o.lat},${o.lng}`,
    `destination=${d.lat},${d.lng}`,
    `travelmode=driving`,
    waypoints ? `waypoints=${waypoints}` : ''
  ]
    .filter(Boolean)
    .join('&')

  window.open(url, '_blank')
}

//--------------------------------------------
// CLEAR / REFRESH
//--------------------------------------------
function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()
  nearbyStations.value = []
  activeStationId.value = null
  hasRoute.value = false
  destinationCoord.value = null
  if (infoWindow) infoWindow.close()
}

function refreshMap() {
  clearRouteInputs()
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
  allStationsVisible.value = true
  map.value = null
  initMap()
  emit('clearFiltered')
}

function clearDirections() {
  if (directionsRenderer) directionsRenderer.set('directions', null)
}

//--------------------------------------------
// AUTOCOMPLETE & UI HELPERS
//--------------------------------------------
function toggleTools() {
  toolsExpanded.value = !toolsExpanded.value
  if (toolsExpanded.value) {
    nextTick(() => {
      if (lookupInput.value) initAutocomplete(lookupInput.value, lookupAddress)
      if (fromInput.value) initPlacesAuto(fromInput.value, fromAddress)
      if (toInput.value) initPlacesAuto(toInput.value, toAddress)
    })
  }
}

function initPlacesAuto(el, textRef, locRef) {
  const auto = new google.maps.places.Autocomplete(el, { types: ['geocode'] })
  auto.addListener('place_changed', () => {
    const place = auto.getPlace()
    if (place && place.geometry?.location) {
      textRef.value = place.formatted_address
      // pull out the exact lat/lng
      locRef.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    }
  })
}


function setMapType(mapType) {
  currentMapType.value = mapType
  if (map.value) map.value.setMapTypeId(mapType)
}

function initAutocomplete(inputEl, modelRef) {
  initPlacesAuto(inputEl, modelRef)
}

//--------------------------------------------
// GEOCODE
//--------------------------------------------
async function geocodeAddress(address) {
  const apiKey = 'AIzaSyDYpNJXRFRuQjIV8LQZi8E90rIaiORI'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  try {
    const resp = await fetch(url)
    const data = await resp.json()
    if (data.status !== 'OK' || !data.results.length) return null
    return data.results[0].geometry.location
  } catch (e) {
    console.error(e)
    return null
  }
}
</script>

<style scoped>
/* (your existing styles unchanged) */
.station-map-container { position: relative; width: 100%; height: 600px; }
.map { width: 100%; height: 100%; }
.map-layer-control { position: absolute; top: 10px; left: 10px; display: flex; border: 1px solid #ccc; background: #fff; font-family: Arial, sans-serif; font-size: 0.9rem; z-index: 999; }
.layer-button { padding: 8px 12px; color: #333; cursor: pointer; border-right: 1px solid #ccc; user-select: none; display: flex; align-items: center; }
.layer-button:last-child { border-right: none; }
.layer-button:hover { background-color: #b11818; color: #fff; }
.layer-button.active { background-color: #b11818; color: #fff; }
.map-overlay { position: absolute; top: 50px; left: 0; right: 0; height: 50px; background: rgba(255, 255, 255, 0.95); display: flex; align-items: center; padding: 0 10px; z-index: 998; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); }
.controls-wrapper { display: flex; gap: 10px; overflow-x: auto; flex: 1; }
.map-overlay .control-group { display: flex; align-items: center; gap: 5px; }
.map-overlay .control-group input { padding: 4px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.8rem; }
.map-overlay .control-group button { padding: 4px 8px; border: none; background-color: #b11818; color: #fff; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }
.map-overlay .control-group button:hover { background-color: #a00; }
.collapse-button, .expand-button { background-color: #b11818; color: #fff; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; font-size: 0.8rem; }
.collapse-button:hover, .expand-button:hover { background-color: #a00; }
.expand-button { position: absolute; top: 10px; right: 10px; z-index: 999; }
</style>
