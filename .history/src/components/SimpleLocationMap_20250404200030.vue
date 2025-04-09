<template>
  <div id="simpleMapContainer">
    <div id="simpleMap"></div>
    <div class="tools-nav">
      <div class="tools-links">
        <div
          :class="['tab-link', { active: activeTab === 'allStations' }]"
          @click="setActiveTab('allStations')"
        >
          Show All Stations
        </div>
        <div
          :class="['tab-link', { active: activeTab === 'haulersAlliance' }]"
          @click="setActiveTab('haulersAlliance')"
        >
          Haulers Alliance
        </div>
      </div>
    </div>
    <div id="stationInfo"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { supabase } from '@/../supabaseClient'
import { MarkerClusterer } from '@googlemaps/markerclusterer' 

export default {
  name: 'SimpleLocationMap',
  setup() {
    // Vue refs and variables
    const map = ref(null)
    let markerCluster = null // We'll store the new MarkerClusterer instance here

    // Active tab
    const activeTab = ref('allStations')

    // Arrays holding your data
    let allStationsData = []
    let haulersAllianceData = []

    // We'll store the raw google.maps.Marker objects for the current view
    let currentMarkers = []

    // Tables for each tab
    const allStationsTables = [
      '7_fleet_fuel_data',
      'circle_k_fuel_data',
      'kwik_fuel_data',
      'maverick_fuel_data',
      'sheetz_fuel_data',
      'ta_fuel_data'
    ]
    const haulersAllianceTables = [
      'sheetz_fuel_data',
      'maverick_fuel_data',
      'circle_k_fuel_data'
    ]

    // Table -> Icon mapping
    const tableMarkerIconUrls = {
      '7_fleet_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'circle_k_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'kwik_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      'maverick_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      'sheetz_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'ta_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    }

    // --------------------------------------------------------------------------
    // 1) Single Fetch of All Data for Both Tabs
    // --------------------------------------------------------------------------
    const fetchAllDataOnce = async () => {
      console.log('[fetchAllDataOnce] Fetching "All Stations" data...')
      const allPromises = allStationsTables.map(table =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Error from ${table}:`, error)
              return []
            }
            return data.map(row => ({ ...row, table }))
          })
      )
      const allResults = await Promise.all(allPromises)
      allStationsData = allResults.flat()
      console.log('[fetchAllDataOnce] allStationsData size =', allStationsData.length)

      console.log('[fetchAllDataOnce] Fetching "Haulers Alliance" data...')
      const alliancePromises = haulersAllianceTables.map(table =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Alliance error from ${table}:`, error)
              return []
            }
            return data.map(row => ({ ...row, table }))
          })
      )
      const allianceResults = await Promise.all(alliancePromises)
      haulersAllianceData = allianceResults.flat()
      console.log('[fetchAllDataOnce] haulersAllianceData size =', haulersAllianceData.length)
    }

    // --------------------------------------------------------------------------
    // 2) Render Markers for the Selected Tab, Using MarkerClusterer
    // --------------------------------------------------------------------------
    const renderMarkersForTab = (tab) => {
      if (!map.value) return

      // Clear any existing cluster
      if (markerCluster) {
        markerCluster.clearMarkers()
        markerCluster = null
      }

      // Also remove old markers from the map
      currentMarkers.forEach(m => m.setMap(null))
      currentMarkers = []

      // Pick which data array to use
      let dataArray = (tab === 'allStations')
        ? allStationsData
        : haulersAllianceData

      // Build new google.maps.Marker objects
      dataArray.forEach(station => {
        const lat = parseFloat(station.latitude)
        const lng = parseFloat(station.longitude)
        if (Number.isNaN(lat) || Number.isNaN(lng)) return

        const iconUrl = tableMarkerIconUrls[station.table]
          || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'

        const marker = new google.maps.Marker({
          position: { lat, lng },
          title: station.table,
          icon: iconUrl
        })
        currentMarkers.push(marker)
      })

      // Now create a new cluster with those markers
      markerCluster = new MarkerClusterer({
        map: map.value,
        markers: currentMarkers
        // You could pass additional options here if needed
      })

      console.log(`[renderMarkersForTab] ${tab}: cluster created with ${currentMarkers.length} markers.`)
    }

    // --------------------------------------------------------------------------
    // 3) Handle Tab Toggle
    // --------------------------------------------------------------------------
    const setActiveTab = (tab) => {
      activeTab.value = tab
      console.log('[setActiveTab]', tab)
      // Re-render for whichever tab is now active
      renderMarkersForTab(tab)
    }

    // --------------------------------------------------------------------------
    // 4) Map Initialization
    // --------------------------------------------------------------------------
    const initMap = () => {
      console.log('[initMap] Creating map...')
      const mapDiv = document.getElementById('simpleMap')
      if (!mapDiv) {
        console.error('[initMap] No map div found!')
        return
      }

      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      })

      // Once the map is ready, render the initial tab
      renderMarkersForTab(activeTab.value)
    }

    // --------------------------------------------------------------------------
    // 5) onMounted => fetch data once, then init the map
    // --------------------------------------------------------------------------
    onMounted(async () => {
      console.log('[onMounted] Loading station data once...')
      await fetchAllDataOnce()

      if (window.google && window.google.maps) {
        initMap()
      } else {
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval)
            initMap()
          }
        }, 100)
      }
    })

    return {
      activeTab,
      setActiveTab
    }
  }
}
</script>

<style scoped>
#simpleMapContainer {
  position: relative;
}
#simpleMap {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
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
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.tab-link:hover,
.tab-link.active {
  background-color: #b11818;
}
</style>
