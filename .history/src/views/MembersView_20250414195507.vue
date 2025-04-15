<template>
  <div id="memberServicesContainer">
    <atobEmbed />
  </div>
</template>

<script>
import Commitment from '@/components/Commitment.vue'
import atobEmbed from '@/components/atobEmbed.vue'

export default {
  name: 'members',
  components: {
    Commitment,
    atobEmbed
  },
}
</script>

<style scoped>
/* Overall Container: Blue background with white text */
#memberServicesContainer {
  background-color: #0C2442; /* Dark Blue background */
  color: #FFFFFF;
  padding: 40px 20px;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Top Banner */
#topBanner {
  background-color: #B11818; /* Accent Red */
  color: #fff;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 30px;
}
#topBanner h3 {
  font-family: Sora, sans-serif;
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

/* Left Media Placeholder */
#leftMedia {
  display: flex;
  justify-content: center;
  align-items: center;
}
.media-placeholder {
  width: 100%;
  height: 200px;
  background-color: #E5E5E5;
  color: #0C2442;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: Sora, sans-serif;
}

/* Fuel Card Info */
#leftFuelCard {
  background-color: #FFFFFF;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  color: #0C2442;
}
#leftFuelCard h4 {
  font-family: Sora, sans-serif;
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
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin-bottom: 10px;
  color: #FFFFFF;
}
#betterImages {
  display: flex;
  justify-content: center;
}
.option-placeholder {
  width: 80%;
  height: 150px;
  background-color: #E5E5E5;
  color: #0C2442;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: Sora, sans-serif;
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
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  color: #0C2442;
}
#rightContent h2 {
  font-family: Sora, sans-serif;
  font-size: 1.6rem;
  margin-bottom: 10px;
}
#rightContent h1 {
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin: 0;
}

/* Card Embed Form Placeholder */
#cardEmbedForm {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  text-align: center;
}
.form-placeholder {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  color: #0C2442;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
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
.ad-placeholder {
  width: 100%;
  height: 200px;
  background-color: #E5E5E5;
  color: #0C2442;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: Sora, sans-serif;
}
#fuelCardText {
  flex: 1;
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  color: #0C2442;
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
