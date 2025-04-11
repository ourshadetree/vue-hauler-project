<template>
  <div id="container99">
    <div id="left">
      <!-- Header and descriptive text -->
      <div id="words99">
        <h1>We are the 99%</h1>
        <h5>
          As of March 2024, there were over 577,000 active US motor carriers registered with FMCSA.
          Out of those carriers, 99.6% operate 100 or fewer trucks.
        </h5>
        <h5>
          We are building the foundation for small and medium-sized carriers to prosper. By coming together, we can rival the largest fleets.
        </h5>
      </div>

      <!-- Goals Section -->
      <div id="smallGoalContainer">
        <div id="goalsHeader">
          <h2>United We Drive: Our Goals</h2>
        </div>
        <div id="threeGoalBoxes">
          <div class="goalBoxContainer"
               v-for="goal in goals"
               :key="goal.id"
               @click="selectGoal(goal)"
               :class="{ active: activeGoal && activeGoal.id === goal.id }">
            <h3>{{ goal.name }}</h3>
            <div class="goalBox">
              <h2>{{ progressPercentageFor(goal) }}%</h2>
            </div>
            <p>{{ goal.partner }}</p>
          </div>
        </div>
        <div id="threeGoalBars">
          <div class="goalBar" 
               v-for="goal in goals" 
               :key="goal.id"
               :data-label="goal.name"
               :data-value="goal.target + ' trucks'">
          </div>
          <button id="joinButton" @click="openModal('SignUpForm')">Join The Movement</button>
        </div>
      </div>

      <div id="finalWords99">
        <p>Join the movement to access discounts and opt-in to our automated load-matching service.</p>
      </div>
    </div>

    <div id="right">
      <NewUserSalesMap />
      <SalesMapNavTools />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import NewUserSalesMap from './NewUserSalesMap.vue'
import SalesMapNavTools from './SalesMapNavTools.vue'
import Modal from "@/components/Modal.vue"
import SignUpForm from "@/components/SignUpForm.vue"

// --- GOALS DATA ---
const currentTrucks = 1180; // example current number of trucks
const goals = ref([
  { id: 1, name: "Goal 1", partner: "Werner & J.B Hunt", target: 8000 },
  { id: 2, name: "Goal 2", partner: "Schneider", target: 10000 },
  { id: 3, name: "Goal 3", partner: "Knight-Swift", target: 20000 }
]);
const activeGoal = ref(null);

function selectGoal(goal) {
  activeGoal.value = goal;
}

function progressPercentageFor(goal) {
  // Calculate percentage as (current trucks / goal target) * 100
  return ((currentTrucks / goal.target) * 100).toFixed(0);
}

// --- MAP AND STATION VARIABLES, CONTROLS, ETC. ---
// (The map code remains essentially as you already have it.)
const map = ref(null)
const markers = ref([])
const stations = ref([]) // array for station data from Supabase
// Attach station data directly to markers for filtering.
const filteredStations = ref([])

let infoWindow = null;
let directionsService = null;
let directionsRenderer = null;

const defaultCenter = { lat: 39.8283, lng: -98.5795 }
const defaultZoom = 5

const lookupAddress = ref('')
const fromAddress = ref('')
const toAddress = ref('')

const lookupInput = ref(null)
const fromInput = ref(null)
const toInput = ref(null)

const toolsExpanded = ref(false)
const currentMapType = ref('roadmap')

// Modal state for the sign-up form
const activeModal = ref("")
function openModal(componentName) {
  activeModal.value = componentName;
}

// --- FUNCTIONS FOR MAP INITIALIZATION, MARKER CREATION, FILTERING, ETC. ---
// (These are the same functions you had in your previous component, with the following adjustment: When creating markers, we attach the station data to each marker.)

async function fetchAllStations() {
  const all = [];
  const batchSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('a_to_b_stations')
      .select('id, lat, lng, brand_name, station_name, address, city, state')
      .range(offset, offset + batchSize - 1);
    if (error) {
      console.error('Error fetching batch:', error);
      break;
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    offset += data.length;
    if (data.length < batchSize) break;
  }
  return all;
}

async function loadStations() {
  stations.value = await fetchAllStations();
}

