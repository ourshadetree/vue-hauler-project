<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
import { MarkerClusterer } from '@googlemaps/markerclusterer'



// 1) Define a custom renderer that produces a red circle with white text for the cluster icon
const RedClusterRenderer = {
  /**
   * Called once per cluster. We return a google.maps.Marker with a custom icon path.
   * @param {object} cluster - includes { count, position, markers } etc.
   * @param {object} stats - optional info about cluster distribution
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

    // We'll store all google.maps.Marker objects for each state
    const markers = []

    // Geocode function for "Alabama, USA" -> lat/lng
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

    // Main init function
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

      // 1) Query the aggregated view (e.g., potential_users_state_counts)
      const { data, error } = await supabase
        .from('potential_users_state_counts') 
        .select('*')
      if (error) {
        console.error('[initMap] Error fetching aggregated states:', error)
        return
      }
      console.log(`[initMap] Retrieved ${data.length} aggregated rows (one per state).`)

      // 2) For each row => geocode the state => build a single marker
      for (const row of data) {
        if (!row.state || !row.user_count) {
          continue
        }
        const address = `${row.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }

        // We'll display the user_count as a label on the marker
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

      // 3) Create a MarkerClusterer that uses our red renderer
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers,
        renderer: RedClusterRenderer // Use our custom red cluster icon
      })
      console.log('[initMap] Marker cluster created with', markers.length, 'markers.')
    }

    // On mount, wait for google.maps, then init the map
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
