<template>
  <div class="station-map-container">
    <!-- The map container -->
    <div id="stationMap" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/../supabaseClient'

// References to hold the map instance and marker list
const map = ref(null)
const markers = ref([])

// Define a default map center (the center of the US, for example) and zoom level
const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

// Load markers from the 'a_to_b_stations' table using Supabase
async function loadStationMarkers() {
  const { data, error } = await supabase
    .from('a_to_b_stations')
    .select('lat, lng, station_name')

  if (error) {
    console.error('Error loading station markers:', error)
    return;
  }
  
  // Loop through each row to create a marker if the coordinates exist
  data.forEach(row => {
    // Make sure lat and lng are not null
    if (row.lat == null || row.lng == null) return;
    const pos = { lat: row.lat, lng: row.lng }
    
    // Create a marker object using the Google Maps API
    const marker = new google.maps.Marker({
      position: pos,
      map: map.value,
      title: row.station_name || ''
    });
    
    // Optionally, if you want to attach an info window that shows station details:
    // const infoWindow = new google.maps.InfoWindow({
    //   content: `<div><strong>${row.station_name || 'Station'}</strong><br>${pos.lat}, ${pos.lng}</div>`
    // });
    // marker.addListener('click', () => {
    //   infoWindow.open(map.value, marker);
    // });

    markers.value.push(marker);
  });
}

// Initialize the Google Map and load markers
async function initMap() {
  const mapDiv = document.getElementById('stationMap');
  if (!mapDiv) {
    console.error('Error: #stationMap element not found.');
    return;
  }
  
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    // You can set custom map styles here if desired
    styles: [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      // Add additional style rules here as needed
    ]
  });
  
  await loadStationMarkers();
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
  height: 500px; /* Adjust height as needed */
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
</style>