function createMarkers() {
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
  stations.value.forEach(station => {
    if (!station.lat || !station.lng) return;
    const position = { lat: station.lat, lng: station.lng };
    const bn = (station.brand_name || '').trim().toLowerCase();
    let iconUrl;
    if (bn === 'ta petro') iconUrl = taIcon;
    else if (bn === 'speedway') iconUrl = speedwayIcon;
    else if (bn === 'sheetz') iconUrl = sheetzIcon;
    else if (bn === 'maverick') iconUrl = maverickIcon;
    else iconUrl = huIcon;
    const marker = new google.maps.Marker({
      position,
      map: map.value,
      title: station.brand_name || station.station_name || `Station ${station.id}`,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(15, 15)
      }
    });
    // Attach station data directly so filtering doesn’t rely on array index
    marker.stationData = station;
    marker.addListener('click', () => {
      const content = `
        <div style="max-width:250px;font-family:Arial,sans-serif">
          <h3 style="margin:0 0 5px 0;">${station.brand_name || station.station_name || `Station ${station.id}`}</h3>
          <p style="margin:0;line-height:1.4">
            ${station.address || 'No address provided'}<br>
            ${station.city || ''}${station.city && station.state ? ', ' : ''}${station.state || ''}
          </p>
        </div>
      `;
      infoWindow.setContent(content);
      infoWindow.open(map.value, marker);
    });
    markers.value.push(marker);
  });
}

function clearMarkers() {
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
}

// For single address filtering.
function filterStationsNear(location) {
  const center = new google.maps.LatLng(location.lat, location.lng);
  const tolerance = 40233; // for example, 25 miles in meters (adjust as needed)
  markers.value.forEach(marker => {
    const station = marker.stationData;
    if (!station?.lat || !station?.lng) return;
    const pt = new google.maps.LatLng(station.lat, station.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(center, pt);
    marker.setMap(distance <= tolerance ? map.value : null);
  });
}

// For route filtering using a bounding box approach.
function filterStationsByBoundingBox(pathArray) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  pathArray.forEach(pt => {
    const lat = pt.lat();
    const lng = pt.lng();
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });
  // Adjust margin (here we use 5% of the range)
  const latMargin = (maxLat - minLat) * 0.05;
  const lngMargin = (maxLng - minLng) * 0.05;
  minLat -= latMargin;
  maxLat += latMargin;
  minLng -= lngMargin;
  maxLng += lngMargin;
  markers.value.forEach(marker => {
    const station = marker.stationData;
    if (!station?.lat || !station?.lng) return;
    const lat = station.lat;
    const lng = station.lng;
    const inBox = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    marker.setMap(inBox ? map.value : null);
  });
}

// Initialize the map and attach autocomplete.
async function initMap() {
  const mapDiv = document.getElementById('stationMap');
  if (!mapDiv) {
    console.error('Error: #stationMap not found.');
    return;
  }
  map.value = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoom,
    disableDefaultUI: true,
    mapTypeId: currentMapType.value
  });
  infoWindow = new google.maps.InfoWindow();
  map.value.addListener('click', () => infoWindow.close());
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  directionsRenderer.setMap(map.value);

  await loadStations();
  createMarkers();

  await nextTick();
  if (toolsExpanded.value && lookupInput.value) {
    initAutocomplete(lookupInput.value, lookupAddress);
  }
  if (toolsExpanded.value && fromInput.value) {
    const fromAuto = new google.maps.places.Autocomplete(fromInput.value, { types: ['geocode'] });
    fromAuto.addListener('place_changed', () => {
      const place = fromAuto.getPlace();
      if (place && place.formatted_address) {
        fromAddress.value = place.formatted_address;
      }
    });
  }
  if (toolsExpanded.value && toInput.value) {
    const toAuto = new google.maps.places.Autocomplete(toInput.value, { types: ['geocode'] });
    toAuto.addListener('place_changed', () => {
      const place = toAuto.getPlace();
      if (place && place.formatted_address) {
        toAddress.value = place.formatted_address;
      }
    });
  }
}

// Generic autocomplete initializer.
function initAutocomplete(inputElement, modelRef) {
  const autocomplete = new google.maps.places.Autocomplete(inputElement, { types: ['geocode'] });
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      map.value.setCenter(location);
      map.value.setZoom(10);
      modelRef.value = place.formatted_address || '';
    }
  });
}

// Handle single address lookup: recenter and filter stations near the address.
async function handleLookup() {
  if (!lookupAddress.value) return;
  const location = await geocodeAddress(lookupAddress.value);
  if (location) {
    map.value.setCenter(location);
    map.value.setZoom(10);
    filterStationsNear(location);
  } else {
    alert('Address not found.');
  }
}

// Geocode an address.
async function geocodeAddress(address) {
  const apiKey = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your actual API key.
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch geocode info');
      return null;
    }
    const data = await response.json();
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error(`Geocode error for ${address}`);
      return null;
    }
    return data.results[0].geometry.location;
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    return null;
  }
}

