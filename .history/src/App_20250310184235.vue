<template>
  <div id="layout">
    <div id="header">
      <img alt="haulerBanner" id="banner" src="../src/assets/haulerBanner.png">
    </div>
    <div id="alertBar">$0 Membership Fee</div>
    <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/members">Members</router-link> 
    <router-link to="/fuelTools">Fuel Tools</router-link>
    <router-link to="/loadBoard">Load Board</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  padding: 30px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  width: 120px;
  text-align: left;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px;
  
  
}

nav a:hover {
  background-color: whitesmoke;
  width: 100%;
  
}

nav a.router-link-exact-active {
  color: #006fe4;
}

h1 {
  border-bottom: 2px solid #2c3e50;
  padding: 30px;
}

#banner {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

#alertBar {
  background-color: red;
  height: 25px;
  color: white;
  font-weight: bold;
}
</style>
