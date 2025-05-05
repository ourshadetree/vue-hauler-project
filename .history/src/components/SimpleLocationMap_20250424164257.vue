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
let placesService = null  // for Place Details
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// UI state
const toolsExpanded = ref(true)
const currentMapType = ref('roadmap')
const allStationsVisible = ref(false)

// Address inputs
const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')
const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

// Directions
let directionsService = null
let directionsRenderer = null

const emit = defineEmits(['filtered', 'clearFiltered'])

// Initialize map on mount
onMounted(() => {
  const checkGoogle = setInterval(() => {
    if (window.google && window.google.maps) {
      clearInterval(checkGoogle)
      initMap()
    }
  }, 100)
})

async function initMap() {
  const mapDiv = document.getElementById('stationMapFool')
  if (!mapDiv) return console.error('#stationMapFool not found')

  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
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
  setupAutocomplete()
}

function setupAutocomplete() {
  if (lookupInput.value) initAutocomplete(lookupInput.value, lookupAddress)
  if (fromInput.value) {
    const fromAuto = new google.maps.places.Autocomplete(fromInput.value)
    fromAuto.addListener('place_changed', () => {
      const place = fromAuto.getPlace()
      if (place.formatted_address) fromAddress.value = place.formatted_address
    })
  }
  if (toInput.value) {
    const toAuto = new google.maps.places.Autocomplete(toInput.value)
    toAuto.addListener('place_changed', () => {
      const place = toAuto.getPlace()
      if (place.formatted_address) toAddress.value = place.formatted_address
    })
  }
}

// Fetch stations (include google_place_id)
async function fetchStations(queryFn) {
  const { data, error } = await queryFn()
  if (error) console.error(error)
  return data || []
}

// Create markers and show infoWindow with retail price
function fetchAndCreateMarkers(stations) {
  // clear old markers
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  stations.forEach(st => {
    const { lat, lng, brand_name, station_name, address, city, state, google_place_id } = st
    if (!lat || !lng) return

    const iconMap = {
      'ta petro': taIcon,
      speedway: speedwayIcon,
      sheetz: sheetzIcon,
      maverick: maverickIcon
    }
    const iconUrl = iconMap[(brand_name||'').toLowerCase()] || huIcon
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: brand_name || station_name || `Station ${st.id}`,
      icon: { url: iconUrl, scaledSize: new google.maps.Size(15,15) }
    })

    marker.addListener('click', () => {
      // Default content
      let content = `<div style="font-family:Arial,sans-serif;max-width:250px">
        <h3 style="margin:0">${brand_name||station_name||`Station ${st.id}`}</h3>
        <p style="margin:0">${address||'No address'}<br>${city||''}${city&&state?', ':''}${state||''}</p>
        <p style="margin-top:5px;font-weight:bold">Retail price: Loading...</p>
      </div>`
      infoWindow.setContent(content)
      infoWindow.open(map.value, marker)

      // Fetch price via Places Details
      if (google_place_id) {
        placesService.getDetails({ placeId: google_place_id, fields: ['fuelPrices'] }, (place, status) => {
          let priceText = 'Unavailable'
          if (status===google.maps.places.PlacesServiceStatus.OK && place.fuelPrices && place.fuelPrices.length) {
            const reg = place.fuelPrices.find(p=>p.type==='REGULAR_UNLEADED')||place.fuelPrices[0]
            const m = reg.price
            priceText = m.currencyCode + (m.units + m.nanos/1e9)
          }
          const updated = `<div style="font-family:Arial,sans-serif;max-width:250px">
            <h3 style="margin:0">${brand_name||station_name||`Station ${st.id}`}</h3>
            <p style="margin:0">${address||'No address'}<br>${city||''}${city&&state?', ':''}${state||''}</p>
            <p style="margin-top:5px;font-weight:bold">Retail price: ${priceText}</p>
          </div>`
          infoWindow.setContent(updated)
        })
      }
    })

    markers.value.push(marker)
  })
}

// Handlers: lookup, route, toggle, refresh (unchanged) ...
// SINGLE ADDRESS LOOKUP
async function handleLookup() {
  map.value=null; initMap()
  if (!lookupAddress.value) return
  const loc = await geocode(lookupAddress.value)
  if (!loc) return alert('Address not found')
  map.value.setCenter(loc); map.value.setZoom(10)
  const d=0.72
  const boundsFn = ()=>supabase.from('a_to_b_stations')
    .select('id,lat,lng,brand_name,station_name,address,city,state,google_place_id')
    .gte('lat',loc.lat-d).lte('lat',loc.lat+d).gte('lng',loc.lng-d).lte('lng',loc.lng+d)
  const stations = await fetchStations(boundsFn)
  fetchAndCreateMarkers(stations)
  emit('filtered',{stations,reference:loc})
}

// AUTO complete helper
function initAutocomplete(el, model) {
  const auto = new google.maps.places.Autocomplete(el)
  auto.addListener('place_changed',()=>{
    const p=auto.getPlace()
    if(p.geometry) model.value=p.formatted_address
  })
}

async function geocode(addr) {
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`)
    const j = await res.json()
    if(j.status==='OK') return j.results[0].geometry.location
  } catch {};
  return null
}
</script>

<style scoped>
.station-map-container { position: relative; width: 100%; height: 600px; }
.map { width: 100%; height: 100%; }
.map-layer-control { position: absolute; top:10px; left:10px; display:flex; background:#fff; border:1px solid #ccc; z-index:999; }
.layer-button { padding:8px 12px; cursor:pointer; border-right:1px solid #ccc; }
.layer-button:last-child { border-right:none; }
.layer-button.active, .layer-button:hover { background:#b11818; color:#fff; }
.map-overlay { position:absolute; top:50px; left:0; right:0; background:rgba(255,255,255,0.95); z-index:998; display:flex; align-items:center; padding:0 10px; }
.controls-wrapper { display:flex; gap:10px; overflow-x:auto; flex:1; }
.control-group { display:flex; gap:5px; align-items:center; }
.control-group input { padding:4px; border:1px solid #ccc; border-radius:4px; }
.control-group button { padding:4px 8px; border:none; background:#b11818; color:#fff; border-radius:4px; cursor:pointer; }
.control-group button:hover { background:#a00; }
.collapse-button { background:#b11818; color:#fff; border:none; border-radius:4px; padding:6px 10px; cursor:pointer; }
.collapse-button:hover { background:#a00; }
</style>
