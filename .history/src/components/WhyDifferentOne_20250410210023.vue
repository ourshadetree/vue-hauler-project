<template>
  <div id="differentContainer">
    <!-- Section Header -->
    <div id="sectionHeader">
      <h2>Why It Works</h2>
    </div>
    
    <div id="title">
      <h1>Collective Bargaining Approach</h1>
      <p>
        By becoming a Haulers United member you unlock the buying power of thousands of trucks with no volume minimums. As our collective purchasing volume grows, so does the group discount which is passed back to you, the carrier.
      </p>
    </div>
    
    <div id="columns">
      <!-- Left side: Diesel Cost Breakdown text & chart -->
      <div id="left">
        <h3>Diesel Cost Breakdown</h3>
        <p>
          By coming together and negotiating volume discounts with distributors, we can lower our fuel costs as much as possible.
        </p>
        <div id="chartContainer">
          <img src="@/assets/chart2.png" alt="Diesel Cost Breakdown Chart" />
          <div id="disclaimer">
            <p>
              Disclaimer: The above graphic is for illustrative purposes only and does not represent actual savings. Actual savings will vary based on market conditions and other factors.
            </p>
          </div>
        </div>
      </div>

      <!-- Right side: Our Fuel Partners -->
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
  background-color: #FFFFFF; /* White background to match site style */
  color: #0C2442;            /* Dark Blue text for contrast */
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
}

/* Section Header */
#sectionHeader h2 {
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

/* Title Section */
#title {
  text-align: center;
  max-width: 800px;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 1.8rem;
  margin-bottom: 15px;
}
#title p {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 30px;
}

/* Columns Layout */
#columns {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
}

#left, #right {
  flex: 1;
  padding: 20px;
}

/* Chart Container */
#chartContainer {
  background-color: #F7F7F7;         /* Subtle gray background */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin-top: 20px;
}

#chartContainer img {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  display: block; /* Ensure it's centered within the container */
}

/* Disclaimer */
#disclaimer {
  margin-top: 10px;
}
#disclaimer p {
  font-size: 0.8rem;
  color: #555; /* Slightly darker text for disclaimer */
  margin: 0;
}

/* Right Column */
#right h2 {
  font-family: Sora, sans-serif;
  margin-bottom: 20px;
  font-size: 1.4rem;
}
</style>
