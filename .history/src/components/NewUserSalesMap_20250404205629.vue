<template>
  <div class="mapContainer">
    <!-- The full-width map -->
    <div id="simpleMapNewUser"></div>

    <!-- The tools nav, styled like your previous example -->
    <div id="mapTools" class="tools-nav">
      <div class="tools-links">
        <button class="tab-link" @click="refreshMap">Refresh Map</button>
        <button class="tab-link" @click="dotSearch">Search DOT Number</button>
      </div>
    </div>

    <!-- Display DOT search results (if any) -->
    <div id="dotSearchResults" v-if="dotSearchResults && dotSearchResults.length > 0">
      <h4>DOT Search Results:</h4>
      <ul>
        <li v-for="(item, index) in dotSearchResults" :key="index">
          {{ item.company_name }} ({{ item.state }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    const dotSearchResults = ref([])

    // Default center & zoom for map
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Simple geocoder for "Alabama, USA" -> lat/lng
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

    // Initialize the map, and place one red circle marker per state
    async function initMap() {
      console.log('[initMap] Initializing map...')

      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }

      // Create the map with default center & zoom
      map.value = new google.maps.Map(mapDiv, {
        center: defaultCenter,
        zoom: defaultZoom
      })
      console.log('[initMap] Map created.')

      // Query the aggregated view potential_users_state_counts
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')
      if (error) {
        console.error('[initMap] Error fetching aggregated states:', error)
        return
      }
      console.log(`[initMap] Retrieved ${data.length} rows.`)

      // For each state => geocode => place a custom red circle marker
      for (const row of data) {
        if (!row.state || !row.user_count) {
          continue
        }

        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        const labelText = String(row.user_count)

        new google.maps.Marker({
          position,
          map: map.value,
          title: `${row.state} - ${row.user_count} users`,
          label: {
            text: labelText,
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '11px'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#FF0000',   // red fill
            fillOpacity: 1,
            strokeColor: '#FFFFFF', // white outline
            strokeWeight: 2,
            scale: 20               // size of the circle
          }
        })
        console.log(`[initMap] Added marker for ${row.state} with user_count = ${row.user_count}`)
      }
    }

    // Re-center & re-zoom the map to defaults
    function refreshMap() {
      if (!map.value) return
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      console.log('[refreshMap] Map reset to defaults.')
    }

    // Search the 'potential_users' table by dot_number and display results
    async function dotSearch() {
      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return

      const { data, error } = await supabase
        .from('potential_users')
        .select('company_name, state')
        .eq('dot_number', dotNumber)

      if (error) {
        console.error('[dotSearch] Error searching DOT:', error)
        return
      }

      dotSearchResults.value = data
      console.log(`[dotSearch] Found ${data.length} results for DOT ${dotNumber}`, data)
    }

    // On mount, wait for google.maps, then init
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
  width: 100%; /* Keep map full width */
  position: relative;
}

#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}

/* Style the toolbar like your previous .tools-nav */
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

/* We can reuse .tools-links for the button container */
.tools-links {
  display: flex;
  gap: 20px;
}

/* Style your buttons similarly to .tab-link */
.tools-links .tab-link {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  background: none;          /* remove default button background */
  border: none;             /* remove default button border */
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.tools-links .tab-link:hover {
  background-color: #b11818;
}

#dotSearchResults {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>
