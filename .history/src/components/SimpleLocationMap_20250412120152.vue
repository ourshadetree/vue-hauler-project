<template>
  <div class="station-map-container">
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
      <div class="layer-button" @click="toggleTools">Map Tools</div>
    </div>

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
        <!-- Route fields -->
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
      <button class="collapse-button" @click="toggleTools">Collapse</button>
    </div>
    <button v-else class="expand-button" @click="toggleTools">Tools</button>

    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '@/../supabaseClient'
import taIcon from '@/assets/ta.png'
import speedwayIcon from '@/assets/speedway.png'
import sheetzIcon from '@/assets/sheetz.png'
import maverickIcon from '@/assets/maverick.png'
import huIcon from '@/assets/huIcon.png'

const map = ref(null)
const markers = ref([])
const stations = ref([])

// For the bounding box or distance-based filtering
let infoWindow = null
let directionsService = null
let directionsRenderer = null

const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

const toolsExpanded = ref(false)
const currentMapType = ref('roadmap')

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

function setMapType(mapType) {
  currentMapType.value = mapType
  if (map.value) map.value.setMapTypeId(mapType)
}

// --- STATION & MARKER LOGIC ---
async function loadStations() {
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
  stations.value = all
}

function createMarkers() {
  // Clear old markers
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  stations.value.forEach(station => {
    if (station.lat == null || station.lng == null) return
    const position = { lat: station.lat, lng: station.lng }
    const bn = (station.brand_name || '').toLowerCase().trim()
    let iconUrl
    if (bn === 'ta petro') iconUrl = taIcon
    else if (bn === 'speedway') iconUrl = speedwayIcon
    else if (bn === 'sheetz') iconUrl = sheetzIcon
    else if (bn === 'maverick') iconUrl = maverickIcon
    else iconUrl = huIcon

    const marker = new google.maps.Marker({
      position,
      map: map.value,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(15, 15)
      },
      title: station.brand_name || station.station_name || `Station ${station.id}`
    })
    marker.stationData = station
    marker.addListener('click', () => {
      const content = `
        <div style="max-width:250px;font-family:Arial,sans-serif">
          <h3 style="margin:0 0 5px 0;">${station.brand_name || station.station_name}</h3>
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

// Single Address Filter
function filterStationsNear(location) {
  console.log('filterStationsNear: Center = ', location)
  const center = new google.maps.LatLng(location.lat, location.lng)
  const tolerance = 40233 // ~50 miles in meters

  markers.value.forEach(marker => {
    const { stationData } = marker
    if (!stationData.lat || !stationData.lng) return
    const pt = new google.maps.LatLng(stationData.lat, stationData.lng)
    const distance = google.maps.geometry.spherical.computeDistanceBetween(center, pt)
    console.log(`Station ${stationData.id}, distance = ${distance}`)
    if (distance <= tolerance) {
      marker.setMap(map.value)
      console.log(`Showing station ${stationData.id}`)
    } else {
      marker.setMap(null)
      console.log(`Hiding station ${stationData.id}`)
    }
  })
}

// Route Filter
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

  // 10% margin
  const latMargin = (maxLat - minLat) * 0.1
  const lngMargin = (maxLng - minLng) * 0.1
  minLat -= latMargin
  maxLat += latMargin
  minLng -= lngMargin
  maxLng += lngMargin

  console.log(`BoundingBox lat [${minLat},${maxLat}], lng [${minLng},${maxLng}]`)

  markers.value.forEach(marker => {
    const { stationData } = marker
    if (!stationData.lat || !stationData.lng) return
    const inBox = (
      stationData.lat >= minLat &&
      stationData.lat <= maxLat &&
      stationData.lng >= minLng &&
      stationData.lng <= maxLng
    )
    marker.setMap(inBox ? map.value : null)
    console.log(`Station ${stationData.id} inBox=${inBox}`)
  })
}

// --- MAP INIT ---
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Map container not found')
    return
  }
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    mapTypeId: currentMapType.value,
    disableDefaultUI: true
  })

  infoWindow = new google.maps.InfoWindow()
  map.value.addListener('click', () => infoWindow.close())

  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false })
  directionsRenderer.setMap(map.value)

  // Load stations, create markers
  await loadStations()
  createMarkers()
  await nextTick()

  // Optionally attach autocomplete if the tools are expanded
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

// Basic Autocomplete
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

// Single Address Lookup
async function handleLookup() {
  if (!lookupAddress.value) return
  const location = await geocodeAddress(lookupAddress.value)
  if (location) {
    map.value.setCenter(location)
    map.value.setZoom(10)
    filterStationsNear(location)
  } else {
    alert('Address not found')
  }
}

// Geocode
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

// Route Calculation
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
      const poly = result?.routes?.[0]?.overview_polyline
      const encoded = typeof poly === 'string' ? poly : poly?.points
      if (!encoded) return console.error('No encoded polyline')
      const fullPath = google.maps.geometry.encoding.decodePath(encoded)
      filterStationsByBoundingBox(fullPath)
    } else {
      console.error('Error calculating route:', status)
      alert(`Unable to calculate route: ${status}`)
    }
  })
}

// Clear route
function clearRouteInputs() {
  fromAddress.value = ''
  toAddress.value = ''
  lookupAddress.value = ''
  clearDirections()
  // We do NOT restore markers here; they'd stay in their filtered state.
}

function clearDirections() {
  if (directionsRenderer) directionsRenderer.set('directions', null)
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
