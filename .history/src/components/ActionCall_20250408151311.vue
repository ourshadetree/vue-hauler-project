<template>
    <div class="action-call">
      <!-- Intro text to encourage truckers -->
      <div class="intro-text">
        <h1>Join the Movement</h1>
        <p>
          Get started by entering your DOT number below. We’ll quickly pull up your details so you can join
          and access exclusive discounts and load-matching services.
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
        />
        <button class="search-button" @click="onDotSearch">Search</button>
      </div>
      
      <!-- Display search results if they exist -->
      <div class="search-results" v-if="dotSearchResults && dotSearchResults.length">
        <h2>We found your record:</h2>
        
        <!-- If exactly one result, show its details -->
        <div class="user-info" v-if="dotSearchResults.length === 1">
          <p><strong>Business:</strong> {{ dotSearchResults[0].business_name }}</p>
          <p><strong>City:</strong> {{ dotSearchResults[0].city }}</p>
          <p><strong>State:</strong> {{ dotSearchResults[0].state }}</p>
          <p><strong>MC Number:</strong> {{ dotSearchResults[0].mc_number }}</p>
          <button class="join-button" @click="openModal(SignUpForm)">Join Now</button>
        </div>
        
        <!-- If multiple results, list them -->
        <div class="multiple-results" v-else>
          <ul>
            <li v-for="(item, idx) in dotSearchResults" :key="idx">
              <p>
                <strong>Business:</strong> {{ item.business_name }}; 
                <strong>City:</strong> {{ item.city }}; 
                <strong>State:</strong> {{ item.state }}; 
                <strong>MC:</strong> {{ item.mc_number }}
              </p>
              <button class="join-button" @click="openModal(SignUpForm)">Join Now</button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Modal: Only shows when activeModal is set -->
      <Modal v-if="activeModal" @close="activeModal = ''">
        <component :is="activeModal" @close="activeModal = ''" />
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import Modal from '@/components/Modal.vue'
  import SignUpForm from '@/components/SignUpForm.vue'
  
  const store = useStore()
  
  // Local state for the DOT number input
  const dotNumber = ref('')
  
  // Retrieve search results from the Vuex store
  const dotSearchResults = computed(() => store.state.dotSearchResults)
  
  // Modal state: if set to a component, that modal is displayed
  const activeModal = ref("")
  
  // Dispatch the DOT search action when search is triggered
  function onDotSearch() {
    if (!dotNumber.value) return
    store.dispatch('dotSearch', dotNumber.value)
  }
  
  // Open the sign up modal by setting activeModal to the SignUpForm component
  function openModal(component) {
    activeModal.value = component
  }
  
  // Optionally, you could add a function to clear results if needed
  function closeDialog() {
    store.commit('CLEAR_DOT_SEARCH_RESULTS')
    dotNumber.value = ''
  }
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
    font-size: 2rem;
    color: #0c2442;
    margin-bottom: 10px;
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
  
  .user-info p {
    margin: 5px 0;
  }
  
  .join-button {
    margin-top: 10px;
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
  </style>
  