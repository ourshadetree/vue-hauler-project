<template>
  <div id="fuelToolsContainer">
    <!-- Internal Tools Navigation -->
    <div class="tools-nav">
      <div class="tools-links">
        <div
          :class="['tab-link', { active: activeTab === 'averages' }]"
          @click="setActiveTab('averages')"
        >
          Averages Tool
        </div>
        <div
          :class="['tab-link', { active: activeTab === 'location' }]"
          @click="setActiveTab('location')"
        >
          Location Tool
        </div>
        <div
          :class="['tab-link', { active: activeTab === 'route' }]"
          @click="setActiveTab('route')"
        >
          Route Tool
        </div>
      </div>
      <!-- Join Now Button -->
      <button id="joinNowButton" @click="openModal('SignUpForm')">Join Now</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'averages'" class="tab-placeholder">
        Averages Tool Placeholder
      </div>
      <div v-if="activeTab === 'location'" class="tab-placeholder">
        Location Tool Placeholder
      </div>
      <div v-if="activeTab === 'route'" class="tab-placeholder">
        Route Tool Placeholder
      </div>
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

export default {
  name: "FuelTools",
  data() {
    return {
      activeTab: "averages",
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
/* Container for the entire Fuel Tools view */
#fuelToolsContainer {
  /* Matches your page background (white) */
  background-color: #ffffff;
  color: #0c2442; /* Dark Blue text */
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  /* Ensure it sits inside #pageContent nicely */
  max-width: 1200px;
  margin: 0 auto; /* Center horizontally */
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
}

/* Internal Tools Navigation */
.tools-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c2442; /* Dark Blue background for the nav */
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
  background-color: #b11818; /* Accent Red */
}

/* Join Now Button */
.join-now-button {
  background-color: #b11818; /* Accent Red */
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
  background-color: #f5f5f5; /* Light grey background */
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
