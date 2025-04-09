<template>
  <div class="mapContainer">
    <div id="simpleMapNewUser"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { supabase } from '@/../supabaseClient'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const store = useStore()
    const map = ref(null)
    const currentMarkers = ref([]) // Array for all markers currently on the map

    // Default map settings
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }
    const defaultZoom = 3.5

    // Clears all markers from the map and resets the currentMarkers array
    function clearMarkers() {
      currentMarkers.value.forEach(marker => marker.setMap(null))
      currentMarkers.value = []
    }

    // Geocode an address string to get a lat/lng (returns a Promise)
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

    // Load base markers from current_members using the address column
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
        const title = row.business_name
          ? `${row.business_name} (${row.state})`
          : row.address
        // Create a marker using your huIcon.png asset
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
      }
    }

    // Load DOT search markers from potential_users (blue markers)
    async function loadDotSearchMarkers(dotNumber) {
      console.log(`[loadDotSearchMarkers] Searching DOT: ${dotNumber}`)
      // Query potential_users by dot_number; select business_name, city, state
      const { data, error } = await supabase
        .from('potential_users')
        .select('business_name, city, state')
        .eq('dot_number', dotNumber)
      if (error) {
        console.error('[loadDotSearchMarkers] Error searching DOT:', error)
        return
      }
      store.commit('SET_DOT_SEARCH_RESULTS', data)
      console.log(`[loadDotSearchMarkers] Found ${data.length} results for DOT ${dotNumber}`)
      
      // Use LatLngBounds to adjust the map view to the search results
      const bounds = new google.maps.LatLngBounds()
      let anyValidMarker = false

      for (const row of data) {
        if (!row.city || !row.state) continue
        const address = `${row.city}, ${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) continue
        // Create a blue marker labeled with the business name
        const marker = new google.maps.Marker({
          position,
          map: map.value,
          title: `${row.business_name} (${row.state})`,
          label: {
            text: row.business_name,
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
        currentMarkers.value.push(marker)
        bounds.extend(position)
        anyValidMarker = true
      }
      if (anyValidMarker) {
        map.value.fitBounds(bounds)
      }
    }

    // Refresh the map: clear markers, reset center/zoom, reload base markers
    async function refreshMap() {
      console.log('[refreshMap] Refreshing map to default member markers...')
      if (!map.value) return
      clearMarkers()
      map.value.setCenter(defaultCenter)
      map.value.setZoom(defaultZoom)
      store.commit('SET_DOT_SEARCH_RESULTS', [])
      await loadMemberMarkers()
    }

    // Initialize the map and load base markers
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

    // Watch for Vuex commands from the navTools component
    // We'll assume the store has state.mapCommand and state.dotSearchQuery
    const store = useStore()
    const mapCommand = computed(() => store.state.mapCommand)
    const dotSearchQuery = computed(() => store.state.dotSearchQuery)

    // Watch for a "refresh" command
    watch(mapCommand, async (newCommand) => {
      if (newCommand === 'refresh') {
        await refreshMap()
        store.commit('CLEAR_MAP_COMMAND')
      }
    })

    // Watch for a DOT search query
    watch(dotSearchQuery, async (newQuery) => {
      if (newQuery) {
        await loadDotSearchMarkers(newQuery)
        store.commit('CLEAR_MAP_COMMAND')
        store.commit('SET_DOT_SEARCH_QUERY', null)
      }
    })

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

    // Helper: load DOT search markers from a given DOT number
    async function loadDotSearchMarkers(dotNumber) {
      clearMarkers()
      dotSearchResults.value = []

      const { data, error } = await supabase
        .from('potential_users')
        .select('business_name, city, state')
        .eq('dot_number', dotNumber)
      if (error) {
        console.error('[loadDotSearchMarkers] Error searching DOT:', error)
        return
      }
      dotSearchResults.value = data
      console.log(`[loadDotSearchMarkers] Found ${data.length} results for DOT ${dotNumber}`, data)

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
