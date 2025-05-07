<template>
  <div class="mapContainer">
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/supabaseClient'

const store = useStore()

// Map instance + overlays
let map = null
let cityMarkers = []
let circle = null

// Default view
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Utility: wait for Google Maps API to load
function whenGoogleReady() {
  return new Promise((resolve) => {
    if (window.google?.maps) return resolve()
    const h = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(h)
        resolve()
      }
    }, 100)
  })
}

// Clear existing markers & circles
function clearOverlays() {
  cityMarkers.forEach(m => m.setMap(null))
  cityMarkers = []
  if (circle) {
    circle.setMap(null)
    circle = null
  }
}

// (Re)initialize the map
async function initMap() {
  await whenGoogleReady()
  clearOverlays()
  map = new google.maps.Map(
    document.getElementById('simpleMapNewUser'),
    {
      center: defaultCenter,
      zoom:   defaultZoom,
      mapTypeControl:    false,
      streetViewControl: false,
      fullscreenControl: false,
    }
  )
}

// Load one marker per city from `potential_users`
async function loadAllCities() {
  await initMap()
  const { data, error } = await supabase
    .from('potential_users')
    .select('city,state,lat,lng', { distinct: ['city','state'] })

  if (error) {
    console.error('Error loading all cities:', error)
    return
  }
  data.forEach(({ city, state, lat, lng }) => {
    if (lat == null || lng == null) return
    const m = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: `${city}, ${state}`,
    })
    cityMarkers.push(m)
  })
}

// Zoom to a single DOT result & draw 50‑mile circle around it
async function showDotCircle(address, title) {
  await initMap()
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address }, (results, status) => {
    if (status !== 'OK' || !results[0]) return
    const loc = results[0].geometry.location
    map.setCenter(loc)
    map.setZoom(8)

    new google.maps.Marker({
      position: loc,
      map,
      title,
    })
    circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      map,
      center: loc,
      radius: 80467, // ~50 miles
    })
  })
}

// Watch your Vuex action results to switch modes
watch(
  () => store.state.dotSearchActionResults,
  (results) => {
    if (!results || results.length === 0) {
      // “Remove” or initial → all cities
      loadAllCities()
    } else if (results.length === 1) {
      // single DOT result
      const { city, state, business_name } = results[0]
      showDotCircle(`${city}, ${state}`, business_name)
    } else {
      // fallback to all cities
      loadAllCities()
    }
  },
  { immediate: true }
)

// On first mount, kick off the “all cities” view
onMounted(() => {
  loadAllCities()
})
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 400px;
}
.mapCanvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
}
</style>
