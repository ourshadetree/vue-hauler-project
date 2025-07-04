<!-- src/components/FriendReferral.vue -->
<template>
  <div class="friend-referral-container">
    <!-- Invite Widget -->
    <div class="widget">
      <CrewWidget />
    </div>

    <!-- Info Section (always visible) -->
    <div class="info-section">
      <h2>Why go it alone?</h2>
      <div class="benefits">
        <div class="benefit-box delay-1">
          <FuelIcon class="icon" />
          <h3>Power at the Pump</h3>
          <p>The more carriers in the group, the better deals we can negotiate.</p>
        </div>
        <div class="benefit-box delay-2">
          <TrophyIcon class="icon" />
          <h3>Help Your Friends</h3>
          <p>Unlock the power of thousands of trucks for you and your crew.</p>
        </div>
        <div class="benefit-box delay-3">
          <HandshakeIcon class="icon" />
          <h3>Get Your Own Deals</h3>
          <p>Combine volume with friends to help us get deals where YOU want.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Fuel as FuelIcon,
  Trophy as TrophyIcon,
  Handshake as HandshakeIcon
} from 'lucide-vue-next'
import CrewWidget from '@/components/CrewWidget.vue'

export default {
  name: "FriendReferral",
  components: {
    CrewWidget,
    FuelIcon,
    TrophyIcon,
    HandshakeIcon
  }
}
</script>

<style scoped>
.friend-referral-container {
  background-color: #0C2442;
  color: #fff;
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Karla', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Widget Styles --- */
.widget {
  width: 100%;
  max-width: 480px;
  margin-bottom: 3rem;
}

/* --- Info Section --- */
.info-section {
  width: 100%;
  max-width: 800px;
  text-align: center;
}
.info-section h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

/* Benefits Grid */
.benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .benefits {
    flex-direction: row;
    justify-content: center;
  }
}

.benefit-box {
  background-color: #fff;
  color: #0C2442;
  border-radius: 0.75rem;
  padding: 1.5rem;
  flex: 1;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}
.benefit-box.delay-1 { animation-delay: 0.1s; }
.benefit-box.delay-2 { animation-delay: 0.2s; }
.benefit-box.delay-3 { animation-delay: 0.3s; }

.benefit-box .icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.75rem;
  color: #B11818;
}
.benefit-box h3 {
  margin-bottom: 0.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
}
.benefit-box p {
  font-size: 0.9rem;
  color: #4B5563;
}

/* Animation */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
