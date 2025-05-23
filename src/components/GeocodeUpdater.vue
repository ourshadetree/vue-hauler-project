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
      <!-- Additional inputs for batch processing -->
      <div class="batch-options">
        <label>
          Start at record (offset):
          <input type="number" v-model.number="offset" placeholder="Enter starting record" />
        </label>
        <label>
          Process batch size:
          <input type="number" v-model.number="batchSize" placeholder="Enter batch size" />
        </label>
      </div>
      <button type="submit">Update Geocodes</button>
    </form>

    <!-- Status message -->
    <div v-if="statusMessage" class="status-message">
      <p>{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'

// Define reactive properties
const tableName = ref('')
const addressField = ref('')
const latField = ref('')
const lngField = ref('')
const statusMessage = ref('')
const offset = ref(0)
const batchSize = ref(1000)

// New reactive properties for progress
const totalRows = ref(0)
const progress = ref(0)

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateGeocodes() {
  if (!tableName.value || !addressField.value || !latField.value || !lngField.value) {
    statusMessage.value = 'Please fill in all fields.';
    return;
  }
  
  statusMessage.value = 'Fetching records...';
  
  // Query the specified table with offset and batch size
  const { data, error } = await supabase
    .from(tableName.value)
    .select(`${addressField.value}, ${latField.value}, ${lngField.value}`)
    .range(offset.value, offset.value + batchSize.value - 1);
  
  if (error) {
    statusMessage.value = `Error fetching records: ${error.message}`;
    return;
  }
  
  console.log(`Fetched ${data.length} records from ${tableName.value}`);
  
  // Set the total rows (could be less than batchSize)
  totalRows.value = data.length;
  progress.value = 0;
  
  // Loop through each row and update geocode if missing
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Update the progress count
    progress.value = i + 1;
    
    // Option: update statusMessage (optional)
    statusMessage.value = `Processing row ${progress.value} of ${totalRows.value}...`;
    
    // Check for missing latitude or longitude (explicitly check for null)
    if (row[latField.value] == null || row[lngField.value] == null) {
      const address = row[addressField.value];
      if (!address) continue;
      
      // Delay between requests (e.g., 1500ms = 1.5 seconds)
      await delay(1500);
      
      const geocode = await getGeocode(address);
      if (geocode) {
        const { error: updateError } = await supabase
          .from(tableName.value)
          .update({ [latField.value]: geocode.lat, [lngField.value]: geocode.lng })
          .match({ [addressField.value]: address });
        
        if (updateError) {
          console.error(`Error updating record for address ${address}:`, updateError);
        }
      } else {
        console.error(`Geocode failed for address: ${address}`);
      }
    }
  }
  
  statusMessage.value = 'Geocoding update complete.';
}

// Function to call the Google Geocoding API
async function getGeocode(address) {
  const apiKey = 'AIzaSyDYpNJXRFRuQq5IV8LQZi8E90r1gIaiORI';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) { 
    console.error("Failed to fetch geocode info");
    return null;
  }
  const data = await response.json();
  if (data.status !== "OK" || !data.results || data.results.length === 0) {
    console.error(`Geocode error for ${address}`);
    return null;
  }
  return data.results[0].geometry.location; 
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

/* Use flex layout for each form row */
.geocode-update form > div {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.geocode-update form > div label {
  width: 150px;
  font-weight: bold;
  font-size: 1rem;
}

.geocode-update form > div input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Ensure batch options use the same layout */
.geocode-update .batch-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.geocode-update .batch-options label {
  width: auto; /* Let them expand */
}

/* Button styles */
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

/* Style for progress display */
.progress-display {
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
}
</style>
