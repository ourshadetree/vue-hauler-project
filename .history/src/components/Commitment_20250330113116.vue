<template>
  <div id="commitmentContainer">
    <!-- Title Section -->
    <div id="title">
      <h1>Our Commitment to Carriers</h1>
    </div>

    <!-- Main Content Columns -->
    <div id="columns">
      <!-- Left Column (Text) -->
      <div id="left">
        <h3>There are too many hands in our pockets as owner-operators</h3>
        <p>
          Haulers United is tipping the scales and catalyzing one of the biggest power
          transfers in history.
        </p>
        <p>
          Carriers like you haul 95% of this country's freight. When we come together, we
          will call the shots.
        </p>
        <h2>Why go it alone?</h2>
      </div>

      <!-- Right Column (Image) -->
      <div id="right">
        <!-- Replace with your actual path if needed -->
        <img src="../assets/testImage.png" alt="Trucks" />
      </div>
    </div>

    <!-- Join Button -->
    <button id="joinNowButton">Join Us</button>
  </div>
</template>

<script>
export default {
  name: 'Commitment'
}
</script>

<style scoped>
/* Overall Container */
#commitmentContainer {
  background-color: #0C2442;   /* Dark Blue background */
  color: #FFFFFF;              /* White text for contrast */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Title */
#title {
  text-align: center;
  margin-bottom: 40px;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 2.4rem;
  margin-bottom: 10px;
  color: #FFFFFF;
}

/* Columns Layout */
#columns {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
  flex-wrap: wrap;
}

/* Left Column */
#left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#left h3 {
  font-family: Sora, sans-serif;
  font-size: 1.4rem;
  margin-bottom: 20px;
  font-style: italic;
  color: #FFFFFF;
}
#left p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #FFFFFF;
}
#left h2 {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  margin-top: 20px;
  color: #B11818; /* Accent Red */
}

/* Right Column (Image) */
#right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
#right img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Join Button */
#joinNowButton {
  background-color: #B11818;  /* Accent Red */
  color: #FFFFFF;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 40px;
  transition: background-color 0.3s, transform 0.3s;
}
#joinNowButton:hover {
  background-color: #a01015;
  transform: scale(1.05);
}
</style>
