<template>
  <div class="action-call">
    <!-- Intro text encouraging truckers to get started -->
    <div class="intro-text">
      <h1>Join the Movement</h1>
      <p>
        Simply enter your DOT number below, and we'll quickly load your details so you can join and access exclusive discounts and load-matching services.
      </p>
    </div>
    
    <!-- DOT search input and button -->
    <div class="search-section">
      <input 
        type="number"
        v-model="dotNumber" 
        placeholder="Enter your DOT number" 
        @keyup.enter="onDotSearch" 
        class="dot-input"
        ref="dotInputRef"
      />
      <button class="search-button" @click="onDotSearch">Search</button>
    </div>
    
    <!-- Display search results if available -->
    <div class="search-results" v-if="dotSearchActionResults && dotSearchActionResults.length">
      <h2>We found your record:</h2>
      
      <!-- Single result display -->
      <div class="user-info" v-if="dotSearchActionResults.length === 1">
        <p><strong>Business:</strong> {{ dotSearchActionResults[0].business_name }}</p>
        <p><strong>City:</strong> {{ dotSearchActionResults[0].city }}</p>
        <p><strong>State:</strong> {{ dotSearchActionResults[0].state }}</p>
        <div class="action-buttons">
          <button class="join-button" @click="openModal(SignUpForm)">Join Now</button>
          <button id="newSearch" class="new-search-button" @click="doNewSearch">Remove</button>
        </div>
      </div>
      
      <!-- Multiple results display -->
      <div class="multiple-results" v-else>
        <ul>
          <li v-for="(item, idx) in dotSearchActionResults" :key="idx">
            <p>
              <strong>Business:</strong> {{ item.business_name }}; 
              <strong>City:</strong> {{ item.city }}; 
              <strong>State:</strong> {{ item.state }}; 
            </p>
            <div class="action-buttons">
              <button class="join-button" @click="openModal(SignUpForm)">Join Now</button>
            </div>
          </li>
        </ul>
        <!-- New Search button for multiple results -->
        <button id="newSearch" class="new-search-button" @click="doNewSearch">New Search</button>
      </div>
    </div>
    
    <!-- Modal: Only shows when activeModal is set -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import Modal from '@/components/Modal.vue'
import SignUpForm from '@/components/SignUpForm.vue'

const store = useStore()
// Local state for the DOT number input
const dotNumber = ref('')
// Reference to the DOT search input (for focusing later)
const dotInputRef = ref(null)

// Computed property for the results returned by the dotSearchAction
const dotSearchActionResults = computed(() => store.state.dotSearchActionResults)

// Modal state: When activeModal is set to a component, that modal is shown
const activeModal = ref("")

// Dispatch the DOT search action when search is triggered
function onDotSearch() {
  if (!dotNumber.value) return
  store.dispatch('dotSearchAction', dotNumber.value)
}

// Open the sign-up modal by setting activeModal to the SignUpForm component
function openModal(component) {
  activeModal.value = component
}

// New search function: clears the search results and focuses the DOT input
function doNewSearch() {
  store.commit('CLEAR_DOT_SEARCH_ACTION_RESULTS')
  dotNumber.value = ''
  dotInputRef.value.focus()
}

// Watch for a single search result so we can send a command to the map with the address info
watch(dotSearchActionResults, (newResults) => {
  if (newResults && newResults.length === 1) {
    const result = newResults[0]
    // Construct an address string from the city and state
    const address = `${result.city}, ${result.state}`
    const title = result.business_name

    // Commit a command to the store with the command data
    store.commit('SET_MAP_COMMAND', {
      command: 'addGreenMarker',
      data: { address, title }
    })
  }
})
</script>

<style scoped>
.action-call {
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
}

.intro-text {
  margin-bottom: 20px;
}

.intro-text h1 {
  font-size: 3rem;
  color: #0c2442;
  margin-bottom: 10px;
  text-align: center;
}

.intro-text p {
  font-size: 1rem;
  color: #333;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.dot-input {
  padding: 10px;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button {
  padding: 10px 20px;
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
}

.search-button:hover {
  background-color: #a00;
}

.search-results {
  margin-top: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.user-info p, .multiple-results p {
  margin: 5px 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.join-button {
  padding: 10px 20px;
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.join-button:hover {
  background-color: #a00;
}

.new-search-button {
  padding: 10px 20px;
  background-color: #0c2442;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.new-search-button:hover {
  background-color: #333;
}
</style>
