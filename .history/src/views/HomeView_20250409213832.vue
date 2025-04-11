<template>
  <div id="topMessage">
    <div id="topContent">
      <TopContent />
    </div>
    <div id="99Percent">
      <weAre99Percent />
    </div>
    <div id="whyDifferentContainer">
      
      <div id="whyDifferentOne">
        <WhyDifferentOne />
      </div>
      <div id="whyDifferentTwo">
        <WhyDifferentTwo />
      </div>
      <div id="whyDifferentThree">
        <WhyDifferentThree />
      </div>
      <div id="roadMap">
        <RoadmapVision />
      </div>
      <div id="commitment">
        <Commitment />
      </div>
    </div>
    
    
  </div>
    
  
</template>

<script>
import TopContent from '../components/TopContent.vue'
import weAre99Percent from '../components/weAre99Percent.vue'
import WhyDifferentOne from '@/components/WhyDifferentOne.vue'
import WhyDifferentTwo from '@/components/WhyDifferentTwo.vue'
import WhyDifferentThree from '@/components/WhyDifferentThree.vue'
import RoadmapVision from '@/components/RoadmapVision.vue'
import Commitment from '@/components/Commitment.vue'

export default {
  components: {
    TopContent,
    weAre99Percent,
    WhyDifferentOne,
    WhyDifferentTwo,
    WhyDifferentThree,
    RoadmapVision,
    Commitment
  },
}

</script>

<style scoped>



</style>

