<template>
  <div id="whyDifferentContainer">
    <div id="title">
      <h1>3. Technology-Driven Association</h1>
      <p>
        Streamline back-office reporting, automate dispatch, bypass brokers, and go direct-to-shippers by tapping into an advanced network built specifically for carriers.
      </p>
    </div>
    <div id="columns">
      <!-- Left Column: Graphic -->
      <div id="left">
        <div id="leftGraphic">
          <img src="../assets/chart.png" alt="Chart">
        </div>
      </div>
      <!-- Right Column: Content Cards -->
      <div id="right">
        <div class="rightContent">
          <h2>Current Focus</h2>
          <p>
            Streamlining back-office reporting and automating routine procedures to make your trucking operations more efficient.
          </p>
        </div>
        <div class="rightContent">
          <h2>What We Are Building</h2>
          <p>
            Fully automated brokerage service built by truckers for truckers. Get loads directly from shippers without having to take a 20% pay cut to a broker.
          </p>
        </div>
      </div>
    </div>
    <!-- Bottom Video Section -->
    <div id="bottomVideo">
      <iframe
        src="https://www.youtube.com/embed/IGnvirW9ds8"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    <!-- Join Now Button -->
    <button id="joinNowButton">Join Now</button>
  </div>
</template>

<script>
export default {
  name: 'WhyDifferentThree',
}
</script>

<style scoped>
/* Overall Container: Dark Blue Background */
#whyDifferentContainer {
  background-color: #0C2442; /* Dark Blue */
  color: #FFFFFF;  /* White text for contrast */
  padding: 60px 20px;
  font-family: Karla, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Title Section */
#title {
  text-align: center;
  margin-bottom: 40px;
}
#title h1 {
  font-family: Sora, sans-serif;
  font-size: 2.8rem;
  margin-bottom: 10px;
  color: #FFFFFF;
}
#title p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: #F5F5F5;
}

/* Columns Layout */
#columns {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 40px;
}

/* Left Column (Graphic) */
#left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
#leftGraphic {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
#leftGraphic img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Right Column (Content Cards) */
#right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.rightContent {
  background-color: #FFFFFF;
  color: #0C2442;  /* Dark Blue for readability on white cards */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.rightContent h2 {
  font-family: Sora, sans-serif;
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #0C2442;
}
.rightContent p {
  font-size: 1rem;
  line-height: 1.5;
  color: #0C2442;
}

/* Bottom Video Section */
#bottomVideo {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
#bottomVideo iframe {
  width: 100%;
  height: 450px;
  border: none;
}

/* Join Now Button */
#joinNowButton {
  background-color: #B11818;  /* Accent Red */
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}
#joinNowButton:hover {
  background-color: #a01015;
  transform: scale(1.05);
}
</style>
