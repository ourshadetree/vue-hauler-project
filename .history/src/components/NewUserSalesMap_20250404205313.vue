<template>
  <div class="mapContainer">
    <!-- The map element -->
    <div id="simpleMapNewUser"></div>

    <!-- Toolbar with refresh & DOT number search -->
    <div id="mapTools">
      <button @click="refreshMap">Refresh Map</button>
      <button @click="dotSearch">Search DOT Number</button>
    </div>

    <!-- Display DOT search results -->
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
    
    // Store the search results for DOT
    const dotSearchResults = ref([])

    // Default center & zoom for the map
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    /**
     * Geocode something like "Alabama, USA" -> lat/lng
     */
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

    // Initializes the map and places the red circle markers for each state
    async function initMap() {
      console.log('[initMap] Initializing map...')

      // 1) Create the map
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

      // 2) Fetch data from your aggregated view 
      //    e.g. each row => { state: "Alabama", user_count: 500 }
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')
      if (error) {
        console.error('[initMap] Error fetching aggregated states:', error)
        return
      }
      console.log(`[initMap] Retrieved ${data.length} rows.`)

      // 3) For each state => geocode => create a custom red bubble marker
      for (const row of data) {
        if (!row.state || !row.user_count) {
          continue
        }
        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // Use a red circle path with a white label for the user_count
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

    // Re-center the map to defaults
    function refreshMap() {
      if (!map.value) return
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      console.log('[refreshMap] Map reset to defaults.')
    }

    // Search the potential_users table by DOT number
    async function dotSearch() {
      const dotNumber = prompt('Enter DOT number:')
      if (!dotNumber) return // user canceled or blank

      // Query the 'potential_users' table for matching dot_number
      const { data, error } = await supabase
        .from('potential_users')
        .select('company_name, state')
        .eq('dot_number', dotNumber) // filter rows where dot_number == dotNumber

      if (error) {
        console.error('[dotSearch] Error searching DOT:', error)
        return
      }

      dotSearchResults.value = data
      console.log(`[dotSearch] Found ${data.length} results for DOT ${dotNumber}`, data)
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

    return { map, dotSearchResults, refreshMap, dotSearch }
  }
}
</script>

<style scoped>
.mapContainer {
  position: relative;
}

#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}

#mapTools {
  margin-top: 10px;
}

#dotSearchResults {
  margin-top: 20px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>
