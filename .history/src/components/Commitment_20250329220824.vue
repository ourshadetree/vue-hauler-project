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
    background-color: #fff;        /* White background to match your main page */
    color: #073763;               /* Dark text for contrast */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 20px;
    font-family: 'Open Sans', sans-serif;
  }
  
  /* Title */
  #title {
    text-align: center;
    margin-bottom: 40px;
  }
  
  #title h1 {
    font-size: 2.4rem;
    margin-bottom: 10px;
  }
  
  /* Columns Layout */
  #columns {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1200px;
    gap: 20px;
  }
  
  /* Left Column */
  #left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  #left h3 {
    font-size: 1.4rem;
    margin-bottom: 20px;
    font-style: italic; /* Matches the screenshot's italic text */
  }
  
  #left p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  #left h2 {
    font-size: 1.2rem;
    margin-top: 20px;
    color: #0073d1; /* Accent color */
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  }
  
  /* Join Button */
  #joinNowButton {
    background-color: #ff6600;
    color: #fff;
    border: none;
    padding: 15px 30px;
    font-size: 1.2rem;
    border-radius: 50px;
    cursor: pointer;
    margin-top: 40px; /* Space above button */
    transition: background-color 0.3s, transform 0.3s;
  }
  
  #joinNowButton:hover {
    background-color: #e65c00;
    transform: scale(1.05);
  }
  </style>
  