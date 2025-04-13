<template>
    <div v-if="visible" class="station-list-container">
      <div class="station-list-header">
        <h3>Nearby Stations</h3>
        <button @click="toggleCollapse" class="collapse-button">
          {{ collapsed ? 'Expand' : 'Collapse' }}
        </button>
      </div>
      <div v-show="!collapsed" class="station-list-content">
        <ul>
          <li v-for="station in sortedStations" :key="station.id">
            <strong>{{ station.brand_name || station.station_name }}</strong> 
            – {{ station.distance }} miles
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
  // Expect two props: an array of filtered stations and a reference location
  const props = defineProps({
    filteredStations: {
      type: Array,
      default: () => []
    },
    referenceLocation: {
      type: Object, // Must have at least { lat, lng }
      default: () => ({ lat: 0, lng: 0 })
    }
  })
  
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
        // compute distance in meters, then convert to miles
        const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(refLatLng, stationLatLng)
        const distanceMiles = distanceMeters / 1609.34
        return { ...st, distance: distanceMiles.toFixed(1) }
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
  })
  
  // Only show the component if there is at least one station
  const visible = computed(() => props.filteredStations.length > 0)
  </script>
  
  <style scoped>
  .station-list-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
  .station-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
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
  </style>
  