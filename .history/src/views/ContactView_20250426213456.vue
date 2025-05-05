<template>
  <div class="contact-component">
    <div class="contact-card">
      <img class="logo" src="@/assets/haulersUnitedLogo4.svg" alt="Haulers United Logo" />

      <h1>Contact Information</h1>

      <div class="info-item">
        <span class="label">Email:</span>
        <span class="value">admin@haulersunited.org</span>
        <button class="copy-btn" @click="copyToClipboard('admin@haulersunited.org')">Copy</button>
      </div>

      <div class="info-item">
        <span class="label">Phone:</span>
        <span class="value">(937) 741-2783</span>
        <button class="copy-btn" @click="copyToClipboard('(937) 741-2783')">Copy</button>
      </div>

      <div class="info-item">
        <span class="label">HQ Address:</span>
        <span class="value">
          1524 E Stroop Rd<br/>
          Dayton, OH 45429
        </span>
        <button
          class="copy-btn"
          @click="copyToClipboard('1524 E Stroop Rd, Dayton, OH 45429')"
        >Copy</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    // you can replace alert with a fancier toast/snackbar if you like
    alert(`Copied to clipboard:\n${text}`)
  } catch (err) {
    console.error('Copy failed', err)
    alert('Failed to copy. Please select and copy manually.')
  }
}
</script>

<style scoped>
.contact-component {
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Karla', sans-serif;
}

.contact-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: center;
}

.logo {
  max-width: 120px;
  margin-bottom: 1rem;
}

h1 {
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.label {
  font-weight: bold;
  color: #0c2442;
  flex: 1;
  text-align: left;
}

.value {
  flex: 2;
  text-align: left;
  word-break: break-word;
}

.copy-btn {
  flex: 0;
  margin-left: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: #b11818;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #8f1212;
}
</style>
