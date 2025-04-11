<template>
  <div id="differentContainer">
    <!-- New Section Header -->
    <div id="sectionHeader">
      <h2>Why It Works</h2>
    </div>
    
    <div id="title">
      <h1>1. Collective Bargaining Approach</h1>
      <p>
        By becoming a Haulers United member you unlock the buying power of thousands of trucks with no volume minimums. As our collective purchasing volume grows, so does the group discount which is passed back to you, the carrier.
      </p>
    </div>
    <div id="columns">
      <div id="left">
        <h3>Diesel Cost Breakdown</h3>
        <p>
          By coming together and negotiating volume discounts with distributors, we can lower our fuel costs as much as possible.
        </p>
        <!-- Using the graphic image in place of the built bars -->
        <div id="chartContainer">
          <img src="@/assets/chart.png" alt="Diesel Cost Breakdown Chart" />
        </div>
        <div id="disclaimer">
          <p>
            Disclaimer: The above graphic is for illustrative purposes only and does not represent actual savings. Actual savings will vary based on market conditions and other factors.
          </p>
        </div>
      </div>
      <div id="right">
        <h2>Our Fuel Partners</h2>
        <div id="icons">
          <!-- Fuel partner icons go here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WhyDifferentOne',
}
</script>

<style scoped>
/* Overall Container & Layout */
#differentContainer {
  background-color: #0C2442; /* Dark Blue background */
  color: #FFFFFF;  /* White text for contrast */
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

/* Section Header */
#sectionHeader h2 {
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Title Section */
#title h1 {
  font-family: Sora, sans-serif;
  margin-bottom: 10px;
}

/* Columns Layout */
#columns {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  margin-top: 30px;
}

#left, #right {
  flex: 1;
  padding: 20px;
}

/* Chart Container */
#chartContainer {
  text-align: center;
  margin: 20px 0;
}

#chartContainer img {
  max-width: 100%;
  height: auto;
}

/* Disclaimer */
#disclaimer p {
  font-size: 0.8rem;
  color: #ddd; /* Slightly lighter white for disclaimer */
  margin-top: 20px;
}

/* Right Column */
#right h2 {
  font-family: Sora, sans-serif;
  margin-bottom: 20px;
}
</style>
