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
// Import the custom member icon asset
import huIcon from '@/assets/huIcon.png'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    const currentMarkers = ref([])       // Track all markers on the map
    const dotSearchResults = ref([])     // Results from DOT search

    // Default map center and zoom
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Clear all markers from the map
    function clearMarkers() {
      currentMarkers.value.forEach(marker => {
        marker.setMap(null)
      })
      currentMarkers.value = []
    }

    // Geocode an address string (e.g. "123 Main St, City, State, USA")
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

    // Load member markers from the current_members table using the 'address' column
    async function loadMemberMarkers() {
      console.log('[loadMemberMarkers] Loading current member markers...')
      // Query current_members; adjust select if you need additional columns (e.g. company_name, state)
      const { data, error } = await supabase
        .from('current_members')
        .select('address, company_name, state')
      if (error) {
        console.error('[loadMemberMarkers] Error fetching current members:', error)
        return
      }
      console.log(`[loadMemberMarkers] Retrieved ${data.length} rows from current_members.`)

      for (const row of data) {
        if (!row.address) continue
        const position = await geocodeAddress(row.address)
        if (!position) continue

        // Create a marker using the huIcon asset
        const marker = new google.maps.Marker({
          position,
          map: map.value,
          title: row.company_name ? `${row.company_name} (${row.state})` : row.address,
          icon: {
            url: huIcon,
            scaledSize: new google.maps.Size(40, 40)
          }
        })
        currentMarkers.value.push(marker)
        console.log(`[loadMemberMarkers] Added marker for ${row.company_name || row.address}`)
      }
    }

    // Refresh the map:
    // - Clear existing markers
    // - Reset the map center and zoom
    // - Load the member markers from current_members
    async function refreshMap() {
      console.log('[refreshMap] Refreshing map...')
      if (!map.value) return
      clearMarkers()
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      dotSearchResults.value = []
      await loadMemberMarkers()
    }

    // DOT search: Query potential_users by dot_number,
    // clear the member markers, and display blue markers for the search results.
    async function dotSearch() {
      if (!map.value) return

      // Clear existing markers and DOT search results
      clearMarkers()
      dotSearchResults.value = []

      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      // Query potential_users for rows matching the DOT number
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

      // Create blue markers for each search result
      const bounds = new google.maps.LatLngBounds()
      let anyValidMarker = false

      for (const row of data) {
        if (!row.city || !row.state) continue
        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        // Create a blue marker labeled with the company name
        const marker = new google.maps.Marker({
          position,
          title: `${row.company_name} (${row.state})`,
          label: {
            text: row.company_name,
            color: '#FFFFFF',
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
          },
          map: map.value
        })
        currentMarkers.value.push(marker)
        bounds.extend(position)
        anyValidMarker = true
      }

      // If at least one marker, adjust the map to show them
      if (anyValidMarker) {
        map.value.fitBounds(bounds)
      }
    }

    async function initMap() {
      console.log('[initMap] Initializing map...')
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }
      map.value = new google.maps.Map(mapDiv, {
        center: defaultCenter,
        zoom: defaultZoom
      })
      console.log('[initMap] Map created. Loading member markers...')
      await loadMemberMarkers()
    }

    onMounted(() => {
      console.log('[onMounted] Checking for google.maps...')
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
