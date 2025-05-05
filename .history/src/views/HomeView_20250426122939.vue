<template>
  <div>
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
        <div id="whyDifferentOne">
          <WhyDifferentOne />
        </div>
        <div id="whyDifferentTwo">
          <WhyDifferentTwo />
        </div>
        <div id="roadMap">
          <RoadmapVision />
        </div>
        <div id="commitment">
          <Commitment />
        </div>
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="confirmation-overlay">
      <div class="confirmation-modal">
        <p>A confirmation email has been sent! 📧</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TopContent       from '@/components/TopContent.vue'
import weAre99Percent   from '@/components/weAre99Percent.vue'
import SmallGoals       from '@/components/SmallGoals.vue'
import WhyDifferentOne  from '@/components/WhyDifferentOne.vue'
import WhyDifferentTwo  from '@/components/WhyDifferentTwo.vue'
import RoadmapVision    from '@/components/RoadmapVision.vue'
import Commitment       from '@/components/Commitment.vue'
import Contact          from '@/components/Contact.vue'

const route  = useRoute()
const router = useRouter()
const showModal = ref(false)

onMounted(() => {
  if (route.query.signedUp === 'true') {
    showModal.value = true
  }
})

function closeModal() {
  showModal.value = false
  // clear the query so it won't reappear
  router.replace({ query: {} })
}
</script>

<style scoped>
/* … your existing styles … */

.confirmation-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.confirmation-modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  font-family: Arial, sans-serif;
}
.confirmation-modal p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.confirmation-modal button {
  padding: 0.5rem 1rem;
  background: #b11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
