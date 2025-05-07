<!-- src/components/NewUserSalesMap.vue -->
<template>
  <div class="mapContainer">
    <!-- The plugin injects the Maps API for you,
         so as soon as this component mounts, GmapMap
         will render a real map. -->
    <g-map-map
      :center="defaultCenter"
      :zoom="defaultZoom"
      style="width: 100%; height: 400px;"
    >
      <g-map-marker
        v-for="(m, i) in markers"
        :key="i"
        :position="{ lat: m.lat, lng: m.lng }"
      />
    </g-map-map>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'

// 1) Your default center + zoom
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 3.5

// 2) Reactive array of marker positions
const markers = ref([])

// 3) On mount, grab your lat/lng data from Supabase
onMounted(async () => {
  const { data, error } = await supabase
    .from('current_members')
    .select('lat, lng')

  if (error) {
    console.error('Error loading member markers:', error)
    return
  }

  // filter out nulls and assign
  markers.value = data.filter(r => r.lat != null && r.lng != null)
})
</script>

<style scoped>
.mapContainer {
  width: 100%;
  /* If you need it taller, bump this up or make it 100% of a defined parent height */
}
</style>
