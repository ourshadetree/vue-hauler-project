<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
// Import the official MarkerClusterer from npm
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// Optional: custom marker icon
import customIcon from '@/assets/potentialUserIcon.svg'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    let markerCluster = null // Will hold our cluster instance
    const markers = []       // We'll store google.maps.Marker objects here

    /**
     * Initialize the map, fetch + group data by state, create a single marker per state,
     * then pass them to MarkerClusterer.
     */
    const initMap = async () => {
      console.log('[initMap] Initializing map...')

      // 1) Create the map
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] Map div not found.')
        return
      }
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      })
      console.log('[initMap] Map initialized successfully.')

      // 2) Fetch all potential_users (selecting only state)
      //    If your table is huge, you can limit or chunk the query as needed.
      const { data, error } = await supabase
        .from('potential_users')
        .select('state')
        .order('random()')
        .range(0, 10000)
      if (error) {
        console.error('[initMap] Error fetching user data:', error)
        return
      }
      console.log(`[initMap] Fetched ${data.length} total rows from potential_users.`)

      // 3) Count how many users per state
      //    Example: { "alabama": 5000, "arizona": 200, ... }
      const stateCountMap = new Map()
      data.forEach(row => {
        if (!row.state) return
        const st = row.state.trim().toLowerCase()
        if (!stateCountMap.has(st)) {
          stateCountMap.set(st, 1)
        } else {
          stateCountMap.set(st, stateCountMap.get(st) + 1)
        }
      })
      console.log('[initMap] Distinct states found:', stateCountMap.size)

      // 4) Geocode each state to get lat/lng
      const geocoder = new google.maps.Geocoder()

      async function geocodeAddress(address) {
        return new Promise((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0].geometry.location)
            } else {
              console.warn(`[initMap] Geocode error for ${address}: ${status}`)
              resolve(null)
            }
          })
        })
      }

      // 5) For each state, create a single marker with a label of user count
      for (const [stateKey, count] of stateCountMap.entries()) {
        const address = `${stateKey}, USA` // e.g. "alabama, USA"
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // We'll use the user count as a label on the marker
        const labelText = String(count)
        const marker = new google.maps.Marker({
          position,
          title: `${stateKey.toUpperCase()} - Users: ${count}`,
          label: {
            text: labelText,
            color: '#ffffff',
            fontWeight: 'bold'
          },
          icon: {
            url: customIcon, 
            scaledSize: new google.maps.Size(40, 40)
          }
        })
        markers.push(marker)
        console.log(`[initMap] Marker for state "${stateKey}" at ${position}, userCount = ${count}`)
      }

      // 6) Use MarkerClusterer to cluster these ~45 state markers
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers
        // You can pass additional clusterer options if needed
      })
      console.log('[initMap] Marker cluster created with', markers.length, 'markers.')
    }

    onMounted(() => {
      console.log('[onMounted] Checking for window.google...')
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

    return { map }
  }
}
</script>

<style scoped>
#simpleMapNewUser {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>
