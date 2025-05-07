<template>
  <div class="contact-component">
    <div class="overlay">
      <h1>Contact Us</h1>
      <!-- replace the plain button with a router-link -->
      <router-link to="/contact" class="contact-button">
        Contact Us
      </router-link>
    </div>
  </div>
</template>

<script setup>
// no script needed when using <router-link>
</script>

<style scoped>
.contact-component {
  background: url('@/assets/contactPhoto.png') no-repeat center center;
  background-size: cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.overlay {
  text-align: center;
  /* optionally add a tint:
     background: rgba(0, 0, 0, 0.3);
     padding: 20px;
     border-radius: 8px;
  */
}

.overlay h1 {
  font-size: 4rem;
  color: #fff;
  margin-bottom: 20px;
}

.contact-button {
  display: inline-block;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  padding: 12px 24px;
  font-size: 1.2rem;
  text-decoration: none;    /* remove link underline */
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.contact-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
