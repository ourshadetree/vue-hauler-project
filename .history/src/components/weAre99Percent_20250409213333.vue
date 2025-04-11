<template>
  <div class="outer-container">
    <!-- Hero row across the top -->
    <div class="hero-row">
      <div class="dot-search-bar">
        <h2>Enter DOT Number to Get Started</h2>
        <div class="search-inputs">
          <input
            type="text"
            v-model="dotNumber"
            placeholder="Enter DOT number"
            class="dot-input"
          />
          <button @click="onDotSearch" class="dot-search-button">Search</button>
        </div>
      </div>
    </div>

    <!-- Main content row: left = text/stats, right = map & tools -->
    <div class="content-row">
      <div class="left-stats">
        <h1 class="main-heading">We Are the 95%</h1>
        <h3>Coming together to compete with the largest fleets.</h3>
        <h2>1,180 Trucks</h2>

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

        <p class="final-message">
          Join the movement to access discounts and opt-in to our automated load-matching service.
        </p>
      </div>

      <div class="right-map">
        <NewUserSalesMap />
        <SalesMapNavTools />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NewUserSalesMap from './NewUserSalesMap.vue'
import SalesMapNavTools from './SalesMapNavTools.vue'

// Reactive state for user input DOT number
const dotNumber = ref('')

// Initialize progress for Goal 1 by default (15%)
const currentProgress = ref(15)

// Handle DOT search (placeholder example)
function onDotSearch() {
  console.log('DOT Search for:', dotNumber.value)
}

// Update the progress bar when a goal is clicked
function setGoalProgress(value) {
  currentProgress.value = value
}
</script>

<style scoped>
/* Outer container spans full width. */
.outer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  font-family: 'Karla', sans-serif;
}

/* Hero row: the top bar with the DOT input & search. */
.hero-row {
  width: 100%;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: center; /* center the content horizontally */
  align-items: center;
}

/* The DOT search bar content. */
.dot-search-bar {
  text-align: center;
}
.dot-search-bar h2 {
  font-family: 'Sora', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.search-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

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
  font-size: 1rem;
}
.dot-search-button:hover {
  background-color: #a00;
}

/* Main content row is a flex with left stats & right map. */
.content-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px;
}

/* Left side: the text/stats. */
.left-stats {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 10px;
}

/* Example headings & text. */
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

/* Goal Boxes Container */
#threeGoalBoxes {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

/* Each Goal Box Card */
.goalBoxContainer {
  background-color: #F5F5F5; /* Light Grey */
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

#threeGoalBoxes h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-family: 'Sora', sans-serif;
}

/* Circular Percentage Display */
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

/* The final message or CTA. */
.final-message {
  margin-top: 20px;
  font-size: 1.05rem;
  color: #0C2442;
  line-height: 1.4;
}

/* Right side: map content. */
.right-map {
  flex: 0 0 50%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
