<template>
    <div id="topContainer">
        <div id="topContent">
            <h1>There is Power in Numbers</h1>
            <h3>Unlock collective strength with America's fastest-growing trucker organization.</h3>
            <h3 id="italic">Every member makes us stronger.</h3>
            <button id="joinButton">Join Now</button>
        </div>
        <div id="topMedia">
            <video autoplay loop muted playsinline>
                <source src="../assets/topVideo.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
        
    </div>
    
</template>

<style scoped>
#topContainer {
    display: flex;
    justify-content: center;
    background-color: #073763;
    position: absolute;
    top: 45px;
    left: -8px;
    height: 400px;
    width: 100vw;
}

#topContent {
    padding: 10px;
    border: 10px;
}

#topMedia {
    display: flex;
    align-items: center;
    padding: 10px;
}

video {
    height: 350px;
    width: 100%;
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