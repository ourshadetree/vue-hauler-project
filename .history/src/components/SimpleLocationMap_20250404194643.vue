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

// A simple utility to pause execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  name: 'SimpleLocationMap',
  setup() {
    const map = ref(null)
    const activeTab = ref('allStations')
    const markers = ref([])
    const isFetching = ref(false)       // Track if a fetch is in progress
    let idleTimeoutId = null           // For debouncing the 'idle' event

    // Table sets for each tab
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

    // Mapping of table names to default Google marker icon URLs.
    const tableMarkerIconUrls = {
      '7_fleet_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'circle_k_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'kwik_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      'maverick_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      'sheetz_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'ta_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    }

    // Clears all existing markers from the map
    const clearMarkers = () => {
      markers.value.forEach(marker => marker.setMap(null))
      markers.value = []
    }

    /**
     * 1) Debounce the map "idle" event by 500ms
     * 2) Then call fetchStationsInViewport
     */
    const onMapIdle = () => {
      if (idleTimeoutId) clearTimeout(idleTimeoutId)
      idleTimeoutId = setTimeout(() => {
        fetchStationsInViewport()
      }, 500) // Wait 500ms after user finishes zoom/pan
    }

    /**
     * Fetch station data for the active tab from only the visible bounds of the map,
     * with concurrency checks and bounding box constraints.
     */
    const fetchStationsInViewport = async () => {
      if (!map.value) return
      const bounds = map.value.getBounds()
      if (!bounds) return

      // If a fetch is already in progress, skip
      if (isFetching.value) {
        console.log('[fetchStationsInViewport] Skipping; another fetch in progress.')
        return
      }
      isFetching.value = true

      // Clear existing markers
      clearMarkers()

      // Determine the tables for the active tab
      const tables = (activeTab.value === 'allStations')
        ? allStationsTables
        : haulersAllianceTables

      // Get bounding box corners
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()

      console.log('[fetchStationsInViewport] Bounding box => ', {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng()
      })

      // Build queries for each table, applying bounding constraints
      const fetchPromises = tables.map((table) => {
        return supabase
          .from(table)
          .select('latitude,longitude')
          .gte('latitude', sw.lat())
          .lte('latitude', ne.lat())
          .gte('longitude', sw.lng())
          .lte('longitude', ne.lng())
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchStationsInViewport] Error from ${table}:`, error)
              return []
            }
            console.log(`[fetchStationsInViewport] ${table} => ${data.length} rows`)
            return data.map(row => ({ ...row, table }))
          })
      })

      // Wait for all table queries to complete
      const results = await Promise.all(fetchPromises)
      const allData = results.flat()
      console.log('[fetchStationsInViewport] Combined rows =>', allData.length)

      // For each row, create a marker if lat/lng are valid
      let addedCount = 0
      allData.forEach(station => {
        const lat = parseFloat(station.latitude)
        const lng = parseFloat(station.longitude)
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          return // skip invalid
        }
        const iconUrl = tableMarkerIconUrls[station.table]
          || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map.value,
          title: station.table,
          icon: iconUrl
        })
        markers.value.push(marker)
        addedCount++
      })
      console.log('[fetchStationsInViewport] Markers added =>', addedCount)

      isFetching.value = false
    }

    /**
     * Called when user clicks a tab.
     * We change activeTab, then do an immediate fetch for the new tab
     * (the 'idle' event will also eventually fire).
     */
    const setActiveTab = (tab) => {
      activeTab.value = tab
      console.log('[setActiveTab]', tab)
      fetchStationsInViewport()
    }

    /**
     * Initialize the map, attach events, default to activeTab
     */
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

      // Debounced idle event
      map.value.addListener('idle', onMapIdle)

      // Start with the default tab’s stations
      fetchStationsInViewport()
    }

    onMounted(() => {
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
      map,
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
