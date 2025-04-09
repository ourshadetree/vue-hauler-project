<template>
  <div class="station-map-container">
    <!-- This div will host the Google Map -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// References for the map and markers.
const map = ref(null)
const markers = ref([])

// We'll use one global info window.
let infoWindow = null

// Default center & zoom (standard Google Maps view).
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 4

// Load station data from the 'a_to_b_stations' table.
async function loadStationData() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('id, lat, lng, brand_name, address, city, state')
  
  if (error) {
    console.error('Error fetching station data:', error)
    return []
  }
  return data
}

// Create markers for the station data and set up a single info window.
async function createMarkers() {
  // Clear existing markers (if any).
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []
  
  const stations = await loadStationData()
  
  stations.forEach(station => {
    if (station.lat == null || station.lng == null) return

    const position = { lat: station.lat, lng: station.lng }
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || 'Station'
    })
    
    // Attach a click handler that updates and opens a shared info window.
    marker.addListener('click', () => {
      // Prepare HTML content for the info window.
      const content = `
        <div style="max-width: 250px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 5px 0;">${station.brand_name || 'Station ' + station.id}</h3>
          <p style="margin: 0; line-height: 1.4;">
            ${station.address ? station.address + '<br>' : ''}
            ${station.city ? station.city + ', ' : ''}${station.state ? station.state : ''}
          </p>
          <p style="margin: 5px 0 0; font-size: 0.85rem; color: #555;">
            Lat: ${station.lat}, Lng: ${station.lng}
          </p>
        </div>
      `;
      
      // Set content and open the info window at the marker.
      infoWindow.setContent(content);
      infoWindow.open(map.value, marker);
    });
    
    markers.value.push(marker)
  });
}

// Initialize the map and the info window, then create markers.
async function initMap() {
  const mapDiv = document.getElementById('stationMap')
  if (!mapDiv) {
    console.error('Error: #stationMap element not found.')
    return
  }
  
  // Initialize the map with standard styling (no dark mode).
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom
  });
  
  // Initialize the global info window.
  infoWindow = new google.maps.InfoWindow();
  
  // Create markers for each station.
  await createMarkers();
}

onMounted(() => {
  if (window.google && window.google.maps) {
    initMap();
  } else {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        initMap();
      }
    }, 100);
  }
});
</script>

<style scoped>
.station-map-container {
  width: 100%;
  height: 600px; /* Adjust as needed */
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 10px; /* Optional */
}
</style>
