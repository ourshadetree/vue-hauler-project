<template>
  <div id="differentContainer">
    <!-- Section Header -->
    <div id="sectionHeader">
      <h2>Major Fuel Discounts</h2>
    </div>
    
    <!-- Columns Layout -->
    <div id="columns">
      <!-- Left side: Partner Icons -->
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
  width: 100%;
  max-width: 1200px;
}
#left, #right {
  flex: 1;
  min-width: 280px;
  padding: 20px;
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

/* Card Container */
#cardContainer {
  text-align: center;
  margin-bottom: 20px;
}
#cardContainer img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  
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
