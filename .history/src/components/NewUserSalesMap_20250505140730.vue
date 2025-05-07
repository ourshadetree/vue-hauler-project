<template>
  <div class="mapContainer">
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { supabase } from '@/supabaseClient'

export default {
  name: 'NewUserSalesMap',

  computed: {
    // Vuex state array from ActionCall component
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
    // Remove all existing markers and circle
    clearOverlays() {
      this.cityMarkers.forEach(m => m.setMap(null))
      this.cityMarkers = []
      if (this.circle) {
        this.circle.setMap(null)
        this.circle = null
      }
    },

    // Initialize a fresh map instance, ensuring the Google API is loaded
    async initMap() {
      // Wait for the plugin to inject & load the Google Maps API
      await this.$gmapApiPromiseLazy()
      // Clear old markers/circles
      this.clearOverlays()
      // Create a new map
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

    // Load and display one marker per unique city/state
    async loadAllCities() {
      // (Re)create the map
      await this.initMap()
      // Fetch only city/state pairs
      const { data, error } = await supabase
        .from('potential_users')
        .select('city, state')

      if (error) {
        console.error('Error loading cities:', error)
        return
      }

      // Deduplicate by city|state
      const seen = new Set()
      for (const { city, state } of data) {
        if (!city || !state) continue
        const key = `${city}|${state}`
        if (seen.has(key)) continue
        seen.add(key)

        // Geocode the city/state into lat/lng
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: `${city}, ${state}` }, (results, status) => {
          if (status !== 'OK' || !results[0]) return
          const loc = results[0].geometry.location
          const marker = new google.maps.Marker({
            position: loc,
            map: this.map,
            title: `${city}, ${state}`,
          })
          this.cityMarkers.push(marker)
        })
      }
    },

    // Show a single DOT-result location with a radius circle
    async showDotCircle(address, title) {
      // (Re)create the map
      await this.initMap()
      // Geocode the specific city/state
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status !== 'OK' || !results[0]) return
        const loc = results[0].geometry.location
        // Center & zoom
        this.map.setCenter(loc)
        this.map.setZoom(8)
        // Marker at the location
        new google.maps.Marker({ position: loc, map: this.map, title })
        // Draw a 50‑mile radius (~80,467 m)
        this.circle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.2,
          map: this.map,
          center: loc,
          radius: 80467,
        })
      })
    }
  },

  watch: {
    // React to ActionCall search results to switch views
    dotSearchActionResults(newResults) {
      if (!newResults || newResults.length === 0) {
        this.loadAllCities()
      } else if (newResults.length === 1) {
        const { city, state, business_name } = newResults[0]
        this.showDotCircle(`${city}, ${state}`, business_name)
      } else {
        this.loadAllCities()
      }
    }
  },

  mounted() {
    // Kick off initial load of all cities
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