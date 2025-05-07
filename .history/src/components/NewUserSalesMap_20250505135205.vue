<!-- src/components/NewUserSalesMap.vue -->
<template>
  <div class="mapContainer">
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/supabaseClient'

// 1) Vuex store
const store = useStore()

// 2) Map & markers
const mapRef = ref(null)
let circle = null
const cityMarkers = ref([])

// 3) Helpers to clear overlays
function clearCircle() {
  if (circle) circle.setMap(null)
}
function clearCityMarkers() {
  cityMarkers.value.forEach(m => m.setMap(null))
  cityMarkers.value = []
}

// 4) Initial “all cities” loader
async function loadAllCities() {
  clearCircle()
  clearCityMarkers()

  // pull every unique city/state (assuming you have lat/lng stored—if not, geocode)
  const { data, error } = await supabase
    .from('potential_users')
    .select('city, state, lat, lng', { distinct: ['city', 'state'] })

  if (error) {
    console.error('Error loading cities:', error)
    return
  }

  data.forEach(({ city, state, lat, lng }) => {
    if (lat == null || lng == null) return
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: mapRef.value,
      title: `${city}, ${state}`,
    })
    cityMarkers.value.push(marker)
  })
}

// 5) Draw one‐off circle & marker for the DOT‐search result
async function showDotCircle(address, title) {
  clearCityMarkers()
  clearCircle()

  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address }, (results, status) => {
    if (status !== 'OK' || !results[0]) return
    const loc = results[0].geometry.location

    // center/zoom so your circle shows nicely
    mapRef.value.setCenter(loc)
    mapRef.value.setZoom(8)

    // marker at the DOT‐result city
    new google.maps.Marker({
      position: loc,
      map: mapRef.value,
      title,
    })

    // 50‑mile radius circle (~80 467 m)
    circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      map: mapRef.value,
      center: loc,
      radius: 80467,
    })
  })
}

// 6) Watch the Vuex action results
watch(
  () => store.state.dotSearchActionResults,
  (results) => {
    if (!results || results.length === 0) {
      // “Remove” pressed or initial state → go back to all cities
      loadAllCities()
    } else if (results.length === 1) {
      // single DOT hit → show just that circle
      const { city, state, business_name } = results[0]
      showDotCircle(`${city}, ${state}`, business_name)
    } else {
      // if you ever want to handle multiple results differently,
      // you could iterate here too.
      loadAllCities()
    }
  },
  { immediate: true }  // so that onMounted it fires once with []
)

// 7) Initialize the map & kick off the first “all cities” load
onMounted(async () => {
  mapRef.value = new google.maps.Map(
    document.getElementById('simpleMapNewUser'),
    {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }
  )

  // first populate all cities
  await loadAllCities()
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
