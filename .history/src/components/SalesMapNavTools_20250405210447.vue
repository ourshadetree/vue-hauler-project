<template>
    <div id="mapTools" class="tools-nav">
      <div class="tools-links">
        <button class="tab-link" @click="onRefreshMap">Refresh Map</button>
        <button class="tab-link" @click="onDotSearch">Search DOT Number</button>
  
        <!-- Display search results from the store -->
        <div
          v-if="dotSearchResults && dotSearchResults.length > 0"
          class="tab-link results-text"
          id="dotSearchResults"
        >
          <ul>
            <li v-for="(item, idx) in dotSearchResults" :key="idx">
              {{ item.business_name }} ({{ item.state }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  
  // Listen to the store for search results
  const dotSearchResults = computed(() => store.state.dotSearchResults)
  
  // Dispatch "refreshMap" action
  function onRefreshMap() {
    store.dispatch('refreshMap')
  }
  
  // Prompt user for DOT number, dispatch "dotSearch" action
  function onDotSearch() {
    const dotNumber = prompt('Enter DOT number:')
    if (!dotNumber) return
    store.dispatch('dotSearch', dotNumber)
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
  
  .tab-link.results-text {
    background-color: #b11818;
    padding: 10px;
    color: #ffffff;
  }
  
  .tab-link.results-text ul {
    margin: 0;
    padding-left: 1rem;
    list-style: disc;
  }
  </style>
  