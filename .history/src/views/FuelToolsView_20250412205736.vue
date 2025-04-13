<template>
  <div id="fuelToolsContainer">
    <!-- Internal Tools Navigation -->
    <div class="tools-nav">
      <div class="tools-links">
        <div
          :class="['tab-link', { active: activeTab === 'location' }]"
          @click="setActiveTab('location')"
        >
          Location Tool
        </div>
        <div
          :class="['tab-link', { active: activeTab === 'geocode' }]"
          @click="setActiveTab('geocode')"
        >
          Geocode Tool
        </div>
      </div>
      <!-- Join Now Button -->
      <button class="join-now-button" @click="openModal('SignUpForm')">
        Join Now
      </button>
    </div>

      <div v-if="activeTab === 'location'" class="tab-placeholder">
        <SimpleLocationMap @filtered="updateFilteredStations" />
        <NearbyStationList
         v-if="filteredStations.length > 0"
         :filteredStations="filteredStations"
         :referenceLocation="currentReference"
         class="overlay-station-list"
      />
      </div>
      
      <div v-if="activeTab === 'geocode'" class="tab-placeholder">
        <GeocodeUpdater />
      </div>
    

    <!-- Modal for authentication forms -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import SignUpForm from "@/components/SignUpForm.vue";
import SimpleLocationMap from "@/components/SimpleLocationMap.vue";
import GeocodeUpdater from "@/components/GeocodeUpdater.vue"; // New geocode component
import NearbyStationList from "@/components/NearbyStationList.vue";

export default {
  name: "FuelTools",
  components: {
    Modal,
    SignUpForm,
    SimpleLocationMap,
    GeocodeUpdater,
    NearbyStationList,
  },
  data() {
    return {
      activeTab: "averages",
      activeModal: "",
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    openModal(formName) {
      this.activeModal = formName;
    },
  },
};
</script>

<style scoped>
/* Container for the entire Fuel Tools view */
#fuelToolsContainer {
  background-color: #ffffff;
  color: #0c2442;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
}

/* Internal Tools Navigation */
.tools-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c2442;
  border-radius: 8px;
  padding: 10px 20px;
  margin-bottom: 20px;
}

/* Container for the tab links */
.tools-links {
  display: flex;
  gap: 20px;
}

/* Each tab link */
.tab-link {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

/* Active or hover state for tab links */
.tab-link:hover,
.tab-link.active {
  background-color: #b11818;
}

/* Join Now Button */
.join-now-button {
  background-color: #b11818;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
.join-now-button:hover {
  background-color: #a01015;
  transform: scale(1.05);
}

/* Tab Content Area */
.tab-content {
  background-color: #f5f5f5;
  padding: 40px 20px;
  border-radius: 8px;
  min-height: 300px;
}

/* Placeholder Styling */
.tab-placeholder {
  text-align: center;
  font-family: Sora, sans-serif;
  font-size: 1.5rem;
  color: #0c2442;
}
</style>