// Calculate a driving route between two addresses and filter stations along the route by bounding box.
async function calculateRoute() {
  if (!fromAddress.value || !toAddress.value) {
    alert('Please enter both a starting and ending address.');
    return;
  }
  const origin = await geocodeAddress(fromAddress.value);
  const destination = await geocodeAddress(toAddress.value);
  if (!origin || !destination) {
    alert('Unable to geocode one or both addresses.');
    return;
  }
  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
      // Get the overview polyline.
      const polylineObj = result.routes[0].overview_polyline;
      if (!polylineObj) {
        console.error("No overview polyline found in the route result.");
        return;
      }
      const encoded = typeof polylineObj === 'string' ? polylineObj : polylineObj.points;
      if (!encoded) {
        console.error("No encoded polyline found in the route result.");
        return;
      }
      const fullPath = google.maps.geometry.encoding.decodePath(encoded);
      filterStationsByBoundingBox(fullPath);
    } else {
      console.error('Error calculating route:', status);
      alert(`Unable to calculate route: ${status}`);
    }
  });
}

// Clear route input fields and reset markers.
function clearRouteInputs() {
  fromAddress.value = '';
  toAddress.value = '';
  lookupAddress.value = '';
  clearDirections();
  markers.value.forEach(m => m.setMap(map.value));
}

// Clear any displayed route.
function clearDirections() {
  if (directionsRenderer) {
    directionsRenderer.set('directions', null);
  }
}

// Refresh the map: recenter, reload station data/markers, and clear routes.
async function refreshMapData() {
  map.value.setCenter(defaultCenter);
  map.value.setZoom(defaultZoom);
  await loadStations();
  createMarkers();
  clearDirections();
  infoWindow.close();
  lookupAddress.value = '';
  fromAddress.value = '';
  toAddress.value = '';
  markers.value.forEach(m => m.setMap(map.value));
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
/* Container: same as before */
#container99 {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background-color: #FFFFFF;
}

/* Left section (text and goals): 50% width */
#left {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 10px;
}

/* Right section (map and nav tools): 50% width */
#right {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
}

/* Styling from your provided small goal component: */
#smallGoalContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #FFFFFF;
  padding: 40px;
  margin-top: 50px;
  border-radius: 10px;
  font-family: 'Karla', sans-serif;
  color: #0C2442;
  position: relative;
}

#goalsHeader {
  position: absolute;
  top: -60px;
  left: 20px;
}

#goalsHeader h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #0C2442;
}

#threeGoalBoxes {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.goalBoxContainer {
  background-color: #F5F5F5;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  margin: 0 10px;
  text-align: center;
  transition: transform 0.3s;
  cursor: pointer;
}
.goalBoxContainer:hover {
  transform: translateY(-5px);
}

#threeGoalBoxes h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-family: 'Sora', sans-serif;
}

.goalBox {
  border: 2px solid #0C2442;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
}
.goalBox h2 {
  margin: 0;
  font-size: 2rem;
  color: #0C2442;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
}

#threeGoalBars {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  position: relative;
}
.goalBar {
  width: 80%;
  height: 20px;
  background-color: #E5E5E5;
  margin: 15px 0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.goalBar::before {
  content: attr(data-label);
  position: absolute;
  left: -150px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  font-size: 0.9rem;
  color: #0C2442;
}
.goalBar::after {
  content: attr(data-value);
  position: absolute;
  right: -160px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #0C2442;
}
.goalBar {
  background: linear-gradient(to right, #B11818 50%, #E5E5E5 50%);
}
#joinButton {
  background-color: #B11818;
  color: #FFFFFF;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s;
  font-family: 'Sora', sans-serif;
}
#joinButton:hover {
  background-color: #8F1212;
  transform: scale(1.05);
}

#finalWords99 p {
  font-family: 'Karla', sans-serif;
  font-size: 1.1rem;
  color: #0C2442;
  font-weight: 500;
}

/* Map container styling */
.map {
  width: 100%;
  height: 100%;
}

/* Custom map layer control (top-left overlay) */
.map-layer-control {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  border: 1px solid #ccc;
  background: #fff;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  z-index: 999;
}

.layer-button {
  padding: 8px 12px;
  color: #333;
  cursor: pointer;
  border-right: 1px solid #ccc;
  user-select: none;
  display: flex;
  align-items: center;
}

.layer-button:last-child {
  border-right: none;
}

.layer-button:hover {
  background-color: #b11818;
  color: #fff;
}

.layer-button.active {
  background-color: #b11818;
  color: #fff;
}

/* Top toolbar overlay (collapsible tools) */
.map-overlay {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 998;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.controls-wrapper {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  flex: 1;
}

.map-overlay .control-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.map-overlay .control-group input,
.map-overlay .control-group select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;
}

.map-overlay .control-group button {
  padding: 4px 8px;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.map-overlay .control-group button:hover {
  background-color: #a00;
}

/* Collapse/expand button styles */
.collapse-button,
.expand-button {
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 0.8rem;
}

.collapse-button:hover,
.expand-button:hover {
  background-color: #a00;
}

/* Place the expand button at top-right */
.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}
</style>
