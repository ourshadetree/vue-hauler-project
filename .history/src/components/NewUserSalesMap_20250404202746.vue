<template>
  <div id="userMap"></div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

// Optional custom icon for each marker
import customIcon from '@/assets/potentialUserIcon.svg'

// This is your final array with states and user counts
const stateCounts = [
  { "state": "California", "count": 36099 },
  { "state": "Texas", "count": 30470 },
  { "state": "Illinois", "count": 16836 },
  /* ... etc ... */
  { "state": "Wyoming", "count": 549 },
  { "state": "Vermont", "count": 503 },
  { "state": "DC", "count": 51 }
]

export default {
  name: 'StateCountMap',
  setup() {
    const map = ref(null)
    let markerCluster = null

    // We'll store our google.maps.Marker objects in this array
    const markers = []

    onMounted(async () => {
      // 1) Create the map
      const mapDiv = document.getElementById('userMap')
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      })

      // 2) Geocode each state to get lat/lng, create a marker with user count
      const geocoder = new google.maps.Geocoder()

      async function geocodeAddress(address) {
        return new Promise((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0].geometry.location)
            } else {
              console.warn(`[StateCountMap] Geocode error for ${address}: ${status}`)
              resolve(null)
            }
          })
        })
      }

      for (const item of stateCounts) {
        // e.g. "California, USA" 
        const address = `${item.state}, USA`
        const position = await geocodeAddress(address)
        if (!position) {
          continue
        }
        // Use item.count as the label
        const labelText = String(item.count)
        const marker = new google.maps.Marker({
          position,
          title: `${item.state} - Users: ${item.count}`,
          label: {
            text: labelText,
            color: '#ffffff',   // label text color
            fontWeight: 'bold'
          },
          icon: {
            url: customIcon,
            scaledSize: new google.maps.Size(40, 40)
          }
        })
        markers.push(marker)
      }

      // 3) Cluster them using MarkerClusterer
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers
      })
      console.log(`[StateCountMap] Created cluster with ${markers.length} markers.`)
    })

    return {}
  }
}
</script>

<style scoped>
#userMap {
  width: 100%;
  height: 500px;
  border-radius: 10px;
}
</style>
