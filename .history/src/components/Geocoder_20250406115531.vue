<template>
    <div class="geocode-updater">
      <button @click="updateGeocodes" :disabled="loading">
        {{ loading ? "Updating..." : "Update Geocodes" }}
      </button>
      <p v-if="loading">
        Processing: {{ processedCount }} / {{ totalCount }}
      </p>
      <p v-if="error" class="error">Error: {{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { supabase } from '@/../supabaseClient'
  
  const loading = ref(false)
  const processedCount = ref(0)
  const totalCount = ref(0)
  const error = ref(null)
  
  /**
   * Geocode the given address using the Nominatim API.
   * Returns an object with { lat, lng } or null if no result is found.
   */
  async function geocodeAddress(address) {
    // Nominatim usage policy requires a valid User-Agent header.
    // In the browser, you might be limited; consider using a server-side proxy.
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        return { lat: parseFloat(lat), lng: parseFloat(lon) }
      } else {
        return null
      }
    } catch (err) {
      console.error('Geocoding error for address:', address, err)
      return null
    }
  }
  
  /**
   * Retrieve rows from Supabase with missing geocode data,
   * run each address through the geocoder,
   * and update the table with the coordinates.
   */
  async function updateGeocodes() {
    loading.value = true
    error.value = null
    processedCount.value = 0
  
    // Retrieve rows that need geocoding (assuming lat is null)
    const { data, error: selectError } = await supabase
      .from('current_members')
      .select('id, address')
      .is('lat', null)
  
    if (selectError) {
      error.value = selectError.message
      loading.value = false
      return
    }
  
    totalCount.value = data.length
  
    for (const row of data) {
      if (!row.address) continue
  
      const coords = await geocodeAddress(row.address)
      if (coords) {
        // Update the row in Supabase with the new lat/lng
        const { error: updateError } = await supabase
          .from('current_members')
          .update({ lat: coords.lat, lng: coords.lng })
          .eq('id', row.id)
        if (updateError) {
          console.error('Update error for row id', row.id, updateError)
        }
      } else {
        console.warn('No geocode result for address', row.address)
      }
      processedCount.value++
    }
    loading.value = false
  }
  </script>
  
  <style scoped>
  .geocode-updater {
    margin: 20px;
    padding: 10px;
    border: 1px solid #ccc;
  }
  button {
    padding: 10px 15px;
    font-size: 1rem;
    cursor: pointer;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  