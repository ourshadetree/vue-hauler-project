<template>
  <div id="container99">
    <div id="left">
      <div id="words99">
        <h1>We are the 99%</h1>
        <h5>
          As of March 2024, there were over 577,000 active US motor carriers registered with FMCSA. Out of those carriers, 99.6% operate 100 or fewer trucks.
        </h5>
        <h5>
          We are building the foundation for small and medium-sized carriers to prosper. By coming together, we can rival the largest fleets.
        </h5>
      </div>
      <div id="progressBar99">
        <h4>
          {{ progressValue }} / {{ progressMax }}
          <span class="members-text">members so far</span>
        </h4>
        <div class="progress-bar-outer">
          <div class="progress-bar-inner" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="percentage-text">{{ progressPercentage }}%</p>
      </div>
      <div id="finalWords99">
        <p>Join the movement to access discounts and opt-in to our automated load-matching service.</p>
      </div>
    </div>
    <div id="right">
      <NewUserSalesMap />
      <SalesMapNavTools />
    </div>
  </div>
</template>

<script setup>
import NewUserSalesMap from './NewUserSalesMap.vue'
import SalesMapNavTools from './SalesMapNavTools.vue'
import { computed } from 'vue'

// Hard-coded values for demonstration
const progressValue = 267
const progressMax = 555000

// Compute the percentage (displayed to 2 decimal places)
const progressPercentage = computed(() => {
  const ratio = (progressValue / progressMax) * 100
  return ratio.toFixed(2)
})
</script>

<style scoped>
/* Container uses white background for informative content */
#container99 {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background-color: #FFFFFF;
}

/* Left section: 50% of the width */
#left {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 10px;
}

/* Right section: 50% of the width */
#right {
  flex: 0 0 50%;
  max-width: 50%;
  flex-direction: column;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

/* Typography for text sections */
#words99 {
  width: 100%;
  margin-bottom: 20px;
}
#words99 h1 {
  font-family: 'Sora', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #0C2442; /* Dark Blue */
  margin-bottom: 10px;
}
#words99 h5 {
  font-family: 'Karla', sans-serif;
  font-size: 1rem;
  color: #0C2442;
  margin-bottom: 10px;
}

/* Progress bar styling */
#progressBar99 h4 {
  font-family: 'Karla', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #0C2442;
}
.members-text {
  font-family: 'Karla', sans-serif;
  font-size: 1rem;
  color: #777;
}
.progress-bar-outer {
  width: 100%;
  height: 20px;
  background-color: #F5F5F5; /* Light Grey */
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}
.progress-bar-inner {
  height: 100%;
  background-color: #B11818; /* Red accent */
  border-radius: 10px;
  transition: width 0.4s ease;
}
.percentage-text {
  font-family: 'Karla', sans-serif;
  margin: 0;
  font-size: 0.9rem;
  color: #0C2442;
}

/* Final message styling */
#finalWords99 p {
  font-family: 'Karla', sans-serif;
  font-size: 1.1rem;
  color: #0C2442;
  font-weight: 500;
}
</style>
