<template>
  <div class="mapContainer">
    <!-- Map Canvas -->
    <div id="simpleMapNewUser" class="mapCanvas"></div>

    <!-- Modal overlay only over the map -->
    
      <Modal v-if="showInitialModal" teleport="#simpleMapNewUser" @close="closeInitialModal">
        <div class="sales-pitch">
          <h2>Welcome to Hauler!</h2>
          <p>
            Start by searching for your DOT number to load your details, access
            exclusive discounts, and activate our automated load-matching service.
          </p>
          <button @click="closeInitialModal">Get Started</button>
        </div>
      </Modal>
    
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
    // Map will be initialized after closing modal or first search
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
.sales-pitch {
  max-width: 300px;
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