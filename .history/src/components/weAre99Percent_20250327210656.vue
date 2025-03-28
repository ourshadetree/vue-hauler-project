<template>
    <div id="container99">
        <div id="left">
            <div id="words99">
                <h1>We are the 99%</h1>
                <h5>As of March 2024, there were over 577,000 active US motor carriers registered with FMCSA. Out of those carriers, 99.6% operate 100 or fewer trucks</h5>
                <h5>We are building the foundation for small and medium-sized carriers to prosper. By coming together, we can rival the largest fleets.</h5>
            </div>
  
            <div id="progressBar99">
                    <!-- Display ratio (e.g., 267 / 555000) -->
                    <h4>
                    {{ progressValue }} / {{ progressMax }}
                    <span style="font-weight: normal;">members so far</span>
                    </h4>
                    <!-- Progress bar container -->
                    <div class="progress-bar-outer">
                    <!-- Inner bar with dynamic width -->
                    <div class="progress-bar-inner" :style="{ width: progressPercentage + '%' }">
                    </div>
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
  
  // Compute the percentage
  const progressPercentage = computed(() => {
    // e.g., 267 / 555000 * 100 = ~0.048% (very small)
    // We'll just display it to 2 decimal places
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
  }
  
  #words99,
  #finalWords99 {
    width: 80%;
    margin-bottom: 20px;
  }
  
  #progressBar99 {
    width: 80%;
    margin-bottom: 20px;
  }

  #left {
    flex: 1;
  }

  #right {
    flex: 1;
  }
  
  /* Progress Bar Container */
  .progress-bar-outer {
    width: 100%;
    height: 20px;
    background-color: #ccc; /* Gray background */
    border-radius: 10px;
    overflow: hidden;
    margin: 0 auto; /* center horizontally */
    margin-top: 10px;
    margin-bottom: 5px;
    position: relative;
  }
  
  /* Progress Bar Inner (the filling) */
  .progress-bar-inner {
    height: 100%;
    background-color: pink; /* Or your brand color */
    border-radius: 10px;
    transition: width 0.4s ease; /* Smooth animation */
  }
  
  /* Percentage Text */
  .percentage-text {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
  }
  </style>
  