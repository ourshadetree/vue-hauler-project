<template>
    <div id="mapTools" class="tools-nav">
      <div class="tools-links">
        <button class="tab-link" @click="onRefreshMap">Refresh Map</button>
        <button class="tab-link" @click="onDotSearch">Search DOT Number</button>
        <div
          v-if="dotSearchResults && dotSearchResults.length > 0"
          class="tab-link results-text"
          id="dotSearchResults"
        >
          <ul>
            <li v-for="(item, index) in dotSearchResults" :key="index">
              {{ item.business_name }} ({{ item.state }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
    name: 'SalesMapNavTools',
    setup() {
      const store = useStore()
  
      // Get the current DOT search results from Vuex
      const dotSearchResults = computed(() => store.state.dotSearchResults)
  
      // Dispatch an action to refresh the map
      function onRefreshMap() {
        store.dispatch('refreshMap')
      }
  
      // Prompt for a DOT number and dispatch an action to search
      function onDotSearch() {
        const dotNumber = prompt('Enter DOT number:')
        if (!dotNumber) return
        store.dispatch('dotSearch', dotNumber)
      }
  
      return {
        dotSearchResults,
        onRefreshMap,
        onDotSearch
      }
    }
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
  