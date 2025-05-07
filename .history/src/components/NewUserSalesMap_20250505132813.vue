<template>
  <div v-if="isReady" class="mapContainer">
    <GMapMap
      :center="defaultCenter"
      :zoom="defaultZoom"
      style="width:100%; height:100%;"
    >
      <GMapMarker
        v-for="(m, i) in markers"
        :key="i"
        :position="{ lat: m.lat, lng: m.lng }"
      />
    </GMapMap>
  </div>
  <div v-else class="mapContainer loading">
    Loading map…
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLoadScript } from '@fawmi/vue-google-maps'
import { supabase } from '@/supabaseClient'

// map defaults
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 3.5

// markers state
const markers = ref([])

// wait for the Google Maps script to load
const { isReady } = useLoadScript()

onMounted(async () => {
  await isReady.value

  const { data, error } = await supabase
    .from('current_members')
    .select('lat, lng')

  if (error) {
    console.error('Error loading member markers:', error)
    return
  }

  markers.value = data.filter(r => r.lat != null && r.lng != null)
})
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: 400px; /* or 100% if its parent has a set height */
  border-radius: 10px;
  border: 1px solid #ddd;
  overflow: hidden;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
