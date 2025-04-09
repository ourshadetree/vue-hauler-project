<template>
  <div class="geocode-update">
    <h2>Dynamic Geocode Updater</h2>
    <form @submit.prevent="updateGeocodes">
      <div>
        <label for="tableName">Table Name:</label>
        <input id="tableName" v-model="tableName" placeholder="Enter table name" />
      </div>
      <div>
        <label for="addressField">Address Field:</label>
        <input id="addressField" v-model="addressField" placeholder="Enter address field name" />
      </div>
      <div>
        <label for="latField">Latitude Field:</label>
        <input id="latField" v-model="latField" placeholder="Enter latitude field name" />
      </div>
      <div>
        <label for="lngField">Longitude Field:</label>
        <input id="lngField" v-model="lngField" placeholder="Enter longitude field name" />
      </div>
      <button type="submit">Update Geocodes</button>
    </form>
    
    <div v-if="statusMessage" class="status-message">
      <p>{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/../supabaseClient'

const tableName = ref('')
const addressField = ref('')
const latField = ref('')
const lngField = ref('')
const statusMessage = ref('')

async function updateGeocodes() {
  if (!tableName.value || !addressField.value || !latField.value || !lngField.value) {
    statusMessage.value = 'Please fill in all fields.'
    return
  }
  
  statusMessage.value = 'Fetching records...'
  
  // Query the specified table
  const { data, error } = await supabase
    .from(tableName.value)
    .select(`${addressField.value}, ${latField.value}, ${lngField.value}`)
  
  if (error) {
    statusMessage.value = `Error fetching records: ${error.message}`
    return
  }
  
  // Process each row that needs a geocode update
  for (const row of data) {
    if (!row[latField.value] || !row[lngField.value]) {
      const address = row[addressField.value]
      if (!address) continue
      
      // Call the geocoding API
      const geocode = await getGeocode(address)
      if (geocode) {
        // Update the record with the new coordinates
        const { error: updateError } = await supabase
          .from(tableName.value)
          .update({ [latField.value]: geocode.lat, [lngField.value]: geocode.lng })
          .match({ [addressField.value]: address })
        
        if (updateError) {
          console.error(`Error updating record for address ${address}:`, updateError)
        }
      }
    }
  }
  
  statusMessage.value = 'Geocoding update complete.'
}

async function getGeocode(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    const response = await fetch(url)
    const results = await response.json()
    if (results && results.length > 0) {
      return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
    }
  } catch (err) {
    console.error('Error during geocoding:', err)
  }
  return null
}
</script>

<style scoped>
.geocode-update {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.geocode-update form > div {
  margin-bottom: 15px;
}

.geocode-update label {
  display: inline-block;
  width: 150px;
}

.geocode-update input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 160px);
}

.geocode-update button {
  padding: 10px 20px;
  border: none;
  background-color: #b11818;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.geocode-update button:hover {
  background-color: #a00;
}

.status-message {
  margin-top: 20px;
  font-size: 1rem;
  color: #0c2442;
}
</style>
