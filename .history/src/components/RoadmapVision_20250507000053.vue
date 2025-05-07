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

      <!-- Bullet items -->
      <ul v-if="phases[activePhase].items && phases[activePhase].items.length">
        <li v-for="(item, idx) in phases[activePhase].items" :key="idx">{{ item }}</li>
      </ul>

      <!-- Description -->
      <p>{{ phases[activePhase].description }}</p>

      <!-- Progress bar for Phase 1 & 2 -->
      <div v-if="activePhase === 0 || activePhase === 1" class="progress-wrapper">
        <div class="progress-label">
          {{ totalTrucks }} / {{ activePhase === 0 ? 8000 : 20000 }} Trucks
        </div>
        <div class="progress-container">
          <div 
            class="progress-bar" 
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- Stats display for Phase 2 (if desired) -->
      <div v-if="activePhase === 1 && phases[1].stats" class="stats">
        <p 
          v-for="(stat, idx) in phases[1].stats" 
          :key="idx" 
          class="trucks"
        >
          {{ stat }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabaseClient'
import happyThumbs from '@/assets/happyThumbs.png'

export default {
  name: 'RoadmapVision',
  data() {
    return {
      activePhase: 0,
      totalTrucks: 0,
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
        },
        {
          label: 'Phase 2',
          title: 'Phase 2: Coming together on a unified open‑source network',
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
        }
      ]
    }
  },
  computed: {
    // Calculate progress percentage based on current phase
    progressPercent() {
      const max = this.activePhase === 0 ? 8000 : 20000
      return Math.min(100, Math.round((this.totalTrucks / max) * 100))
    }
  },
  async mounted() {
    // Fetch total number_of_trucks sum from Supabase
    const { data, error } = await supabase
      .from('current_members')
      .select('number_of_trucks')
    if (!error && data) {
      this.totalTrucks = data.reduce(
        (sum, row) => sum + (row.number_of_trucks || 0),
        0
      )
    } else {
      console.error('Error fetching truck totals:', error)
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

/* Progress Bar Styles */
.progress-wrapper {
  margin-top: 20px;
}
.progress-label {
  font-weight: bold;
  margin-bottom: 8px;
}
.progress-container {
  width: 100%;
  background-color: #e6e6e6;
  border-radius: 10px;
  overflow: hidden;
  height: 20px;
}
.progress-bar {
  height: 100%;
  background-color: #b11818;
  transition: width 0.4s ease;
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