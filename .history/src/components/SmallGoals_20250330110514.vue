<template>
  <div id="smallGoalContainer">
    <!-- Section Header -->
    <div id="goalsHeader">
      <h2>United We Drive: Our Goals</h2>
    </div>
    <div id="left">
      <div id="threeGoalBoxes">
        <div class="goalBoxContainer">
          <h3>Goal 1</h3>
          <div class="goalBox">
            <h2>15%</h2>
          </div>
          <p>Werner &amp; J.B Hunt</p>
        </div>
        <div class="goalBoxContainer">
          <h3>Goal 2</h3>
          <div class="goalBox">
            <h2>10%</h2>
          </div>
          <p>Schneider</p>
        </div>
        <div class="goalBoxContainer">
          <h3>Goal 3</h3>
          <div class="goalBox">
            <h2>5%</h2>
          </div>
          <p>Knight-Swift</p>
        </div>
      </div>
  
      <div id="threeGoalBars">
        <div class="goalBar" data-label="Goal 1" data-value="8000 trucks"></div>
        <div class="goalBar" data-label="Goal 2" data-value="10000 trucks"></div>
        <div class="goalBar" data-label="Goal 3" data-value="20000 trucks"></div>
        <button id="joinButton">Join The Movement</button>
      </div>
    </div>
    <div id="right">
      <div id="achieveList">
        <h3>What We Will Achieve</h3>
        <ul>
          <li>Lower Operating Expenses</li>
          <li>Reduce Reliance on Brokers</li>
          <li>Stabilize Industry Rates</li>
        </ul>
      </div>
    </div>
    <!-- Modal for authentication forms -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>
  
<script>
import Modal from "@/components/Modal.vue";
import SignUpForm from "@/components/SignUpForm.vue";

export default {
  name: "SmallGoals",
  components: {
    Modal,
    SignUpForm,
  },
  data() {
    return {
      activeModal: "", // Will be set to "SignInForm" or "SignUpForm"
    };
  },
  methods: {
    openModal(formName) {
      this.activeModal = formName;
    },
  },
};
</script>
  
<style scoped>
/* Overall container with white background for content */
#smallGoalContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 40px;
  margin-top: 50px;
  border-radius: 10px;
  background-color: #FFFFFF; /* White background */
  font-family: 'Karla', sans-serif;
  color: #0C2442; /* Dark Blue text */
  position: relative;
}

/* Goals Section Header */
#goalsHeader {
  position: absolute;
  top: -60px;
  left: 20px;
}
#goalsHeader h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #0C2442;
}

/* Left and Right Sections */
#left, #right {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 20px;
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

/* Progress Bars Section */
#threeGoalBars {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  position: relative;
}
.goalBar {
  width: 80%;
  height: 20px;
  background-color: #E5E5E5; /* Grey for empty bar */
  margin: 15px 0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

/* Labels on progress bars using pseudo-elements */
.goalBar::before {
  content: attr(data-label);
  position: absolute;
  left: -150px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  font-size: 0.9rem;
  color: #0C2442;
}
.goalBar::after {
  content: attr(data-value);
  position: absolute;
  right: -160px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #0C2442;
}

/* For demonstration purposes, setting a dummy progress fill */
.goalBar {
  /* Example: 50% fill using Red and grey */
  background: linear-gradient(to right, #B11818 50%, #E5E5E5 50%);
}

/* Join Button styling */
#joinButton {
  background-color: #B11818; /* Red accent */
  color: #FFFFFF;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s;
  font-family: 'Sora', sans-serif;
}
#joinButton:hover {
  background-color: #8F1212;
  transform: scale(1.05);
}

/* Achieve List styling (Right Side) */
#achieveList {
  background-color: #F5F5F5; /* Light Grey */
  border: 1px solid #E5E5E5;
  border-radius: 10px;
  padding: 20px;
}
#achieveList h3 {
  margin-bottom: 15px;
  font-size: 1.4rem;
  font-family: 'Sora', sans-serif;
  color: #0C2442;
}
#achieveList ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#achieveList li {
  margin-bottom: 10px;
  position: relative;
  padding-left: 30px;
  font-size: 1rem;
  font-family: 'Karla', sans-serif;
  color: #0C2442;
}
#achieveList li::before {
  content: "\2713";
  position: absolute;
  left: 0;
  top: 0;
  color: #B11818;
  font-size: 1.2rem;
}
</style>
