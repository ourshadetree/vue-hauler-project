<template>
  <div class="mapContainer">
    <!-- Map container -->
    <div id="simpleMapNewUser"></div>
    
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
