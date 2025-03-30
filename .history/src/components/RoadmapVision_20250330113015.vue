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
/* Overall Container: White background with dark text */
#roadmapContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  background-color: #FFFFFF;  /* White background */
  color: #0C2442;             /* Dark Blue text */
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Title Section */
#title {
  margin-bottom: 30px;
  text-align: center;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 2.4rem;
  margin-bottom: 10px;
  color: #0C2442;
}

/* Phase Boxes Container */
#phaseBoxes {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
  flex-wrap: wrap;
}

/* Individual Phase Box: White card with dark text */
.phaseBox {
  flex: 1;
  background-color: #fff;
  color: #0C2442;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.phaseBox h2 {
  font-family: Sora, sans-serif;
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #0C2442;
}

.phaseBox ul {
  list-style: disc;
  margin-left: 20px;
  margin-bottom: 10px;
  color: #0C2442;
}

.phaseBox p {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #0C2442;
}

/* Special Styles for Emphasis */
.progress {
  font-weight: bold;
  color: #B11818;  /* Accent Red */
}

.trucks {
  font-weight: bold;
  color: #B11818;  /* Accent Red */
}
</style>
