<template>
  <div class="mapContainer">
    <!-- Map container where Google Maps will render -->
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { supabase } from '@/supabaseClient'

export default {
  name: 'NewUserSalesMap',
  computed: {
    // Vuex state for DOT search results
    ...mapState(['dotSearchActionResults'])
  },
  data() {
    return {
      map: null,
      cityMarkers: [],
      circle: null,
      defaultCenter: { lat: 39.8283, lng: -98.5795 },
      defaultZoom: 4
    }
  },
  methods: {
    clearOverlays() {
      // Remove all markers and circle
      this.cityMarkers.forEach(m => m.setMap(null))
      this.cityMarkers = []
      if (this.circle) {
        this.circle.setMap(null)
        this.circle = null
      }
    },
    async initMap() {
      // Reset overlays then initialize a fresh map instance
      this.clearOverlays()
      this.map = new google.maps.Map(
        document.getElementById('simpleMapNewUser'),
        {
          center: this.defaultCenter,
          zoom: this.defaultZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }
      )
    },
    async loadAllCities() {
  await this.initMap()

  // 1️⃣ Fetch all rows (no distinct)
  const { data, error } = await supabase
    .from('potential_users')
    .select('city, state, lat, lng')

  if (error) {
    console.error('Error loading cities:', error)
    return
  }

  // 2️⃣ Dedupe city/state combos in JS
  const seen = new Set()
  data.forEach(({ city, state, lat, lng }) => {
    if (!city || !state || lat == null || lng == null) return

    const key = `${city}|${state}`
    if (seen.has(key)) return
    seen.add(key)

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: `${city}, ${state}`,
    })
    this.cityMarkers.push(marker)
  })
}

    async showDotCircle(address, title) {
      await this.initMap()
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status !== 'OK' || !results[0]) return
        const loc = results[0].geometry.location
        this.map.setCenter(loc)
        this.map.setZoom(8)
        new google.maps.Marker({ position: loc, map: this.map, title })
        this.circle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.2,
          map: this.map,
          center: loc,
          radius: 80467, // ~50 miles
        })
      })
    }
  },
  watch: {
    dotSearchActionResults(newResults) {
      if (!newResults || newResults.length === 0) {
        // No DOT result or user clicked Remove → show all cities
        this.loadAllCities()
      } else if (newResults.length === 1) {
        // Single DOT search hit → show that circle
        const { city, state, business_name } = newResults[0]
        this.showDotCircle(`${city}, ${state}`, business_name)
      } else {
        // Multiple results fallback → all cities
        this.loadAllCities()
      }
    }
  },
  async mounted() {
    // Wait for plugin‐injected script to load
    await this.$gmapApiPromiseLazy()
    // Initial map load
    this.loadAllCities()
  }
}
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 400px;
}
.mapCanvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
}
</style>

<style scoped>
.mapContainer {
  width: 100%;
  height: 400px;
}
.mapCanvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
}
</style>