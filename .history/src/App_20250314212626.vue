<template>
    <div id="layout">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/members">Members</router-link> 
        <router-link to="/fuelTools">Fuel Tools</router-link>
        <router-link to="/loadBoard">Load Board</router-link>
      </nav>

      <div id="header">
        <div id="bannerBox">
          <img alt="haulerBanner" id="banner" src="../src/assets/finalLogoBanner.png">
        </div>
        
        <div id="pageContent">
          <router-view/>
        </div>
        
      </div>
    
    </div>
</template>

<style>
body {
  background-color: rgb(252, 248, 248);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0;
}

nav {
  position: fixed;
  left: 0;
  top: 0;
  padding: 30px;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  width: 120px;
  height: 100%;
  text-align: left;
  background-color: white;
  border-right: 1px solid lightgray;
}

nav a {
  color: black;
  padding: 15px;
  text-decoration: none;
  
  
}

nav a:hover {
  background-color: whitesmoke;
  width: 100%;
  
}

nav a.router-link-exact-active {
color: #0073d1;
font-weight: bold;
border-left: 2px solid #0073d1;
}



h1 {
  border-bottom: 2px solid #2c3e50;
  padding: 30px;
}

#pageContent {
  left: 180px;
  position: relative;
  padding: 20px;
}

#bannerBox {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  width: calc(100% - 120px); /* Subtract navbar width */
  height: 50px;
  background: radial-gradient(circle, rgb(71, 71, 181), #00008B);
}

#banner {
  width: 22%;
  height: 75%; 
}

</style>
