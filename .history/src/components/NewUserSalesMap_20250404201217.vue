<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// Optional: Use a custom icon for each marker. 
// We'll apply a label with the user count.
import customIcon from '@/assets/potentialUserIcon.svg'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    let markerCluster = null // For the clusterer instance
    let markers = []         // We'll build an array of google.maps.Marker

    const initMap = async () => {
      console.log('[initMap] Initializing map...')

      // 1) Initialize the Google Map
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

      // 2) Fetch all potential_users in ONE query 
      //    (If your table is huge, you might do .range() or pagination)
      const { data, error } = await supabase
        .from('potential_users')
        .select('state')
      if (error) {
        console.error('[initMap] Error fetching user data:', error)
        return
      }
      console.log(`[initMap] Fetched ${data.length} total rows from potential_users.`)

      // 3) Count how many users per state
      //    Use a Map or object: state -> count
      const stateCountMap = new Map()
      data.forEach((row) => {
        if (!row.state) return
        const stateKey = row.state.trim().toLowerCase()
        // increment the count
        if (!stateCountMap.has(stateKey)) {
          stateCountMap.set(stateKey, 1)
        } else {
          stateCountMap.set(stateKey, stateCountMap.get(stateKey) + 1)
        }
      })
      console.log('[initMap] Distinct states found:', stateCountMap.size)

      // 4) For each state, geocode "StateKey, USA" to get lat/lng
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

      // We'll build markers as we go
      markers = []

      for (const [stateKey, count] of stateCountMap.entries()) {
        const address = `${stateKey}, USA` // e.g., "alabama, USA"
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // We'll show the user count in the marker's label. 
        // You can also do a custom icon with text, 
        // but label is simpler if the icon isn't too large.
        const labelText = String(count) // Convert to string for the label

        const marker = new google.maps.Marker({
          position,
          title: `${stateKey.toUpperCase()} - Users: ${count}`,
          label: {
            text: labelText,
            color: '#ffffff',    // label text color
            fontWeight: 'bold'
          },
          icon: {
            url: customIcon, // or remove icon property if you prefer default
            scaledSize: new google.maps.Size(40, 40)
          }
        })
        markers.push(marker)
        console.log(`[initMap] Marker for state "${stateKey}" at ${position}, userCount = ${count}`)
      }

      // 5) Create a new MarkerClusterer with the markers
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers: markers
        // you can pass additional options if needed 
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
