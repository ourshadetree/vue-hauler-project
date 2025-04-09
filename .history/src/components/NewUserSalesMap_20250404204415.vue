<template>
  <div id="simpleMapNewUser"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'

export default {
  name: 'NewUserSalesMap',
  setup() {
    const map = ref(null)

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

    async function initMap() {
      console.log('[initMap] Initializing map...')

      // 1) Create the map
      const mapDiv = document.getElementById('simpleMapNewUser')
      if (!mapDiv) {
        console.error('[initMap] #simpleMapNewUser not found.')
        return
      }
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
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
            fontSize: '10px'
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

    onMounted(() => {
      // Wait for google.maps to be ready, then init
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
