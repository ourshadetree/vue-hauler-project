<template>
    <div id="topContainer">
        <div id="topContent">
            <h1>There is Power in Numbers</h1>
            <h3>Unlock collective strength with America's fastest-growing trucker organization.</h3>
            <h3 id="italic">Every member makes us stronger.</h3>
            <button id="joinButton">Join Now</button>
        </div>
        <div id="topMedia">
            <img src="../src/assets/topVideo.mp4">
        </div>
        
    </div>
    
</template>

<style scoped>
#topContainer {
    display: flex;
    background-color: #073763;
    position: relative;
    top: 25px;
    left: -28px;
}

#topContent {
    border: 10px;
}

h1 {
    font-weight: 900;
    color: pink;
    border: none;
}

h3 {
    color: white;
}

#italic {
    font-style: italic;
    font-weight: 900;
    color: white;
}

</style>