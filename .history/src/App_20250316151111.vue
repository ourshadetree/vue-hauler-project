<template>
  <div id="app">
    <!-- Fixed Nav on the left -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/members">Members</router-link> 
      <router-link to="/fuelTools">Fuel Tools</router-link>
      <router-link to="/loadBoard">Load Board</router-link>
    </nav>

    <!-- Fixed Banner at the top -->
    <div id="bannerBox">
      <img alt="haulerBanner" id="banner" src="../src/assets/finalLogoBanner.png" />
    </div>

    <!-- Main content area (Router View) -->
    <div id="pageContent">
      <router-view/>
    </div>
  </div>
</template>

<style>
/* Reset margin/padding for a clean slate */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Prevent horizontal scroll */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: rgb(252, 248, 248);
}

/* FIXED NAV on the left side */
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 120px; /* Adjust as needed */
  height: 100%;
  padding-top: 90px; /* Space for banner, if you want extra top padding */
  background-color: white;
  border-right: 1px solid lightgray;
}

nav a {
  display: block;
  padding: 15px;
  text-decoration: none;
  color: black;
}

nav a:hover {
  background-color: whitesmoke;
}

nav a.router-link-exact-active {
  color: #0073d1;
  font-weight: bold;
  border-left: 2px solid #0073d1;
}

/* FIXED BANNER at the top */
#bannerBox {
  position: fixed;
  top: 0;
  left: 120px; /* same width as nav */
  right: 0;
  height: 50px; /* adjust as needed */
  background: radial-gradient(circle, #173d60, #073763);
  z-index: 999; /* ensure it stays above content */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}

#banner {
  width: 22%;
  height: 75%; 
}

/* MAIN CONTENT area */
#pageContent {
  /* Offset by the navbar width and banner height */
  margin-left: 120px; /* same width as nav */
  margin-top: 50px;  /* same height as banner */
  padding: 20px;
  min-height: 100vh;  /* ensures content area spans full viewport height */
  box-sizing: border-box;
}
</style>
