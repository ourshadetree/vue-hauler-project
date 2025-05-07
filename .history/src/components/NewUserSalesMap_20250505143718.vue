<template>
  <div class="mapContainer">
    <!-- Map Canvas -->
    <div id="simpleMapNewUser" class="mapCanvas"></div>

    <!-- Inline overlay—only covers the mapContainer -->
   <div v-if="showInitialModal" class="map-modal-overlay">
     <div class="sales-pitch">
       <h2>Welcome to Hauler!</h2>
       <p>
         Search your DOT number to load your details and unlock exclusive
         discounts plus automated load-matching.
       </p>
       <button @click="closeInitialModal">Get Started</button>
     </div>
   </div>
    
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
    ...mapState(['dotSearchActionResults'])
  },

  data() {
    return {
      map: null,
      circle: null,
      defaultCenter: { lat: 39.8283, lng: -98.5795 },
      defaultZoom: 4,
      showInitialModal: true
    }
  },

  methods: {
    clearOverlays() {
      if (this.circle) {
        this.circle.setMap(null)
        this.circle = null
      }
    },

    async initMap() {
      await this.$gmapApiPromiseLazy()
      this.clearOverlays()
      this.map = new google.maps.Map(
        document.getElementById('simpleMapNewUser'),
        {
          center: this.defaultCenter,
          zoom: this.defaultZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }
      )
    },

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
          radius: 80467
        })
      })
    },

    closeInitialModal() {
      this.showInitialModal = false
      this.initMap()
      this.$store.commit('SET_FOCUS_DOT_INPUT')
    }
  },

  watch: {
    dotSearchActionResults(newResults) {
      if (this.showInitialModal) return
      if (!newResults || newResults.length === 0) {
        this.initMap()
      } else if (newResults.length === 1) {
        const { city, state, business_name } = newResults[0]
        this.showDotCircle(`${city}, ${state}`, business_name)
      } else {
        this.initMap()
      }
    }
  },

  mounted() {
    this.initMap();
  }
}
</script>

<style scoped>
.mapContainer {
  position: relative;
  width: 100%;
  height: 400px;
}
.mapCanvas {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
}
.map-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.sales-pitch {
  max-width: 300px;
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
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