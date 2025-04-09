<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// 1) A custom renderer that draws a red circle with white text for cluster icons
const RedClusterRenderer = {
  /**
   * Called once per cluster. Returns a google.maps.Marker (or an AdvancedMarkerElement)
   * which we'll style as a red circle.
   * @param {object} cluster - includes { count, position, markers } etc.
   * @param {object} stats - info about all clusters (not essential here)
   */
  render({ count, position }, stats) {
    return new google.maps.Marker({
      position,
      label: {
        text: String(count),
        color: '#ffffff',
        fontWeight: 'bold'
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF0000',   // red fill
        fillOpacity: 1,
        strokeColor: '#FFFFFF', // white outline
        strokeWeight: 2,
        scale: 18               // size of the circle
      }
    })
  }
}

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)
    let markerCluster = null
    const markers = []

    /**
     * Simple geocoder function to convert "Alabama, USA" into lat/lng
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

      // 1) Query the aggregated view. 
      //    Each row is { state: "Alabama", user_count: 500 } for example.
      const { data, error } = await supabase
        .from('potential_users_state_counts') 
        .select('*')

      if (error) {
        console.error('[initMap] Error fetching aggregated states:', error)
        return
      }
      console.log(`[initMap] Retrieved ${data.length} aggregated rows (one per state).`)

      // 2) For each state, geocode => create a default marker (no custom icon)
      for (const row of data) {
        if (!row.state || !row.user_count) {
          continue
        }
        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // Use the default Google pin; no icon or label (besides a tooltip).
        const marker = new google.maps.Marker({
          position,
          title: `${row.state} - ${row.user_count} users`
          // no icon property => default icon
        })
        markers.push(marker)
        console.log(`[initMap] Created marker for ${row.state} with count = ${row.user_count}`)
      }

      // 3) Create a MarkerClusterer with our red cluster renderer
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers,
        renderer: RedClusterRenderer
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
