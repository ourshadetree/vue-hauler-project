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

// Utility to parse lat/lng safely
function parseLatLng(station) {
  const lat = parseFloat(station.latitude)
  const lng = parseFloat(station.longitude)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  return { lat, lng }
}

export default {
  name: 'SimpleLocationMap',
  setup() {
    // Vue references
    const map = ref(null)
    const activeTab = ref('allStations')
    const markers = ref([])

    // Store all data in memory
    let allStationsData = []        // Contains union of all "all stations" table rows
    let haulersAllianceData = []    // Contains union of alliance station rows

    // Table sets
    const allStationsTables = [
      '7_fleet_fuel_data',
      'circle_k_fuel_data',
      'kwik_fuel_data',
      'maverick_fuel_data',
      'sheetz_fuel_data',
      'ta_fuel_data'
      // (casey_fuel_data omitted as per previous mention)
    ]
    const haulersAllianceTables = [
      'sheetz_fuel_data',
      'maverick_fuel_data',
      'circle_k_fuel_data'
    ]

    // Map table names to default marker icons
    const tableMarkerIconUrls = {
      '7_fleet_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'circle_k_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'kwik_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      'maverick_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      'sheetz_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'ta_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    }

    //------------------------------------------------
    // 1) Single Fetch: Load all station data once
    //------------------------------------------------
    const fetchAllDataOnce = async () => {
      // Fetch data for "all stations" set
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
      console.log('[fetchAllDataOnce] allStationsData =>', allStationsData.length)

      // Fetch data for "haulersAlliance" set
      const alliancePromises = haulersAllianceTables.map((table) =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[fetchAllDataOnce] Alliance error from ${table}:`, error)
              return []
            }
            console.log(`[fetchAllDataOnce] Alliance ${table} => ${data.length} rows`)
            return data.map(row => ({ ...row, table }))
          })
      )
      const allianceResults = await Promise.all(alliancePromises)
      haulersAllianceData = allianceResults.flat()
      console.log('[fetchAllDataOnce] haulersAllianceData =>', haulersAllianceData.length)
    }

    //------------------------------------------------
    // 2) Render Markers from in-memory arrays
    //------------------------------------------------
    const renderMarkers = () => {
      if (!map.value) return
      // Clear old markers
      markers.value.forEach(m => m.setMap(null))
      markers.value = []

      // Decide which data array to use
      const dataArray = (activeTab.value === 'allStations')
        ? allStationsData
        : haulersAllianceData

      // Also filter by map bounds if you want viewport-based logic:
      const bounds = map.value.getBounds()
      let north, south, east, west
      if (bounds) {
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        north = ne.lat()
        south = sw.lat()
        east  = ne.lng()
        west  = sw.lng()
      } else {
        // If bounds not available yet, fallback to no bounds filter
        console.warn('[renderMarkers] No map bounds yet, skipping bounding filter')
      }

      let addedCount = 0
      dataArray.forEach(station => {
        const coords = parseLatLng(station)
        if (!coords) return
        // If we do want viewport-limiting, check coords are inside the bounding box
        if (bounds) {
          if (coords.lat < south || coords.lat > north || coords.lng < west || coords.lng > east) {
            // Skip if outside the viewport
            return
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
        addedCount++
      })
      console.log('[renderMarkers] Markers displayed =>', addedCount)
    }

    //------------------------------------------------
    // 3) Handle Tab Changes
    //------------------------------------------------
    const setActiveTab = (tab) => {
      activeTab.value = tab
      console.log('[setActiveTab]', tab)
      // Re-render markers from in-memory data for the new tab
      renderMarkers()
    }

    //------------------------------------------------
    // 4) Map Initialization
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

      // If you want dynamic re-render on zoom/pan, listen to 'idle'
      map.value.addListener('idle', () => {
        console.log('[Map Event] idle -> re-render markers from memory')
        renderMarkers()
      })

      // Once the map is ready, do an initial render
      renderMarkers()
    }

    //------------------------------------------------
    // 5) On Mounted, load data once, then init map
    //------------------------------------------------
    onMounted(async () => {
      // 5a) Fetch all data once
      await fetchAllDataOnce()

      // 5b) Initialize map
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
