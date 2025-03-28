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
    
  </div>
    
  
</template>

<script>
import TopContent from '../components/TopContent.vue'
import SmallGoals from '../components/SmallGoals.vue'
import weAre99Percent from '../components/weAre99Percent.vue'

export default {
  components: {
    TopContent,
    weAre99Percent,
    SmallGoals
  },
}

</script>

<style scoped>



</style>

