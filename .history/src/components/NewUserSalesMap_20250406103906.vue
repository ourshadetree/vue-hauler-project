<template>
  <div class="mapContainer">
    <!-- The map container only, no nav bars or search results here -->
    <div id="simpleMapNewUser"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/../supabaseClient'

// We assume you have huIcon.png in assets
import huIcon from '@/assets/huIcon.png'
import huDOTIcon from '@/assets/huDOTIcon.svg'

const store = useStore()

const map = ref(null)
const currentMarkers = ref([])

// Default map center & zoom
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 3.5

// Keep track of commands from the store
const mapCommand = computed(() => store.state.mapCommand)
const dotSearchQuery = computed(() => store.state.dotSearchQuery)

// Clears all markers from the map
function clearMarkers() {
  console.log('[clearMarkers] removing', currentMarkers.value.length, 'markers')
  currentMarkers.value.forEach(marker => marker.setMap(null))
  currentMarkers.value = []
}

// Geocode an address string => Promise<LatLng>
function geocodeAddress(address) {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].geometry.location)
      } else {
        console.warn(`[NewUserSalesMap] Geocode error for ${address}: ${status}`)
        resolve(null)
      }
    })
  })
}

// Load base markers from current_members
async function loadMemberMarkers() {
  console.log('[loadMemberMarkers] Loading current member markers...')
  const { data, error } = await supabase
    .from('current_members')
    .select('address, business_name, state')
  if (error) {
    console.error('[loadMemberMarkers] Error:', error)
    return
  }
  console.log(`[loadMemberMarkers] Found ${data.length} rows in current_members.`)
  for (const row of data) {
    if (!row.address) continue
    const pos = await geocodeAddress(row.address)
    if (!pos) continue
    const title = row.business_name ? `${row.business_name} (${row.state})` : row.address
    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title,
      icon: {
        url: huIcon,
        scaledSize: new google.maps.Size(20, 20)
      }
    })
    
  }
}

// Perform a DOT search => query potential_users => place blue markers
async function loadDotSearchMarkers(dotNumber) {
  console.log(`[loadDotSearchMarkers] Searching for DOT ${dotNumber}...`)
  const { data, error } = await supabase
    .from('potential_users')
    .select('business_name, city, state')
    .eq('dot_number', dotNumber)
  if (error) {
    console.error('[loadDotSearchMarkers] Error:', error)
    return
  }
  // Store the results for the nav tools to display
  store.commit('SET_DOT_SEARCH_RESULTS', data)
  console.log(`[loadDotSearchMarkers] Found ${data.length} results for DOT ${dotNumber}`, data)

  const bounds = new google.maps.LatLngBounds()
  let anyMarker = false
  for (const row of data) {
    if (!row.city || !row.state) continue
    const address = `${row.city}, ${row.state}, USA`
    const pos = await geocodeAddress(address)
    if (!pos) continue
    // Create a blue marker
    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title: `${row.business_name} (${row.state})`,
      icon: {
        url: huDOTIcon,
        scaledSize: new google.maps.Size(20, 20)
      }
    })
    console.log(currentMarkers.value.length, 'markers before adding DOT marker')
    console.log(currentMarkers.value)
    currentMarkers.value.push(marker)
    console.log(
  '[loadDotSearchMarkers] After adding DOT marker, currentMarkers =',
  currentMarkers.value.length,
  currentMarkers.value
)
    bounds.extend(pos)
    anyMarker = true
  }
  if (anyMarker) {
    map.value.fitBounds(bounds)
  }
}

// Called when user wants to refresh the map
async function refreshMap() {
  console.log('[refreshMap] Refreshing base markers...')
  if (!map.value) return
  clearMarkers()
  map.value.setCenter(defaultCenter)
  map.value.setZoom(defaultZoom)
  // Clear DOT search results
  store.commit('CLEAR_DOT_SEARCH_RESULTS')
  // Reload the base markers
  await loadMemberMarkers()
}

// Create the map on mount
async function initMap() {
  console.log('[initMap] Creating map...')
  const mapDiv = document.getElementById('simpleMapNewUser')
  if (!mapDiv) {
    console.error('[initMap] #simpleMapNewUser not found.')
    return
  }
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#757575" }]
      },
      {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }]
      },
      {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#bdbdbd" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#181818" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#2c2c2c" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8a8a8a" }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#373737" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#3c3c3c" }]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#4e4e4e" }]
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }]
      },
      {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3d3d3d" }]
      }
    ]
  })
  console.log('[initMap] Map created. Loading base markers...')
  await loadMemberMarkers()
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

// Watch for "refresh" commands
watch(mapCommand, async (newCmd) => {
  if (newCmd === 'refresh') {
    await refreshMap()
    store.commit('CLEAR_MAP_COMMAND')
  }
})

// Watch for "dotSearch" commands (i.e. a new dotSearchQuery)
watch(dotSearchQuery, async (query) => {
  if (query) {
    // Clear markers
    clearMarkers()
    await loadDotSearchMarkers(query)
    // Once done, clear the command so we don't re-run
    store.commit('CLEAR_MAP_COMMAND')
    store.commit('CLEAR_DOT_SEARCH_QUERY')
  }
})
</script>

<style scoped>
.mapContainer {
  width: 100%;
  position: relative;
}

#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>
