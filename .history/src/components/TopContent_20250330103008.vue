<template>
  <div id="topContainer">
    <div id="topContent">
      <h1>There is Power in Numbers</h1>
      <h3>
        Unlock collective strength with America's fastest-growing trucker organization.
      </h3>
      <h3 id="italic">Every member makes us stronger.</h3>
      <!-- When clicked, this button calls openModal() with the SignUpForm component -->
      <button @click="openModal(SignUpForm)">Join Now</button>
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
    <!-- Modal: Only shows when activeModal is set -->
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

// Modal state: When activeModal is set to a component, the modal is shown
const activeModal = ref("");

// Function to open the modal with a specific component (e.g., SignUpForm)
function openModal(component) {
  activeModal.value = component;
}

// Function to play video on click
function playVideo() {
  if (topVideo.value) {
    if (isVideoPlaying.value) {
      topVideo.value.pause();
      isVideoPlaying.value = false;
    } else {
      topVideo.value.play();
      isVideoPlaying.value = true;
    }
  }
}

</script>

<style scoped>
/* Top container: Hero banner with Dark Blue background */
#topContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0C2442; /* Dark Blue */
  height: 400px;
  width: 100%;
  padding: 20px;
}

/* Left content area */
#topContent {
  padding: 20px;
  color: #FFFFFF;
  max-width: 50%;
}

/* Heading using Sora */
h1 {
  font-family: 'Sora', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 900;
  color: #FFFFFF;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

/* Subheadings using Karla */
h3 {
  font-family: 'Karla', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #FFFFFF;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

#italic {
  font-style: italic;
  font-weight: 500;
}

/* Join Now Button using Red accent */
button {
  padding: 10px 20px;
  background-color: #B11818; /* Red */
  border: none;
  border-radius: 5px;
  color: #FFFFFF;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Sora', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

button:hover {
  background-color: #9A1010; /* Slightly darker red */
}

/* Right content area for media */
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
  color: #FFFFFF;
}
</style>
