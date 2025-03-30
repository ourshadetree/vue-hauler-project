<template>
  <div id="topContainer">
    <div id="topContent">
      <h1>There is Power in Numbers</h1>
      <h3>
        Unlock collective strength with America's fastest-growing trucker organization.
      </h3>
      <h3 id="italic">Every member makes us stronger.</h3>
      <!-- When clicked, this button calls openModal() with 'SignUpForm' -->
      <button @click="openModal('SignUpForm')">Join Now</button>
    </div>
    <div id="topMedia">
      <div class="video-wrapper" @click="playVideo">
        <video ref="topVideo" playsinline>
          <source src="../assets/topVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div v-if="!isVideoPlaying" class="play-overlay">
          <i class="play-icon">▶</i>
        </div>
      </div>
    </div>
    <!-- Modal: Only shows when activeModal is not empty -->
    <Modal v-if="activeModal" @close="activeModal = ''">
      <component :is="activeModal" @close="activeModal = ''" />
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from "@/components/Modal.vue";
import SignUpForm from "@/components/SignUpForm.vue";

// Video-related state
const isVideoPlaying = ref(false);
const topVideo = ref(null);

// Modal state: When activeModal has a component name, the modal is shown
const activeModal = ref("");

// Function to open the modal with a specific component (e.g., 'SignUpForm')
function openModal(componentName) {
  activeModal.value = componentName;
}

// Function to play video on click
function playVideo() {
  if (topVideo.value) {
    topVideo.value.play();
    isVideoPlaying.value = true;
  }
}
</script>

<style scoped>
#topContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #073763;
  height: 400px;
  width: 100%;
  padding: 20px;
}

#topContent {
  padding: 20px;
  color: #ffffff;
  max-width: 50%;
}

h1 {
  font-weight: 900;
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 10px;
}

h3 {
  color: #d1d1d1;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

#italic {
  font-style: italic;
  font-weight: 500;
}

button {
  padding: 10px 20px;
  background-color: #ff6600; /* Modern accent color */
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e65c00;
}

#topMedia {
  padding: 20px;
  max-width: 50%;
  position: relative;
}

.video-wrapper {
  position: relative;
  cursor: pointer;
}

video {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.play-icon {
  font-size: 3rem;
  color: #ffffff;
}
</style>
