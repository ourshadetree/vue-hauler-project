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

// Helper to create a custom **red** bubble marker (for aggregated states)
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
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 20
    }
  })
}

// Helper to create a **blue** bubble marker (for DOT search)
function createBlueBubbleMarker(position, labelText, title) {
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

    // Array holding the currently displayed markers (both states + DOT)
    const currentMarkers = ref([])

    // For displaying DOT search results
    const dotSearchResults = ref([])

    // Default center & zoom
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Remove all markers from the map and clear currentMarkers
    function clearMarkers() {
      currentMarkers.value.forEach(m => m.setMap(null))
      currentMarkers.value = []
    }

    // Geocode something like "Alabama, USA" or "New York, USA" => lat/lng
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

    // Load the aggregated states from potential_users_state_counts
    // and place RED markers for each
    async function loadStateMarkers() {
      console.log('[loadStateMarkers] Loading aggregated state markers...')
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')
      if (error) {
        console.error('[loadStateMarkers] Error fetching aggregated states:', error)
        return
      }
      console.log(`[loadStateMarkers] Retrieved ${data.length} rows (one per state).`)

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

    // Re-center, re-zoom, clear all markers, re-load the aggregated states,
    // clear any DOT search results
    async function refreshMap() {
      console.log('[refreshMap] Resetting map & markers to default states...')
      if (!map.value) return

      // Clear existing markers
      clearMarkers()
      // Re-center & zoom
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      // Re-load the aggregated states
      await loadStateMarkers()

      // Clear DOT results from the UI
      dotSearchResults.value = []
    }

    // Called once => create the map => load the state markers
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
      console.log('[initMap] Map created.')

      // Load the aggregated states => place red markers
      await loadStateMarkers()
    }

    // dotSearch => prompt for DOT => query potential_users => place BLUE markers
    async function dotSearch() {
      if (!map.value) return

      // Clear existing markers, results
      clearMarkers()
      dotSearchResults.value = []

      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      // 1) Query for matching rows
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

      // 2) For each result => geocode city,state => place a BLUE marker
      for (const row of data) {
        if (!row.city || !row.state) continue
        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue

        // We'll label the bubble with the company's name
        const marker = createBlueBubbleMarker(
          position,
          row.company_name,                   // label text
          `${row.company_name} (${row.state})`// marker title
        )
        marker.setMap(map.value)
        currentMarkers.value.push(marker)
      }

      // Optionally zoom to the result if there's exactly 1 row
      if (data.length === 1 && currentMarkers.value.length === 1) {
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
  width: 100%;
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

/* Style your buttons and the result text like .tab-link */
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

/* Hover style for the buttons and results box */
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
