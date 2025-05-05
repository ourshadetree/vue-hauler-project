<template>
    <div v-if="visible" class="station-list-container">
      <div class="station-list-header">
        <h3>Nearby Stations/</h3>
        <button @click="toggleCollapse" class="collapse-button">
          {{ collapsed ? 'Expand' : 'Collapse' }}
        </button>
      </div>
      <div v-show="!collapsed" class="station-list-content">
        <ul>
          <li
            v-for="station in sortedStations"
            :key="station.id"
            :class="{ active: station.id === props.activeStationId }"
            @click="emit('select', station.id)"
          >
            <strong>{{ station.brand_name || station.station_name }}</strong>
            
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
  // Now also accept which station is “active”
  const props = defineProps({
    filteredStations: Array,
    referenceLocation: Object,
    activeStationId: [String, Number]
  })
  const emit = defineEmits(['select'])
  
  // Collapsed state of the list
  const collapsed = ref(false)
  function toggleCollapse() {
    collapsed.value = !collapsed.value
  }
  
  // Compute sorted stations by distance from the reference location
  const sortedStations = computed(() => {
    if (!props.referenceLocation || !props.filteredStations.length) return []
    return props.filteredStations
      .map(st => {
        const stationLatLng = new google.maps.LatLng(st.lat, st.lng)
        const refLatLng = new google.maps.LatLng(props.referenceLocation.lat, props.referenceLocation.lng)
        // Compute distance in meters, then convert to miles
        const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(refLatLng, stationLatLng)
        const distanceMiles = distanceMeters / 1609.34
        return { ...st, distance: distanceMiles.toFixed(1) }
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
  })
  
  // The component is visible only if there is at least one station
  const visible = computed(() => props.filteredStations.length > 0)
  </script>
  
  <style scoped>
  .station-list-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    max-height: 200px; /* Limit the height; scroll if content overflows */
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 0; /* We handle padding within header and content */
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
  
  /* Make the header sticky so it remains visible on scroll */
  .station-list-header {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;  /* Add padding for spacing */
    border-bottom: 1px solid #ddd;
    z-index: 10;
  }
  
  .station-list-header h3 {
    margin: 0;
    font-family: Sora, sans-serif;
    color: #0c2442;
  }
  
  .collapse-button {
    background-color: #b11818;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-family: Sora, sans-serif;
    font-size: 0.9rem;
  }
  
  .station-list-content {
    padding: 10px;
  }
  
  .station-list-content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .station-list-content li {
    font-family: Karla, sans-serif;
    color: #0c2442;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .station-list-content li:last-child {
    border-bottom: none;
  }

  .station-list-content li.active {
  background-color: #f0f0f0;
  font-weight: bold;
}
  </style>
  