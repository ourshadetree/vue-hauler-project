<template>
  <div id="roadmapContainer">
    <!-- Header Section with Image -->
    <div id="headerImage">
      <img src="@/assets/happyThumbs.png" alt="Happy Thumbs" />
    </div>

    <!-- Title Section -->
    <div id="title">
      <h1>Roadmap: The Long Haul</h1>
    </div>

    <!-- Navigation: Clickable Phase Titles -->
    <div id="phaseNav">
      <button 
        v-for="(phase, index) in phases" 
        :key="index"
        :class="{'active': activePhase === index}"
        @click="activePhase = index">
        {{ phase.label }}
      </button>
    </div>

    <!-- Active Phase Details -->
    <div id="phaseDetails" class="phaseBox">
      <h2>{{ phases[activePhase].title }}</h2>
      <!-- If list items exist, display them -->
      <ul v-if="phases[activePhase].items && phases[activePhase].items.length">
        <li v-for="(item, idx) in phases[activePhase].items" :key="idx">{{ item }}</li>
      </ul>
      <p>{{ phases[activePhase].description }}</p>
      <!-- Some phases have additional info, like progress text or statistics -->
      <p v-if="phases[activePhase].extra" class="extra">{{ phases[activePhase].extra }}</p>
      <div v-if="phases[activePhase].stats" class="stats">
        <p v-for="(stat, idx) in phases[activePhase].stats" :key="idx" class="trucks">{{ stat }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import happyThumbs from '@/assets/happyThumbs.png'

export default {
  name: 'RoadmapVision',
  data() {
    return {
      activePhase: 0,
      // Array with phase data
      phases: [
        {
          label: 'Phase 1',
          title: 'Phase 1: Uniting the 99% through volume discounts',
          items: [
            'Fuel Card',
            'Factoring',
            'Roadside Assistance',
            'ELDs',
            'Insurance'
          ],
          description: `Once all expenses are tackled, our primary goal will be to increase our
          collective purchasing volume with the biggest benefits for all members to
          benefit from.`,
          extra: 'Progress to starting phase 2'
        },
        {
          label: 'Phase 2',
          title: 'Phase 2: Coming together on a unified open‑source network',
          // No bullet list for phase 2 in this example
          description: `Once we have enough coverage nationwide, the association will approach shippers
          directly to reduce all expenses, building on a network of carriers without a
          brokerage fee.`,
          stats: [
            '1,176 Trucks',
            '20,000 Trucks'
          ]
        },
        {
          label: 'Phase 3',
          title: 'Phase 3: Stabilizing Industry Rates',
          description: `A small story about how the rate will be determined, how technology can easily
          replace brokers, and how eliminating rate variation between carriers and brokers
          will stabilize the market.`,
          // No extra info for Phase 3
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Overall Container with white background and dark text */
#roadmapContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #FFFFFF;
  color: #0C2442;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Header image */
#headerImage {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
#headerImage img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* Title Section */
#title {
  text-align: center;
  margin-bottom: 30px;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 2.4rem;
  margin-bottom: 10px;
  color: #0C2442;
}

/* Phase Navigation (Tabs) */
#phaseNav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}
#phaseNav button {
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  padding: 10px 20px;
  color: #0C2442;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
#phaseNav button.active,
#phaseNav button:hover {
  background-color: #B11818;
  color: #fff;
}

/* Phase Details (Card) */
.phaseBox {
  background-color: #fff;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.phaseBox h2 {
  font-family: Sora, sans-serif;
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #0C2442;
}
.phaseBox ul {
  list-style: disc;
  margin-left: 20px;
  margin-bottom: 10px;
  color: #0C2442;
}
.phaseBox p {
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #0C2442;
}
/* Emphasis styles */
.extra {
  font-weight: bold;
  color: #B11818;
}
.stats .trucks {
  font-weight: bold;
  color: #B11818;
  margin: 0;
}
</style>
