<template>
  <!-- Initial sales-pitch modal on first load -->
  <Modal v-if="showInitialModal" @close="closeInitialModal">
    <div class="sales-pitch">
      <h2>Welcome to Hauler!</h2>
      <p>
        Start by searching for your DOT number to load your details and access
        exclusive discounts and our automated load-matching service.
      </p>
      <button @click="closeInitialModal">Get Started</button>
    </div>
  </Modal>

  <!-- Map container renders behind the modal or after it's closed -->
  <div class="mapContainer">
    <div id="simpleMapNewUser" class="mapCanvas"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { supabase } from '@/supabaseClient'
import Modal from '@/components/Modal.vue'

export default {
  name: 'NewUserSalesMap',
  components: { Modal },

  computed: {
    // Vuex state array from ActionCall component
    ...mapState(['dotSearchActionResults'])
  },

  data() {
    return {
      map: null,
      circle: null,
      defaultCenter: { lat: 39.8283, lng: -98.5795 },
      defaultZoom: 4,
      showInitialModal: true,
    }
  },

  methods: {
    // Remove any existing circle overlay
    clearOverlays() {
      if (this.circle) {
        this.circle.setMap(null)
        this.circle = null
      }
    },

    // Close the intro modal and initialize the map
    async closeInitialModal() {
      this.showInitialModal = false
      await this.initMap()
    },

    // Initialize or re-create a clean Google Map instance
    async initMap() {
      // Wait for the plugin to load the Maps JS API
      await this.$gmapApiPromiseLazy()
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

    // Show a single DOT search result with a 50-mile radius circle
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
          radius: 80467, // ~50 miles in meters
        })
      })
    }
  },

  watch: {
    // React to DOT search results: only act once modal is closed
    dotSearchActionResults(newResults) {
      if (this.showInitialModal) return
      this.clearOverlays()
      if (newResults && newResults.length === 1) {
        const { city, state, business_name } = newResults[0]
        this.showDotCircle(`${city}, ${state}`, business_name)
      }
    }
  },

  mounted() {
    // Do not auto-load markers; map will init after modal closes
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
.sales-pitch {
  padding: 20px;
  text-align: center;
}
.sales-pitch h2 {
  margin-bottom: 10px;
  color: #0C2442;
}
.sales-pitch p {
  margin-bottom: 20px;
  color: #333;
}
.sales-pitch button {
  padding: 10px 20px;
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.sales-pitch button:hover {
  background-color: #a00;
}
</style>