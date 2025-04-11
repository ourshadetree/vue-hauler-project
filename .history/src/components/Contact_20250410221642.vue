<template>
    <div class="contact-component">
      <div class="overlay">
        <h1>Contact Us</h1>
        <button class="contact-button">Contact Us</button>
      </div>
    </div>
  </template>
  
  <script setup>
  // No additional logic required yet.
  </script>
  
  <style scoped>
  .contact-component {
    /* Use the background image from your assets */
    background: url('@/assets/contactPhoto.png') no-repeat center center;
    background-size: cover;
    
    /* Set a height; adjust as needed or use responsive units */
    height: 400px;
    
    /* Flex settings to center contents */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  /* Optional overlay for potential background color tinting or to improve text contrast */
  .overlay {
    text-align: center;
    /* If needed, add a semi-transparent layer:
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
    border: 2px solid #fff;
    background: transparent;
    color: #fff;
    padding: 12px 24px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease;
  }
  
  .contact-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  </style>
  