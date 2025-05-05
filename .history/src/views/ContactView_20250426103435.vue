<template>
    <div class="contact-page">
      <img src="@/assets/haulersUnitedLogo4.svg" alt="Haulers United logo" class="logo" />
      <h1>Contact Haulers United</h1>
      <div class="info">
        <div class="info-item">
          <strong>Email:</strong>
          <a href="mailto:admin@haulersunited.org">admin@haulersunited.org</a>
        </div>
        <div class="info-item">
          <strong>Phone:</strong>
          <a href="tel:+19377412783">(937) 741-2783</a>
        </div>
        <div class="info-item">
          <strong>HQ Address:</strong>
          1524 E Stroop Rd<br />
          Dayton, OH 45429
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // no script logic needed
  </script>
  
  <style scoped>
  .contact-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: #0C2442;
    text-align: center;
  }
  
  .contact-page .logo {
    display: block;
    margin: 0 auto 1rem;
    max-width: 180px;
  }
  
  .contact-page h1 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #b11818;
  }
  
  .contact-page .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }
  
  .contact-page .info-item {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .contact-page a {
    color: #b11818;
    text-decoration: none;
  }
  
  .contact-page a:hover {
    text-decoration: underline;
  }
  </style>
  