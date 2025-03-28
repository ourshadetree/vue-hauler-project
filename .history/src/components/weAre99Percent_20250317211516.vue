<template>
    <div id="99Container">
      <div id="99Words">
        <h1>We are the 99%</h1>
        <h5>As of March 2024, there were over 577,000 active US motor carriers registered with FMCSA. Out of those carriers, 99.6% operate 100 or fewer trucks</h5>
        <h5>We are building the foundation for small and medium-sized carriers to prosper. By coming together, we can rival the largest fleets.</h5>
      </div>
  
      <div id="99ProgressBar">
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
  
      <div id="99FinalWords">
        <p>Join the movement to access discounts and opt-in to our automated load-matching service.</p>
      </div>
    </div>
  </template>
  
  <script setup>
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
  #99Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  #99Words,
  #99FinalWords {
    width: 80%;
    margin-bottom: 20px;
  }
  
  #99ProgressBar {
    width: 80%;
    margin-bottom: 20px;
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
  