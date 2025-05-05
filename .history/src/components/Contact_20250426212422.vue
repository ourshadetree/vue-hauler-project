<template>
  <div class="contact-component">
    <div class="overlay">
      <h1>Contact Us</h1>
      <ul class="contact-list">
        <li>
          <span>Email: admin@haulersunited.org</span>
          <button
            class="copy-btn"
            @click="copyToClipboard('admin@haulersunited.org')"
          >
            Copy
          </button>
        </li>
        <li>
          <span>Phone: (937) 741-2783</span>
          <button
            class="copy-btn"
            @click="copyToClipboard('(937) 741-2783')"
          >
            Copy
          </button>
        </li>
        <li>
          <span>HQ Address: 1524 E Stroop Rd, Dayton, OH 45429</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // you can swap this out for a fancier toast/snackbar if you like
      alert(`Copied to clipboard:\n${text}`)
    })
    .catch(err => {
      console.error('Copy failed', err)
      alert('Failed to copy. Please try manually.')
    })
}
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
  font-family: 'Karla', sans-serif;
}

.overlay {
  background: rgba(0, 0, 0, 0.5); /* darken for contrast */
  padding: 2rem;
  border-radius: 8px;
  text-align: left;
  color: #fff;
  max-width: 500px;
  width: 100%;
}

.overlay h1 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
  font-size: 1.1rem;
}

.copy-btn {
  background: #B11818;
  border: none;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #8f1212;
}
</style>
