<template>
  <div class="mapContainer">
    <!-- Full-width map -->
    <div id="simpleMapNewUser"></div>

    <!-- Tools nav bar -->
    <div id="mapTools" class="tools-nav">
      <div class="tools-links">
        <button class="tab-link" @click="refreshMap">Refresh Map</button>
        <button class="tab-link" @click="dotSearch">Search DOT Number</button>

        <!-- DOT search results displayed here -->
        <div
          v-if="dotSearchResults.length > 0"
          class="tab-link results-text"
          id="dotSearchResults"
        >
          <ul>
            <li v-for="(item, index) in dotSearchResults" :key="index">
              {{ item.business_name }} ({{ item.state }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'

// Blue marker for DOT searches
function createBlueBubbleMarker(position, labelText, title) {
  return new google.maps.Marker({
    position,
    title,
    label: {
      text: labelText,
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '11px'
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#0000FF', // blue fill
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 20
    }
  })
}

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    const currentMarkers = ref([])       // All markers currently on the map
    const dotSearchResults = ref([])     // Local DOT search results

    // Default map center & zoom
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Clears all markers from the map
    function clearMarkers() {
      currentMarkers.value.forEach(marker => marker.setMap(null))
      currentMarkers.value = []
    }

    // Geocode an address string to get lat/lng
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

    // Load current member markers from the current_members table
    async function loadMemberMarkers() {
      console.log('[loadMemberMarkers] Loading current member markers...')
      const { data, error } = await supabase
        .from('current_members')
        .select('address, business_name, state')
      if (error) {
        console.error('[loadMemberMarkers] Error fetching current members:', error)
        return
      }
      console.log(`[loadMemberMarkers] Retrieved ${data.length} rows from current_members.`)
      for (const row of data) {
        if (!row.address) continue
        const position = await geocodeAddress(row.address)
        if (!position) continue
        const title = row.business_name ? `${row.business_name} (${row.state})` : row.address
        // Create a marker using huIcon.png; here we assume it's set up in your assets
        const marker = new google.maps.Marker({
          position,
          map: map.value,
          title,
          icon: {
            url: require('@/assets/huIcon.png'),
            scaledSize: new google.maps.Size(20, 20)
          }
        })
        currentMarkers.value.push(marker)
        console.log(`[loadMemberMarkers] Added marker for ${title}`)
      }
    }

    // Refresh the map: clear markers, reset center/zoom, and reload current member markers.
    async function refreshMap() {
      console.log('[refreshMap] Refreshing map...')
      if (!map.value) return
      clearMarkers()
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      dotSearchResults.value = []
      await loadMemberMarkers()
    }

    // Initialize the map and load the current member markers.
    async function initMap() {
      console.log('[initMap] Initializing map...')
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
      console.log('[initMap] Map created. Loading member markers...')
      await loadMemberMarkers()
    }

    // DOT search: query potential_users by dot_number,
    // clear current markers, then load blue markers based on (city, state)
    async function dotSearch() {
      if (!map.value) return

      clearMarkers()
      dotSearchResults.value = []

      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      const { data, error } = await supabase
        .from('potential_users')
        .select('business_name, city, state')
        .eq('dot_number', dotNumber)
      if (error) {
        console.error('[dotSearch] Error searching DOT:', error)
        return
      }
      dotSearchResults.value = data
      console.log(`[dotSearch] Found ${data.length} results for DOT ${dotNumber}`, data)

      const bounds = new google.maps.LatLngBounds()
      let anyValidMarker = false

      for (const row of data) {
        if (!row.city || !row.state) continue
        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        const marker = createBlueBubbleMarker(
          position,
          row.business_name,
          `${row.business_name} (${row.state})`
        )
        marker.setMap(map.value)
        currentMarkers.value.push(marker)
        bounds.extend(position)
        anyValidMarker = true
      }
      if (anyValidMarker) {
        map.value.fitBounds(bounds)
      }
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

    return {
      dotSearchResults,
      refreshMap,
      dotSearch
    }
  }
}
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

/* Tools nav bar styling */
.tools-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c2442;
  border-radius: 8px;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.tools-links {
  display: flex;
  gap: 20px;
}

.tab-link {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.tab-link:hover {
  background-color: #b11818;
}

.tab-link.results-text {
  background-color: #b11818;
  padding: 10px;
  color: #ffffff;
}

.tab-link.results-text ul {
  margin: 0;
  padding-left: 1rem;
  list-style: disc;
}
</style>
