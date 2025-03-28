<template>
    <div id="differentContainer">
      <div id="title">
        <h1>1. Collective Bargaining Approach</h1>
        <p>By becoming a Haulers United member you unlock the buying power of thousands of trucks with no volume minimums. As our collective purchasing volume grows, so does the group discount which is passed back to you, the carrier.</p>
      </div>
      <div id="columns">
        <div id="left">
          <h3>Diesel Cost Breakdown</h3>
          <p>By coming together and negotiating volume discounts with distributors, we can lower our fuel costs as much as possible</p>
          <!-- Without Haulers United Graphic -->
          <div id="withoutUs">
            <h4>Without Haulers United</h4>
            <div id="withoutGraphic" class="stacked-bar">
              <div class="segment taxes"></div>
              <div class="segment refining"></div>
              <div class="segment crude"></div>
              <div class="segment distribution"></div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="color-box taxes"></span> Taxes (16%)</div>
              <div class="legend-item"><span class="color-box refining"></span> Refining (16%)</div>
              <div class="legend-item"><span class="color-box crude"></span> Crude Oil (49%)</div>
              <div class="legend-item"><span class="color-box distribution"></span> Distribution &amp; Marketing (18%)</div>
            </div>
          </div>
          <!-- With Haulers United Graphic -->
          <div id="withUs">
            <h4>With Haulers United</h4>
            <div id="withGraphic" class="stacked-bar">
              <div class="segment taxes"></div>
              <div class="segment refining"></div>
              <div class="segment crude"></div>
              <div class="segment distribution"></div>
              <div class="segment back"></div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="color-box taxes"></span> Taxes (16%)</div>
              <div class="legend-item"><span class="color-box refining"></span> Refining (16%)</div>
              <div class="legend-item"><span class="color-box crude"></span> Crude Oil (49%)</div>
              <div class="legend-item"><span class="color-box distribution"></span> Distribution &amp; Marketing (3%)</div>
              <div class="legend-item"><span class="color-box back"></span> Back in Your Pocket (15%)</div>
            </div>
          </div>
          <div id="disclaimer">
            <p>Disclaimer: The above graphics are for illustrative purposes only and do not represent actual savings. Actual savings will vary based on market conditions and other factors.</p>
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
  /* Container & Layout */
  #differentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 20px;
    color: #073763;
  }
  
  #title h1 {
    margin-bottom: 10px;
  }
  
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
  
  /* Stacked Bar Graphics */
  .stacked-bar {
    display: flex;
    height: 30px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  
  /* Without Haulers United: Set segment widths */
  #withoutGraphic .taxes { width: 16%; }
  #withoutGraphic .refining { width: 16%; }
  #withoutGraphic .crude { width: 49%; }
  #withoutGraphic .distribution { width: 18%; }
  
  /* With Haulers United: Set segment widths */
  #withGraphic .taxes { width: 16%; }
  #withGraphic .refining { width: 16%; }
  #withGraphic .crude { width: 49%; }
  #withGraphic .distribution { width: 3%; }
  #withGraphic .back { width: 15%; }
  
  /* Common styling for segments */
  .segment {
    height: 100%;
  }
  
  /* Colors for each segment */
  .taxes { background-color: #f08080; }        /* Light Coral */
  .refining { background-color: #f0e68c; }      /* Khaki */
  .crude { background-color: #87cefa; }         /* Light Sky Blue */
  .distribution { background-color: #98fb98; }  /* Pale Green */
  .back { background-color: #90ee90; }          /* A brighter light green */
  
  /* Legend Styling */
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    margin-right: 15px;
  }
  
  .color-box {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    border: 1px solid #ccc;
  }
  
  .color-box.taxes { background-color: #f08080; }
  .color-box.refining { background-color: #f0e68c; }
  .color-box.crude { background-color: #87cefa; }
  .color-box.distribution { background-color: #98fb98; }
  .color-box.back { background-color: #90ee90; }
  
  /* Disclaimer */
  #disclaimer p {
    font-size: 0.8rem;
    color: #555;
    margin-top: 20px;
  }
  
  /* Right Column */
  #right h2 {
    margin-bottom: 20px;
  }
  </style>
  