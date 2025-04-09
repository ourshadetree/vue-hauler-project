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

function parseLatLng(station) {
  const lat = parseFloat(station.latitude)
  const lng = parseFloat(station.longitude)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  return { lat, lng }
}

export default {
  name: 'SimpleLocationMap',
  setup() {
    // Vue refs
    const map = ref(null)
    const activeTab = ref('allStations')

    // All data is fetched once and stored here
    let allStationsData = []
    let haulersAllianceData = []

    // This is the “currently displayed” array. We'll switch this based on the tab.
    const displayData = ref([])

    // We track marker objects so we can clear them
    const markers = ref([])

    // Table sets
    const allStationsTables = [
      '7_fleet_fuel_data',
      'circle_k_fuel_data',
      'kwik_fuel_data',
      'maverick_fuel_data',
      'sheetz_fuel_data',
      'ta_fuel_data'
      // omit 'casey_fuel_data' as previously discussed
    ]
    const haulersAllianceTables = [
      'sheetz_fuel_data',
      'maverick_fuel_data',
      'circle_k_fuel_data'
    ]

    // Icon mapping
    const tableMarkerIconUrls = {
      '7_fleet_fuel_data': '/../assets/7_11.png',
      'circle_k_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'kwik_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      'maverick_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      'sheetz_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'ta_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    }

    // --------------------------------------------------------------------------
    // 1) Fetch All Data Once & Store in allStationsData / haulersAllianceData
    // --------------------------------------------------------------------------
    const fetchAllDataOnce = async () => {
      console.log('[fetchAllDataOnce] Fetching ALL data at startup...')

      // Fetch "all stations" data
      const allPromises = allStationsTables.map((table) =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Error from ${table}:`, error)
              return []
            }
            console.log(`[fetchAllDataOnce] ${table} => ${data.length} rows`)
            return data.map(row => ({ ...row, table }))
          })
      )
      const allResults = await Promise.all(allPromises)
      allStationsData = allResults.flat()
      console.log('[fetchAllDataOnce] allStationsData size =>', allStationsData.length)

      // Fetch "haulers alliance" data
      const alliancePromises = haulersAllianceTables.map((table) =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Error from alliance ${table}:`, error)
              return []
            }
            console.log(`[fetchAllDataOnce] alliance ${table} => ${data.length} rows`)
            return data.map(row => ({ ...row, table }))
          })
      )
      const allianceResults = await Promise.all(alliancePromises)
      haulersAllianceData = allianceResults.flat()
      console.log('[fetchAllDataOnce] haulersAllianceData size =>', haulersAllianceData.length)
    }

    // --------------------------------------------------------------------------
    // 2) Clear Markers & Render from displayData
    // --------------------------------------------------------------------------
    const clearMarkers = () => {
      markers.value.forEach(m => m.setMap(null))
      markers.value = []
    }

    const renderMarkers = () => {
      if (!map.value) return

      // Clear any existing markers first
      clearMarkers()

      const bounds = map.value.getBounds()
      if (!bounds) {
        // If no map bounds yet, we skip bounding logic
        console.log('[renderMarkers] no map bounds yet; showing entire displayData')
      }

      let north, south, east, west
      if (bounds) {
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        north = ne.lat()
        south = sw.lat()
        east  = ne.lng()
        west  = sw.lng()
      }

      let count = 0
      displayData.value.forEach((station) => {
        const coords = parseLatLng(station)
        if (!coords) return

        // If we do bounding logic, skip if outside the viewport
        if (bounds) {
          if (coords.lat < south || coords.lat > north ||
              coords.lng < west  || coords.lng > east) {
            return // outside visible region
          }
        }

        const iconUrl = tableMarkerIconUrls[station.table]
          || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        const marker = new google.maps.Marker({
          position: coords,
          map: map.value,
          title: station.table,
          icon: iconUrl
        })
        markers.value.push(marker)
        count++
      })
      console.log(`[renderMarkers] Displayed ${count} markers (of ${displayData.value.length} total in displayData)`)
    }

    // --------------------------------------------------------------------------
    // 3) Tab Toggle => Switch displayData to the appropriate array
    // --------------------------------------------------------------------------
    const setActiveTab = (tab) => {
      activeTab.value = tab
      console.log('[setActiveTab]', tab)

      // Clear & repopulate displayData
      displayData.value = []
      if (tab === 'allStations') {
        displayData.value = allStationsData
      } else {
        displayData.value = haulersAllianceData
      }
      // Now re-render markers from the new displayData
      renderMarkers()
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

      // Re-render markers on 'idle' event so we only see markers in the visible region
      map.value.addListener('idle', () => {
        console.log('[Map Event] idle => re-render markers from displayData')
        renderMarkers()
      })

      // Immediately render markers (in case map bounds are available quickly)
      renderMarkers()
    }

    // --------------------------------------------------------------------------
    // 5) onMounted => Fetch data once, init map, set default tab array
    // --------------------------------------------------------------------------
    onMounted(async () => {
      console.log('[onMounted] Begin single-fetch...')
      await fetchAllDataOnce()

      // By default, we load "allStations" into displayData
      displayData.value = allStationsData

      // Initialize the map
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

    return { map, activeTab, setActiveTab }
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
