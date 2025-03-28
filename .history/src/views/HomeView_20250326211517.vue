<template>
  <div id="topMessage">
    <div id="topContent">
      <TopContent />
    </div>
    <div id="99Percent">
      <weAre99Percent />
    </div>
    <div id="smallGoal">
      <SmallGoals />
    </div>
    <div id="whyDifferentContainer">
      <div id="title">
        <h1>Why It Works</h1>
      </div>
      <div id="whyDifferentOne">
        <WhyDifferentOne />
      </div>
      <div id="whyDifferentTwo">
        <WhyDifferentTwo />
      </div>
      <div id="whyDifferentThree">
        <WhyDifferentThree />
      </div>
    </div>
    
    
  </div>
    
  
</template>

<script>
import TopContent from '../components/TopContent.vue'
import SmallGoals from '../components/SmallGoals.vue'
import weAre99Percent from '../components/weAre99Percent.vue'
import WhyDifferentOne from '@/components/WhyDifferentOne.vue'
import WhyDifferentTwo from '@/components/WhyDifferentTwo.vue'
import WhyDifferentThree from '@/components/WhyDifferentThree.vue'

export default {
  components: {
    TopContent,
    weAre99Percent,
    SmallGoals,
    WhyDifferentOne,
    WhyDifferentTwo,
    WhyDifferentThree
  },
}

</script>

<style scoped>



</style>

