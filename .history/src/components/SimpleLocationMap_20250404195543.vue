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

export default {
  name: 'SimpleLocationMap',
  setup() {
    // Map and MarkerCluster references
    const map = ref(null)
    let markerCluster = null

    // Active tab and arrays
    const activeTab = ref('allStations')
    let allStationsData = []
    let haulersAllianceData = []

    // We'll store the raw google.maps.Marker objects for the current view
    let currentMarkers = []

    // Table sets
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

    //------------------------------------------------
    // 1) Single Fetch (All Data & Alliance Data)
    //------------------------------------------------
    const fetchAllDataOnce = async () => {
      console.log('[fetchAllDataOnce] Fetching all stations data...')

      // allStations
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

      // HaulersAlliance
      const alliancePromises = haulersAllianceTables.map(table =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Error from alliance ${table}:`, error)
              return []
            }
            return data.map(row => ({ ...row, table }))
          })
      )
      const allianceResults = await Promise.all(alliancePromises)
      haulersAllianceData = allianceResults.flat()
      console.log('[fetchAllDataOnce] haulersAllianceData size =', haulersAllianceData.length)
    }

    //------------------------------------------------
    // 2) Render Markers with MarkerClusterer
    //------------------------------------------------
    const renderMarkersForTab = (tab) => {
      if (!map.value) return

      // Clear existing cluster and markers
      if (markerCluster) {
        markerCluster.clearMarkers()
      }
      currentMarkers.forEach(m => m.setMap(null))
      currentMarkers = []

      // Decide which array to use
      let dataArray = []
      if (tab === 'allStations') {
        dataArray = allStationsData
      } else {
        dataArray = haulersAllianceData
      }

      // Create google.maps.Marker objects
      dataArray.forEach((station) => {
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

      // Create a new cluster with the markers
      /* global MarkerClusterer */
      markerCluster = new MarkerClusterer(map.value, currentMarkers, {
        imagePath:
          'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      })

      console.log(`[renderMarkersForTab] ${tab}: Created cluster with ${currentMarkers.length} markers.`)
    }

    //------------------------------------------------
    // 3) Tab Toggle => Re-render Markers from Memory
    //------------------------------------------------
    const setActiveTab = (tab) => {
      activeTab.value = tab
      console.log('[setActiveTab]', tab)
      renderMarkersForTab(tab)
    }

    //------------------------------------------------
    // 4) Map Init
    //------------------------------------------------
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

      // Once the map is ready, render initial tab
      renderMarkersForTab(activeTab.value)
    }

    //------------------------------------------------
    // 5) On Mounted => fetch data once, init map
    //------------------------------------------------
    onMounted(async () => {
      console.log('[onMounted] Starting single fetch...')
      await fetchAllDataOnce()

      // Initialize the map after data is loaded
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
