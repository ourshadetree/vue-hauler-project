<template>
  <div id="roadmapContainer">
    <!-- Title Section -->
    <div id="title">
      <h1>Roadmap: The Long Haul</h1>
    </div>

    <!-- Phase Boxes -->
    <div id="phaseBoxes">
      <!-- Phase 1 -->
      <div class="phaseBox">
        <h2>Phase 1: Uniting the 99% through volume discounts</h2>
        <ul>
          <li>Fuel Card</li>
          <li>Factoring</li>
          <li>Roadside Assistance</li>
          <li>ELDs</li>
          <li>Insurance</li>
        </ul>
        <p>
          Once all expenses are tackled, our primary goal will be to increase our
          collective purchasing volume with the biggest benefits for all members to
          benefit from.
        </p>
        <p class="progress">Progress to starting phase 2</p>
      </div>

      <!-- Phase 2 -->
      <div class="phaseBox">
        <h2>Phase 2: Coming together on a unified open-source network</h2>
        <p>
          Once we have enough coverage nationwide, the association will approach shippers
          directly to reduce all expenses, building on a network of carriers without a
          brokerage fee.
        </p>
        <p class="trucks">1,176 Trucks</p>
        <p class="trucks">20,000 Trucks</p>
      </div>

      <!-- Phase 3 -->
      <div class="phaseBox">
        <h2>Phase 3: Stabilizing Industry Rates</h2>
        <p>
          A small story about how the rate will be determined, how technology can easily
          replace brokers, and how eliminating rate variation between carriers and brokers
          will stabilize the market.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoadmapVision',
}
</script>

<style scoped>
/* Overall Container: Blue background with white text */
#roadmapContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  background-color: #073763;  /* Blue background */
  color: white;               /* Default text color white */
  font-family: 'Open Sans', sans-serif;
}

/* Title Section */
#title {
  margin-bottom: 30px;
  text-align: center;
}
#title h1 {
  font-size: 2.4rem;
  margin-bottom: 10px;
  color: white;
}

/* Phase Boxes Container */
#phaseBoxes {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
}

/* Individual Phase Box: White card with dark text */
.phaseBox {
  flex: 1;
  background-color: #fff;      /* White background */
  color: #073763;             /* Dark text */
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;          /* Ensures some vertical space */
}

.phaseBox h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #073763;
}

.phaseBox ul {
  list-style: disc;
  margin-left: 20px;
  margin-bottom: 10px;
  color: #073763;
}

.phaseBox p {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #073763;
}

/* Special Styles for Emphasis */
.progress {
  font-weight: bold;
  color: #0073d1;  /* Accent color */
}

.trucks {
  font-weight: bold;
  color: #0073d1;  /* Accent color */
}
</style>
