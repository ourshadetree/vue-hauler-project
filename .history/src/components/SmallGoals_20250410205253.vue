<template>
  <div id="techDrivenContainer">
    <!-- Main Title -->
    <h2 class="main-heading">A Technology-Driven Association</h2>

    <div class="content-wrapper">
      <!-- LEFT COLUMN: Member Services Box -->
      <div id="left">
        <div id="chart">
          <h2>Member Services</h2>
          <div class="chart">
            <div class="chart-left">
              <div class="title">
                <h3>Fuel Card:</h3>
                <div class="image">
                  <!-- Insert fuel card image/icon here -->
                </div>
              </div>
              <h4>Average discount 47¢ per gallon, up to $2.00 in certain markets</h4>
            </div>
            <div class="chart-right">
              <div class="link">
                <!-- Optional link or call-to-action -->
              </div>
            </div>
          </div>
          <div class="chart">
            <div class="chart-left">
              <div class="title">
                <h3>Factoring:</h3>
                <div class="image">
                  <!-- Insert factoring image/icon here -->
                </div>
              </div>
              <h4>1.5% factoring rate, payments in 90 minutes for most invoices</h4>
            </div>
            <div class="chart-right">
              <div class="link">
                <!-- Optional link or call-to-action -->
              </div>
            </div>
          </div>
          <div class="chart">
            <div class="chart-left">
              <div class="title">
                <h3>Maintenance:</h3>
                <div class="image">
                  <!-- Insert maintenance image/icon here -->
                </div>
              </div>
              <h4>Discounts on emergency roadside assistance 24/7, 365</h4>
            </div>
            <div class="chart-right">
              <div class="link">
                <!-- Optional link or call-to-action -->
              </div>
            </div>
          </div>
        </div>
        <button class="join-button" @click="openModal(SignUpForm)">Join Now</button>
      </div>

      <!-- RIGHT COLUMN: Explanatory Text -->
      <div class="info-text-container">
        <p class="highlight-text">
          Big fleets get all the best discounts and rates while small carriers
          are stuck paying the premiums.
        </p>
        <p>
          Alone, we don't have the leverage to negotiate the rates per mile or
          discounts we need to thrive.
        </p>
        <p>
          Haulers United is building foundational infrastructure for small
          carriers to gain leverage.
        </p>
        <p class="savings">
          <strong>Monthly Savings: Over $1,000 per Truck</strong>
        </p>
        <img src="@/assets/rally.png" alt="Rally Image" />
      </div>
    </div>

    <!-- Existing Modal & Sign-Up Form from the old component -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import SignUpForm from "@/components/SignUpForm.vue";

export default {
  name: "SmallGoals", // or rename as you wish
  components: {
    Modal,
    SignUpForm,
  },
  data() {
    return {
      activeModal: "", // Controls which modal (SignUp or SignIn) is open
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
/* Outer container for the entire section */
#techDrivenContainer {
  width: 100%;
  background-color: #0C2442;
  color: white;
  font-family: "Karla", sans-serif;
  padding: 40px;
  border-radius: 10px;
  position: relative;
}

/* Main heading */
.main-heading {
  font-family: "Sora", sans-serif;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

/* Wrapper that holds both columns (Member Services + Info Text) */
.content-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

/* Left column: the Member Services box */
.member-services-container {
  flex: 0 0 45%;
  max-width: 45%;
}

.member-services-box {
  background-color: #f5f5f5; /* Light Grey */
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-services-box h3 {
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #0C2442;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li {
  margin-bottom: 10px;
  line-height: 1.4;
}

/* Join Now button */
.join-now-button {
  background-color: #b11818; /* Red accent */
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s;
}
.join-now-button:hover {
  background-color: #8f1212;
  transform: scale(1.05);
}

/* Right column: the explanatory text */
.info-text-container {
  flex: 0 0 50%;
  max-width: 50%;
  line-height: 1.6;
}

.highlight-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.savings {
  margin-top: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #b11818;
}

.info-text-container img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 20px;
}

/* Left Column (Charts) Card */
#left {
  background-color: #F5F5F5; /* Light grey to separate the card */
  padding: 20px;
  width: 100%;
  border-radius: 8px;
}
#chart h2 {
  text-align: center;
  font-family: Sora, sans-serif;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #0C2442;
}

/* Chart Styling */
.chart {
  display: flex;
  background-color: #FFFFFF; /* White card for each chart */
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart:hover {
  background-color: #F5F5F5;
}
.chart-left {
  flex: 1;
}

.chart-left .title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.chart-left h3 {
  font-family: Sora, sans-serif;
  font-size: 1.2rem;
  margin-right: 10px;
  color: #0C2442;
}
.chart-left .image {
  width: 40px;
  height: 40px;
  background-color: #E5E5E5;
  border-radius: 50%;
}
.chart-left h4 {
  font-size: 1rem;
  margin: 0;
  line-height: 1.4;
  color: #0C2442;
}
.chart-right {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-right p {
  font-size: 0.9rem;
  color: #0C2442;
}

/* Join Now Button */
#joinNowButton {
  background-color: #B11818;  /* Accent Red */
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
#joinNowButton:hover {
  background-color: #a01015;
  transform: scale(1.05);
}
</style>
