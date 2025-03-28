<template>
  <div id="memberServicesContainer">
    <div id="topBanner">
      <h3>$0 Membership Fee</h3>
    </div>
    <div id="columns">
      <div id="left">
        <div id="leftMedia">
          
        </div>
        <div id="leftFuelCard">
          <ul>Our Fuel Card</ul>
            <li>98% Credit Approval</li>
            <li>Over 2,000 Locations</li>
            <li>Highest Rated Customer Support</li>
            <li>Never Any Extra Fees</li>
        </div>
        <div id="leftBetterOption">
          <h1>There is a better option...</h1>
          <div id="betterImages">

          </div>
        </div>
      </div>
      <div id="right">
        <div id="rightContent">
          <h2>Best Fuel Card for Companies with</h2>
          <h1>50 Trucks or Less</h1>
        </div>
        <div id="cardEmbedForm">

        </div>
      </div>
    </div>
    <div id="fuelCardAds">
      <div id="fuelCardImg">

      </div>
      <div id="fuelCardText">
        <ul></ul>
          <li>Flexible Terms: No long-term agreements, contracts, or volume commitments to join.</li>
          <li>Free For Members: Never get charged any membership, transaction, or hidden fees.</li>
          <li>A Carrier Driven Org: Passing the largest savings to our carriers of any other program.</li>
      </div>
      <div id="commitment">
        <Commitment />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MembersView',

  components: {
    Commitment
  },
}

</script>

<style scoped>

</style>