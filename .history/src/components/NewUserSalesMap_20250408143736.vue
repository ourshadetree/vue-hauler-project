<template>
  <div class="mapContainer">
    <!-- Map container -->
    <div id="simpleMapNewUser"></div>
    
    <!-- Modal overlay (rendered only when showModal is true) -->
    <div v-if="showModal" class="dialog-overlay">
      <div class="dialog-box">
        <h2>DOT Search Result</h2>
        <!-- Render a list of results if more than one -->
        <div v-if="dotSearchResults.length === 1">
          <p>{{ dotSearchResults[0].business_name }} ({{ dotSearchResults[0].state }})</p>
          <button class="join-button" @click="onJoinNow(dotSearchResults[0])">Join Now</button>
        </div>
        <div v-else>
          <ul>
            <li v-for="(item, idx) in dotSearchResults" :key="idx">
              {{ item.business_name }} ({{ item.state }})
              <button class="join-button" @click="onJoinNow(item)">Join Now</button>
            </li>
          </ul>
        </div>
        <button class="close-dialog" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/../supabaseClient'

// Map and marker state as before
const map = ref(null)
const currentMarkers = ref([])

// Default map center & zoom
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 3.5

// Vuex store
const store = useStore()

// Modal state - initially not shown
const showModal = ref(false)

// Listen to DOT search results from the store
const dotSearchResults = computed(() => store.state.dotSearchResults)

// Watch for DOT search results to display the modal
watch(dotSearchResults, (newVal) => {
  if (newVal && newVal.length > 0) {
    showModal.value = true
  }
})

// Function to close the modal
function closeModal() {
  showModal.value = false
  store.commit('CLEAR_DOT_SEARCH_RESULTS')
}

// Map functions: clearMarkers, loadMemberMarkers, refreshMap, and initMap remain unchanged
function clearMarkers() {
  currentMarkers.value.forEach(marker => marker.setMap(null))
  currentMarkers.value = []
}

async function loadMemberMarkers() {
  const { data, error } = await supabase
    .from('current_members')
    .select('lat, lng, business_name, state')
  if (error) {
    console.error('[loadMemberMarkers] Error:', error)
    return
  }
  data.forEach(row => {
    if (row.lat == null || row.lng == null) return  // Skip if coordinates are missing
    const pos = { lat: row.lat, lng: row.lng }
    const title = row.business_name ? `${row.business_name} (${row.state})` : ''
    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title,
      icon: {
        url: require('@/assets/huIcon.png'),
        scaledSize: new google.maps.Size(20, 20)
      }
    })
    currentMarkers.value.push(marker)
  })
}

async function refreshMap() {
  if (!map.value) return
  clearMarkers()
  map.value.setCenter(defaultCenter)
  map.value.setZoom(defaultZoom)
  store.commit('CLEAR_DOT_SEARCH_RESULTS')
  await loadMemberMarkers()
}

async function initMap() {
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
      // ... Additional style rules ...
    ]
  })
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
