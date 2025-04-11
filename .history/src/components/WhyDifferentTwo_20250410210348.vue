<template>
  <div id="whyDifferentContainer">
    <!-- Title Section -->
    <div id="title">
      <h1>2. Full Service Package for Owner Operators</h1>
      <p>
        We partner with fast-moving, technology-focused companies to bring you a full suite of essential services at premium pricing. Additionally, we only work with partners who value customer support. Don't get left on hold for hours when you need help now.
      </p>
    </div>

    <!-- Two Column Layout -->
    <div id="columns">
      <!-- Left Column: Display the Key Image -->
      <div id="left">
        <div id="imageContainer">
          <img src="@/assets/happyThumbs.png" alt="Member Services - Happy Thumbs" />
        </div>
      </div>

      <!-- Right Column: Savings Calculator -->
      <div id="right">
        <div id="savingsCalculator">
          <SavingsCalculator />
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div id="faq">
      <h3>FAQ</h3>
      <p>
        Participation in any and all member services is optional. You can opt in and out of any of the above services at your discretion. There are no volume commitments or long-term contracts required to participate. All offers above are valid only for qualifying carriers.
      </p>
    </div>
  </div>
</template>

<script>
import SavingsCalculator from '@/components/SavingsCalculator.vue';

export default {
  name: 'WhyDifferentTwo',
  components: {
    SavingsCalculator
  }
}
</script>

<style scoped>
/* Overall Container: Dark background with white text */
#whyDifferentContainer {
  background-color: #0C2442; /* Dark Blue background */
  color: #FFFFFF;            /* White text */
  padding: 50px 20px;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Title Section */
#title {
  text-align: center;
  margin-bottom: 40px;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #FFFFFF;
}
#title p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #FFFFFF;
}

/* Columns Layout */
#columns {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto 40px;
}
#left, #right {
  flex: 1;
}

/* Left Column - Image Container Styling */
#left {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF; /* White background for contrast */
  padding: 20px;
  border-radius: 8px;
}
#imageContainer {
  width: 100%;
  text-align: center;
}
#imageContainer img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Right Column - Savings Calculator */
#right {
  background-color: #FFFFFF; /* White background */
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#savingsCalculator {
  width: 100%;
  color: #0C2442;  /* Dark Blue for readability inside the calculator */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* FAQ Section */
#faq {
  background-color: #F5F5F5;
  color: #0C2442;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}
#faq h3 {
  font-family: Sora, sans-serif;
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #0C2442;
}
#faq p {
  font-size: 1rem;
  line-height: 1.5;
  color: #0C2442;
}
</style>
