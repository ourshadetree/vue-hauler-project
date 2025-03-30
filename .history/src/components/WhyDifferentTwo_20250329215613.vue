<template>
    <div id="whyDifferentContainer">
      <div id="title">
        <h1>2. Full Service Package for Owner Operators</h1>
        <p>
          We partner with fast-moving, technology-focused companies to bring you a full suite of essential services at premium pricing. Additionally, we only work with partners who value customer support. Don't get left on hold for hours when you need help now.
        </p>
      </div>
      <div id="columns">
        <!-- Left Column: Charts -->
        <div id="left">
          <div id="chart">
            <h2>Member Services</h2>
            <div class="chart">
              <div class="chart-left">
                <div class="title">
                  <h3>Fuel Card:</h3>
                  <div class="image">
                    <!-- Insert fuel card image/icon here -->
                  </div>
                </div>
                <h4>Average discount 47¢ per gallon, up to $2.00 in certain markets</h4>
              </div>
              <div class="chart-right">
                <div class="link">
                  <!-- Optional link or call-to-action -->
                </div>
              </div>
            </div>
            <div class="chart">
              <div class="chart-left">
                <div class="title">
                  <h3>Factoring:</h3>
                  <div class="image">
                    <!-- Insert factoring image/icon here -->
                  </div>
                </div>
                <h4>1.5% factoring rate, payments in 90 minutes for most invoices</h4>
              </div>
              <div class="chart-right">
                <div class="link">
                  <!-- Optional link or call-to-action -->
                </div>
              </div>
            </div>
            <div class="chart">
              <div class="chart-left">
                <div class="title">
                  <h3>Maintenance:</h3>
                  <div class="image">
                    <!-- Insert maintenance image/icon here -->
                  </div>
                </div>
                <h4>Discounts on emergency roadside assistance 24/7, 365</h4>
              </div>
              <div class="chart-right">
                <div class="link">
                  <!-- Optional link or call-to-action -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Right Column: Savings Calculator -->
        <div id="right">
          <div id="savingsCalculator">
            <SavingsCalculator />
          </div>
        </div>
      </div>
      <!-- FAQ Section -->
      <div id="faq">
        <h3>FAQ</h3>
        <p>
          Participation in any and all member services are optional. You can opt in and out of any of the above services at your discretion. There are no volume commitments or long-term contracts required to participate. All offers above are valid only for qualifying carriers.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import SavingsCalculator from '@/components/SavingsCalculator.vue';
  
  export default {
    name: 'WhyDifferentTwo',
    components: {
      SavingsCalculator
    }
  }
  </script>
  
  <style scoped>
  /* Overall Container */
  #whyDifferentContainer {
    background-color: #073763;
    color: white;
    padding: 50px 20px;
    font-family: 'Open Sans', sans-serif;
  }
  
  /* Title Section */
  #title {
    text-align: center;
    margin-bottom: 40px;
  }
  #title h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  #title p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
  
  /* Columns Layout */
  #columns {
    display: flex;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto 40px;
  }
  #left, #right {
    flex: 1;
  }
  
  /* Left Column (Charts) Card */
  #left {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 8px;
  }
  #chart h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: #fff;
  }
  
  /* Chart Styling */
  .chart {
    display: flex;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .chart-left {
    flex: 1;
  }
  .chart-left .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .chart-left h3 {
    font-size: 1.2rem;
    margin-right: 10px;
    color: #fff;
  }
  .chart-left .image {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 50%;
  }
  .chart-left h4 {
    font-size: 1rem;
    margin: 0;
    line-height: 1.4;
    color: #fff;
  }
  .chart-right {
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Right Column (Savings Calculator) Card */
  #right {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 8px;
  }
  #savingsCalculator {
    background-color: #fff;
    color: #073763;  /* Dark text for readability */
    padding: 20px;
    border-radius: 8px;
  }
  
  /* FAQ Section */
  #faq {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  #faq h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  #faq p {
    font-size: 1rem;
    line-height: 1.5;
  }
  </style>
  