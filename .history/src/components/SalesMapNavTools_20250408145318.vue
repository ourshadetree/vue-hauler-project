<template>
  <div id="mapTools" class="tools-nav">
    <div class="tools-links">
      <button class="tab-link" @click="onRefreshMap">Refresh Map</button>
      <!-- DOT Search input and button -->
      <div class="dot-search-container">
        <input 
          type="number" 
          v-model="dotNumber" 
          class="dot-input" 
          placeholder="Enter your DOT number" 
        />
        <button class="tab-link" @click="onDotSearch">Search</button>
      </div>
    </div>
    
    <!-- Dialog overlay appears when there are DOT search results -->
    <div v-if="dotSearchResults && dotSearchResults.length" class="dialog-overlay">
      <div class="dialog-box">
        <h2>DOT Search Result</h2>
        <!-- Display single result or list of results -->
        <div v-if="dotSearchResults.length === 1">
          <p>{{ dotSearchResults[0].business_name }} ({{ dotSearchResults[0].state }})</p>
          <button class="join-button" @click="onJoinNow(dotSearchResults[0])">Join Now</button>
        </div>
        <div v-else>
          <ul>
            <li v-for="(item, idx) in dotSearchResults" :key="idx">
              {{ item.business_name }} ({{ item.state }})
              <button class="join-button" @click="onJoinNow(item)">Join Now</button>
            </li>
          </ul>
        </div>
        <button class="close-dialog" @click="closeDialog">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
// Local reactive state for the DOT number input
const dotNumber = ref('')

// Listen to the store for search results
const dotSearchResults = computed(() => store.state.dotSearchResults)

// Dispatch "refreshMap" action
function onRefreshMap() {
  store.dispatch('refreshMap')
}

// Dispatch the DOT search action using the value from the input
function onDotSearch() {
  if (!dotNumber.value) return
  store.dispatch('dotSearch', dotNumber.value)
}

// Implement the "Join Now" behavior, e.g. navigate or show another modal
function onJoinNow(item) {
  console.log('Join now clicked for:', item)
  alert(`Join now for ${item.business_name}!`)
}

// Close the dialog by clearing search results and resetting the input
function closeDialog() {
  store.commit('CLEAR_DOT_SEARCH_RESULTS')
  dotNumber.value = ''
}
</script>

<style scoped>
.tools-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c2442;
  border-radius: 8px;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.tools-links {
  display: flex;
  gap: 20px;
}

/* Styling for the DOT search container */
.dot-search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot-input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tab-link {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.tab-link:hover {
  background-color: #b11818;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-box {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  min-width: 320px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.join-button {
  margin-top: 10px;
  font-size: 1rem;
  padding: 8px 12px;
  border: none;
  background-color: #b11818;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.join-button:hover {
  background-color: #a00;
}

.close-dialog {
  margin-top: 20px;
  font-size: 1rem;
  padding: 8px 12px;
  border: none;
  background-color: #ccc;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
}
</style>
