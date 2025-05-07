<template>
  <div class="outer-container">
    <!-- Hero row across the top -->
    <div class="hero-row">
      <ActionCall />
    </div>
    
    <!-- Main content row: left = text/stats, right = map & tools -->
    <div class="content-row">
      <div class="left-stats">
        <h1 class="main-heading">We Are the 95%</h1>
        <h3>Coming together to compete with the largest fleets.</h3>

        <!-- Live truck count -->
        <h2 class="truck-count">{{ formattedTrucks }} Trucks</h2>

        <!-- Progress Bar Container (dynamically updates) -->
        <div class="progress-container">
          <div
            class="progress-bar"
            :style="{ width: currentProgress + '%' }"
          ></div>
        </div>
        <p class="progress-text">{{ currentProgress }}% of This Goal</p>

        <!-- Example "goals" row -->
        <div id="threeGoalBoxes">
          <!-- Goal 1 -->
          <div class="goalBoxContainer" @click="setGoalProgress(15)">
            <h3>Goal 1</h3>
            <div class="goalBox">
              <h2>15%</h2>
            </div>
            <p>Werner &amp; J.B Hunt</p>
          </div>
          <!-- Goal 2 -->
          <div class="goalBoxContainer" @click="setGoalProgress(10)">
            <h3>Goal 2</h3>
            <div class="goalBox">
              <h2>10%</h2>
            </div>
            <p>Schneider</p>
          </div>
          <!-- Goal 3 -->
          <div class="goalBoxContainer" @click="setGoalProgress(5)">
            <h3>Goal 3</h3>
            <div class="goalBox">
              <h2>5%</h2>
            </div>
            <p>Knight-Swift</p>
          </div>
        </div>

        
      </div>

      <div class="right-map">
        <NewUserSalesMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NewUserSalesMap from './NewUserSalesMap.vue'
import ActionCall from './ActionCall.vue'
import { supabase } from '@/supabaseClient'  // adjust if you removed the @ alias

// Reactive state
const dotNumber = ref('')
const currentProgress = ref(15)
const totalTrucks = ref(0)

// Format with thousands separators
const formattedTrucks = computed(() =>
  totalTrucks.value.toLocaleString()
)

// Fetch and sum the truck counts on mount
onMounted(async () => {
  const { data, error } = await supabase
    .from('current_members')
    .select('number_of_trucks')

  if (error) {
    console.error('Error fetching truck count:', error)
    return
  }
  totalTrucks.value = data.reduce(
    (sum, row) => sum + (row.number_of_trucks || 0),
    0
  )
})

// Stub handlers (if you actually need them)
function onDotSearch() {
  console.log('DOT Search for:', dotNumber.value)
}
function setGoalProgress(value) {
  currentProgress.value = value
}
</script>

<style scoped>
.outer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  font-family: 'Karla', sans-serif;
}

.hero-row {
  width: 100%;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px;
}

.left-stats {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 10px;
}

.main-heading {
  font-family: 'Sora', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: #0C2442;
  margin-bottom: 10px;
}

.left-stats h3 {
  font-weight: 400;
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

/* New truck-count style */
.truck-count {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #0C2442;
  font-family: 'Sora', sans-serif;
}

/* Progress Bar Styles */
.progress-container {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #e6e6e6;
  border-radius: 10px;
  margin: 20px 0 10px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #b11818;
  transition: width 0.4s ease;
  border-radius: 10px;
}
.progress-text {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #0C2442;
  font-family: 'Sora', sans-serif;
}

#threeGoalBoxes {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.goalBoxContainer {
  background-color: #F5F5F5;
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  margin: 0 10px;
  text-align: center;
  transition: transform 0.3s;
  cursor: pointer;
}
.goalBoxContainer:hover {
  transform: translateY(-5px);
}

.goalBox {
  border: 2px solid #0C2442;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
}
.goalBox h2 {
  margin: 0;
  font-size: 2rem;
  color: #0C2442;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
}

.right-map {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Optional: style your ActionCall component slot if needed */
.dot-input {
  padding: 8px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.dot-search-button {
  padding: 8px 12px;
  background-color: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.dot-search-button:hover {
  background-color: #a00;
}
</style>
