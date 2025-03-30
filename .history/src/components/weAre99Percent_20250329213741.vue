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
        <!-- Display ratio (e.g., 267 / 555000) -->
        <h4>
          {{ progressValue }} / {{ progressMax }}
          <span class="members-text">members so far</span>
        </h4>
        <!-- Progress bar container -->
        <div class="progress-bar-outer">
          <!-- Inner bar with dynamic width -->
          <div class="progress-bar-inner" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <!-- Optional: Show percentage next to the bar -->
        <p class="percentage-text">{{ progressPercentage }}%</p>
      </div>

      <div id="finalWords99">
        <p>Join the movement to access discounts and opt-in to our automated load-matching service.</p>
      </div>
    </div>
    <div id="right">
      <SimpleLocationMap />
    </div>
  </div>
</template>

<script setup>
import SimpleLocationMap from './SimpleLocationMap.vue'
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
#container99 {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background-color: #f8f8f8; /* Light background for contrast */
}

/* Left and right sections take equal width */
#left,
#right {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  align-items: stretch;
}

/* Inner content fills its parent */
#words99,
#progressBar99,
#finalWords99 {
  width: 100%;
  margin-bottom: 20px;
}

/* Typography for text sections */
#words99 h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #073763; /* Dark blue for headline */
  margin-bottom: 10px;
}

#words99 h5 {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

/* Progress bar and accompanying text */
#progressBar99 h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #073763;
}

.members-text {
  font-weight: normal;
  font-size: 1rem;
  color: #777;
}

.progress-bar-outer {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0; /* Light gray background */
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar-inner {
  height: 100%;
  background-color: #ff6600; /* Modern accent (orange) */
  border-radius: 10px;
  transition: width 0.4s ease;
}

.percentage-text {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

/* Final message styling */
#finalWords99 p {
  font-size: 1.1rem;
  color: #073763;
  font-weight: 500;
}
</style>
