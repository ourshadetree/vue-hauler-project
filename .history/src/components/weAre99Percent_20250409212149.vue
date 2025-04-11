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
        <h3>Coming together to compete with the largest fleets. 1,180 Trucks</h3>

        <!-- Example "goals" row -->
        <div class="goals-container">
          <div class="goal-box">
            <h4>Goal 1 (Werner & JB Hunt)</h4>
            <p>Some progress or percentage here</p>
          </div>
          <div class="goal-box">
            <h4>Goal 2 (Schneider)</h4>
            <p>Some progress or percentage here</p>
          </div>
          <div class="goal-box">
            <h4>Goal 3 (Knight Swift)</h4>
            <p>Some progress or percentage here</p>
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

/*
  Hard-coded dotNumber in the screenshot example.
  In a real app, you'd dispatch an action or make an API call once the user searches.
*/
const dotNumber = ref('')

function onDotSearch() {
  // Example: console.log or dispatch to store
  console.log('DOT Search for:', dotNumber.value)
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

/* Goals row. */
.goals-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.goal-box {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
  flex: 1;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.goal-box h4 {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #0C2442;
  font-weight: 600;
}
.goal-box p {
  font-size: 0.9rem;
  color: #333;
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

/* (We assume NewUserSalesMap & SalesMapNavTools handle their own sizing/styling) */

</style>
