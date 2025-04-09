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
import { supabase } from '@/../supabaseClient' // Ensure the path is correct

export default {
  name: 'SimpleLocationMap',
  setup() {
    // Reactive references
    const map = ref(null)
    const activeTab = ref('allStations')
    const markers = ref([])

    // We store the tables for each tab so we can fetch them when needed
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
      console.log('[clearMarkers] # of markers before clear:', markers.value.length)
      markers.value.forEach(marker => marker.setMap(null))
      markers.value = []
      console.log('[clearMarkers] # of markers after clear:', markers.value.length)
    }

    /**
     * Fetch station data for the given tables within the current map bounds
     * and display markers accordingly.
     */
    const fetchStationsInViewport = async (tables) => {
      if (!map.value) return
      const bounds = map.value.getBounds()
      if (!bounds) {
        console.warn('[fetchStationsInViewport] No map bounds available yet.')
        return
      }

      // Get the current bounding box (Northeast & Southwest corners)
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()

      console.log('[fetchStationsInViewport] Map bounds:', {
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng()
      })

      // Prepare queries for each table, applying bounding box constraints:
      // latitude between sw.lat() and ne.lat()
      // longitude between sw.lng() and ne.lng()
      const fetchPromises = tables.map((table) =>
        supabase
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
            console.log(`[fetchStationsInViewport] ${table}: Fetched ${data.length} rows within bounds`)
            return data.map(row => ({ ...row, table }))
          })
      )

      // Run all queries concurrently
      const results = await Promise.all(fetchPromises)
      const allData = results.flat()
      console.log('[fetchStationsInViewport] Combined rows in viewport:', allData.length)

      // Clear existing markers before adding new ones
      clearMarkers()

      // Create new markers for each station in the viewport
      allData.forEach((station) => {
        const latValue = parseFloat(station.latitude)
        const lngValue = parseFloat(station.longitude)
        if (!station.table || Number.isNaN(latValue) || Number.isNaN(lngValue)) {
          console.warn('[fetchStationsInViewport] Invalid lat/lng, skipping:', station)
          return
        }

        const iconUrl = tableMarkerIconUrls[station.table]
                       || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'

        const marker = new google.maps.Marker({
          position: { lat: latValue, lng: lngValue },
          map: map.value,
          title: `${station.table} Station`,
          icon: iconUrl
        })
        markers.value.push(marker)
      })
      console.log('[fetchStationsInViewport] # of markers after load:', markers.value.length)
    }

    /**
     * When user clicks a tab, set activeTab and re-fetch for the new set of tables.
     */
    const setActiveTab = (tab) => {
      activeTab.value = tab
      // Immediately refetch using the new table list
      fetchStationsInViewport(
        tab === 'allStations' ? allStationsTables : haulersAllianceTables
      )
    }

    /**
     * Initialize the map, set up listener for map idle event, load initial stations.
     */
    const initMap = () => {
      console.log('[initMap] Initializing map...')
      const mapDiv = document.getElementById('simpleMap')
      if (!mapDiv) {
        console.error('[initMap] Map div not found.')
        return
      }
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4
      })

      // Listen for 'idle' event -> fetch stations within viewport
      map.value.addListener('idle', () => {
        console.log('[Map Event] idle -> fetching stations for tab:', activeTab.value)
        // Determine which table set is active
        const tables = activeTab.value === 'allStations'
          ? allStationsTables
          : haulersAllianceTables

        fetchStationsInViewport(tables)
      })

      // Initial load for the active tab
      // (the 'idle' event will fire and call fetch automatically,
      //  but we can also call fetchStationsInViewport manually if needed).
      console.log('[initMap] Map initialized. Waiting for first idle event...')
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
