<template>
    <div class="factoring-container">
        <div class="zeroFeeHeader">

        </div>
        <div class="topContent">
            <div class="topLeft">
                <img src="@/assets/happyFlanel.png" alt="Happy Flanel" />
            </div>
            <div class="topRight">
                <h1>Best Factor</h1>
                <h3>for companies running between</h3>
                <h1>1 to 50 trucks</h1>
            </div>
        </div>
        <div class="promoDiv1">
            <h2>Offering a</h2>
            <h1>1.5% Rate</h1>
            <h2>on factoring</h2>
        </div>
        <div class="promoDiv2">
            <h2>Get Paid in</h2>
            <h1>90 minutes</h1>
            <h2>or less</h2>
        </div>
        <div class="promoDiv3">
            <h2>Work with the best</h2>
            <h1>Outgo</h1>
            <h3>The Terms are Simple</h3>
            <ul>
                <li>No sign up costs</li>
                <li>No reserve requirements</li>
                <li>No driver recourse</li>
                <li>No long-term contracts</li>
                <li>No more headaches!</li>
            </ul>    
        </div> 
        <div class="disclaimer">
            <p>Outgo Inc is a financial technology company, and is not a bank. Banking services provided by TransPecos Banks, SSB, Members FDIC. Learn more at Outgo.com and Outgo.com/legal.</p>
        </div>
        <Commitment />
        <Contact />   
    </div>
</template>

<script>
import Commitment from '@/components/Commitment.vue'
import Contact from '@/components/Contact.vue'

export default {
    name: 'factoringView',
    components: {
        Commitment,
        Contact
    }
}

</script>

<style scoped>
.factoring-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: Arial, sans-serif;
  color: #0c2442;
}

/* 1) ZERO‐FEE HEADER */
.zeroFeeHeader {
  background-color: #b11818;
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1rem;
}

/* 2) TOP CONTENT: two‐column hero */
.topContent {
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

.topRight h1 {
  margin: 0.2rem 0;
  font-size: 2rem;
}

.topRight h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #555;
}

/* 3) PROMO DIVS: highlight key stats */
.promoDiv1,
.promoDiv2 {
  text-align: center;
  padding: 2rem 1rem;
}

.promoDiv1 {
  background-color: #f7f7f7;
}

.promoDiv2 {
  background-color: #eaeef3;
}

.promoDiv1 h1,
.promoDiv2 h1 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
  color: #b11818;
}

/* 4) PROMO DIV 3: features list */
.promoDiv3 {
  background-color: #fff;
  padding: 2rem 1rem;
  text-align: center;
}

.promoDiv3 h1 {
  margin: 0.5rem 0;
  font-size: 2rem;
  color: #0c2442;
}

.promoDiv3 h3 {
  margin: 0.5rem 0 1rem;
  font-size: 1.1rem;
  color: #555;
}

.promoDiv3 ul {
  list-style: none;
  padding: 0;
  margin: 1rem auto;
  max-width: 400px;
}

.promoDiv3 ul li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
}

/* 5) DISCLAIMER */
.disclaimer {
  font-size: 0.8rem;
  color: #666;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #ddd;
}

/* 6) COMPONENT SPACING */
.commitment,
.contact {
  margin-top: 2rem;
}
</style>
