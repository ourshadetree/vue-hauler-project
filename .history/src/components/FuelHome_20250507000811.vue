<template>
    <div class="fuel-home-container">
        <div class="fuelTopContent">
            <div class="topLeft">
                <img src="@/assets/happyThumbs.png" alt="Happy Trucker Picture" />
            </div>
            <div class="topRight">
                <h3>Best Fuel Card for Companies</h3>
                <h1>50 Trucks or Less</h1>
                <h4>A fuel program built by carriers, for carries.</h4>
                <h4>Our discounts get bigger as we grow together.</h4>
                <h4>Every member makes a difference.</h4>
                <h4>Why go it alone?</h4>
            </div>
        </div>
        <div class="promoDiv1">
            <h1>Our Fuel Card</h1>
            <h3>98% Credit Approval</h3>
            <h3>Over 3,000 Locations</h3>
            <h3>Highest Rated Customer Support</h3>
            <h3>Never any extra fees</h3>
        </div>
        <div class="promoDiv2">
            <h3>There is a better option...</h3>
        </div>
        <WhyDifferentOne />
        <Commitment />
        <Contact />
    </div>
</template>

<script>
import NewUserSalesMap from "@/components/NewUserSalesMap.vue";
import Commitment from "@/components/Commitment.vue";
import Contact from "@/components/Contact.vue";
import WhyDifferentOne from "@/components/WhyDifferentOne.vue";

export default {
    name: "FuelHome",
    components: {
        NewUserSalesMap,
        Commitment,
        Contact,
        WhyDifferentOne
    }
};
</script>

<style scoped>
.fuel-home-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: Arial, sans-serif;
  color: #0C2442;
}

/* 1) HERO / TOP CONTENT */
.fuelTopContent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 2rem;
}
.topLeft,
.topRight {
  flex: 1 1 300px;
}
.topLeft img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.topRight h3 {
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
  color: #b11818;
}
.topRight h1 {
  margin: 0.5rem 0;
  font-size: 2.5rem;
}
.topRight h4 {
  margin: 0.25rem 0;
  font-size: 1rem;
  color: #555;
}

/* 2) PROMO BANNER */
.promoDiv1 {
  background-color: #f7f7f7;
  text-align: center;
  padding: 2rem 1rem;
}
.promoDiv1 h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #b11818;
}
.promoDiv1 h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

/* 3) SECONDARY TEASER */
.promoDiv2 {
  background-color: #eaeef3;
  text-align: center;
  padding: 1.5rem 1rem;
  font-style: italic;
}
.promoDiv2 h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #0C2442;
}

/* 5) SPACING FOR COMMITMENT & CONTACT */
.commitment,
.contact,
.whyDifferentOne {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

/* 6) RESPONSIVE TWEAKS */
@media (max-width: 768px) {
  .fuelTopContent,
  .ourNetwork {
    flex-direction: column;
  }
}
</style>
