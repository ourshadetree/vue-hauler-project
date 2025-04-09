<template>
  <div class="mapContainer">
    <!-- Full-width map -->
    <div id="simpleMapNewUser"></div>

    <!-- Tools nav bar, styled like your .tools-nav -->
    <div id="mapTools" class="tools-nav">
      <div class="tools-links">
        <button class="tab-link" @click="refreshMap">Refresh Map</button>
        <button class="tab-link" @click="dotSearch">Search DOT Number</button>

        <!-- DOT search results appear here, styled as another "tab-link" item -->
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

// Helper function to create a custom red bubble icon
// labeled with a given 'labelText'
function createRedBubbleMarker(position, labelText, title) {
  return new google.maps.Marker({
    position,
    title,
    label: {
      text: labelText,
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '11px'
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#FF0000', // red fill
      fillOpacity: 1,
      strokeColor: '#FFFFFF', // white outline
      strokeWeight: 2,
      scale: 20              // size of the circle
    }
  })
}

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    const currentMarkers = ref([])       // Array of markers currently on the map
    const dotSearchResults = ref([])     // Data from searching DOT

    // Default map center/zoom
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Clears all markers from the map
    function clearMarkers() {
      currentMarkers.value.forEach(m => m.setMap(null))
      currentMarkers.value = []
    }

    // Geocode utility for "City, State, USA" => lat/lng
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

    // Loads the aggregated state markers (one marker per state) onto the map
    async function loadStateMarkers() {
      console.log('[loadStateMarkers] Loading aggregated state markers...')
      // 1) Fetch from potential_users_state_counts
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')
      if (error) {
        console.error('[loadStateMarkers] Error fetching aggregated states:', error)
        return
      }
      console.log(`[loadStateMarkers] Retrieved ${data.length} rows (one per state).`)

      // 2) For each row => geocode => create a bubble marker
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

    // Refresh map: Clears existing markers, re-zooms, and reloads the aggregated states
    async function refreshMap() {
      console.log('[refreshMap] Resetting map & markers to default states...')
      if (!map.value) return
      // Clear any existing markers
      clearMarkers()
      // Re-center & zoom
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      // Reload the aggregated state markers
      await loadStateMarkers()
      // Clear DOT search results from the UI
      dotSearchResults.value = []
      currentMarkers.value = []
    }

    // Called once to initialize map & load initial state markers
    async function initMap() {
      console.log('[initMap] Initializing map...')
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }

      // Create the map
      map.value = new google.maps.Map(mapDiv, {
        center: defaultCenter,
        zoom: defaultZoom
      })

      console.log('[initMap] Map created. Now loading state markers...')
      await loadStateMarkers()
    }

    // dotSearch: Clears markers, prompts for DOT, queries potential_users,
    // geocodes (city, state) for each result, displays those markers + results next to the button
    async function dotSearch() {
      if (!map.value) return

      // Clear old markers & search results
      clearMarkers()
      dotSearchResults.value = []

      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      // Query potential_users for rows matching dot_number
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

      // For each result => geocode city, state => create marker
      for (const row of data) {
        // We skip if city/state is missing
        if (!row.city || !row.state) continue

        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        // We'll label the bubble with the company's name
        // or we could do row.dot_number if you prefer
        const marker = createRedBubbleMarker(
          position,
          row.company_name,                   // label text
          `${row.company_name} (${row.state})`// marker title
        )
        marker.setMap(map.value)
        currentMarkers.value.push(marker)
      }

      // Optionally zoom/center to results if you'd like,
      // or keep the existing viewpoint.
      // e.g. if only 1 result => center on it:
      if (data.length === 1) {
        const singlePos = currentMarkers.value[0].getPosition()
        map.value.setCenter(singlePos)
        map.value.setZoom(7)
      }
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
      map,
      dotSearchResults,
      refreshMap,
      dotSearch
    }
  }
}
</script>

<style scoped>
.mapContainer {
  width: 100%; /* Keep the map full width */
  position: relative;
}

#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}

/* Tools nav bar, styled like your .tools-nav */
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

/* A container for the buttons and the results */
.tools-links {
  display: flex;
  gap: 20px;
}

/* Style the buttons to match the tab-link style */
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

/* Button hover style */
.tab-link:hover {
  background-color: #b11818;
}

/* Our DOT search results area also gets the .tab-link style,
   so it appears like a box next to the buttons. */
.tab-link.results-text {
  background-color: whitesmoke;  /* Slightly different or you can keep #0c2442 if you like */
  padding: 10px;
  color: black;
}

.tab-link.results-text ul {
  margin: 0;
  padding-left: 1rem;
  list-style: disc;
}
</style>
