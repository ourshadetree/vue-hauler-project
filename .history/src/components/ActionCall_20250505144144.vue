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
      <div class="dot-input-wrapper">
        <input 
          type="number"
          v-model="dotNumber" 
          placeholder="Enter your DOT number" 
          @keyup.enter="onDotSearch" 
          @focus="showTooltip = true"
          @blur="showTooltip = false"
          class="dot-input"
          ref="dotInputRef"
        />
        <div v-if="showTooltip" class="input-tooltip">
          Start your DOT search
        </div>
      </div>
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
// Reference to the DOT search input (for focusing)
const dotInputRef = ref(null)
// Tooltip visibility state
const showTooltip = ref(false)

// Computed property for the results returned by the dotSearchAction
const dotSearchActionResults = computed(() => store.state.dotSearchActionResults)

// Computed state for focusing the input via Vuex
const focusDotInput = computed(() => store.state.focusDotInput)

// Watch for focus requests
watch(focusDotInput, shouldFocus => {
  if (shouldFocus) {
    dotInputRef.value?.focus()
    store.commit('CLEAR_FOCUS_DOT_INPUT')
  }
})

// Dispatch the DOT search action when search is triggered
function onDotSearch() {
  if (!dotNumber.value) return
  store.dispatch('dotSearchAction', dotNumber.value)
}

// Open the sign-up modal
function openModal(component) {
  activeModal.value = component
}

// New search function: clears the search results and focuses the DOT input
function doNewSearch() {
  store.commit('CLEAR_DOT_SEARCH_ACTION_RESULTS')
  dotNumber.value = ''
  dotInputRef.value.focus()
}

// Watch for a single search result to send a command to the map
watch(dotSearchActionResults, (newResults) => {
  if (newResults && newResults.length === 1) {
    const result = newResults[0]
    const address = `${result.city}, ${result.state}`
    const title = result.business_name

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

.dot-input-wrapper {
  position: relative;
  flex: 1;
}

.dot-input {
  padding: 10px;
  width: 100%;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.input-tooltip {
  position: absolute;
  top: -1.6rem;
  left: 0;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
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

.user-info p,
.multiple-results p {
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
