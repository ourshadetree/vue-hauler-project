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
    const map = ref(null)
    const activeTab = ref("allStations")
    const markers = ref([])

    // Mapping of table names to default Google marker icon URLs.
    const tableMarkerIconUrls = {
      '7_fleet_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      /* casey_fuel_data removed */
      'circle_k_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'kwik_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      'maverick_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      'sheetz_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'ta_fuel_data': 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
    }

    // Clears all existing markers from the map.
    const clearMarkers = () => {
      console.log('[clearMarkers] # of markers before clear:', markers.value.length)
      markers.value.forEach(marker => marker.setMap(null))
      markers.value = []
      console.log('[clearMarkers] # of markers after clear:', markers.value.length)
    }

    // Loads stations from the given array of table names.
    const loadStations = async (tables) => {
      console.log(`[loadStations] Loading stations from: ${tables.join(', ')}`)
      // Fetch data concurrently from each table.
      const fetchPromises = tables.map((table) =>
        supabase
          .from(table)
          .select('latitude,longitude')
          .then(({ data, error }) => {
            if (error) {
              console.error(`[loadStations] Error fetching data from ${table}:`, error)
              return []
            }
            console.log(`[loadStations] Fetched ${data.length} rows from ${table}`)
            return data.map(row => ({ ...row, table }))
          })
      )

      // Wait for all fetches to complete and combine the results.
      const results = await Promise.all(fetchPromises)
      const allData = results.flat()
      console.log('[loadStations] Total combined data:', allData.length)

      // Add markers for each station.
      allData.forEach((station) => {
        const latValue = parseFloat(station.latitude)
        const lngValue = parseFloat(station.longitude)
        if (!station.table || Number.isNaN(latValue) || Number.isNaN(lngValue)) {
          console.warn(`[loadStations] Invalid lat/lng => skipping:`, station)
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
      console.log('[loadStations] # of markers after load:', markers.value.length)
    }

    // Sets the active tab, clears markers, and loads the appropriate stations.
    const setActiveTab = (tab) => {
      activeTab.value = tab
      clearMarkers()

      if (tab === 'allStations') {
        loadStations([
          '7_fleet_fuel_data',
          /* 'casey_fuel_data' omitted here */
          'circle_k_fuel_data',
          'kwik_fuel_data',
          'maverick_fuel_data',
          'sheetz_fuel_data',
          'ta_fuel_data'
        ])
      } else if (tab === 'haulersAlliance') {
        loadStations([
          /* 'casey_fuel_data' omitted here as well */
          'sheetz_fuel_data',
          'maverick_fuel_data',
          'circle_k_fuel_data'
        ])
      }
    }

    // Initializes the map and loads the default stations (allStations).
    const initMap = async () => {
      const mapDiv = document.getElementById('simpleMap')
      if (!mapDiv) {
        console.error('[initMap] Map div not found.')
        return
      }
      map.value = new google.maps.Map(mapDiv, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4,
      })
      setActiveTab(activeTab.value)
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
