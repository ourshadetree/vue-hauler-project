<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// Optional: a custom icon for each marker
import customIcon from '@/assets/potentialUserIcon.svg'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    let markerCluster = null

    // We'll build an array of google.maps.Marker objects
    const markers = []

    /**
     * Geocode a state name (e.g. "Alabama, USA") to get lat/lng
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

    /**
     * Fetch aggregated data from our new view (potential_users_state_counts),
     * create markers, cluster them.
     */
    async function initMap() {
      console.log('[initMap] Initializing map...')
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }
      // Create the Google Map
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      })
      console.log('[initMap] Map created.')

      // 1) Query the aggregated view
      //    returns rows like: { state: "Alabama", user_count: 500 }
      const { data, error } = await supabase
        .from('potential_users_state_counts')
        .select('*')
      if (error) {
        console.error('[initMap] Error fetching aggregated states:', error)
        return
      }
      console.log(`[initMap] Retrieved ${data.length} aggregated rows (one per state).`)

      // 2) For each row, geocode the state (e.g. "Alabama, USA"), build a single marker
      for (const row of data) {
        if (!row.state || !row.user_count) {
          continue
        }
        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // We'll display the user_count as a label, e.g. "3000"
        const labelText = String(row.user_count)

        const marker = new google.maps.Marker({
          position,
          title: `${row.state} - ${row.user_count} users`,
          label: {
            text: labelText,
            color: '#FFFFFF',
            fontWeight: 'bold'
          },
          icon: {
            url: customIcon,
            scaledSize: new google.maps.Size(40, 40)
          }
        })
        markers.push(marker)
        console.log(`[initMap] Created marker for ${row.state} with count = ${row.user_count}`)
      }

      // 3) Cluster the markers
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers
      })
      console.log('[initMap] Marker cluster created with', markers.length, 'markers.')
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
