<template>
  <div id="memberServicesContainer">
    <!-- Top Banner -->
    <div id="topBanner">
      <h3>$0 Membership Fee</h3>
    </div>

    <!-- Main Columns -->
    <div id="columns">
      <!-- Left Column -->
      <div id="left">
        <!-- Left Media (Placeholder image; update src as needed) -->
        <div id="leftMedia">
          <img src="../assets/placeholderMedia.png" alt="Media">
        </div>
        <!-- Fuel Card Info -->
        <div id="leftFuelCard">
          <h4>Our Fuel Card</h4>
          <ul>
            <li>98% Credit Approval</li>
            <li>Over 2,000 Locations</li>
            <li>Highest Rated Customer Support</li>
            <li>Never Any Extra Fees</li>
          </ul>
        </div>
        <!-- Better Option Section -->
        <div id="leftBetterOption">
          <h1>There is a better option...</h1>
          <div id="betterImages">
            <img src="../assets/optionImage.png" alt="Better Option">
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div id="right">
        <div id="rightContent">
          <h2>Best Fuel Card for Companies with</h2>
          <h1>50 Trucks or Less</h1>
        </div>
        <div id="cardEmbedForm">
          <!-- Placeholder Form -->
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Get Started</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Fuel Card Ads Section -->
    <div id="fuelCardAds">
      <div id="fuelCardImg">
        <img src="../assets/fuelCardAd.png" alt="Fuel Card Ad">
      </div>
      <div id="fuelCardText">
        <ul>
          <li>Flexible Terms: No long-term agreements, contracts, or volume commitments to join.</li>
          <li>Free For Members: Never get charged any membership, transaction, or hidden fees.</li>
          <li>A Carrier Driven Org: Passing the largest savings to our carriers of any other program.</li>
        </ul>
      </div>
      <div id="commitment">
        <Commitment />
      </div>
    </div>
  </div>
</template>

<script>
import Commitment from '@/components/Commitment.vue'

export default {
  name: 'members',
  components: {
    Commitment
  },
}
</script>

<style scoped>
/* Overall Container */
#memberServicesContainer {
  background-color: #fff; /* Main page white background */
  color: #073763;
  padding: 40px 20px;
  font-family: 'Open Sans', sans-serif;
}

/* Top Banner */
#topBanner {
  background-color: #ff6600;
  color: #fff;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
}
#topBanner h3 {
  font-size: 1.8rem;
  margin: 0;
}

/* Main Columns Layout */
#columns {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto 40px;
}

/* Left Column */
#left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Left Media */
#leftMedia {
  display: flex;
  justify-content: center;
  align-items: center;
}
#leftMedia img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Fuel Card Info */
#leftFuelCard {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}
#leftFuelCard h4 {
  margin-bottom: 10px;
  font-size: 1.4rem;
}
#leftFuelCard ul {
  list-style: disc;
  padding-left: 20px;
  font-size: 1rem;
  margin: 0;
}

/* Better Option Section */
#leftBetterOption {
  text-align: center;
}
#leftBetterOption h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}
#betterImages {
  display: flex;
  justify-content: center;
}
#betterImages img {
  max-width: 80%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* Right Column */
#right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Right Content */
#rightContent {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
#rightContent h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
}
#rightContent h1 {
  font-size: 2rem;
  margin: 0;
}

/* Card Embed Form */
#cardEmbedForm {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
}
#cardEmbedForm form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
#cardEmbedForm input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
#cardEmbedForm button {
  background-color: #ff6600;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
#cardEmbedForm button:hover {
  background-color: #e65c00;
}

/* Fuel Card Ads Section */
#fuelCardAds {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}
#fuelCardImg {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
#fuelCardImg img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
#fuelCardText {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
#fuelCardText ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  font-size: 1rem;
}
#fuelCardText li {
  margin-bottom: 10px;
}

/* Commitment Section */
#commitment {
  width: 100%;
  margin-top: 20px;
}
</style>
