<template>
  <div id="differentContainer">
    <!-- Section Header -->
    <div id="sectionHeader">
      <h2>Major Fuel Discounts</h2>
    </div>
    
    <!-- Columns Layout -->
    <div id="columns">
      <!-- Left side: Partner Icons and Discount Line -->
      <div id="left">
        <div id="icons">
          <img
            v-for="(icon, idx) in partnerIcons"
            :key="idx"
            :src="icon.src"
            :alt="icon.alt"
            class="partner-icon"
          />
        </div>
        <div id="discountLine">
          $0.60 - $2.00 Off At Hundreds of Locations
        </div>
      </div>

      <!-- Right side: Card Screenshot & Features -->
      <div id="right">
        <div id="cardContainer">
          <img src="@/assets/atobCardScreenShot.png" alt="Haulers United Card" />
        </div>
        <ul id="features">
          <li>Over 3,000 Locations</li>
          <li>98% Credit Approval</li>
          <li>$0 in account or transaction fees</li>
          <li>Prepaid options available</li>
          <li>Advanced fleet management features</li>
        </ul>
        <img id="addPhoto" src="@/assets/happyFlanel.png" alt="Happy Flanel" />
      </div>
    </div>
  </div>
</template>

<script>
// Import all partner logos
import allSups from '@/assets/allSups.svg'
import sheetz from '@/assets/sheetz.svg'
import caseys from '@/assets/caseys.svg'
import maverik from '@/assets/maverik.svg'
import yesWay from '@/assets/yesWay.svg'
import raceTrac from '@/assets/raceTrac.svg'
import raceWay from '@/assets/raceWay.svg'
import circleK from '@/assets/circleK.svg'
import ta from '@/assets/ta.svg'
import petro from '@/assets/petro.svg'
import sevenFleet from '@/assets/7Fleet.svg'
import speedWay from '@/assets/speedWay.svg'
import kwikTrip from '@/assets/kwikTrip.svg'
import roadys from '@/assets/roadys.svg'
import sappBros from '@/assets/sappBros.svg'

export default {
  name: 'WhyDifferentOne',
  data() {
    return {
      partnerIcons: [
        { src: allSups,    alt: 'Allsups' },
        { src: sheetz,     alt: 'Sheetz' },
        { src: caseys,     alt: 'Casey’s' },
        { src: maverik,    alt: 'Maverik' },
        { src: yesWay,     alt: 'YesWay' },
        { src: raceTrac,   alt: 'RaceTrac' },
        { src: raceWay,    alt: 'RaceWay' },
        { src: circleK,    alt: 'Circle K' },
        { src: ta,         alt: 'TA' },
        { src: petro,      alt: 'Petro' },
        { src: sevenFleet, alt: '7Fleet' },
        { src: speedWay,   alt: 'SpeedWay' },
        { src: kwikTrip,   alt: 'KwikTrip' },
        { src: roadys,     alt: 'Roadys' },
        { src: sappBros,   alt: 'Sapp Bros' }
      ]
    }
  }
}
</script>

<style scoped>
/* Container */
#differentContainer {
  background-color: #ffffff;
  color: #0c2442;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

/* Section Header */
#sectionHeader h2 {
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Columns */
#columns {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
}
#left, #right {
  flex: 1;
  min-width: 280px;
  padding: 20px;
}

/* Left: icons and discount */
#left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Partner Icons Grid */
#icons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: center;
}
.partner-icon {
  max-width: 80px;
  height: auto;
}

/* Discount Line */
#discountLine {
  margin-top: 20px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  color: #b11818;
}

/* Card Container */
#cardContainer {
  text-align: center;
  margin-bottom: 20px;
}
#cardContainer img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Features List */
#features {
  list-style: none;
  padding: 0;
}
#features li {
  font-size: 1rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
#features li::before {
  content: '✔️';
  margin-right: 10px;
  color: #b11818;
}
</style>
