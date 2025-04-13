<template>
  <div class="roadmap-container">
    <!-- Title -->
    <h1 class="roadmap-title">Roadmap: The Long Haul</h1>

    <div class="roadmap-content">
      <!-- Left side: Phase tabs & Phase details -->
      <div class="roadmap-left">
        
        <!-- Phase Tabs -->
        <div class="phase-tabs">
          <!-- Phase 1 is 'active' -->
          <div class="tab active">Phase 1</div>
          <div class="tab">Phase 2</div>
          <div class="tab">Phase 3</div>
        </div>
        
        <!-- Phase 1 Content -->
        <h2 class="phase-heading">Uniting Carriers With Volume Discounts</h2>
        
        <!-- Checklist with green checks -->
        <ul class="checklist">
          <li><span class="check-icon">✔</span>Fuel Card</li>
          <li><span class="check-icon">✔</span>Factoring</li>
          <li><span class="check-icon">✔</span>Roadside Assistance</li>
          <li><span class="check-icon">✔</span>ELDs</li>
          <li><span class="check-icon">✔</span>Insurance</li>
        </ul>
        
        <!-- Progress bar / label -->
        <div class="progress-section">
          <p class="progress-label">Progress to Phase 2</p>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <p class="progress-count">{{ currentProgress }}/{{ maxProgress }}</p>
        </div>
      </div>

      <!-- Right side: Image -->
      <div class="roadmap-right">
        <img
          :src="happyThumbs"
          alt="Happy Trucker Thumbs Up"
          class="thumbs-img"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import happyThumbs from '@/assets/happyThumbs.png'

// Example progress out of 2000
const currentProgress = ref(1810)
const maxProgress = ref(2000)
const progressPercent = computed(() => {
  return Math.round((currentProgress.value / maxProgress.value) * 100)
})
</script>

<style scoped>
/* Overall container */
.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #0c2442;
}

/* Title styling */
.roadmap-title {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Content area: two columns */
.roadmap-content {
  display: flex;
  flex-wrap: wrap;   /* Let it wrap on small screens */
  gap: 20px;
}

/* Left column (phase info) */
.roadmap-left {
  flex: 1;
  min-width: 300px;
}

/* Phase tabs */
.phase-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.tab {
  padding: 10px 16px;
  border: 2px solid #b11818;
  border-radius: 4px;
  cursor: pointer;
  color: #b11818;
  font-weight: bold;
  background-color: #fff;
}
.tab.active {
  background-color: #b11818;
  color: #fff;
}

/* Phase heading */
.phase-heading {
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #0c2442;
}

/* Checklist with green checks */
.checklist {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}
.checklist li {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.check-icon {
  color: #3ab963;
  margin-right: 8px;
  font-weight: bold;
}

/* Progress bar & label */
.progress-section {
  margin-top: 15px;
}
.progress-label {
  font-weight: bold;
  color: #b11818;
  margin-bottom: 8px;
}
.progress-bar {
  width: 100%;
  height: 16px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-fill {
  height: 100%;
  background-color: #b11818;
  transition: width 0.3s ease;
}
.progress-count {
  font-size: 0.9rem;
  color: #333;
}

/* Right column (image) */
.roadmap-right {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumbs-img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}
</style>
