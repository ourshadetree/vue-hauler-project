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
              {{ item.company_name }} ({{ item.state }})
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

// Red marker for aggregated state data
function createRedBubbleMarker(position, labelText, title) {
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
      fillColor: '#FF0000', // red
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 20
    }
  })
}

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
      fillColor: '#0000FF', // blue
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
    const currentMarkers = ref([])       // Track all markers on the map
    const dotSearchResults = ref([])     // Show these in the toolbar

    // Default map center & zoom
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Clears all markers from the map
    function clearMarkers() {
      currentMarkers.value.forEach(marker => {
        marker.setMap(null)
      })
      currentMarkers.value = []
    }

    // Simple geocoder for e.g. "Alabama, USA" => lat/lng
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

    // Load aggregated states -> place RED markers
    async function loadStateMarkers() {
      console.log('[loadStateMarkers] Loading aggregated state markers...')
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')

      if (error) {
        console.error('[loadStateMarkers] Error fetching aggregated states:', error)
        return
      }

      console.log(`[loadStateMarkers] Retrieved ${data.length} rows.`)
      for (const row of data) {
        if (!row.state || !row.user_count) continue
        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        const labelText = String(row.user_count)
        const marker = createRedBubbleMarker(
          position,
          labelText,
          `${row.state} - ${row.user_count} users`
        )
        marker.setMap(map.value)
        currentMarkers.value.push(marker)
      }
    }

    // Re-center map, reload states, clear search results
    async function refreshMap() {
      console.log('[refreshMap] Resetting map to defaults...')
      if (!map.value) return

      clearMarkers()
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      dotSearchResults.value = []

      await loadStateMarkers()
    }

    // Initialize map, load states
    async function initMap() {
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }

      map.value = new google.maps.Map(mapDiv, {
        center: defaultCenter,
        zoom: defaultZoom
      })
      console.log('[initMap] Map created. Loading state markers...')
      await loadStateMarkers()
    }

    // DOT search => remove existing, place BLUE markers, zoom to them
    async function dotSearch() {
      if (!map.value) return

      // Clear existing markers
      clearMarkers()
      dotSearchResults.value = []

      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      // Query potential_users for matching rows
      const { data, error } = await supabase
        .from('potential_users')
        .select('company_name, city, state')
        .eq('dot_number', dotNumber)

      if (error) {
        console.error('[dotSearch] Error searching DOT:', error)
        return
      }

      dotSearchResults.value = data
      console.log(`[dotSearch] Found ${data.length} results for DOT ${dotNumber}`, data)

      // We'll track the positions in a LatLngBounds
      const bounds = new google.maps.LatLngBounds()
      let anyValidMarker = false

      for (const row of data) {
        if (!row.city || !row.state) continue

        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        // Create a BLUE bubble marker for the DOT search
        const marker = createBlueBubbleMarker(
          position,
          row.company_name,                // label
          `${row.company_name} (${row.state})`
        )
        marker.setMap(map.value)
        currentMarkers.value.push(marker)

        // Extend bounds for each marker
        bounds.extend(position)
        anyValidMarker = true
      }

      // If at least one valid marker was created, fit the map to it
      if (anyValidMarker) {
        // If exactly 1 marker, .fitBounds() will just center on that location 
        // at a zoom that ensures the marker is visible.
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
