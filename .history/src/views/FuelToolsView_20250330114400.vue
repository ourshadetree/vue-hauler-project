<template>
  <div id="fuelToolsContainer">
    <!-- Internal Navigation Bar -->
    <nav id="fuelToolsNav">
      <ul>
        <li :class="{ active: activeTab === 'averages' }" @click="setActiveTab('averages')">
          Averages Tool
        </li>
        <li :class="{ active: activeTab === 'location' }" @click="setActiveTab('location')">
          Location Tool
        </li>
        <li :class="{ active: activeTab === 'route' }" @click="setActiveTab('route')">
          Route Tool
        </li>
      </ul>
      <button id="joinNowButton">Join Now</button>
    </nav>

    <!-- Tab Content -->
    <div id="tabContent">
      <div v-if="activeTab === 'averages'" class="tab-placeholder">
        <p>Averages Tool Placeholder</p>
      </div>
      <div v-if="activeTab === 'location'" class="tab-placeholder">
        <p>Location Tool Placeholder</p>
      </div>
      <div v-if="activeTab === 'route'" class="tab-placeholder">
        <p>Route Tool Placeholder</p>
      </div>
    </div>
  </div>
</template>

<script>
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
/* Overall Container: Use white background so it blends with the page's content area */
#fuelToolsContainer {
  background-color: #ffffff;
  color: #0c2442;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
  border-radius: 8px;
}

/* Internal Navigation Bar */
#fuelToolsNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c2442; /* Dark Blue */
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

#fuelToolsNav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

#fuelToolsNav li {
  margin-right: 20px;
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

#fuelToolsNav li.active,
#fuelToolsNav li:hover {
  background-color: #b11818; /* Accent Red */
}

/* Join Now Button */
#joinNowButton {
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
#joinNowButton:hover {
  background-color: #a01015;
  transform: scale(1.05);
}

/* Tab Content */
#tabContent {
  background-color: #f5f5f5; /* Light grey for content background */
  padding: 20px;
  border-radius: 8px;
  min-height: 300px;
}

.tab-placeholder {
  text-align: center;
  font-family: Sora, sans-serif;
  font-size: 1.5rem;
  color: #0c2442;
  padding: 40px;
}
</style>
